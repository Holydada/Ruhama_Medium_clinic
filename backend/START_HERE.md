# 🚀 START HERE - Backend MySQL Setup

Welcome! This guide will help you connect your backend to MySQL on Windows.

## 📋 What You Need

- Windows 10/11
- Node.js 18+ ([Download](https://nodejs.org/))
- MySQL 8.0+ (we'll install this)
- 30 minutes of your time

## 🎯 Quick Start (3 Steps)

### Step 1: Install MySQL

**Don't have MySQL?**
1. Download: https://dev.mysql.com/downloads/installer/
2. Run installer → Choose "Custom" → Select "MySQL Server 8.0"
3. Set root password: `Holyghost123` (remember this!)
4. Complete installation

**Verify:**
```powershell
mysql --version
```

### Step 2: Create Database

```powershell
mysql -u root -p
# Enter password: Holyghost123
```

```sql
CREATE DATABASE ruhama_clinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Step 3: Setup Backend

```powershell
cd backend
setup-backend-windows.bat
```

That's it! The script will:
- Install dependencies
- Generate Prisma Client
- Create database tables
- Test connection

## ✅ Verify It Works

```powershell
# Start server
npm run dev

# Should see:
# 🚀 Server running on http://localhost:5000
# ✅ Database connected
```

Test in browser: http://localhost:5000/api/health

## 📚 Documentation

Choose your path:

### 🏃 I want to get started quickly
→ Read: **QUICK_START_WINDOWS.md**
- Step-by-step instructions
- Copy-paste commands
- 15 minutes to complete

### ✓ I want a checklist to follow
→ Read: **SETUP_CHECKLIST.md**
- Interactive checklist
- Check off each step
- Verify everything works

### 🔧 I'm having problems
→ Read: **TROUBLESHOOTING.md**
- Common issues & solutions
- Diagnostic commands
- Complete reset guide

### 📖 I want detailed information
→ Read: **WINDOWS_MYSQL_SETUP.md**
- Comprehensive guide
- All configuration options
- Advanced topics

### 💾 I want to understand the database
→ Read: **MYSQL_README.md**
- Database schema
- Management commands
- Backup & restore

## 🎬 Video Tutorial (If Available)

[Coming soon - Step-by-step video walkthrough]

## 🆘 Common Issues

### "mysql is not recognized"
```powershell
# Restart your terminal, or add to PATH:
# C:\Program Files\MySQL\MySQL Server 8.0\bin
```

### "Can't connect to MySQL server"
```powershell
# Start MySQL service
Start-Service MySQL80
```

### "Access denied"
```powershell
# Check password in .env file matches MySQL password
notepad .env
```

### "Unknown database"
```sql
-- Create the database
CREATE DATABASE ruhama_clinic;
```

**More solutions:** See TROUBLESHOOTING.md

## 🧪 Test Your Setup

```powershell
# Run connection test
node test-mysql.js

# Should see: ✅ All tests passed!
```

## 📁 Project Structure

```
backend/
├── 📄 START_HERE.md              ← You are here
├── 📄 QUICK_START_WINDOWS.md     ← Quick setup guide
├── 📄 SETUP_CHECKLIST.md         ← Step-by-step checklist
├── 📄 TROUBLESHOOTING.md         ← Problem solving
├── 📄 WINDOWS_MYSQL_SETUP.md     ← Detailed MySQL guide
├── 📄 MYSQL_README.md            ← Database management
├── 🔧 setup-backend-windows.bat  ← Automated setup script
├── 🧪 test-mysql.js              ← Connection test
├── ⚙️ .env                       ← Configuration (check this!)
└── 📦 package.json               ← Dependencies
```

## 🎯 Your Goal

Get this working:

```
MySQL (localhost:3306)
    ↓
Backend API (localhost:5000)
    ↓
Frontend (localhost:5173)
```

## 📝 Quick Commands

```powershell
# Setup
cd backend
npm install
npx prisma generate
npx prisma db push

# Development
npm run dev              # Start server
npx prisma studio        # View database

# Testing
node test-mysql.js       # Test connection
curl http://localhost:5000/api/health

# MySQL
mysql -u root -p         # Connect to MySQL
Get-Service MySQL80      # Check service status
Start-Service MySQL80    # Start MySQL
```

## 🔐 Default Credentials

**MySQL:**
- Username: `root`
- Password: `Holyghost123` (or what you set)
- Database: `ruhama_clinic`
- Port: `3306`

**Backend:**
- Port: `5000`
- Environment: `development`

**Update these in `.env` file if different!**

## ✨ What Happens Next?

After backend is running:

1. ✅ Backend connected to MySQL
2. ⏭️ Create admin user
3. ⏭️ Start frontend
4. ⏭️ Login and test
5. ⏭️ Deploy to production

## 🎓 Learning Path

**Beginner:**
1. Follow QUICK_START_WINDOWS.md
2. Run setup-backend-windows.bat
3. Test with node test-mysql.js
4. Start server with npm run dev

**Intermediate:**
1. Read WINDOWS_MYSQL_SETUP.md
2. Understand Prisma schema
3. Explore API endpoints
4. Use Prisma Studio

**Advanced:**
1. Review database schema
2. Optimize queries
3. Setup backups
4. Configure for production

## 🛠️ Tools You'll Use

- **PowerShell/CMD** - Run commands
- **MySQL** - Database server
- **Node.js** - JavaScript runtime
- **npm** - Package manager
- **Prisma** - Database ORM
- **Prisma Studio** - Database GUI (optional)

## 📊 Success Indicators

You'll know it's working when:

✅ `mysql --version` shows version
✅ `Get-Service MySQL80` shows "Running"
✅ `node test-mysql.js` passes all tests
✅ `npm run dev` starts without errors
✅ http://localhost:5000/api/health returns OK
✅ No red errors in terminal

## 🚨 Red Flags (Something's Wrong)

❌ "mysql is not recognized"
❌ "Can't connect to MySQL server"
❌ "Access denied for user"
❌ "Unknown database"
❌ "Port already in use"
❌ Red error messages in terminal

**If you see these:** Check TROUBLESHOOTING.md

## 💡 Pro Tips

1. **Always check MySQL service first**
   ```powershell
   Get-Service MySQL80
   ```

2. **Keep terminal open** to see errors

3. **Test connection** before starting server
   ```powershell
   node test-mysql.js
   ```

4. **Use Prisma Studio** to view data
   ```powershell
   npx prisma studio
   ```

5. **Backup .env file** before changes
   ```powershell
   copy .env .env.backup
   ```

## 🎉 Ready to Start?

Choose your path:

**→ I'm new to this**
Start with: **QUICK_START_WINDOWS.md**

**→ I want a checklist**
Start with: **SETUP_CHECKLIST.md**

**→ I'm having issues**
Start with: **TROUBLESHOOTING.md**

**→ I want to automate it**
Run: **setup-backend-windows.bat**

## 📞 Need Help?

1. Check error message in terminal
2. Search TROUBLESHOOTING.md
3. Run diagnostic: `node test-mysql.js`
4. Review .env configuration
5. Verify MySQL service is running

## 🎯 Next Steps

After backend is running:

1. **Create admin user:**
   ```powershell
   npx prisma db seed
   ```

2. **View database:**
   ```powershell
   npx prisma studio
   ```

3. **Test API endpoints:**
   - Health: http://localhost:5000/api/health
   - Login: POST http://localhost:5000/api/auth/login

4. **Start frontend:**
   ```powershell
   cd ../frontend
   npm run dev
   ```

## 📖 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)

## 🏁 Final Checklist

Before you start:

- [ ] Windows 10/11 installed
- [ ] Have admin rights on computer
- [ ] Internet connection available
- [ ] 30 minutes of free time
- [ ] Ready to follow instructions

Let's go! 🚀

---

**Choose your guide and start:**

1. **QUICK_START_WINDOWS.md** - Fast setup
2. **SETUP_CHECKLIST.md** - Step-by-step
3. **TROUBLESHOOTING.md** - Fix problems
4. **WINDOWS_MYSQL_SETUP.md** - Detailed guide

Or just run: `setup-backend-windows.bat`

Good luck! 💪
