<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * One-shot port of data from the legacy SQLite file into the active Postgres
 * connection. Safe to delete once the migration is verified in all environments.
 */
class PortSqliteToPgsql extends Command
{
    protected $signature = 'db:port-sqlite
        {--sqlite= : Path to source sqlite file (defaults to env SQLITE_DATABASE)}
        {--truncate : Truncate destination tables before insert}';

    protected $description = 'Copy rows from the legacy SQLite database into the active Postgres connection';

    /** Tables to copy, in FK-safe order. */
    private const TABLES = ['users', 'vehicles', 'inquiries', 'settings'];

    public function handle(): int
    {
        if (DB::connection()->getDriverName() !== 'pgsql') {
            $this->error('Default connection is not pgsql. Aborting to avoid data loss.');
            return self::FAILURE;
        }

        $sqlitePath = $this->option('sqlite') ?: env('SQLITE_DATABASE');
        if (! $sqlitePath || ! is_file($sqlitePath)) {
            $this->error("SQLite file not found at: {$sqlitePath}");
            return self::FAILURE;
        }

        Config::set('database.connections.legacy_sqlite', [
            'driver' => 'sqlite',
            'database' => $sqlitePath,
            'prefix' => '',
            'foreign_key_constraints' => false,
        ]);

        $sqlite = DB::connection('legacy_sqlite');
        $pgsql = DB::connection();

        foreach (self::TABLES as $table) {
            if (! Schema::connection('legacy_sqlite')->hasTable($table)) {
                $this->warn("[skip] {$table} — not present in SQLite");
                continue;
            }
            if (! Schema::hasTable($table)) {
                $this->warn("[skip] {$table} — not present in Postgres");
                continue;
            }

            if ($this->option('truncate')) {
                $pgsql->statement("TRUNCATE TABLE {$table} RESTART IDENTITY CASCADE");
            }

            $rows = $sqlite->table($table)->get();
            if ($rows->isEmpty()) {
                $this->line("[empty] {$table}");
                continue;
            }

            $jsonCols = $this->jsonColumns($table);
            $boolCols = $this->booleanColumns($table);

            $payload = $rows->map(function ($row) use ($jsonCols, $boolCols) {
                $arr = (array) $row;
                foreach ($arr as $col => $val) {
                    if ($val !== null && in_array($col, $jsonCols, true) && is_string($val)) {
                        // Already JSON-encoded text in SQLite — keep as-is for Postgres json/jsonb.
                        continue;
                    }
                    if (in_array($col, $boolCols, true) && $val !== null) {
                        $arr[$col] = (bool) $val;
                    }
                }
                return $arr;
            })->all();

            $pgsql->transaction(function () use ($pgsql, $table, $payload) {
                foreach (array_chunk($payload, 200) as $chunk) {
                    $pgsql->table($table)->insert($chunk);
                }
            });

            $this->resetSequence($table);
            $this->info(sprintf('[copied] %s — %d rows', $table, count($payload)));
        }

        $this->info('Done.');
        return self::SUCCESS;
    }

    /**
     * Columns that should be treated as JSON (already serialized strings in SQLite).
     */
    private function jsonColumns(string $table): array
    {
        return match ($table) {
            'vehicles' => ['highlights', 'images'],
            default => [],
        };
    }

    /**
     * Columns that need explicit bool casting — SQLite stores 0/1, Postgres wants true/false.
     */
    private function booleanColumns(string $table): array
    {
        return match ($table) {
            'vehicles' => ['is_featured'],
            default => [],
        };
    }

    /**
     * Realign Postgres sequence after explicit-id inserts so future inserts don't collide.
     */
    private function resetSequence(string $table): void
    {
        $seq = "{$table}_id_seq";
        DB::statement("SELECT setval(?, COALESCE((SELECT MAX(id) FROM {$table}), 1), (SELECT COUNT(*) FROM {$table}) > 0)", [$seq]);
    }
}
