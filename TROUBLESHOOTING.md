# Troubleshooting Guide

## Turbopack Panic Error

If you see this error:
```
⨯ [Error: Panic in async function] { code: 'GenericFailure' }
thread 'tokio-runtime-worker' panicked at crates/napi/src/next_api/turbopack_ctx.rs
```

### Quick Fix:

1. **Stop the dev server** (Ctrl+C)

2. **Clear the Next.js cache:**
   ```bash
   rm -rf .next
   ```

3. **Clear node_modules cache:**
   ```bash
   rm -rf node_modules/.cache
   ```

4. **Restart the dev server:**
   ```bash
   pnpm dev
   ```

### Alternative: Use Webpack instead of Turbopack

If the panic persists, you can temporarily disable Turbopack by running:
```bash
pnpm dev -- --no-turbopack
```

Or add to `package.json` scripts:
```json
"dev:webpack": "next dev --no-turbopack"
```

### Common Causes:

- File system watching conflicts
- Corrupted build cache
- Multiple dev servers running
- Large number of files being watched

### If Problem Persists:

1. **Check for multiple Node processes:**
   ```bash
   ps aux | grep node
   ```
   Kill any duplicate processes

2. **Restart your terminal/IDE**

3. **Check disk space:**
   ```bash
   df -h
   ```

4. **Try a clean install:**
   ```bash
   rm -rf node_modules .next
   pnpm install
   pnpm dev
   ```

