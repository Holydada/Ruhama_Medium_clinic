@echo off
echo ========================================
echo MySQL Password Finder
echo ========================================
echo.
echo Testing common MySQL passwords...
echo.

REM First, make sure database exists
echo Creating database if it doesn't exist...
echo.

REM Test 1: No password (most common for WAMP/XAMPP)
echo [1/5] Testing: No password (empty)
set "DATABASE_URL=mysql://root@localhost:3306/ruhama_clinic"
npx prisma db push --skip-generate >nul 2>&1
if %errorlevel%==0 (
    echo.
    echo ========================================
    echo SUCCESS! Password is EMPTY ^(no password^)
    echo ========================================
    echo.
    echo Update your .env file with:
    echo DATABASE_URL="mysql://root@localhost:3306/ruhama_clinic"
    echo.
    pause
    exit /b 0
)
echo Failed - trying next...
echo.

REM Test 2: Password = root
echo [2/5] Testing: Password = root
set "DATABASE_URL=mysql://root:root@localhost:3306/ruhama_clinic"
npx prisma db push --skip-generate >nul 2>&1
if %errorlevel%==0 (
    echo.
    echo ========================================
    echo SUCCESS! Password is: root
    echo ========================================
    echo.
    echo Update your .env file with:
    echo DATABASE_URL="mysql://root:root@localhost:3306/ruhama_clinic"
    echo.
    pause
    exit /b 0
)
echo Failed - trying next...
echo.

REM Test 3: Password = password
echo [3/5] Testing: Password = password
set "DATABASE_URL=mysql://root:password@localhost:3306/ruhama_clinic"
npx prisma db push --skip-generate >nul 2>&1
if %errorlevel%==0 (
    echo.
    echo ========================================
    echo SUCCESS! Password is: password
    echo ========================================
    echo.
    echo Update your .env file with:
    echo DATABASE_URL="mysql://root:password@localhost:3306/ruhama_clinic"
    echo.
    pause
    exit /b 0
)
echo Failed - trying next...
echo.

REM Test 4: Password = admin
echo [4/5] Testing: Password = admin
set "DATABASE_URL=mysql://root:admin@localhost:3306/ruhama_clinic"
npx prisma db push --skip-generate >nul 2>&1
if %errorlevel%==0 (
    echo.
    echo ========================================
    echo SUCCESS! Password is: admin
    echo ========================================
    echo.
    echo Update your .env file with:
    echo DATABASE_URL="mysql://root:admin@localhost:3306/ruhama_clinic"
    echo.
    pause
    exit /b 0
)
echo Failed - trying next...
echo.

REM Test 5: Password = mysql
echo [5/5] Testing: Password = mysql
set "DATABASE_URL=mysql://root:mysql@localhost:3306/ruhama_clinic"
npx prisma db push --skip-generate >nul 2>&1
if %errorlevel%==0 (
    echo.
    echo ========================================
    echo SUCCESS! Password is: mysql
    echo ========================================
    echo.
    echo Update your .env file with:
    echo DATABASE_URL="mysql://root:mysql@localhost:3306/ruhama_clinic"
    echo.
    pause
    exit /b 0
)
echo Failed
echo.

REM All tests failed
echo ========================================
echo Could not find password automatically
echo ========================================
echo.
echo Please check your MySQL password manually:
echo.
echo For WAMP:
echo   C:\wamp64\apps\phpmyadmin\config.inc.php
echo   Look for: $cfg['Servers'][$i]['password']
echo.
echo For XAMPP:
echo   C:\xampp\phpMyAdmin\config.inc.php
echo   Look for: $cfg['Servers'][$i]['password']
echo.
echo Or see: FIND_MYSQL_PASSWORD.md for detailed instructions
echo.
pause
