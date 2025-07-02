<x-mail::message>
<p> Hi {{ $user->name }},</p>
@if ($otp->type == 'verification')
<p> We have received a request to verify your email address. Please use the below 6 digit OTP to complete the verification process: </p>
@endif
<p> We have received a request to reset your account password. Please use the below 6 digit OTP to complete the password reset process: </p>
<p> <strong> OTP: {{ $otp->code }} </strong> </p>
<p> This OTP is valid for 10 minutes. If you did not request this, please ignore this email. </p>
<p> If you have any questions or need further assistance, feel free to reach out to our support team. </p>
<p> You can also visit our website for more information. </p>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
