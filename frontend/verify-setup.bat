@echo off
echo ========================================
echo Verifying Admin Dashboard Setup
echo ========================================
echo.

echo Checking if backend is running on port 5000...
curl -s http://localhost:5000/health > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend is running on port 5000
) else (
    echo [ERROR] Backend is NOT running!
    echo.
    echo Please start the backend server:
    echo   cd backend
    echo   npm run dev
    echo.
    goto :end
)

echo.
echo Checking if frontend is running on port 3000...
curl -s http://localhost:3000 > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend is running on port 3000
) else (
    echo [WARNING] Frontend might not be running
    echo Please start: npm run dev
)

echo.
echo Running diagnostic script...
echo.
npx tsx backend/diagnose-admin-dashboard.ts

:end
echo.
echo ========================================
echo Verification Complete
echo ========================================
pause
