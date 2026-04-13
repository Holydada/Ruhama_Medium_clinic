@echo off
REM Ruhama Clinic Backend Setup Script for Windows
REM This script sets up the backend with MySQL database

echo ========================================
echo Ruhama Clinic Backend Setup
echo ========================================
echo.

REM Check if we're in the backend directory
if not exist "package.json" (
    echo ERROR: Please run this script from the backend directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo [1/6] Checking MySQL installation...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: MySQL is not installed or not in PATH
    echo.
    echo Please install MySQL first:
    echo 1. Download from: https://dev.mysql.com/downloads/installer/
    echo 2. Install MySQL Server 8.0+
    echo 3. Set root password
    echo 4. Restart this script
    echo.
    echo See WINDOWS_MYSQL_SETUP.md for detailed instructions
    pause
    exit /b 1
)
echo MySQL is installed
echo.

echo [2/6] Checking .env file...
if not exist ".env" (
    echo.
    echo ERROR: .env file not found
    echo Please create .env file with DATABASE_URL
    echo.
    echo Example:
    echo DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/ruhama_clinic"
    echo.
    pause
    exit /b 1
)
echo .env file exists
echo.

echo [3/6] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)
echo Dependencies installed
echo.

echo [4/6] Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Prisma generate failed
    pause
    exit /b 1
)
echo Prisma Client generated
echo.

echo [5/6] Pushing database schema...
echo This will create all tables in your MySQL database
call npx prisma db push
if errorlevel 1 (
    echo ERROR: Database push failed
    echo.
    echo Common issues:
    echo - MySQL server not running
    echo - Database does not exist
    echo - Wrong credentials in DATABASE_URL
    echo.
    echo To create database manually:
    echo   mysql -u root -p
    echo   CREATE DATABASE ruhama_clinic;
    echo   EXIT;
    echo.
    pause
    exit /b 1
)
echo Database schema created
echo.

echo [6/6] Testing database connection...
call node test-mysql.js
if errorlevel 1 (
    echo ERROR: Database connection test failed
    pause
    exit /b 1
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your backend is ready to use.
echo.
echo Next steps:
echo 1. Start the server: npm run dev
echo 2. Server will run on: http://localhost:5000
echo 3. Create admin user: npx prisma db seed
echo.
echo To view database: npx prisma studio
echo.
pause
