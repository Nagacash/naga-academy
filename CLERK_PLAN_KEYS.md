# Clerk Plan Keys Configuration

## Your Current Plan Setup

### Pro Plan
- **Plan ID:** `cplan_36LYDI1InUy7ifDMAZeJl2Ovrzi`
- **Plan Key:** `pro` (used in code)
- **Price:** $29/month

### Ultra Plan
- **Plan ID:** `cplan_36LYPG0WuhLcuqbD33wpHDb89lx`
- **Plan Key:** `ultra` (used in code)
- **Price:** $99/month

### Free Tier
- **Plan Key:** `free_user`
- **Price:** $0/month (or no subscription)

## How the Code Checks Plans

The code uses Clerk's `has()` function with plan keys:

```typescript
// Check for ultra tier
has({ plan: "ultra" })

// Check for pro tier
has({ plan: "pro" })

// Check for free tier (optional)
has({ plan: "free_user" })
```

## Important: Plan Keys vs Plan IDs

- **Plan Key:** The identifier you use in code (e.g., `"pro"`, `"ultra"`, `"free_user"`)
- **Plan ID:** The internal Clerk ID (e.g., `cplan_36LYDI1InUy7ifDMAZeJl2Ovrzi`)

**Make sure in Clerk Dashboard:**
- Pro plan has **Key:** `pro`
- Ultra plan has **Key:** `ultra`
- Free plan (if created) has **Key:** `free_user`

## Verifying Plan Keys in Clerk

1. Go to **Billing** → **Plans** in Clerk Dashboard
2. Click on each plan
3. Check the **"Key"** field matches:
   - Pro: `pro`
   - Ultra: `ultra`
   - Free: `free_user` (if you created one)

If the keys don't match, update them in Clerk Dashboard to match what the code expects.

## Plan Metadata (Optional but Recommended)

For each plan, add metadata:
- Pro: `{ "plan": "pro" }`
- Ultra: `{ "plan": "ultra" }`
- Free: `{ "plan": "free" }` (if you created a free plan)

This helps with debugging and ensures consistency.

