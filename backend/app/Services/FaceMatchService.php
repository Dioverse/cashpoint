<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;

class FaceMatchService
{
    public function checkFaceMatch($idPath, $selfiePath)
    {
        $apiKey = env('FACEPP_API_KEY');
        $apiSecret = env('FACEPP_API_SECRET');

        $response = Http::asMultipart()->post('https://api-us.faceplusplus.com/facepp/v3/compare', [
            'api_key' => $apiKey,
            'api_secret' => $apiSecret,
            'image_file1' => fopen(storage_path("app/public/{$idPath}"), 'r'),
            'image_file2' => fopen(storage_path("app/public/{$selfiePath}"), 'r'),
        ]);

        $data = $response->json();

        return $data['confidence'] ?? 0;
    }


    public function faceMatch($image1, $image2)
    {
        return $image1 == $image2;
    }
}
