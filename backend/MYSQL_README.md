# MySQL Database Setup for Ruhama Clinic Backend

## Overview

This backend now uses **MySQL** instead of PostgreSQL for better cPanel compatibility. All necessary configurations have been updated.

## Quick Start

### 1. Prerequisites
- MySQL 8.0+ installed
- Node.js 18+ installed
- Database credentials ready

### 2. Create Database

**Local Development:**
```sql
CREATE DATABASE ruhama_clinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**cPanel:**
- Go to cPanel → MySQL Databases
- Create database (e.g., `clinic`)
- Create user (e.g., `admin`)
- Add user to database with ALL PRIVILEGES
- Note the full names with prefix (e.g., `ruhamats_clinic`, `ruhamats_admin`)

### 3. Configure Environment

Create `.env` file:

**Local:**
```env
DATABASE_URL="mysql://root:password@localhost:3306/ruhama_clinic"
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
```

**cPanel:**
```env
DATABASE_URL="mysql://ruhamats_admin:password@localhost:3306/ruhamats_clinic"
PORT=
NODE_ENV=production
JWT_SECRET=your-production-secret-key
```

### 4. Install & Setup

**Windows:**
```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push

# Test connection
node test-mysql.js
```

**Linux/Mac:**
```bash
chmod +x setup-mysql.sh
./setup-mysql.sh
```

### 5. Start Application

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Database Schema

The Prisma schema has been configured for MySQL with:

- **Provider**: `mysql`
- **Relation Mode**: `prisma` (for cPanel compatibility)
- **Character Set**: UTF-8 (utf8mb4)
- **Indexes**: Added for all foreign keys
- **Data Types**: Optimized for MySQL

### Key Features:
- UUID primary keys
- Decimal types for monetary values
- JSON fields for flexible data
- Proper indexes for performance
- Cascade deletes where appropriate

## Available Scripts

```bash
# Development
npm run dev              # Start with hot reload

# Build
npm run build           # Compile TypeScript to dist/

# Production
npm start               # Run compiled code

# Database
npx prisma generate     # Generate Prisma Client
npx prisma db push      # Push schema to database
npx prisma studio       # Open database GUI
npx prisma migrate dev  # Create migration (optional)

# Testing
node test-mysql.js      # Test database connection
npm test                # Run test suite
```

## Database Management

### View Database
```bash
npx prisma studio
```
Opens a web interface at http://localhost:5555

### Backup Database
```bash
# Export
mysqldump -u username -p database_name > backup.sql

# Import
mysql -u username -p database_name < backup.sql
```

### Reset Database
```bash
# WARNING: This deletes all data!
npx prisma db push --force-reset
```

## Troubleshooting

### Connection Issues

**Error: "Can't reach database server"**
- Check MySQL is running: `mysql --version`
- Verify DATABASE_URL format
- Test MySQL connection: `mysql -u username -p`

**Error: "Unknown database"**
- Create database: `CREATE DATABASE ruhama_clinic;`
- Check database name in DATABASE_URL

**Error: "Access denied"**
- Verify username and password
- Check user has privileges: `GRANT ALL PRIVILEGES ON database.* TO 'user'@'localhost';`

### Schema Issues

**Error: "Prisma Client not generated"**
```bash
npx prisma generate
```

**Error: "Table doesn't exist"**
```bash
npx prisma db push
```

**Error: "Migration failed"**
- Use `npx prisma db push` instead of migrate for cPanel
- Check MySQL version (needs 8.0+)

### Performance Issues

**Slow queries:**
- Check indexes are created
- Use `select` to limit fields
- Optimize `include` statements

**Connection pool exhausted:**
- Increase connection limit in Prisma
- Check for connection leaks
- Use `prisma.$disconnect()` properly

## cPanel Specific Notes

### Database Naming
cPanel adds prefix to database and user names:
- Database: `cpanel_user_dbname`
- User: `cpanel_user_username`

### Connection String
```
mysql://ruhamats_admin:password@localhost:3306/ruhamats_clinic
```

### File Permissions
```bash
chmod 755 /home/ruhamats/backend
chmod 755 /home/ruhamats/backend/uploads
chmod 644 /home/ruhamats/backend/.env
```

### Node.js Environment
```bash
# Activate Node.js environment
source /home/ruhamats/nodevenv/backend/18/bin/activate

