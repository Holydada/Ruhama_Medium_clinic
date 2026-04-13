# Backend Setup Checklist ✓

Follow this checklist to get your backend connected to MySQL on Windows.

## Phase 1: Install MySQL

### Step 1.1: Download MySQL
- [ ] Go to https://dev.mysql.com/downloads/installer/
- [ ] Download `mysql-installer-community-8.0.xx.msi` (larger file ~400MB)
- [ ] Save to Downloads folder

### Step 1.2: Install MySQL
- [ ] Run the downloaded .msi file
- [ ] Choose "Custom" installation type
- [ ] Select "MySQL Server 8.0.xx"
- [ ] Click Next through the wizard

### Step 1.3: Configure MySQL
- [ ] Config Type: Development Computer
- [ ] Port: 3306 (keep default)
- [ ] Authentication: Use Strong Password Encryption
- [ ] Set Root Password: `Holyghost123` (write it down!)
- [ ] Windows Service: MySQL80
- [ ] Start at System Startup: ✓ Checked
- [ ] Click Execute to apply configuration

### Step 1.4: Verify Installation
- [ ] Open NEW PowerShell or Command Prompt
- [ ] Run: `mysql --version`
- [ ] Should see: `mysql Ver 8.0.xx for Win64`

**If "mysql is not recognized":**
- [ ] Close and reopen terminal
- [ ] Or add to PATH: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
- [ ] Restart terminal and try again

---

## Phase 2: Create Database

### Step 2.1: Connect to MySQL
- [ ] Open PowerShell or Command Prompt
- [ ] Run: `mysql -u root -p`
- [ ] Enter password: `Holyghost123`
- [ ] Should see `mysql>` prompt

### Step 2.2: Create Database
- [ ] Run this SQL command:
```sql
CREATE DATABASE ruhama_clinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
- [ ] Verify: `SHOW DATABASES;`
- [ ] Should see `ruhama_clinic` in the list
- [ ] Exit: `EXIT;`

**Alternative: Use MySQL Workbench (GUI)**
- [ ] Open MySQL Workbench
- [ ] Connect to Local instance (root)
- [ ] Click "Create Schema" icon
- [ ] Name: `ruhama_clinic`
- [ ] Charset: `utf8mb4`
- [ ] Click Apply

---

## Phase 3: Configure Backend

### Step 3.1: Check .env File
- [ ] Navigate to `backend` folder
- [ ] Open `.env` file
- [ ] Verify `DATABASE_URL` line exists
- [ ] Should look like: `DATABASE_URL="mysql://root:Holyghost123@localhost:3306/ruhama_clinic"`

**If you used a different password:**
- [ ] Update the password in DATABASE_URL
- [ ] Format: `mysql://root:YOUR_PASSWORD@localhost:3306/ruhama_clinic`
- [ ] Save the file

### Step 3.2: Verify Other Settings
- [ ] `PORT=5000` exists
- [ ] `NODE_ENV=development` exists
- [ ] `JWT_SECRET` has a value
- [ ] Save and close .env

---

## Phase 4: Setup Backend

### Step 4.1: Open Terminal in Backend Folder
- [ ] Open PowerShell or Command Prompt
- [ ] Navigate to backend folder: `cd path\to\backend`
- [ ] Verify you're in the right place: `dir` should show `package.json`

### Step 4.2: Install Dependencies
- [ ] Run: `npm install`
- [ ] Wait for installation to complete (may take 2-3 minutes)
- [ ] Should see "added XXX packages"
- [ ] No major errors

### Step 4.3: Generate Prisma Client
- [ ] Run: `npx prisma generate`
- [ ] Should see "Generated Prisma Client"
- [ ] No errors

### Step 4.4: Push Database Schema
- [ ] Run: `npx prisma db push`
- [ ] Should see "Your database is now in sync with your schema"
- [ ] Creates all tables in MySQL

**If this fails:**
- [ ] Check MySQL service is running: `Get-Service MySQL80`
- [ ] If stopped, start it: `Start-Service MySQL80`
- [ ] Try again: `npx prisma db push`

### Step 4.5: Test Connection
- [ ] Run: `node test-mysql.js`
- [ ] Should see "✅ All tests passed!"
- [ ] Shows MySQL version
- [ ] Shows table count
- [ ] No errors

---

