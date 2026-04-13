# Quick Start Guide - Windows

## Prerequisites Checklist

- [ ] Windows 10/11
- [ ] Node.js 18+ installed
- [ ] MySQL 8.0+ installed
- [ ] Git (optional)

## Step-by-Step Setup

### 1. Install MySQL (if not installed)

**Download & Install:**
```
1. Go to: https://dev.mysql.com/downloads/installer/
2. Download: mysql-installer-community-8.0.xx.msi
3. Run installer
4. Choose "Custom" installation
5. Select "MySQL Server 8.0"
6. Set root password: Holyghost123 (or your choice)
7. Complete installation
```

**Verify Installation:**
```powershell
mysql --version
```

### 2. Create Database

**Option A - Command Line:**
```powershell
mysql -u root -p
# Enter password: Holyghost123
```

```sql
CREATE DATABASE ruhama_clinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
EXIT;
```

**Option B - MySQL Workbench:**
```
1. Open MySQL Workbench
2. Connect to Local instance
3. Click "Create Schema"
4. Name: ruhama_clinic
5. Apply
```

### 3. Configure Environment

Check your `.env` file in the backend folder:

```env
DATABASE_URL="mysql://root:Holyghost123@localhost:3306/ruhama_clinic"
PORT=5000
NODE_ENV=development
JWT_SECRET=ruhama-clinic-dev-secret-change-for-production
```

**Important:** If you used a different MySQL password, update `DATABASE_URL`

### 4. Run Setup Script

**Option A - Automated (Recommended):**
```powershell
cd backend
setup-backend-windows.bat
```

**Option B - Manual:**
```powershell
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push

# Test connection
node test-mysql.js
```

### 5. Start Backend Server

```powershell
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ Database connected successfully
```

### 6. Verify Setup

**Test the API:**
```powershell
# In a new terminal
curl http://localhost:5000/api/health
```

Or open in browser: http://localhost:5000/api/health

**View Database:**
```powershell
npx prisma studio
```

Opens GUI at: http://localhost:5555

## Common Issues & Solutions

### Issue: "MySQL is not recognized"

**Solution:**
```
1. Restart your terminal/PowerShell
2. Or add MySQL to PATH:
   - Search "Environment Variables"
   - Edit System PATH
   - Add: C:\Program Files\MySQL\MySQL Server 8.0\bin
   - Restart terminal
```

### Issue: "Can't connect to MySQL server"

**Solution:**
```powershell
# Check if MySQL service is running
Get-Service MySQL80

# If stopped, start it
Start-Service MySQL80

# Or use Services app (Win + R, type: services.msc)
```

### Issue: "Access denied for user 'root'"

**Solution:**
```
1. Check password in .env file
2. Update DATABASE_URL with correct password
3. Or reset MySQL root password (see WINDOWS_MYSQL_SETUP.md)
```

### Issue: "Unknown database 'ruhama_clinic'"

**Solution:**
```powershell
mysql -u root -p
```
```sql
CREATE DATABASE ruhama_clinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Issue: "Port 5000 already in use"

**Solution:**
```
Change PORT in .env file:
PORT=5001

Then restart: npm run dev
```

## Quick Commands

```powershell
# Backend
cd backend
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Run production build
npm test                 # Run tests

# Database
npx prisma studio        # Open database GUI
npx prisma db push       # Update database schema
npx prisma generate      # Regenerate Prisma Client
node test-mysql.js       # Test database connection

# MySQL Service
Get-Service MySQL80      # Check status
Start-Service MySQL80    # Start MySQL
Stop-Service MySQL80     # Stop MySQL
Restart-Service MySQL80  # Restart MySQL

# MySQL Client
mysql -u root -p                    # Connect to MySQL
mysql -u root -p ruhama_clinic      # Connect to database
```

## Project Structure

```
backend/
├── src/                    # Source code
│   ├── server.ts          # Main server file
│   ├── routes/            # API routes
│   ├── controllers/       # Business logic
│   ├── middleware/        # Express middleware
│   └── utils/             # Utility functions
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── .env                   # Environment variables
├── package.json           # Dependencies
└── test-mysql.js          # Connection test
```

## Next Steps

1. ✅ MySQL installed
2. ✅ Database created
3. ✅ Backend running
4. ⏭️ Create admin user
5. ⏭️ Test API endpoints
6. ⏭️ Start frontend
7. ⏭️ Access application

## Create Admin User

After setup, create your first admin:

```powershell
npx prisma db seed
```

Or use Prisma Studio:
```powershell
npx prisma studio
```

Then manually create a user in the `users` table.

## API Endpoints

Once running, test these endpoints:

```
GET  http://localhost:5000/api/health          # Health check
POST http://localhost:5000/api/auth/login      # Login
GET  http://localhost:5000/api/users           # Get users
GET  http://localhost:5000/api/patients        # Get patients
```

## Environment Variables

Key variables in `.env`:

```env
# Database
DATABASE_URL=mysql://root:password@localhost:3306/ruhama_clinic

# Server
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Frontend
FRONTEND_URL=http://localhost:5173
```

## Troubleshooting Checklist

- [ ] MySQL service is running
- [ ] Database `ruhama_clinic` exists
- [ ] `.env` file has correct DATABASE_URL
- [ ] Dependencies installed (`npm install`)
- [ ] Prisma Client generated (`npx prisma generate`)
- [ ] Schema pushed to database (`npx prisma db push`)
- [ ] Port 5000 is available
- [ ] No firewall blocking connections

## Getting Help

1. Check error messages carefully
2. Review logs in terminal
3. Test MySQL connection: `node test-mysql.js`
4. Check MySQL service status
5. Verify .env configuration
6. See detailed guide: `WINDOWS_MYSQL_SETUP.md`

## Success Indicators

You'll know everything is working when:

✅ `mysql --version` shows MySQL version
✅ `node test-mysql.js` passes all tests
✅ `npm run dev` starts without errors
✅ Server logs show "Database connected"
✅ `http://localhost:5000/api/health` returns OK
✅ `npx prisma studio` opens database GUI

---

**Ready to go!** Your backend should now be connected to MySQL and running on Windows.
