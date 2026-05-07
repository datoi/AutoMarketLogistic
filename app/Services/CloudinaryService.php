<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;
use RuntimeException;

class CloudinaryService
{
    private ?Cloudinary $client = null;

    /**
     * Lazily build the client so listing/edit pages don't 500 when CLOUDINARY_URL isn't configured yet.
     * Only the upload/delete paths actually need credentials.
     */
    private function client(): Cloudinary
    {
        if ($this->client === null) {
            $url = config('services.cloudinary.url');
            if (! $url) {
                throw new RuntimeException('CLOUDINARY_URL is not configured. Sign up at https://cloudinary.com and set it in your .env.');
            }
            $this->client = new Cloudinary($url);
        }
        return $this->client;
    }

    private function folder(): string
    {
        return (string) config('services.cloudinary.upload_folder', 'automarketlogistic/vehicles');
    }

    /**
     * Upload an image and return its delivery URL.
     */
    public function upload(UploadedFile $file): string
    {
        $result = $this->client()->uploadApi()->upload($file->getRealPath(), [
            'folder'         => $this->folder(),
            'resource_type'  => 'image',
            'overwrite'      => false,
            'unique_filename' => true,
        ]);

        if (empty($result['secure_url'])) {
            throw new RuntimeException('Cloudinary upload did not return a secure_url.');
        }

        return (string) $result['secure_url'];
    }

    /**
     * Best-effort delete by URL. Silently no-ops for non-Cloudinary URLs (e.g. legacy picsum).
     */
    public function destroyByUrl(string $url): void
    {
        $publicId = $this->extractPublicId($url);
        if ($publicId === null) {
            return;
        }

        try {
            $this->client()->uploadApi()->destroy($publicId, ['resource_type' => 'image']);
        } catch (\Throwable) {
            // Deletion is best-effort — don't block save flow on Cloudinary or config errors.
        }
    }

    /**
     * Pull the public_id (incl. folder) out of a Cloudinary delivery URL.
     * Returns null when the URL isn't a Cloudinary asset.
     */
    private function extractPublicId(string $url): ?string
    {
        if (! preg_match('#^https?://res\.cloudinary\.com/[^/]+/image/upload/(.+)$#', $url, $m)) {
            return null;
        }

        $path = $m[1];

        // Strip any leading transformations (segments before the version, e.g. "w_400,h_300/")
        // Version segment looks like "v1234567890". Everything after it is the public_id (with extension).
        if (preg_match('#(?:^|/)(v\d+)/(.+)$#', $path, $vm)) {
            $path = $vm[2];
        }

        // Drop the file extension.
        return preg_replace('/\.[a-zA-Z0-9]+$/', '', $path);
    }
}
