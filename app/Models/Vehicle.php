<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'year', 'make', 'model', 'trim', 'price', 'mileage', 'condition',
        'status', 'lot_number', 'location', 'engine', 'fuel_type',
        'transmission', 'vin', 'primary_damage', 'secondary_damage',
        'highlights', 'images', 'estimated_arrival', 'description',
        'color', 'is_featured',
    ];

    protected $casts = [
        'highlights'    => 'array',
        'images'        => 'array',
        'estimated_arrival' => 'date:Y-m-d',
        'price'         => 'decimal:2',
        'is_featured'   => 'boolean',
    ];

    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            // Postgres LIKE is case-sensitive; ilike isn't. Pick per driver so the
            // same query "tesla" matches "Tesla" on every backend we support.
            $likeOp = $query->getConnection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($search, $likeOp) {
                $q->where('make', $likeOp, "%{$search}%")
                  ->orWhere('model', $likeOp, "%{$search}%")
                  ->orWhere('vin', $likeOp, "%{$search}%")
                  ->orWhere('lot_number', $likeOp, "%{$search}%");
            });
        }

        if (!empty($filters['make'])) {
            $query->where('make', $filters['make']);
        }

        if (!empty($filters['year_min'])) {
            $query->where('year', '>=', (int) $filters['year_min']);
        }

        if (!empty($filters['year_max'])) {
            $query->where('year', '<=', (int) $filters['year_max']);
        }

        if (!empty($filters['price_min'])) {
            $query->where('price', '>=', (float) $filters['price_min']);
        }

        if (!empty($filters['price_max'])) {
            $query->where('price', '<=', (float) $filters['price_max']);
        }

        if (!empty($filters['condition'])) {
            $query->where('condition', $filters['condition']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['fuel_type'])) {
            $query->where('fuel_type', $filters['fuel_type']);
        }

        if (!empty($filters['transmission'])) {
            $query->where('transmission', $filters['transmission']);
        }

        return $query;
    }

    public function scopeSorted(Builder $query, ?string $sort): Builder
    {
        return match ($sort) {
            'price_asc'     => $query->orderBy('price', 'asc'),
            'price_desc'    => $query->orderBy('price', 'desc'),
            'year_desc'     => $query->orderBy('year', 'desc'),
            'year_asc'      => $query->orderBy('year', 'asc'),
            'mileage_asc'   => $query->orderBy('mileage', 'asc'),
            'mileage_desc'  => $query->orderBy('mileage', 'desc'),
            default         => $query->orderBy('created_at', 'desc'),
        };
    }
}