# Then run commands
npx prisma generate
npx prisma db push
```

## Migration from PostgreSQL

If you have existing PostgreSQL data:

### Option 1: Fresh Start
1. Create new MySQL database
2. Run `npx prisma db push`
3. Manually recreate admin users

### Option 2: Data Migration
1. Export data from PostgreSQL
2. Convert to MySQL format
3. Import to MySQL
4. Verify data integrity

**Note**: Schema is compatible, but data types may need conversion.

## Security Best Practices

1. **Strong Passwords**: Use complex passwords for MySQL users
2. **Environment Variables**: Never commit .env file
3. **Database Privileges**: Grant only necessary privileges
4. **Connection Limits**: Configure appropriate pool size
5. **Backup Regularly**: Automate database backups
6. **Monitor Logs**: Check for suspicious activity
7. **Update Dependencies**: Keep packages up to date

## Performance Optimization

### Indexes
Already included for:
- Primary keys (UUID)
- Foreign keys
- Unique constraints
- Frequently queried fields

### Connection Pooling
Prisma default settings:
```javascript
// Automatically managed
// Default pool size: 10
// Can be configured in DATABASE_URL
```

### Query Optimization
```javascript
// Good: Select only needed fields
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, fullName: true }
});

// Good: Use include wisely
const patient = await prisma.patient.findUnique({
  where: { id },
  include: { visits: { take: 10, orderBy: { createdAt: 'desc' } } }
});
```

## Monitoring

### Check Connection
```bash
node test-mysql.js
```

### Database Size
```sql
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'ruhama_clinic'
GROUP BY table_schema;
```

### Active Connections
```sql
SHOW STATUS LIKE 'Threads_connected';
```

### Slow Queries
```sql
SHOW VARIABLES LIKE 'slow_query_log';
SET GLOBAL slow_query_log = 'ON';
```

## Support

### Documentation
- Prisma MySQL: https://www.prisma.io/docs/concepts/database-connectors/mysql
- MySQL 8.0: https://dev.mysql.com/doc/refman/8.0/en/
- cPanel: https://docs.cpanel.net/

### Common Commands
```bash
# Check MySQL version
mysql --version

# Connect to database
mysql -u username -p database_name

# Show databases
SHOW DATABASES;

# Show tables
SHOW TABLES;

# Describe table
DESCRIBE table_name;

# Check user privileges
SHOW GRANTS FOR 'username'@'localhost';
```

## Changelog

### v2.0.0 - MySQL Migration
- Changed database from PostgreSQL to MySQL
- Updated Prisma schema with relationMode
- Added MySQL-specific configurations
- Updated environment templates
- Added setup scripts and documentation

## Next Steps

1. ✅ Database configured
2. ✅ Schema pushed
3. ✅ Connection tested
4. ⏭️ Create admin user
5. ⏭️ Test API endpoints
6. ⏭️ Deploy to production
7. ⏭️ Configure backups
8. ⏭️ Monitor performance

## Quick Reference

### Environment Variables
```env
DATABASE_URL=mysql://user:pass@host:3306/db
PORT=5000
NODE_ENV=development|production
JWT_SECRET=your-secret
JWT_EXPIRES_IN=24h
ALLOWED_ORIGINS=https://domain.com
FRONTEND_URL=https://domain.com
UPLOAD_DIR=/path/to/uploads
```

### Database URL Format
```
mysql://username:password@host:port/database
```

### Important Files
- `prisma/schema.prisma` - Database schema
- `.env` - Environment configuration
- `test-mysql.js` - Connection test
- `setup-mysql.sh` - Setup script
- `MYSQL_README.md` - This file

---

**Ready to go!** Your backend is now configured for MySQL. Run `node test-mysql.js` to verify everything is working.
