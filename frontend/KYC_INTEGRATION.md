# KYC Integration Documentation

## Backend API Endpoints

### KYC Endpoints

- `POST /api/kyc/tier2` - Submit Tier 2 KYC verification (ID document + photo)
- `POST /api/kyc/tier3` - Submit Tier 3 KYC verification (address proof + fund proof)
- `GET /api/user` - Get user data including KYC status

### Request/Response Format

#### Tier 2 KYC Submission

```javascript
// Request
{
  id_type: "nin|bvn|driver_license|passport",
  photo: FormData (image file)
}

// Response
{
  "message": "KYC submitted successfully",
  "status": true,
  "results": {
    "data": {
      "idtype": "nin",
      "idmean": "path/to/stored/image",
      "kyc_status": "pending",
      "kyc_tier": "tier2"
    }
  }
}
```

#### Tier 3 KYC Submission

```javascript
// Request
{
  address_prove: FormData (image file),
  fund_prove: FormData (image file)
}

// Response
{
  "message": "KYC submitted successfully",
  "status": true,
  "results": {
    "data": {
      "prove_of_address": "path/to/stored/image",
      "prove_of_fund": "path/to/stored/image",
      "kyc_status": "pending",
      "kyc_tier": "tier3"
    }
  }
}
```

## Frontend Implementation

### Services

#### KYC Service (`src/services/kycService.js`)

- `submitTier2KYC(data)` - Submit Tier 2 verification
- `submitTier3KYC(data)` - Submit Tier 3 verification
- `getUserKYCStatus()` - Fetch user KYC status
- `validateKYCData(data, tier)` - Validate KYC data before submission
- `getTierLimits(tier)` - Get account limits for each tier
- `getNextTierInfo(currentTier)` - Get next tier information

### Components

#### KYC Status Card (`src/components/KYCStatusCard.jsx`)

Reusable component that displays:

- Current KYC status (Verified, Under Review, Rejected, Not Started)
- Current tier level
- Account limits (daily limit, max balance)
- Upgrade button (if applicable)

### Screens

#### 1. KYC Status Screen (`src/screens/KycStatus.jsx`)

- Displays comprehensive KYC status
- Shows verification progress
- Displays current and next tier benefits
- Provides refresh functionality
- Handles different KYC states (pending, approved, rejected)

#### 2. Upgrade to Tier 2 (`src/screens/UpgradeToTierTwoScreen.jsx`)

- ID type selection (NIN, BVN, Driver's License, Passport)
- ID document upload
- Selfie verification
- Real-time validation
- Loading states and error handling

#### 3. Upgrade to Tier 3 (`src/screens/UpgradeToTierThreeScreen.jsx`)

- Proof of address upload
- Source of fund verification upload
- Form validation
- Loading states and error handling

### Navigation Integration

The KYC flow is integrated into the main app navigation:

```javascript
// App.jsx - Main navigation stack
<Stack.Screen name="KycStatus" component={KycStatus} />
<Stack.Screen name="UpgradeToTierTwo" component={UpgradeToTierTwoScreen} />
<Stack.Screen name="UpgradeToTierThree" component={UpgradeToTierThreeScreen} />
```

### Profile Screen Integration

The ProfileScreen now includes:

- KYC Status Card at the top
- KYC Verification menu item
- Smart navigation based on current tier

## KYC Tiers and Limits

### Tier 1 (Basic)

- **Requirements**: Basic account information
- **Daily Limit**: ₦50,000
- **Max Balance**: ₦300,000
- **Status**: Completed on registration

### Tier 2 (ID Verification)

- **Requirements**: Valid ID document + selfie
- **Daily Limit**: ₦200,000
- **Max Balance**: ₦500,000
- **ID Types**: NIN, BVN, Driver's License, Passport

### Tier 3 (Full Verification)

- **Requirements**: Proof of address + source of fund
- **Daily Limit**: ₦5,000,000
- **Max Balance**: Unlimited
- **Documents**: Utility bill, bank statement, business registration

## User Experience Flow

1. **Profile Screen**: User sees KYC status card with current tier and limits
2. **Upgrade Prompt**: If eligible, user can tap upgrade button
3. **Document Upload**: User selects ID type and uploads documents
4. **Validation**: Real-time validation with error messages
5. **Submission**: Documents submitted to backend with loading state
6. **Status Update**: User context updated with new KYC status
7. **Confirmation**: Success modal or status screen update

## Error Handling

### Validation Errors

- Missing ID type selection
- Missing document uploads
- Invalid file formats
- File size limits (2MB max)

### API Errors

- Network connectivity issues
- Server errors
- Authentication failures
- File upload failures

### User Feedback

- Loading indicators during submission
- Error messages with specific guidance
- Success confirmations
- Status updates in real-time

## Security Considerations

1. **Image Upload**: Images are uploaded securely to backend storage
2. **Authentication**: All KYC endpoints require valid auth tokens
3. **Validation**: Both client and server-side validation
4. **File Limits**: 2MB maximum file size enforced
5. **Supported Formats**: JPEG and PNG only

## Testing Checklist

### Tier 2 KYC

- [ ] ID type selection works
- [ ] Image picker opens correctly
- [ ] Form validation works
- [ ] API submission successful
- [ ] Loading states display
- [ ] Error handling works
- [ ] Success flow completes

### Tier 3 KYC

- [ ] Both document uploads work
- [ ] Form validation works
- [ ] API submission successful
- [ ] Loading states display
- [ ] Error handling works
- [ ] Success flow completes

### Status Screen

- [ ] Displays correct tier information
- [ ] Shows proper status indicators
- [ ] Refresh functionality works
- [ ] Navigation to upgrade screens works
- [ ] Account limits display correctly

### Profile Integration

- [ ] KYC card displays correctly
- [ ] Upgrade button works
- [ ] KYC menu item works
- [ ] Status updates reflect in real-time

## Future Enhancements

1. **Face Match Integration**: Implement face matching between ID and selfie
2. **Document OCR**: Extract text from uploaded documents
3. **Progress Tracking**: Show detailed progress for each verification step
4. **Push Notifications**: Notify users of KYC status changes
5. **Admin Panel**: Allow admins to review and approve/reject KYC submissions
6. **Analytics**: Track KYC completion rates and user behavior

## Troubleshooting

### Common Issues

1. **Image Upload Fails**

   - Check file size (must be < 2MB)
   - Verify file format (JPEG/PNG only)
   - Check network connectivity

2. **KYC Status Not Updating**

   - Refresh the status screen
   - Check if user context is updated
   - Verify API response format

3. **Navigation Issues**
   - Ensure all screens are registered in navigation
   - Check route parameters are passed correctly
   - Verify navigation stack structure

### Debug Mode

Enable debug logging by setting `console.log` statements in:

- KYC service methods
- Screen navigation handlers
- API response handlers
