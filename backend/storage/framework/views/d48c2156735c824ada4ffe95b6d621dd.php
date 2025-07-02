<?php if (isset($component)) { $__componentOriginalaa758e6a82983efcbf593f765e026bd9 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalaa758e6a82983efcbf593f765e026bd9 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => $__env->getContainer()->make(Illuminate\View\Factory::class)->make('mail::message'),'data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('mail::message'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<p> Hi <?php echo e($user->name); ?>,</p>
<?php if($otp->type == 'verification'): ?>
<p> We have received a request to verify your email address. Please use the below 6 digit OTP to complete the verification process: </p>
<?php endif; ?>
<p> We have received a request to reset your account password. Please use the below 6 digit OTP to complete the password reset process: </p>
<p> <strong> OTP: <?php echo e($otp->code); ?> </strong> </p>
<p> This OTP is valid for 10 minutes. If you did not request this, please ignore this email. </p>
<p> If you have any questions or need further assistance, feel free to reach out to our support team. </p>
<p> You can also visit our website for more information. </p>

Thanks,<br>
<?php echo e(config('app.name')); ?>

 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalaa758e6a82983efcbf593f765e026bd9)): ?>
<?php $attributes = $__attributesOriginalaa758e6a82983efcbf593f765e026bd9; ?>
<?php unset($__attributesOriginalaa758e6a82983efcbf593f765e026bd9); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalaa758e6a82983efcbf593f765e026bd9)): ?>
<?php $component = $__componentOriginalaa758e6a82983efcbf593f765e026bd9; ?>
<?php unset($__componentOriginalaa758e6a82983efcbf593f765e026bd9); ?>
<?php endif; ?>
<?php /**PATH C:\Users\adior\Documents\DEVELOPMENT\Laravel\penger\resources\views/mail/auth/otp.blade.php ENDPATH**/ ?>