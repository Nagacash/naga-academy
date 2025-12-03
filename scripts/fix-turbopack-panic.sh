#!/bin/bash

# Fix Turbopack panic by clearing caches and restarting

echo "🧹 Clearing Next.js cache..."
rm -rf .next

echo "🧹 Clearing node_modules/.cache..."
rm -rf node_modules/.cache

echo "🧹 Stopping any running dev servers..."
pkill -f "next dev" || true

echo "✅ Cache cleared! Now restart with: pnpm dev"

