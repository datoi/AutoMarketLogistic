<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Converts vehicles.images from a flat array of URLs to an array of
 * {url, public_id} objects. public_id is what Cloudinary's destroy API
 * needs; storing it directly avoids reverse-engineering it from URLs.
 *
 * For existing Cloudinary URLs we extract public_id one time here; for
 * non-Cloudinary URLs (legacy picsum seeds) public_id is left null and
 * the destroy path becomes a no-op for them.
 */
return new class extends Migration
{
    public function up(): void
    {
        DB::table('vehicles')->whereNotNull('images')->orderBy('id')->lazy()->each(function ($row) {
            $images = $this->decodeJson($row->images);
            if ($images === null) {
                return;
            }

            $converted = [];
            foreach ($images as $entry) {
                if (is_array($entry) && isset($entry['url'])) {
                    $converted[] = $entry;
                    continue;
                }
                if (is_string($entry) && $entry !== '') {
                    $converted[] = [
                        'url'       => $entry,
                        'public_id' => self::extractPublicId($entry),
                    ];
                }
            }

            DB::table('vehicles')->where('id', $row->id)->update([
                'images' => json_encode(array_values($converted)),
            ]);
        });
    }

    public function down(): void
    {
        DB::table('vehicles')->whereNotNull('images')->orderBy('id')->lazy()->each(function ($row) {
            $images = $this->decodeJson($row->images);
            if ($images === null) {
                return;
            }

            $reverted = [];
            foreach ($images as $entry) {
                if (is_array($entry) && isset($entry['url'])) {
                    $reverted[] = $entry['url'];
                } elseif (is_string($entry)) {
                    $reverted[] = $entry;
                }
            }

            DB::table('vehicles')->where('id', $row->id)->update([
                'images' => json_encode(array_values($reverted)),
            ]);
        });
    }

    private function decodeJson(mixed $value): ?array
    {
        if (is_array($value)) {
            return $value;
        }
        if (! is_string($value)) {
            return null;
        }
        $decoded = json_decode($value, true);
        return is_array($decoded) ? $decoded : null;
    }

    private static function extractPublicId(string $url): ?string
    {
        if (! preg_match('#^https?://res\.cloudinary\.com/[^/]+/image/upload/(.+)$#', $url, $m)) {
            return null;
        }
        $path = $m[1];
        if (preg_match('#(?:^|/)(v\d+)/(.+)$#', $path, $vm)) {
            $path = $vm[2];
        }
        return preg_replace('/\.[a-zA-Z0-9]+$/', '', $path) ?: null;
    }
};
