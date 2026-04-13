@echo off
echo ========================================
echo Creating MySQL Database
echo ========================================
echo.

REM Try to create database (you'll be prompted for password)
echo Please enter your MySQL root password when prompted:
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "CREATE DATABASE IF NOT EXISTS ruhama_clinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; SHOW DATABASES;"

if errorlevel 1 (
    echo.
    echo ERROR: Could not create database
    echo.
    echo Please create the database manually:
    echo 1. Open phpMyAdmin
    echo 2. Click "New" in the left sidebar
    echo 3. Database name: ruhama_clinic
    echo 4. Collation: utf8mb4_unicode_ci
    echo 5. Click "Create"
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Database created successfully!
echo ========================================
pause
