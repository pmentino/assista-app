<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TextBeeService
{
    protected $apiKey;
    protected $deviceId;
    protected $baseUrl;

    public function __construct()
    {
        $this->apiKey = env('TEXTBEE_API_KEY');
        $this->deviceId = env('TEXTBEE_DEVICE_ID');
        $this->baseUrl = env('TEXTBEE_BASE_URL', 'https://api.textbee.dev/api/v1');
    }

    /**
     * Send SMS to a specific number.
     */
    public function sendSms($phoneNumber, $message)
    {
        // 1. Sanitize: Remove dashes or spaces
        $cleanNumber = preg_replace('/[^0-9]/', '', $phoneNumber);

        // 2. Format: Convert 0917... to +63917...
        if (str_starts_with($cleanNumber, '0')) {
            $cleanNumber = '+63' . substr($cleanNumber, 1);
        }

        // 3. API Request
        $url = "{$this->baseUrl}/gateway/devices/{$this->deviceId}/send-sms";

        try {
            /** @var \Illuminate\Http\Client\Response $response */
            $response = Http::withHeaders([
                'x-api-key' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($url, [
                'recipients' => [$cleanNumber],
                'message' => $message,
            ]);

            // FIX: Checked spelling of successful()
            if ($response->successful()) {
                Log::info("TextBee: SMS sent to {$cleanNumber}");
                return true;
            } else {
                Log::error("TextBee Error: " . $response->body());
                return false;
            }
        } catch (\Exception $e) {
            Log::error("TextBee Exception: " . $e->getMessage());
            return false;
        }
    }
}
