# Mux Setup Guide

## Required Credentials

To complete Mux setup, you need 4 pieces of information from your Mux dashboard:

### 1. API Access Tokens
Go to: **Settings → API Access Tokens**

- **Token ID**: `nu8ak12ntar2otlmnep49c9a8` ✅ (already added)
- **Token Secret**: `your_token_secret_here` ⏳ (needed)

### 2. Signing Keys
Go to: **Settings → Signing Keys**

- **Signing Key ID**: `your_signing_key_id_here` ⏳ (needed)
- **Signing Key (Private Key)**: `your_private_key_here` ⏳ (needed)

## How to Get These

### Step 1: Get Token Secret
1. Go to [dashboard.mux.com](https://dashboard.mux.com)
2. Navigate to **Settings → API Access Tokens**
3. Find the token with ID `nu8ak12ntar2otlmnep49c9a8`
4. Click to reveal the **Token Secret**
5. Copy it (you won't see it again!)

### Step 2: Create Signing Key
1. Go to **Settings → Signing Keys**
2. Click **Create new signing key**
3. Copy the **Key ID**
4. Copy the **Private Key** immediately (you won't see it again!)
5. Save both values

## Environment Variables Format

Once you have all credentials, they should be in `.env.local` like this:

```bash
MUX_TOKEN_ID=nu8ak12ntar2otlmnep49c9a8
MUX_TOKEN_SECRET=your_token_secret_here
MUX_SIGNING_KEY_ID=your_signing_key_id_here
MUX_SIGNING_KEY=your_private_key_here
```

**Note:** The code uses `MUX_SIGNING_KEY` (not `MUX_SIGNING_KEY_PRIVATE` as mentioned in some docs).

## Testing Video Upload

Once all credentials are set:

1. Visit `http://localhost:3000/admin/lessons`
2. Create or edit a lesson
3. Use the Mux video uploader
4. Upload a test video
5. Wait for processing (status will show "ready")
6. Verify video appears in Sanity

## Troubleshooting

**"Mux API credentials are not configured"**
- Check all 4 environment variables are set
- Restart dev server after adding variables

**"Playback token invalid"**
- Verify signing key is correct (PEM format or base64)
- Ensure `MUX_SIGNING_KEY_ID` matches the key

**Videos stuck loading**
- Check Mux asset status is "ready" in Sanity
- Verify video finished processing in Mux dashboard

