# Windows MySQL Setup Guide for Ruhama Clinic Backend

## Step 1: Install MySQL on Windows

### Option A: MySQL Installer (Recommended)

1. **Download MySQL Installer**
   - Go to: https://dev.mysql.com/downloads/installer/
   - Download "mysql-installer-community-8.0.xx.msi" (Windows MSI Installer)
   - Choose the larger file (~400MB) for offline installation

2. **Run the Installer**
   - Double-click the downloaded .msi file
   - Choose "Custom" installation type
   - Select these components:
     * MySQL Server 8.0.xx
     * MySQL Workbench (optional, for GUI management)
     * MySQL Shell (optional)

3. **Configure MySQL Server**
   - **Type and Networking:**
     * Config Type: Development Computer
     * Port: 3306 (default)
     * Check "Open Windows Firewall ports for network access"
   
   - **Authentication Method:**
     * Choose "Use Strong Password Encryption"
   
   - **Accounts and Roles:**
     * Set Root Password: `Holyghost123` (or your preferred password)
     * Remember this password - you'll need it!
   
   - **Windows Service:**
     * Service Name: MySQL80
     * Check "Start the MySQL Server at System Startup"
     * Run Windows Service as: Standard System Account

4. **Complete Installation**
   - Click "Execute" to apply configuration
   - Wait for all steps to complete
   - Click "Finish"

### Option B: Standalone ZIP Archive

If you prefer manual installation:
1. Download MySQL ZIP from https://dev.mysql.com/downloads/mysql/
2. Extract to `C:\mysql`
3. Add `C:\mysql\bin` to System PATH
4. Initialize: `mysqld --initialize-insecure`
5. Start service: `mysqld --console`

## Step 2: Verify MySQL Installation

Open a NEW Command Prompt or PowerShell window and run:

```powershell
mysql --version
```

You should see something like: `mysql  Ver 8.0.xx for Win64`

## Step 3: Create Database

### Using Command Line:

```powershell
# Connect to MySQL as root
mysql -u root -p
# Enter password: Holyghost123
```

Then in MySQL prompt:

```sql
-- Create database
CREATE DATABASE ruhama_clinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify database was created
SHOW DATABASES;

-- Exit MySQL
EXIT;
```

### Using MySQL Workbench (GUI):

1. Open MySQL Workbench
2. Connect to Local instance (root user)
3. Click "Create Schema" button
4. Name: `ruhama_clinic`
5. Charset: `utf8mb4`
6. Collation: `utf8mb4_unicode_ci`
7. Click "Apply"

## Step 4: Configure Backend Environment

Your `.env` file is already configured:

```env
DATABASE_URL="mysql://root:Holyghost123@localhost:3306/ruhama_clinic"
```

**If you used a different password**, update the `.env` file:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/ruhama_clinic"
```

## Step 5: Install Backend Dependencies

In the `backend` folder:

```powershell
cd backend
npm install
```

## Step 6: Generate Prisma Client

```powershell
npx prisma generate
```

This creates the Prisma Client based on your schema.

## Step 7: Push Database Schema

```powershell
npx prisma db push
```

This creates all tables in your MySQL database.

## Step 8: Test Connection

```powershell
node test-mysql.js
```

You should see:
```
✅ All tests passed!
Your MySQL database is ready to use.
```

## Step 9: Start Backend Server

```powershell
npm run dev
```

The server should start on http://localhost:5000

## Troubleshooting

### MySQL Service Not Running

**Check service status:**
```powershell
Get-Service MySQL80
```

**Start service:**
```powershell
Start-Service MySQL80
```

**Or use Services app:**
1. Press `Win + R`
2. Type `services.msc`
3. Find "MySQL80"
4. Right-click → Start

### Connection Refused

1. **Check MySQL is running:**
   ```powershell
   Get-Service MySQL80
   ```

2. **Check port 3306 is listening:**
   ```powershell
   netstat -an | findstr 3306
   ```

3. **Test MySQL connection:**
   ```powershell
   mysql -u root -p -h localhost
   ```

### Access Denied Error

1. **Reset root password:**
   ```powershell
   # Stop MySQL service
   Stop-Service MySQL80
   
   # Start MySQL without password check
   mysqld --skip-grant-tables
   
   # In another terminal, connect and reset password
   mysql -u root
   ```
   
   ```sql
   FLUSH PRIVILEGES;
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'Holyghost123';
   EXIT;
   ```
   
   ```powershell
   # Restart MySQL normally
   Start-Service MySQL80
   ```

### Database Does Not Exist

```powershell
mysql -u root -p
```

```sql
CREATE DATABASE ruhama_clinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
EXIT;
```

### Prisma Client Not Generated

```powershell
npx prisma generate
```

### Tables Not Created

```powershell
npx prisma db push
```

### Port 3306 Already in Use

Check what's using the port:
```powershell
netstat -ano | findstr :3306
```

Kill the process or change MySQL port in `my.ini` configuration file.

## Quick Command Reference

```powershell
# MySQL Service Management
Get-Service MySQL80              # Check status
Start-Service MySQL80            # Start service
Stop-Service MySQL80             # Stop service
Restart-Service MySQL80          # Restart service

