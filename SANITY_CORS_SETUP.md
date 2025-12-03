# Sanity CORS Setup Guide

## Add CORS Origin for Local Development

To access Sanity Studio and use the Sanity App SDK, you need to add your local development URL as a CORS origin.

### Steps:

1. **Go to Sanity Dashboard**
   - Visit [sanity.io/manage](https://www.sanity.io/manage)
   - Select your project (Project ID: `mo941b3r`)

2. **Navigate to API Settings**
   - Go to **Settings** → **API** → **CORS origins**
   - Or go directly to: https://www.sanity.io/manage/personal/project/mo941b3r/api

3. **Add CORS Origin**
   - Click **"Add CORS origin"** or **"Add origin"**
   - Enter: `http://localhost:3000`
   - **Allow credentials**: ✅ Check this box (important!)
   - Click **Save**

4. **For Production** (when you deploy):
   - Add your production domain: `https://your-domain.com`
   - Also check **"Allow credentials"**

### Quick Link:
[Sanity Project API Settings](https://www.sanity.io/manage/personal/project/mo941b3r/api)

### After Adding:
- Refresh your browser
- The Studio should now load without CORS errors
- The admin panel should also work properly

### Note:
If you're using a different port (not 3000), add that URL instead. The CORS origin must match exactly what's in your browser's address bar.

