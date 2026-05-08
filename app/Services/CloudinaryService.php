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
     * Upload an image and return both its delivery URL and the public_id needed
     * to delete it later. Storing public_id alongside the URL avoids the brittle
     * regex round-trip we used to do.
     *
     * @return array{url: string, public_id: string}
     */
    public function upload(UploadedFile $file): array
    {
        $result = $this->client()->uploadApi()->upload($file->getRealPath(), [
            'folder'         => $this->folder(),
            'resource_type'  => 'image',
            'overwrite'      => false,
            'unique_filename' => true,
        ]);

        if (empty($result['secure_url']) || empty($result['public_id'])) {
            throw new RuntimeException('Cloudinary upload did not return a secure_url + public_id pair.');
        }

        return [
            'url'       => (string) $result['secure_url'],
            'public_id' => (string) $result['public_id'],
        ];
    }

    /**
     * Best-effort delete by public_id. No-ops for null (legacy non-Cloudinary entries).
     */
    public function destroy(?string $publicId): void
    {
        if ($publicId === null || $publicId === '') {
            return;
        }

        try {
            $this->client()->uploadApi()->destroy($publicId, ['resource_type' => 'image']);
        } catch (\Throwable) {
            // Deletion is best-effort — don't block save flow on Cloudinary or config errors.
        }
    }
}
