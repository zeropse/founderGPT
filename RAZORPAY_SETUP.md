# Razorpay Integration Setup (Enhanced)

This guide explains the enhanced Razorpay payment integration for the $5 one-time Premium plan upgrade with improved error handling, user experience, and security features.

## ✨ New Features

### Enhanced Payment Component

- **Better Error Handling**: Specific error messages for different failure scenarios
- **User Prefilling**: Automatically fills user name and email from Clerk authentication
- **Payment Validation**: Client-side validation before payment initiation
- **Retry Logic**: Automatic retry for network failures during order creation
- **Payment States**: Visual feedback for different payment states (loading, processing, success, error)
- **Security Indicators**: SSL encryption badge and security messaging
- **USD Support**: Built-in support for USD payments

### Enhanced API Endpoints

- **Robust Error Handling**: Better error categorization and user-friendly messages
- **Duplicate Payment Prevention**: Prevents processing the same payment twice
- **Enhanced Logging**: Comprehensive logging for debugging and monitoring
- **Performance Tracking**: Payment processing time tracking
- **Validation**: Comprehensive input validation and sanitization

### Payment Utilities

- **Payment Utilities**: Helper functions for USD formatting and validation
- **Validation Functions**: Payment amount and ID validation
- **Error Message Mapping**: User-friendly error messages for Razorpay errors
- **Security Functions**: Payment data sanitization for logging

## Prerequisites

