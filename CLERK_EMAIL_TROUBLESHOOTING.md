# Clerk Email Verification Troubleshooting

## Issue: Not Receiving Verification Codes

If you're not receiving Clerk verification codes in your email, try these solutions:

## Quick Fixes

### 1. Check Spam/Junk Folder
- Clerk emails sometimes end up in spam
- Check your spam, junk, promotions, or other folders
- Add `noreply@clerk.com` to your contacts/whitelist

### 2. Wait a Few Minutes
- Email delivery can take 1-5 minutes
- Don't request multiple codes immediately (this can cause delays)

### 3. Try a Different Email Provider
- Some email providers (like corporate emails) block automated emails
- Try with Gmail, Outlook, or another personal email
- Avoid emails with strict spam filters

### 4. Check Clerk Dashboard Email Settings

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **User & Authentication** → **Email, Phone, Username**
3. Verify **Email** is enabled
4. Check **Email verification** settings:
   - Should be set to "Required" or "Optional"
   - Make sure it's not disabled

### 5. Check Email Delivery Status

1. In Clerk Dashboard, go to **Users**
2. Find your user account
3. Check the **Email addresses** section
4. Look for delivery status or error messages

### 6. Use Clerk's Test Mode

If you're in development:
1. Clerk's test mode has email limits
2. Check if you've exceeded the daily email limit
3. Consider using Clerk's development mode which shows codes in the dashboard

### 7. View Codes in Clerk Dashboard (Development Only)

For testing purposes, you can view verification codes in the Clerk Dashboard:

1. Go to Clerk Dashboard → **Users**
2. Find the user account
3. Click on the user
4. In development/test mode, verification codes may be visible in the user details

### 8. Check Environment Variables

Make sure your Clerk keys are correct:

```bash
# Check your .env.local file
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Verify these match your Clerk Dashboard → **API Keys**

### 9. Reset Email Verification

If an email is stuck in "unverified" state:

1. Go to Clerk Dashboard → **Users**
2. Find the user
3. Click on the email address
4. Click **"Resend verification email"** or **"Delete email"** and re-add it

### 10. Use Magic Link Instead

If verification codes aren't working, try using Clerk's magic link:

1. In Clerk Dashboard → **User & Authentication** → **Email, Phone, Username**
2. Enable **"Magic links"** as an alternative
3. Users can click a link instead of entering a code

## Development/Testing Workaround

### Option 1: Use Clerk's Development Mode
- In development, Clerk may show codes in the browser console
- Check your browser's developer console for verification codes

### Option 2: Use Test Email Services
- Use services like [Mailinator](https://www.mailinator.com/) or [10 Minute Mail](https://10minutemail.com/)
- These are designed for testing and receive emails quickly

### Option 3: Configure Custom SMTP (Production)

For production, you can configure custom email delivery:

1. Go to Clerk Dashboard → **Settings** → **Email**
2. Configure custom SMTP settings
3. Use your own email service (SendGrid, AWS SES, etc.)

## Common Email Provider Issues

| Provider | Issue | Solution |
|----------|-------|----------|
| Gmail | Codes in spam | Check spam folder, whitelist Clerk |
| Outlook/Hotmail | Delayed delivery | Wait 5-10 minutes |
| Corporate email | Blocked by firewall | Use personal email for testing |
| Yahoo | Filtered as spam | Check spam folder |

## Still Not Working?

1. **Check Clerk Status**: Visit [status.clerk.com](https://status.clerk.com) for service issues
2. **Contact Clerk Support**: Use the support chat in your Clerk Dashboard
3. **Check Browser Console**: Look for any JavaScript errors that might prevent email sending
4. **Verify Network**: Make sure your network isn't blocking Clerk's API calls

## Alternative: Use OAuth Providers

If email verification continues to be problematic, you can enable OAuth providers:

1. Go to Clerk Dashboard → **User & Authentication** → **Social Connections**
2. Enable **Google**, **GitHub**, or other providers
3. Users can sign in with OAuth instead of email verification


