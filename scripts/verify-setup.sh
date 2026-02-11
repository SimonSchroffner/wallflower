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
    echo "Please install Node.js 20+ from https://nodejs.org"
    exit 1
fi

# Check pnpm
echo -n "✓ Checking pnpm... "
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    echo "found ($PNPM_VERSION)"
else
    echo "❌ NOT FOUND"
    echo "Run: npm install -g pnpm"
    exit 1
fi

# Check dependencies
echo -n "✓ Checking dependencies... "
if [ -d "node_modules" ]; then
    echo "installed"
else
    echo "❌ NOT INSTALLED"
    echo "Run: pnpm install"
    exit 1
fi

# Check Prisma client
echo -n "✓ Checking Prisma client... "
if [ -d "node_modules/.pnpm/@prisma+client"* ]; then
    echo "generated"
else
    echo "⚠️  NOT GENERATED"
    echo "Run: cd packages/backend && npx prisma generate"
fi

# Check environment files
echo ""
echo "Environment Files:"
echo -n "  - Backend .env... "
if [ -f "packages/backend/.env" ]; then
    echo "✓ exists"
else
    echo "❌ MISSING"
fi

echo -n "  - Display .env... "
if [ -f "packages/display/.env" ]; then
    echo "✓ exists"
else
    echo "❌ MISSING"
fi

echo -n "  - Mobile .env... "
if [ -f "packages/mobile/.env" ]; then
    echo "✓ exists"
else
    echo "❌ MISSING"
fi

# Check PostgreSQL connection (optional)
echo ""
echo -n "✓ Checking PostgreSQL... "
if command -v psql &> /dev/null; then
    echo "found"
    echo "  To test connection, run: psql \$DATABASE_URL"
else
    echo "⚠️  psql not in PATH (optional)"
fi

echo ""
echo "================================"
echo "Setup verification complete!"
echo ""
echo "Next steps:"
echo "1. Configure DATABASE_URL in packages/backend/.env"
echo "2. Run: cd packages/backend && npx prisma migrate deploy"
echo "3. Run: pnpm dev"
echo ""
echo "See QUICKSTART.md for detailed instructions."
