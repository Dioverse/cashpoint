<?php

namespace App\Services;

class CryptoHelper
{
    private string $key;

    public function __construct()
    {
        $encodedKey = config('app.crypto_key');

        if (str_starts_with($encodedKey, 'base64:')) {
            $encodedKey = substr($encodedKey, 7);
        }

        $this->key = base64_decode($encodedKey);

        if ($this->key === false || strlen($this->key) !== 32) {
            throw new \RuntimeException('Invalid APP_CRYPTO_KEY. Must be 32 bytes (base64 encoded).');
        }
    }

    /**
     * Encrypt plain text securely (AES-256-GCM)
     */
    public function encrypt(string $plaintext): string
    {
        $iv = random_bytes(12); // 96-bit nonce
        $tag = '';
        $cipher = openssl_encrypt(
            $plaintext,
            'aes-256-gcm',
            $this->key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );

        if ($cipher === false) {
            throw new \RuntimeException('Encryption failed.');
        }

        return base64_encode($iv . $tag . $cipher);
    }

    /**
     * Decrypt text
     */
    public function decrypt(string $ciphertext): string
    {
        $decoded = base64_decode($ciphertext, true);

        if ($decoded === false || strlen($decoded) < 28) {
            throw new \RuntimeException('Invalid ciphertext.');
        }

        $iv = substr($decoded, 0, 12);
        $tag = substr($decoded, 12, 16);
        $cipher = substr($decoded, 28);

        $plain = openssl_decrypt(
            $cipher,
            'aes-256-gcm',
            $this->key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );

        if ($plain === false) {
            throw new \RuntimeException('Decryption failed.');
        }

        return $plain;
    }

    /**
     * Encode ID (safe for URLs)
     */
    public function encodeId(int|string $id): string
    {
        $payload = json_encode([
            'id' => $id,
            'ts' => time(),
        ]);

        return rtrim(strtr(base64_encode($this->encrypt($payload)), '+/', '-_'), '=');
    }

    /**
     * Decode ID
     */
    public function decodeId(string $token): int|string|null
    {
        $ciphertext = base64_decode(strtr($token, '-_', '+/'), true);

        if ($ciphertext === false) {
            return null;
        }

        try {
            $payload = $this->decrypt($ciphertext);
            $data = json_decode($payload, true);

            return $data['id'] ?? null;
        } catch (\Exception $e) {
            return null;
        }
    }
}