1. **Razorpay Account**: Sign up at [https://razorpay.com](https://razorpay.com)
2. **API Keys**: Get your Key ID and Key Secret from the Razorpay Dashboard

## Environment Variables

Add these variables to your `.env.local` file:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

## Razorpay Dashboard Setup

### 1. Get API Keys

1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to Settings → API Keys
3. Generate or copy your Key ID and Key Secret
4. Add them to your environment variables

### 2. Configure Webhooks (Optional but Recommended)

1. Go to Settings → Webhooks
2. Create a new webhook with URL: `https://yourdomain.com/api/payment/webhook`
3. Select events: `payment.captured`, `payment.failed`
4. Copy the webhook secret and add to `RAZORPAY_WEBHOOK_SECRET`

### 3. Test Mode vs Live Mode

- For development: Use Test mode keys
- For production: Switch to Live mode and update keys

## How It Works

### Enhanced Payment Flow

1. **Validation**: Component validates amount before proceeding
2. **User Prefilling**: Automatically fills user details from Clerk authentication
3. **Order Creation**: Creates Razorpay order with retry logic and enhanced error handling
4. **Payment Modal**: Opens Razorpay checkout with enhanced configuration
5. **Payment Processing**: Real-time status updates and loading states
6. **Payment Verification**: Multi-layer verification with duplicate prevention
7. **User Upgrade**: Upgrades user to Premium plan with comprehensive error handling
8. **Order Recording**: Records order in database with detailed payment information

### Security Features

- **Enhanced signature verification**: Multi-step verification process
- **Duplicate payment prevention**: Prevents processing the same payment twice
- **Input validation**: Comprehensive validation of all payment data
- **Secure data handling**: Sanitization of sensitive payment information
- **Rate limiting ready**: Prepared for rate limiting implementation
- **Audit logging**: Comprehensive logging for security auditing

## Component Usage

### Basic Usage

```jsx
import RazorpayPayment from "@/components/app/razorpay-payment";

<RazorpayPayment
  amount={5}
  currency="USD"
  onSuccess={(data) => console.log("Payment successful!", data)}
  onError={(error) => console.error("Payment failed:", error)}
/>;
```

### Advanced Usage

```jsx
<RazorpayPayment
  amount={5}
  currency="USD"
  buttonText="Upgrade Now"
  showSecurityBadge={true}
  showPaymentInfo={true}
  disabled={false}
  className="custom-button-class"
  onSuccess={handlePaymentSuccess}
  onError={handlePaymentError}
/>
```

### Props

| Prop                | Type     | Default | Description                                            |
| ------------------- | -------- | ------- | ------------------------------------------------------ |
| `amount`            | number   | 5       | Payment amount in main currency unit                   |
| `currency`          | string   | "USD"   | Currency code (USD, INR, EUR, GBP)                     |
| `currencySymbol`    | string   | auto    | Custom currency symbol (auto-detected if not provided) |
| `onSuccess`         | function | -       | Callback for successful payment                        |
| `onError`           | function | -       | Callback for payment errors                            |
| `disabled`          | boolean  | false   | Disable the payment button                             |
| `className`         | string   | ""      | Additional CSS classes                                 |
| `buttonText`        | string   | auto    | Custom button text                                     |
| `showSecurityBadge` | boolean  | true    | Show security badge                                    |
| `showPaymentInfo`   | boolean  | true    | Show payment information                               |

## Testing

### Test Payment Credentials

Use these test card details in Test mode:

- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **Name**: Any name

### Additional Test Cards

- **Visa**: 4111 1111 1111 1111
- **Mastercard**: 5555 5555 5555 4444
- **Amex**: 3782 8224 6310 005
- **Failed Payment**: 4000 0000 0000 0002

### Test Flow

1. Ensure you're using Test mode API keys
2. Complete a test payment on the billing page
3. Verify user is upgraded to Premium
4. Check order appears in order history
5. Verify proper error handling with failed payment card

## Error Handling

### Client-Side Errors

- **Network errors**: Automatic retry with exponential backoff
- **Validation errors**: Real-time validation feedback
- **Payment failures**: Specific error messages based on failure reason
- **Script loading failures**: Graceful fallback and retry

### Server-Side Errors

- **API validation**: Comprehensive input validation
- **Database errors**: Graceful error handling without payment failure
- **Razorpay API errors**: Proper error mapping and user feedback
- **Duplicate payments**: Prevention and proper handling

## Currency Support

### Supported Currencies

- **USD**: US Dollar (minimum $0.50)
- **INR**: Indian Rupee (minimum ₹1)
- **EUR**: Euro (minimum €0.50)
- **GBP**: British Pound (minimum £0.30)

### Adding New Currencies

1. Update `SUPPORTED_CURRENCIES` in `/lib/utils/paymentUtils.js`
2. Add currency configuration with symbol, minimum amount, and multiplier
3. Test with Razorpay to ensure currency is supported

## Monitoring and Logging

### Payment Tracking

- **Processing time**: Track payment processing duration
- **Success/failure rates**: Monitor payment success rates
- **Error categorization**: Categorized error tracking
- **User behavior**: Track payment attempts and completions

### Logging Features

- **Comprehensive logging**: All payment steps are logged
- **Error tracking**: Detailed error information for debugging
- **Performance metrics**: Processing time and performance data
- **Security logging**: Security-related events and validations

## Troubleshooting

### Common Issues

1. **Payment fails immediately**

   - Check API keys are correct and from the right mode (Test/Live)
   - Verify environment variables are properly set
   - Check browser console for JavaScript errors

2. **Webhook not working**

   - Verify webhook URL is accessible from internet
   - Check webhook secret matches environment variable
   - Ensure webhook endpoint returns 200 status

3. **Order not created**

   - Check MongoDB connection
   - Verify User model schema
   - Check API endpoint logs

4. **Payment verification fails**
   - Verify Razorpay Key Secret is correct
   - Check payment signature calculation
   - Ensure payment is captured in Razorpay dashboard

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

### Logs Location

- Payment creation: Browser console and `/api/payment/create-order` logs
- Payment verification: `/api/payment/verify` logs
- Webhook events: `/api/payment/webhook` logs

## Files Structure

```
app/api/payment/
├── create-order/route.js    # Enhanced order creation with validation
├── verify/route.js          # Enhanced payment verification
└── webhook/route.js         # Webhook handling

components/app/
└── razorpay-payment.jsx     # Enhanced payment component

lib/utils/
└── paymentUtils.js          # Payment utility functions

app/app/billing/
└── page.js                  # Billing page using enhanced component
```

## Security Considerations

### Production Checklist

- [ ] **Environment Variables**: Verify all secrets are properly configured
- [ ] **HTTPS**: Ensure all payment endpoints use HTTPS
- [ ] **Rate Limiting**: Implement rate limiting on payment endpoints
- [ ] **Input Validation**: All inputs are validated server-side
- [ ] **Error Handling**: No sensitive information in error messages
- [ ] **Logging**: Sensitive data is sanitized in logs
- [ ] **Webhooks**: Webhook signatures are properly verified
- [ ] **Database**: Payment data is properly secured

### Security Features

1. **Signature Verification**: All payments verified with Razorpay signatures
2. **Input Sanitization**: All user inputs are sanitized and validated
3. **Duplicate Prevention**: Prevents processing duplicate payments
4. **Error Sanitization**: Sensitive information removed from error messages
5. **Audit Logging**: Comprehensive logging for security auditing
6. **Environment Validation**: Environment variables validated on startup

## Performance Optimizations

### Client-Side

- **Script Caching**: Razorpay script loaded once and cached
- **Lazy Loading**: Payment component loads only when needed
- **Error Recovery**: Automatic retry for transient failures
- **State Management**: Efficient state management for payment flow

### Server-Side

- **Connection Pooling**: Database connections properly pooled
- **Caching**: User data cached where appropriate
- **Async Processing**: Non-critical operations processed asynchronously
- **Error Handling**: Fast fail for invalid requests

## Support and Maintenance

### Regular Tasks

- **Monitor payment success rates**: Track and analyze payment metrics
- **Update test cards**: Ensure test cards are current
- **Review logs**: Regular log review for issues
- **Security updates**: Keep dependencies updated

### Monitoring Alerts

Set up alerts for:

- Payment failure rate > 5%
- API response time > 5 seconds
- Database connection failures
- Webhook verification failures

## Migration from Basic Implementation

If upgrading from the basic implementation:

1. **Backup**: Backup your current implementation
2. **Environment**: Ensure all environment variables are set
3. **Dependencies**: Update any dependencies if needed
4. **Testing**: Thoroughly test the enhanced implementation
5. **Monitoring**: Set up enhanced monitoring and logging

The enhanced implementation is backward compatible and provides better error handling and user experience out of the box.