## Phase 5: Start Backend

### Step 5.1: Start Development Server
- [ ] Run: `npm run dev`
- [ ] Should see "🚀 Server running on http://localhost:5000"
- [ ] Should see "✅ Database connected"
- [ ] No errors in console

### Step 5.2: Test API
- [ ] Open browser
- [ ] Go to: `http://localhost:5000/api/health`
- [ ] Should see JSON response: `{"status":"ok"}`

**Or use curl:**
- [ ] In new terminal: `curl http://localhost:5000/api/health`

### Step 5.3: View Database (Optional)
- [ ] In new terminal (keep server running)
- [ ] Run: `npx prisma studio`
- [ ] Opens browser at: `http://localhost:5555`
- [ ] Can view all tables and data

---

## Phase 6: Verify Everything

### Final Checks
- [ ] MySQL service is running
- [ ] Database `ruhama_clinic` exists and has tables
- [ ] Backend server is running on port 5000
- [ ] API health endpoint responds
- [ ] No errors in terminal

### Test These Commands
```powershell
# Should all work without errors:
mysql --version                    # Shows MySQL version
Get-Service MySQL80                # Shows "Running"
node test-mysql.js                 # All tests pass
npm run dev                        # Server starts
```

---

## Troubleshooting

### MySQL Service Not Running
```powershell
# Check status
Get-Service MySQL80

# Start service
Start-Service MySQL80

# Or use GUI: Win+R → services.msc → Find MySQL80 → Start
```

### Can't Connect to Database
- [ ] Check MySQL is running
- [ ] Verify password in .env matches MySQL root password
- [ ] Ensure database `ruhama_clinic` exists
- [ ] Test: `mysql -u root -p` and enter password

### Port 5000 Already in Use
- [ ] Change PORT in .env to 5001 or another port
- [ ] Restart server: `npm run dev`

### Prisma Client Errors
- [ ] Run: `npx prisma generate`
- [ ] Then: `npx prisma db push`
- [ ] Restart server

### "Module not found" Errors
- [ ] Delete `node_modules` folder
- [ ] Delete `package-lock.json`
- [ ] Run: `npm install`
- [ ] Run: `npx prisma generate`

---

## Success Criteria

You're done when ALL of these are true:

✅ MySQL installed and service running
✅ Database `ruhama_clinic` created
✅ `.env` file configured correctly
✅ `npm install` completed successfully
✅ `npx prisma generate` completed
✅ `npx prisma db push` completed
✅ `node test-mysql.js` passes all tests
✅ `npm run dev` starts server without errors
✅ `http://localhost:5000/api/health` returns OK
✅ Can view database in Prisma Studio

---

## Quick Reference

### Essential Commands
```powershell
# MySQL
mysql -u root -p                    # Connect to MySQL
Get-Service MySQL80                 # Check service status
Start-Service MySQL80               # Start MySQL

# Backend Setup
cd backend                          # Navigate to backend
npm install                         # Install dependencies
npx prisma generate                 # Generate Prisma Client
npx prisma db push                  # Create tables
node test-mysql.js                  # Test connection

# Development
npm run dev                         # Start dev server
npx prisma studio                   # Open database GUI
npm run build                       # Build for production
npm start                           # Run production build
```

### Important Files
- `.env` - Environment configuration (DATABASE_URL, PORT, etc.)
- `prisma/schema.prisma` - Database schema definition
- `test-mysql.js` - Connection test script
- `package.json` - Dependencies and scripts

### Important URLs
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health
- Prisma Studio: http://localhost:5555

---

## Next Steps After Setup

1. ✅ Backend is running
2. ⏭️ Create admin user (seed database)
3. ⏭️ Test API endpoints with Postman/Insomnia
4. ⏭️ Start frontend application
5. ⏭️ Test full application flow

---

## Need Help?

### Check These First
1. Error messages in terminal
2. MySQL service status
3. .env file configuration
4. Database exists in MySQL

### Detailed Guides
- `QUICK_START_WINDOWS.md` - Step-by-step guide
- `WINDOWS_MYSQL_SETUP.md` - Detailed MySQL setup
- `MYSQL_README.md` - Database management guide

### Test Connection
```powershell
node test-mysql.js
```

This will tell you exactly what's wrong.

---

**Good luck! You've got this! 🚀**
