# Troubleshooting Guide - Backend MySQL Connection

## Quick Diagnostics

Run these commands to identify the issue:

```powershell
# 1. Check MySQL installation
mysql --version

# 2. Check MySQL service
Get-Service MySQL80

# 3. Test database connection
node test-mysql.js

# 4. Check if port 5000 is available
netstat -an | findstr :5000

# 5. Check if port 3306 is listening
netstat -an | findstr :3306
```

---

## Common Issues & Solutions

### 1. "mysql is not recognized as a command"

**Problem:** MySQL is not installed or not in system PATH

**Solutions:**

**A. Restart Terminal (Simplest)**
```powershell
# Close PowerShell/CMD completely
# Open a NEW PowerShell/CMD window
mysql --version
```

**B. Add MySQL to PATH**
```
1. Press Win + X → System
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", find "Path"
5. Click "Edit"
6. Click "New"
7. Add: C:\Program Files\MySQL\MySQL Server 8.0\bin
8. Click OK on all dialogs
9. Restart terminal
10. Test: mysql --version
```

**C. Install MySQL**
```
If MySQL is not installed:
1. Download from: https://dev.mysql.com/downloads/installer/
2. Run installer
3. Follow WINDOWS_MYSQL_SETUP.md guide
```

---

### 2. "Can't connect to MySQL server on 'localhost'"

**Problem:** MySQL service is not running

**Check Service Status:**
```powershell
Get-Service MySQL80
```

**Solution A: Start Service via PowerShell**
```powershell
Start-Service MySQL80
```

**Solution B: Start Service via GUI**
```
1. Press Win + R
2. Type: services.msc
3. Press Enter
4. Find "MySQL80" in the list
5. Right-click → Start
6. Set Startup Type to "Automatic"
```

**Solution C: Start MySQL Manually**
```powershell
# Navigate to MySQL bin directory
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"

# Start MySQL
mysqld --console
```

**Verify It's Running:**
```powershell
Get-Service MySQL80
# Should show: Status = Running

netstat -an | findstr :3306
# Should show: TCP 0.0.0.0:3306 LISTENING
```

---

### 3. "Access denied for user 'root'@'localhost'"

**Problem:** Wrong password in DATABASE_URL

**Solution A: Check .env File**
```powershell
# Open .env file
notepad .env

# Verify DATABASE_URL format:
DATABASE_URL="mysql://root:YOUR_ACTUAL_PASSWORD@localhost:3306/ruhama_clinic"

# Make sure password matches what you set during MySQL installation
```

**Solution B: Test MySQL Login**
```powershell
mysql -u root -p
# Enter your password
# If this works, update .env with the same password
```

**Solution C: Reset Root Password**
```powershell
# 1. Stop MySQL service
Stop-Service MySQL80

# 2. Create init file
echo ALTER USER 'root'@'localhost' IDENTIFIED BY 'Holyghost123'; > C:\mysql-init.txt

# 3. Start MySQL with init file
mysqld --init-file=C:\mysql-init.txt --console

# 4. Wait for MySQL to start, then press Ctrl+C

# 5. Start MySQL normally
Start-Service MySQL80

# 6. Test new password
mysql -u root -p
# Enter: Holyghost123

# 7. Update .env file with new password
```

---

### 4. "Unknown database 'ruhama_clinic'"

**Problem:** Database doesn't exist

**Solution:**
```powershell
# Connect to MySQL
mysql -u root -p
# Enter password
```

```sql
-- Create database
CREATE DATABASE ruhama_clinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify it was created
SHOW DATABASES;

-- Should see ruhama_clinic in the list
EXIT;
```

**Then push schema:**
```powershell
npx prisma db push
```

---

### 5. "Port 5000 is already in use"

**Problem:** Another application is using port 5000

**Solution A: Change Port**
```powershell
# Edit .env file
notepad .env

# Change PORT to something else:
PORT=5001

# Save and restart server
npm run dev
```