# MySQL Client
mysql -u root -p                 # Connect as root
mysql -u root -p ruhama_clinic   # Connect to specific database

# Backend Commands
cd backend                       # Navigate to backend
npm install                      # Install dependencies
npx prisma generate              # Generate Prisma Client
npx prisma db push               # Push schema to database
npx prisma studio                # Open database GUI
node test-mysql.js               # Test connection
npm run dev                      # Start development server
npm run build                    # Build for production
npm start                        # Run production server

# Database Management
mysqldump -u root -p ruhama_clinic > backup.sql    # Backup
mysql -u root -p ruhama_clinic < backup.sql        # Restore
```

## MySQL Configuration File Location

Default location: `C:\ProgramData\MySQL\MySQL Server 8.0\my.ini`

Common settings:
```ini
[mysqld]
port=3306
max_connections=151
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
```

## Next Steps After Setup

1. ✅ MySQL installed and running
2. ✅ Database created
3. ✅ Backend connected
4. ✅ Schema pushed
5. ⏭️ Create admin user (run seed script)
6. ⏭️ Test API endpoints
7. ⏭️ Start frontend

## Create Admin User

After database is set up, create your first admin user:

```powershell
npx prisma db seed
```

Or manually in MySQL:

```sql
USE ruhama_clinic;

INSERT INTO users (
  id, email, password_hash, full_name, role, 
  is_active, is_approved, email_verified, created_at, updated_at
) VALUES (
  UUID(), 
  'admin@clinic.com',
  '$2a$10$YourHashedPasswordHere',
  'System Administrator',
  'SUPER_ADMIN',
  1, 1, 1,
  NOW(), NOW()
);
```

## Useful MySQL Commands

```sql
-- Show all databases
SHOW DATABASES;

-- Use database
USE ruhama_clinic;

-- Show all tables
SHOW TABLES;

-- Describe table structure
DESCRIBE users;

-- Count records
SELECT COUNT(*) FROM users;

-- View recent users
SELECT id, email, full_name, role FROM users ORDER BY created_at DESC LIMIT 10;

-- Check database size
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'ruhama_clinic'
GROUP BY table_schema;
```

## Security Notes

1. **Change default root password** in production
2. **Create separate database user** for the application
3. **Use strong passwords** (mix of letters, numbers, symbols)
4. **Never commit .env file** to version control
5. **Backup database regularly**
6. **Keep MySQL updated** for security patches

## Support Resources

- MySQL Documentation: https://dev.mysql.com/doc/
- Prisma MySQL Guide: https://www.prisma.io/docs/concepts/database-connectors/mysql
- MySQL Workbench: https://www.mysql.com/products/workbench/

---

**You're all set!** Follow these steps and your backend will be connected to MySQL on Windows.
