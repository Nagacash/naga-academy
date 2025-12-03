#!/bin/bash

# Add Mux Token ID to .env.local

TOKEN_ID="nu8ak12ntar2otlmnep49c9a8"

if grep -q "MUX_TOKEN_ID" .env.local 2>/dev/null; then
  # Update existing
  sed -i '' "s/MUX_TOKEN_ID=.*/MUX_TOKEN_ID=$TOKEN_ID/" .env.local
  echo "✅ Updated MUX_TOKEN_ID"
else
  # Add new
  echo "" >> .env.local
  echo "# Mux Video - Token ID" >> .env.local
  echo "MUX_TOKEN_ID=$TOKEN_ID" >> .env.local
  echo "✅ Added MUX_TOKEN_ID"
fi

echo ""
echo "📝 Still needed from Mux Dashboard:"
echo "   - MUX_TOKEN_SECRET (from Settings → API Access Tokens)"
echo "   - MUX_SIGNING_KEY_ID (from Settings → Signing Keys)"
echo "   - MUX_SIGNING_KEY (private key from Settings → Signing Keys)"
echo ""
echo "See MUX_SETUP.md for detailed instructions"

