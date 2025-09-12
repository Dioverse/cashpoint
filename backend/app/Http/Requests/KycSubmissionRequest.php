<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class KycSubmissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $tier = $this->input('tier');
        
        $baseRules = [
            'tier' => 'required|in:tier2,tier3',
            'id_type' => 'required|string|in:passport,national_id,drivers_license',
            'personal_info.full_name' => 'required|string|max:255',
            'personal_info.date_of_birth' => 'required|date|before:18 years ago',
            'personal_info.address' => 'required|string|max:500',
            'personal_info.phone' => 'required|string|max:20',
        ];

        if ($tier === 'tier2') {
            return array_merge($baseRules, [
                'documents.id_document' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
                'documents.selfie' => 'required|file|mimes:jpg,jpeg,png|max:5120',
            ]);
        }

        if ($tier === 'tier3') {
            return array_merge($baseRules, [
                'documents.id_document' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
                'documents.selfie' => 'required|file|mimes:jpg,jpeg,png|max:5120',
                'documents.prove_of_fund' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
                'personal_info.occupation' => 'required|string|max:255',
                'personal_info.income_source' => 'required|string|max:255',
            ]);
        }

        return $baseRules;
    }
}
