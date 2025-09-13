<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->firstName,
            'last_name' => $this->lastName,
            'username' => $this->username,
            'email' => $this->email,
            'kyc_tier' => $this->kyc_tier,
            'kyc_status' => $this->kyc_status,
            'kyc_rejection_reason' => $this->kyc_rejection_reason,
            'status' => $this->status,
            'role' => $this->role,
            'phone' => $this->phone,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'email_verified_at' => $this->email_verified_at,
        ];
    }
}
