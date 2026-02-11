#!/bin/bash

# Wallflower Setup Verification Script

echo "🌸 Wallflower Setup Verification"
echo "================================"
echo ""

# Check Node.js
echo -n "✓ Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "found ($NODE_VERSION)"
else
    echo "❌ NOT FOUND"
    exit 1
fi

# Check pnpm
echo -n "✓ Checking pnpm... "
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    echo "found ($PNPM_VERSION)"
else
    echo "❌ NOT FOUND"
    exit 1
fi

# Check dependencies
echo -n "✓ Checking dependencies... "
if [ -d "node_modules" ]; then
    echo "installed"
else
    echo "❌ NOT INSTALLED"
    exit 1
fi

echo ""
echo "================================"
echo "✓ Setup verification complete!"
echo ""
echo "Next steps:"
echo "1. Configure DATABASE_URL in packages/backend/.env"
echo "2. Run: cd packages/backend && npx prisma migrate deploy"
echo "3. Run: pnpm dev"
echo ""
echo "See QUICKSTART.md for detailed instructions."
