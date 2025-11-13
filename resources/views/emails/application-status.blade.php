<x-mail::message>
# Application Status Updated

Hello **{{ $application->user->name }}**,

Your application (ID: **{{ $application->id }}**) for the **{{ $application->program }}** program has been updated.

**New Status:** {{ $application->status }}

@if($application->remarks)
**Admin Remarks:**
{{ $application->remarks }}
@endif

You can view your application details on your dashboard:
<x-mail::button :url="route('dashboard')">
View Dashboard
</x-mail::button>

Thank you,<br>
{{ config('app.name') }}
</x-mail::message>