**Solution B: Find and Kill Process**
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Note the PID (last column)
# Kill the process (replace 1234 with actual PID)
taskkill /PID 1234 /F

# Restart server
npm run dev
```

---

### 6. "Prisma Client could not be generated"

**Problem:** Prisma Client not generated or outdated

**Solution:**
```powershell
# Delete existing client
Remove-Item -Recurse -Force node_modules\.prisma

# Regenerate
npx prisma generate

# If that fails, reinstall everything
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npx prisma generate
```

---

### 7. "Table 'ruhama_clinic.users' doesn't exist"

**Problem:** Database schema not pushed

**Solution:**
```powershell
# Push schema to database
npx prisma db push

# Verify tables were created
mysql -u root -p ruhama_clinic
```

```sql
SHOW TABLES;
-- Should see: users, patients, patient_visits, etc.
EXIT;
```

---

### 8. "Cannot find module '@prisma/client'"

**Problem:** Dependencies not installed or Prisma Client not generated

**Solution:**
```powershell
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Restart server
npm run dev
```

---

### 9. "Error: P1001: Can't reach database server"

**Problem:** MySQL not running or wrong connection details

**Diagnostic Steps:**
```powershell
# 1. Check MySQL service
Get-Service MySQL80

# 2. Check if MySQL is listening
netstat -an | findstr :3306

# 3. Test MySQL connection
mysql -u root -p

# 4. Check .env DATABASE_URL format
notepad .env
```

**Solution:**
```powershell
# Start MySQL if stopped
Start-Service MySQL80

# Verify DATABASE_URL format in .env:
DATABASE_URL="mysql://username:password@localhost:3306/database"

# Test connection
node test-mysql.js
```

---

### 10. "npm install" fails with errors

**Problem:** Node modules corruption or network issues

**Solution A: Clean Install**
```powershell
# Delete node_modules and lock file
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

**Solution B: Use Different Registry**
```powershell
# Use different npm registry
npm install --registry=https://registry.npmjs.org/
```

**Solution C: Check Node Version**
```powershell
# Check Node version (needs 18+)
node --version

# If too old, download from: https://nodejs.org/
```

---

### 11. "ECONNREFUSED" Error

**Problem:** Backend can't connect to MySQL

**Full Diagnostic:**
```powershell
# 1. Is MySQL running?
Get-Service MySQL80

# 2. Is it listening on 3306?
netstat -an | findstr :3306

# 3. Can you connect manually?
mysql -u root -p

# 4. Is DATABASE_URL correct?
notepad .env

# 5. Test connection
node test-mysql.js
```

**Solution:**
```powershell
# Ensure MySQL is running
Start-Service MySQL80

# Verify .env has correct format
DATABASE_URL="mysql://root:password@localhost:3306/ruhama_clinic"

# Test
node test-mysql.js
```

---

### 12. "Migration failed" or "Schema push failed"

**Problem:** Schema conflicts or database locked

**Solution A: Force Push**
```powershell
npx prisma db push --force-reset
# WARNING: This deletes all data!
```

**Solution B: Manual Reset**
```powershell
# Connect to MySQL
mysql -u root -p
```

```sql
-- Drop and recreate database
DROP DATABASE IF EXISTS ruhama_clinic;
CREATE DATABASE ruhama_clinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

```powershell
# Push schema again
npx prisma db push
```

---

### 13. Server starts but API doesn't respond

**Problem:** Server running but routes not working

**Diagnostic:**
```powershell
# Check if server is actually running
netstat -an | findstr :5000

# Check server logs for errors
# Look in terminal where you ran npm run dev

# Test health endpoint
curl http://localhost:5000/api/health
```

**Solution:**
```powershell
# Restart server with clean state
# Press Ctrl+C to stop server

# Clear any cached modules
Remove-Item -Recurse -Force node_modules\.cache

# Restart
npm run dev
```

---

### 14. "CORS" Errors in Browser

**Problem:** Frontend can't connect to backend

**Solution:**
```powershell
# Check ALLOWED_ORIGINS in .env
notepad .env

