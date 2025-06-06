# Razorpay Integration Setup

This guide explains how to set up Razorpay payment integration for the $5 one-time Premium plan upgrade.

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

### Payment Flow

1. User clicks "Upgrade to Premium" on billing page
2. Frontend creates a Razorpay order via `/api/payment/create-order`
3. Razorpay checkout modal opens with $5 USD payment
4. User completes payment
5. Payment is verified via `/api/payment/verify`
6. User is upgraded to Premium plan
7. Order is recorded in user's order history

### Security Features

- Payment signature verification
- Webhook signature validation
- Protected API routes with Clerk authentication
- Duplicate payment prevention

## Testing

### Test Payment Credentials

Use these test card details in Test mode:

- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **Name**: Any name

### Test Flow

1. Ensure you're using Test mode API keys
2. Complete a test payment on the billing page
3. Verify user is upgraded to Premium
4. Check order appears in order history

## Currency Support

Currently configured for USD payments. To add other currencies:

1. Update the `currency` prop in `RazorpayPayment` component
2. Modify the `create-order` API to handle currency conversion
3. Update the UI to display correct currency symbols

## Troubleshooting

### Common Issues

1. **Payment fails**: Check API keys are correct and from the right mode (Test/Live)
2. **Webhook not working**: Verify webhook URL is accessible and secret is correct
3. **Order not created**: Check MongoDB connection and User model schema

### Logs

- Payment creation: Check browser console and `/api/payment/create-order` logs
- Payment verification: Check `/api/payment/verify` logs
- Webhook events: Check `/api/payment/webhook` logs

## Files Structure

```
app/api/payment/
├── create-order/route.js    # Creates Razorpay order
├── verify/route.js          # Verifies payment and upgrades user
└── webhook/route.js         # Handles Razorpay webhooks

components/ui/
└── razorpay-payment.jsx     # Payment component

app/app/billing/
└── page.js                  # Updated with Razorpay integration
```

## Security Considerations

1. **Never expose Key Secret**: Keep it server-side only
2. **Verify all payments**: Always verify payment signatures
3. **Use HTTPS**: Required for production Razorpay integration
4. **Validate webhooks**: Always verify webhook signatures
5. **Rate limiting**: Consider adding rate limits to payment endpoints
