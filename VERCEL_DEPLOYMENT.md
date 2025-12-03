# Vercel Deployment Guide

Complete guide to deploy Naga Academy to Vercel.

## Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier works)
3. **All Environment Variables** - Have all your API keys ready

---

## Step 1: Push Code to GitHub

If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Option A: GitHub Integration (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Your Repository**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `pnpm build` (or `npm run build`)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `pnpm install` (or `npm install`)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add all variables from your `.env.local`:

   ```
   # Sanity
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2025-11-27
   SANITY_API_WRITE_TOKEN=your_write_token
   
   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... (use production keys!)
   CLERK_SECRET_KEY=sk_live_... (use production keys!)
   CLERK_WEBHOOK_SECRET=whsec_...
   
   # OpenAI
   OPENAI_API_KEY=sk-...
   
   # Mux
   MUX_TOKEN_ID=your_token_id
   MUX_TOKEN_SECRET=your_token_secret
   MUX_SIGNING_KEY_ID=your_signing_key_id
   MUX_SIGNING_KEY_PRIVATE=your_signing_key_private
   
   # Admin
   ADMIN_EMAILS=your-email@example.com
   
   # App URL (for redirects)
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)

### Option B: Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel
# or
pnpm i -g vercel

# Login to Vercel
vercel login

# Deploy (preview)
vercel

# Deploy to production
vercel --prod
```

When prompted:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No (first time)
- **Project name?** naga-academy (or your choice)
- **Directory?** `./` (current directory)
- **Override settings?** No

Then add environment variables via Vercel Dashboard or CLI:

```bash
vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID
vercel env add CLERK_SECRET_KEY
# ... repeat for each variable
```

---

## Step 3: Post-Deployment Configuration

### 3.1 Update Clerk Settings

1. **Go to Clerk Dashboard** → Your App → Settings
2. **Update URLs:**
   - **Frontend API:** `https://your-domain.vercel.app`
   - **Allowed Origins:** `https://your-domain.vercel.app`
3. **Switch to Production Keys:**
   - Use `pk_live_...` and `sk_live_...` (not test keys!)
   - Update environment variables in Vercel

### 3.2 Configure Clerk Webhooks

1. **Go to Clerk Dashboard** → Webhooks
2. **Create New Endpoint:**
   - **URL:** `https://your-domain.vercel.app/api/webhooks/clerk`
   - **Events to Subscribe:**
     - `user.created`
     - `user.updated`
     - `subscription.created`
     - `subscription.updated`
3. **Copy Signing Secret:**
   - Add to Vercel as `CLERK_WEBHOOK_SECRET`

### 3.3 Configure Sanity CORS

1. **Go to Sanity Dashboard** → Your Project → Settings → API → CORS origins
2. **Add Production URL:**
   - `https://your-domain.vercel.app`
   - `https://*.vercel.app` (for preview deployments)

### 3.4 Update Environment Variables

After getting your production domain, update:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

In Vercel Dashboard → Settings → Environment Variables

---

## Step 4: Test Your Deployment

### Checklist

- [ ] **Homepage loads** - Visit `https://your-domain.vercel.app`
- [ ] **Authentication works** - Sign up, sign in, sign out
- [ ] **Admin panel accessible** - Visit `/admin` (as admin user)
- [ ] **Sanity Studio loads** - Visit `/studio`
- [ ] **Courses display** - Check `/dashboard`
- [ ] **Video playback works** - Test a lesson with video
- [ ] **AI Tutor works** - Test as Ultra user (if applicable)
- [ ] **Webhooks working** - Check Clerk webhook logs

---

## Step 5: Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to Project → Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables:**
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain
   - Update Clerk allowed origins
   - Update Sanity CORS origins

---

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Check `package.json` has all dependencies
- Ensure `pnpm install` runs successfully locally first

**Error: "Environment variable missing"**
- Verify all variables are set in Vercel Dashboard
- Check variable names match exactly (case-sensitive)

### Runtime Errors

**"Clerk not loading"**
- Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
- Check you're using production keys (not test keys)

**"Sanity project not found"**
- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
- Check CORS is configured for your domain

**"Webhook verification failed"**
- Verify `CLERK_WEBHOOK_SECRET` matches Clerk Dashboard
- Check webhook URL is correct

### Performance

**Slow builds:**
- Vercel caches `node_modules` automatically
- Consider using `.vercelignore` for large files

**Slow page loads:**
- Check image optimization (Next.js handles this automatically)
- Verify Mux videos are properly configured

---

## Environment Variables Reference

### Required for Production

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=*
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-11-27
SANITY_API_WRITE_TOKEN=*

# Clerk (Production Keys!)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_*
CLERK_SECRET_KEY=sk_live_*
CLERK_WEBHOOK_SECRET=whsec_*

# OpenAI
OPENAI_API_KEY=sk-*

# Mux
MUX_TOKEN_ID=*
MUX_TOKEN_SECRET=*
MUX_SIGNING_KEY_ID=*
MUX_SIGNING_KEY_PRIVATE=*

# Admin
ADMIN_EMAILS=your-email@example.com

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Optional

```bash
# Only if using Sanity Live
SANITY_API_READ_TOKEN=*
```

---

## Next Steps

1. **Set up monitoring** - Consider adding Sentry or similar
2. **Configure backups** - Sanity has automatic backups
3. **Set up analytics** - Add Google Analytics or similar
4. **Configure CDN** - Vercel handles this automatically
5. **Set up staging** - Use Vercel preview deployments

---

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Test locally first to isolate issues

Happy deploying! 🚀