# Should include your frontend URL:
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Restart server
npm run dev
```

---

### 15. Slow Database Queries

**Problem:** Database performance issues

**Solution:**
```powershell
# Open Prisma Studio to check data
npx prisma studio

# Check database size
mysql -u root -p
```

```sql
USE ruhama_clinic;

-- Check table sizes
SELECT 
  table_name AS 'Table',
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'ruhama_clinic'
ORDER BY (data_length + index_length) DESC;

-- Check for missing indexes
SHOW INDEX FROM users;
```

---

## Diagnostic Commands

### System Check
```powershell
# Node.js version (needs 18+)
node --version

# npm version
npm --version

# MySQL version (needs 8.0+)
mysql --version

# Check MySQL service
Get-Service MySQL80

# Check ports
netstat -an | findstr :3306
netstat -an | findstr :5000
```

### Database Check
```powershell
# Test connection
node test-mysql.js

# Connect to MySQL
mysql -u root -p

# In MySQL:
SHOW DATABASES;
USE ruhama_clinic;
SHOW TABLES;
SELECT COUNT(*) FROM users;
EXIT;
```

### Backend Check
```powershell
# Check if dependencies installed
dir node_modules

# Check if Prisma Client generated
dir node_modules\.prisma\client

# Check environment
type .env

# Test server
npm run dev
```

---

## Complete Reset (Nuclear Option)

If nothing else works, start fresh:

```powershell
# 1. Stop server (Ctrl+C)

# 2. Stop MySQL
Stop-Service MySQL80

# 3. Delete backend dependencies
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# 4. Start MySQL
Start-Service MySQL80

# 5. Drop and recreate database
mysql -u root -p
```

```sql
DROP DATABASE IF EXISTS ruhama_clinic;
CREATE DATABASE ruhama_clinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

```powershell
# 6. Reinstall everything
npm install

# 7. Generate Prisma Client
npx prisma generate

# 8. Push schema
npx prisma db push

# 9. Test connection
node test-mysql.js

# 10. Start server
npm run dev
```

---

## Getting More Help

### Check Logs
```powershell
# Backend logs
# Look at terminal where npm run dev is running

# MySQL error log
# Location: C:\ProgramData\MySQL\MySQL Server 8.0\Data\*.err
```

### Enable Debug Mode
```powershell
# Edit .env
notepad .env

# Add:
DEBUG=*
LOG_LEVEL=debug

# Restart server
npm run dev
```

### Test Individual Components
```powershell
# Test MySQL
mysql -u root -p

# Test Node.js
node --version

# Test npm
npm --version

# Test Prisma
npx prisma --version

# Test connection
node test-mysql.js
```

---

## Prevention Tips

1. **Always check MySQL service is running before starting backend**
   ```powershell
   Get-Service MySQL80
   ```

2. **Keep .env file backed up**
   ```powershell
   copy .env .env.backup
   ```

3. **Regular database backups**
   ```powershell
   mysqldump -u root -p ruhama_clinic > backup.sql
   ```

4. **Update dependencies regularly**
   ```powershell
   npm update
   ```

5. **Monitor logs for warnings**
   - Watch terminal output when running `npm run dev`

---

## Still Having Issues?

1. **Run full diagnostic:**
   ```powershell
   node test-mysql.js
   ```

2. **Check all services:**
   ```powershell
   Get-Service MySQL80
   netstat -an | findstr :3306
   netstat -an | findstr :5000
   ```

3. **Review error messages carefully**
   - Copy exact error message
   - Search in this guide
   - Check stack trace for clues

4. **Try the complete reset** (see above)

5. **Check documentation:**
   - QUICK_START_WINDOWS.md
   - WINDOWS_MYSQL_SETUP.md
   - MYSQL_README.md

---

**Remember:** Most issues are due to:
1. MySQL service not running
2. Wrong password in .env
3. Database doesn't exist
4. Prisma Client not generated
5. Dependencies not installed

Check these first! 🔍
