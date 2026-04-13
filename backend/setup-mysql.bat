@echo off
echo ========================================
echo Ruhama Clinic - MySQL Setup Script
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed
echo.

echo [2/5] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo [3/5] Generating Prisma Client for MySQL...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Failed to generate Prisma Client
    echo Make sure DATABASE_URL is set in .env file
    pause
    exit /b 1
)
echo ✓ Prisma Client generated
echo.

echo [4/5] Pushing schema to MySQL database...
echo This will create all tables in your MySQL database
call npx prisma db push
if errorlevel 1 (
    echo ERROR: Failed to push schema to database
    echo.
    echo Common issues:
    echo - Database doesn't exist (create it in cPanel MySQL Databases)
    echo - Wrong credentials in DATABASE_URL
    echo - MySQL server not running
    echo.
    pause
    exit /b 1
)
echo ✓ Database schema created
echo.

echo [5/5] Testing database connection...
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => { console.log('✓ Database connection successful!'); process.exit(0); }).catch((e) => { console.error('✗ Connection failed:', e.message); process.exit(1); });"
if errorlevel 1 (
    echo WARNING: Database connection test failed
    echo The schema was created but connection test failed
    echo This might be a temporary issue
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Verify .env file has correct MySQL credentials
echo 2. Run: npm start
echo 3. Test API endpoints
echo.
echo For production deployment:
echo 1. Build: npm run build
echo 2. Upload dist folder to cPanel
echo 3. Configure Node.js app in cPanel
echo.
pause
