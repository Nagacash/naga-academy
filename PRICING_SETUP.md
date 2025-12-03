# Pricing Tiers Setup Guide

## Current Pricing Configuration

The platform supports three pricing tiers:

### Free Tier
- **Price:** $0/month
- **Plan ID:** `free`
- **Features:**
  - Access to foundational courses
  - Community Discord access
  - Basic projects & exercises
  - Email support

### Pro Tier
- **Price:** $29/month
- **Plan ID:** `pro`
- **Features:**
  - Everything in Free
  - All Pro-tier courses
  - Advanced real-world projects
  - Priority support
  - Course completion certificates

### Ultra Tier
- **Price:** $99/month
- **Plan ID:** `ultra`
- **Features:**
  - Everything in Pro
  - AI Learning Assistant
  - Exclusive Ultra-only content
  - Monthly 1-on-1 sessions
  - Private Discord channel
  - Early access to new courses
  - Lifetime updates

## Setting Up Pricing in Clerk

To enable actual payments, you need to configure pricing plans in Clerk:

### Step 1: Enable Billing in Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Billing** → **Settings**
3. Enable billing for your application
4. Connect a payment provider (Stripe is recommended)

### Step 2: Create Pricing Plans

**Important:** Clerk requires a minimum of $1 for monthly base fee, so we don't create a "Free" plan in Clerk. Users without a subscription are automatically treated as "free" tier.

1. Go to **Billing** → **Plans**
2. Create **only two paid plans**:

   **Pro Plan:**
   - Name: `Pro`
   - Key: `pro`
   - Monthly base fee: $29.00
   - Plan identifier: `pro` (in metadata)
   - Description: "All Pro-tier courses and advanced features"
   - **Publicly available:** Toggle ON (so it appears in PricingTable)

   **Ultra Plan:**
   - Name: `Ultra`
   - Key: `ultra`
   - Monthly base fee: $99.00
   - Plan identifier: `ultra` (in metadata)
   - Description: "AI Learning Assistant and exclusive content"
   - **Publicly available:** Toggle ON (so it appears in PricingTable)

**Note:** Do NOT create a "Free" plan in Clerk. The code automatically treats users without a subscription as "free" tier.

### Step 3: Configure Plan Metadata

For each paid plan, add metadata that matches the plan identifier:
- Pro: Add metadata `{ "plan": "pro" }`
- Ultra: Add metadata `{ "plan": "ultra" }`

This ensures that `has({ plan: "pro" })` and `has({ plan: "ultra" })` checks work correctly in the code.

**Free Tier Handling:**
- Users without any subscription are automatically "free" tier
- The code checks `has({ plan: "pro" })` and `has({ plan: "ultra" })` 
- If both return false, the user is treated as "free" tier

### Step 4: Test the Pricing Flow

1. Visit `/pricing` as a non-admin user
2. You should see Clerk's `PricingTable` component
3. Users can click to upgrade and will be redirected to Clerk's checkout
4. After payment, users will automatically get access to their tier

## Admin Bypass

Admins (configured in `ADMIN_EMAILS` or `lib/admin-access.ts`) can:
- See a custom upgrade interface at `/pricing`
- Upgrade to any tier instantly without payment
- This is for testing and development purposes

## Updating Prices

To change prices, update `lib/constants.ts`:

```typescript
export const TIER_FEATURES = [
  {
    tier: "Free",
    price: 0,  // Update this
    // ...
  },
  {
    tier: "Pro",
    price: 29,  // Update this
    // ...
  },
  {
    tier: "Ultra",
    price: 99,  // Update this
    // ...
  },
];
```

Then update the corresponding plans in Clerk Dashboard to match.

## Notes

- The pricing displayed in the UI comes from `lib/constants.ts`
- Actual billing is handled by Clerk
- Plan identifiers must match between the code and Clerk configuration
- Admins can upgrade without payment via the admin upgrade interface

