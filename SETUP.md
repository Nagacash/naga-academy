# Setup Guide - Naga Academy LMS

This guide will walk you through setting up all the required services and getting the platform running.

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Accounts for: Sanity, Clerk, Mux, OpenAI

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

3. **Follow the setup steps below for each service**

4. **Start the development server:**
   ```bash
   pnpm dev
   ```

---

## Step 1: Sanity Setup

### 1.1 Create Sanity Account & Project

1. Go to [sanity.io](https://www.sanity.io) and sign up
2. Create a new project
3. Choose a project name and dataset name (default: `production`)

### 1.2 Get Credentials

1. Go to **Settings** → **API** → **Project settings**
2. Copy your **Project ID**
3. Note your **Dataset** name (usually `production`)
4. Go to **Settings** → **Organization** to get your **Organization ID**

### 1.3 Configure CORS

1. Go to **Settings** → **API** → **CORS origins**
2. Add these origins:
   - `http://localhost:3000` (for development)
   - Your production domain (when ready)

### 1.4 Set Environment Variables

Add to `.env.local`:
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-11-27
NEXT_PUBLIC_SANITY_ORG_ID=your_org_id
```

### 1.5 Test Connection

1. Run `pnpm dev`
2. Visit `http://localhost:3000/studio` - should load Sanity Studio
3. Visit `http://localhost:3000/admin` - should load custom admin panel

---

## Step 2: Mux Setup

### 2.1 Create Mux Account

1. Go to [mux.com](https://www.mux.com) and sign up
2. Complete account setup

### 2.2 Get API Credentials

1. Go to **Settings** → **API Access Tokens**
2. Create a new token
3. Copy the **Token ID** and **Token Secret**

### 2.3 Generate Signing Keys

1. Go to **Settings** → **Signing Keys**
2. Click **Create new signing key**
3. Copy the **Key ID** and **Private Key**
   - ⚠️ **Important:** Save the private key immediately - you won't see it again!

### 2.4 Set Environment Variables

Add to `.env.local`:
```bash
MUX_TOKEN_ID=your_token_id
MUX_TOKEN_SECRET=your_token_secret
MUX_SIGNING_KEY_ID=your_signing_key_id
MUX_SIGNING_KEY=your_private_key
```

**Note:** The code uses `MUX_SIGNING_KEY` (not `MUX_SIGNING_KEY_PRIVATE`). The private key should be in PEM format or base64-encoded.

### 2.5 Test Video Upload

1. Visit `http://localhost:3000/admin/lessons`
2. Create a new lesson
3. Upload a test video via the Mux uploader
4. Wait for video to process (status will show "ready")
5. Verify video appears in Sanity

---

## Step 3: Clerk Setup

### 3.1 Create Clerk Account

1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application

### 3.2 Get Credentials

1. Go to **API Keys** in the dashboard
2. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
3. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 3.3 Configure Authentication

1. Go to **User & Authentication**
2. Enable **Email** authentication (or OAuth providers)
3. Configure sign-in/sign-up pages as needed

### 3.4 Set Up Subscription Plans

1. Go to **Billing** → **Plans** (or **Subscriptions**)
2. Create three plans matching the tiers:

   **Free Plan:**
   - Name: `Free`
   - Price: $0
   - Plan identifier: `free` (or configure metadata)

   **Pro Plan:**
   - Name: `Pro`
   - Set your desired price
   - Plan identifier: `pro` (or configure metadata)

   **Ultra Plan:**
   - Name: `Ultra`
   - Set your desired price
   - Plan identifier: `ultra` (or configure metadata)

3. **Important:** Configure plan metadata so Clerk's `has({ plan: "pro" })` and `has({ plan: "ultra" })` checks work correctly.

### 3.5 Set Environment Variables

Add to `.env.local`:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3.6 Configure Webhooks (Optional for Development)

For production, you'll need to set up webhooks:

1. Get your webhook secret:
   - Go to **Webhooks** in Clerk dashboard
   - Create a new webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Copy the **Signing Secret**

2. Add to `.env.local`:
   ```bash
   CLERK_WEBHOOK_SECRET=whsec_...
   ```

3. Select these events:
   - `user.created`
   - `user.updated`
   - `subscription.created`
   - `subscription.updated`

### 3.7 Test Authentication

1. Visit `http://localhost:3000/dashboard`
2. Should redirect to sign-in page
3. Sign up a new user
4. Verify user can access dashboard

---

## Step 4: OpenAI Setup

### 4.1 Get API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create account
3. Go to **API Keys**
4. Create a new secret key
5. Copy the key (starts with `sk-`)

### 4.2 Set Environment Variable

Add to `.env.local`:
```bash
OPENAI_API_KEY=sk-...
```

### 4.3 Test AI Tutor

1. Sign up as an Ultra tier user (or manually set tier in Clerk)
2. Visit any lesson page
3. Open the AI tutor widget (bottom right)
4. Ask a question about course content
5. Verify it searches and responds with relevant information

---

## Step 5: Import Sample Data

### 5.1 Import via CLI

```bash
npx sanity dataset import sample-data.ndjson production
```

Or use Sanity Studio:
1. Visit `http://localhost:3000/studio`
2. Use the Import tool
3. Upload `sample-data.ndjson`

### 5.2 Verify Import

1. Visit `http://localhost:3000/admin`
2. Check that courses, modules, lessons, and categories appear
3. Verify counts match sample data

---

## Step 6: Generate TypeScript Types

```bash
# Extract schema
pnpm schema:extract

# Generate types
pnpm typegen

# Verify no errors
pnpm typecheck
```

---

## Step 7: Test Everything

### Admin Panel (`/admin`)
- [ ] Dashboard loads and shows stats
- [ ] Can create new course
- [ ] Can edit course with modules
- [ ] Can create/edit modules
- [ ] Can create/edit lessons
- [ ] Can upload video to lesson
- [ ] Can publish/unpublish documents

### Learner App (`/`)
- [ ] Homepage loads
- [ ] Can browse courses
- [ ] Can view course details
- [ ] Can access free courses
- [ ] Tier gating works (Pro/Ultra courses blocked for Free users)

### Authentication
- [ ] Can sign up
- [ ] Can sign in
- [ ] Can sign out
- [ ] Protected routes redirect properly

### Video Playback
- [ ] Can watch lesson videos
- [ ] Video player loads and plays
- [ ] Progress tracking works

### Progress Tracking
- [ ] Can mark lesson as complete
- [ ] Can mark course as complete
- [ ] Dashboard shows progress

### AI Tutor (Ultra tier only)
- [ ] Tutor widget appears for Ultra users
- [ ] Can ask questions
- [ ] Tutor searches course content
- [ ] Tutor provides relevant answers

---

## Troubleshooting

### Sanity Issues

**"Project not found"**
- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
- Check dataset name matches

**Content not updating**
- Check you're using the correct dataset
- Restart dev server

**TypeScript errors**
- Run `pnpm typegen` to regenerate types
- Run `pnpm typecheck` to verify

### Clerk Issues

**"Clerk not loading"**
- Check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set correctly
- Verify key is for the correct environment (test vs live)

**"Unauthorized" errors**
- Verify `CLERK_SECRET_KEY` matches your Clerk app
- Check key is for the correct environment

**Subscription not recognized**
- Check Clerk subscription configuration
- Verify plan identifiers match code expectations
- Check webhook is configured (for production)

### Mux Issues

**Videos not playing**
- Verify Mux credentials are correct
- Check Mux asset status is "ready" in Sanity

**"Playback token invalid"**
- Check `MUX_SIGNING_KEY` is properly formatted
- Verify signing key is correct (PEM format or base64)
- Ensure `MUX_SIGNING_KEY_ID` matches the key

**Videos stuck loading**
- Ensure Mux asset status is "ready" in Sanity
- Check video has finished processing in Mux dashboard

### AI Tutor Issues

**Tutor not responding**
- Verify `OPENAI_API_KEY` is valid
- Check API key has sufficient credits
- Ensure courses have published content

**"No content found"**
- Ensure courses have published content
- Check Sanity dataset has course data

**Tutor showing for non-Ultra users**
- Check Clerk subscription configuration
- Verify `has({ plan: "ultra" })` check is working

---

## Next Steps

Once everything is set up and tested:

1. Review the feature list in the plan
2. Prioritize additional features to implement
3. Start building new features!

---

## Environment Variables Checklist

Make sure all these are set in `.env.local`:

- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID`
- [ ] `NEXT_PUBLIC_SANITY_DATASET`
- [ ] `NEXT_PUBLIC_SANITY_API_VERSION`
- [ ] `NEXT_PUBLIC_SANITY_ORG_ID`
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `CLERK_SECRET_KEY`
- [ ] `CLERK_WEBHOOK_SECRET` (for production)
- [ ] `OPENAI_API_KEY`
- [ ] `MUX_TOKEN_ID`
- [ ] `MUX_TOKEN_SECRET`
- [ ] `MUX_SIGNING_KEY_ID`
- [ ] `MUX_SIGNING_KEY`

