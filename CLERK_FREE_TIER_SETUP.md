# How to Set Up Free Tier in Clerk

## The Problem

Clerk requires a **minimum of $1** for the monthly base fee when creating a plan. You cannot create a $0 plan directly in Clerk.

## The Solution

**Don't create a "Free" plan in Clerk.** Instead, treat users without any subscription as the "free" tier.

## How It Works

1. **Free Tier Users:**
   - Users who sign up but don't subscribe to any plan
   - Automatically have access to free-tier content
   - The code checks: if user doesn't have `pro` or `ultra` plan → they're `free`

2. **Paid Tier Users:**
   - Users subscribe to Pro ($29/month) or Ultra ($99/month) plans
   - These plans are created in Clerk with actual pricing
   - Users get access based on their subscription

## Setup Instructions

### Step 1: Create Only Paid Plans in Clerk

1. Go to **Billing** → **Plans** in Clerk Dashboard
2. Click **"Create plan"**
3. Create **Pro Plan:**
   - Name: `Pro`
   - Key: `pro`
   - Monthly base fee: `$29.00` (minimum $1)
   - Description: "All Pro-tier courses and advanced features"
   - Toggle **"Publicly available"** ON
   - Add metadata: `{ "plan": "pro" }`

4. Create **Ultra Plan:**
   - Name: `Ultra`
   - Key: `ultra`
   - Monthly base fee: `$99.00`
   - Description: "AI Learning Assistant and exclusive content"
   - Toggle **"Publicly available"** ON
   - Add metadata: `{ "plan": "ultra" }`

### Step 2: How the Code Handles Free Tier

The code in `lib/course-access.ts` and `lib/hooks/use-user-tier.ts` works like this:

```typescript
// If user has ultra plan → return "ultra"
if (has({ plan: "ultra" })) return "ultra";

// If user has pro plan → return "pro"
if (has({ plan: "pro" })) return "pro";

// Otherwise → return "free" (default)
return "free";
```

So users without any subscription are automatically "free" tier.

### Step 3: Display Free Tier in Pricing Table

The pricing page at `/pricing` will show:
- **Free:** $0/month (displayed from `lib/constants.ts`, not from Clerk)
- **Pro:** $29/month (from Clerk)
- **Ultra:** $99/month (from Clerk)

Users can click "Get Started" for Free (which just signs them up) or upgrade to Pro/Ultra (which goes through Clerk's checkout).

## Summary

✅ **Do:** Create Pro and Ultra plans in Clerk with $29 and $99 pricing  
❌ **Don't:** Try to create a $0 "Free" plan in Clerk  
✅ **Result:** Users without subscriptions are automatically free tier

This is the standard approach for handling free tiers with Clerk's billing system.

