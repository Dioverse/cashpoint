<?php
namespace App\Helpers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class NotificationHelper
{
    public static function notifyAdmin($title, $message, $data = [])
    {
        // Assuming admins have `is_admin` column
        $admins = User::where('role', 'admin')->orWhere('role', 'super-admin')->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'title'   => $title,
                'message' => $message,
                'type'    => 'admin',
                'data'    => json_encode($data),
            ]);

            // Optional: trigger push notification via Firebase
            if ($admin->device_token) {
                self::sendPush($admin->device_token, $title, $message);
            }
        }
    }

    public static function notifyUser($userId, $title, $message, $data = [])
    {
        $user = User::find($userId);
        if (!$user) return;

        Notification::create([
            'user_id' => $userId,
            'title'   => $title,
            'message' => $message,
            'type'    => 'user',
            'data'    => json_encode($data),
        ]);

        if ($user->device_token) {
            self::sendPush($user->device_token, $title, $message);
        }
    }

    protected static function sendPush($token, $title, $message)
    {
        $firebaseServerKey = config('services.firebase.api_key');

        Http::withHeaders([
            'Authorization' => "key=$firebaseServerKey",
            'Content-Type'  => 'application/json',
        ])->post('https://fcm.googleapis.com/fcm/send', [
            'to' => $token,
            'notification' => [
                'title' => $title,
                'body'  => $message,
                'sound' => 'default',
            ],
            'priority' => 'high',
        ]);
    }
}
