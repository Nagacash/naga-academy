# Fix Admin Access - Getting Redirected from /admin

## The Problem

You're being redirected from `/admin` pages because your email isn't in the admin list.

## Quick Fix: Add Your Email to Admin List

### Option 1: Add via Environment Variable (Recommended)

1. **Check your current email**:
   - Sign in to your app
   - Your email should be visible in Clerk Dashboard → Users

2. **Add to `.env.local`**:
   ```bash
   ADMIN_EMAILS=your-email@gmail.com,sonic13.ch@googlemail.com
   ```
   
   Replace `your-email@gmail.com` with the email you used to sign up (the one from Google OAuth).

3. **Restart your dev server**:
   ```bash
   # Stop server (Ctrl+C) and restart
   pnpm dev
   ```

4. **Try accessing admin again**: `http://localhost:3000/admin`

### Option 2: Update Code Directly

1. **Open** `lib/admin-access.ts`
2. **Find line 13** with the default admin email
3. **Add your email** to the array:
   ```typescript
   return ["sonic13.ch@googlemail.com", "your-email@gmail.com"].map((e) => e.toLowerCase());
   ```
4. **Restart dev server**

## How to Find Your Email

### Method 1: Check Clerk Dashboard
1. Go to https://dashboard.clerk.com
2. Click **Users** in sidebar
3. Find your user account
4. Check the **Email addresses** section
5. Copy the email address

### Method 2: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. The admin check might log errors - check for your email

### Method 3: Use Debug Endpoint
I'll create a debug endpoint to show your current email (see below)

## Current Admin Emails

The system currently recognizes:
- `sonic13.ch@googlemail.com` (hardcoded)
- Any emails in `ADMIN_EMAILS` environment variable

## After Adding Your Email

1. **Make sure you're signed in** with the email you added
2. **Restart the dev server** (important!)
3. **Try accessing** `http://localhost:3000/admin`
4. **You should now have access!**

## Troubleshooting

**Still redirecting?**
- Make sure email matches exactly (case-insensitive, but check for typos)
- Make sure you restarted the dev server
- Make sure you're signed in with the correct email
- Check browser console for errors

**Not signed in?**
- Go to `http://localhost:3000/sign-in`
- Sign in with Google (or the email you added to admin list)


