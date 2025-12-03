#!/bin/bash

# Update Mux credentials in .env.local

TOKEN_ID="0f827daa-d405-48fa-a553-fbf580223955"
TOKEN_SECRET="A0nby59L3nAwZxcQijE1LbVpLz9oZv05QQqdkK609hYJSUZz84zw9+sRyJyA5ZkomJm5Ukx3qET"

echo "Updating Mux credentials in .env.local..."

# Update or add MUX_TOKEN_ID
if grep -q "MUX_TOKEN_ID" .env.local 2>/dev/null; then
  sed -i '' "s|MUX_TOKEN_ID=.*|MUX_TOKEN_ID=$TOKEN_ID|" .env.local
  echo "✅ Updated MUX_TOKEN_ID"
else
  echo "" >> .env.local
  echo "# Mux Video - API Credentials" >> .env.local
  echo "MUX_TOKEN_ID=$TOKEN_ID" >> .env.local
  echo "✅ Added MUX_TOKEN_ID"
fi

# Update or add MUX_TOKEN_SECRET
if grep -q "MUX_TOKEN_SECRET" .env.local 2>/dev/null; then
  sed -i '' "s|MUX_TOKEN_SECRET=.*|MUX_TOKEN_SECRET=$TOKEN_SECRET|" .env.local
  echo "✅ Updated MUX_TOKEN_SECRET"
else
  echo "MUX_TOKEN_SECRET=$TOKEN_SECRET" >> .env.local
  echo "✅ Added MUX_TOKEN_SECRET"
fi

echo ""
echo "✅ Mux API credentials added!"
echo ""
echo "📝 Still needed from Mux Dashboard:"
echo "   Go to: Settings → Signing Keys"
echo "   - MUX_SIGNING_KEY_ID"
echo "   - MUX_SIGNING_KEY (private key)"
echo ""
echo "After adding signing keys, restart your dev server."

