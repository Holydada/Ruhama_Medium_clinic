# 🚀 SETUP YOUR BACKEND NOW - Step by Step

## ✅ What's Already Done
- ✅ MySQL is installed and running
- ✅ Backend dependencies installed
- ✅ Prisma Client generated
- ✅ Schema fixed for MySQL

## 🎯 What You Need to Do (5 Minutes)

### Step 1: Create Database in phpMyAdmin (2 minutes)

You have phpMyAdmin open. Do this:

1. **In phpMyAdmin, click "SQL" tab at the top**
2. **Copy and paste this SQL:**
   ```sql
   CREATE DATABASE IF NOT EXISTS ruhama_clinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. **Click "Go" button**
4. **You should see "Database created successfully"**
5. **Refresh the left sidebar - you'll see `ruhama_clinic` database**

### Step 2: Find Your MySQL Root Password (1 minute)

Since you're using WAMP/XAMPP with phpMyAdmin, your root password is likely:
- **Empty** (no password)
- **OR** check your WAMP/XAMPP configuration

**To test which one:**

**Option A: No Password**
Open PowerShell in the backend folder and run:
```powershell
$env:DATABASE_URL="mysql://root@localhost:3306/ruhama_clinic"; npx prisma db push --skip-generate
```

**Option B: With Password**
If Option A fails, try with password:
```powershell
$env:DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/ruhama_clinic"; npx prisma db push --skip-generate
```

Replace `YOUR_PASSWORD` with your actual MySQL root password.

### Step 3: Update .env File (30 seconds)

Once you know which works, update your `.env` file:

**If no password:**
```env
DATABASE_URL="mysql://root@localhost:3306/ruhama_clinic"
```

**If with password:**
```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/ruhama_clinic"
```

### Step 4: Push Database Schema (1 minute)

In PowerShell (backend folder):
```powershell
npx prisma db push
```

You should see:
```
✔ Your database is now in sync with your schema
```

### Step 5: Test Connection (30 seconds)

```powershell
node test-mysql.js
```

You should see:
```
✅ All tests passed!
```

### Step 6: Start Backend Server (30 seconds)

```powershell
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ Database connected
```

### Step 7: Verify API Works (30 seconds)

Open browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{"status":"ok"}
```

## 🎉 Done!

Your backend is now connected to MySQL!

---

## 🚨 Troubleshooting

### Issue: "Authentication failed"

**Solution:** Wrong password in DATABASE_URL

1. Check your MySQL root password
2. Update .env file with correct password
3. Try again

### Issue: "Unknown database 'ruhama_clinic'"

**Solution:** Database not created

1. Go to phpMyAdmin
2. Click "SQL" tab
3. Run: `CREATE DATABASE ruhama_clinic;`
4. Try again

### Issue: "Can't connect to MySQL server"

**Solution:** MySQL not running

1. Start WAMP/XAMPP
2. Make sure MySQL service is green/running
3. Try again

---

## 📝 Quick Commands

```powershell
# Test with no password
$env:DATABASE_URL="mysql://root@localhost:3306/ruhama_clinic"; npx prisma db push --skip-generate

# Test with password
$env:DATABASE_URL="mysql://root:PASSWORD@localhost:3306/ruhama_clinic"; npx prisma db push --skip-generate

# After finding correct password, update .env and run:
npx prisma db push
node test-mysql.js
npm run dev
```

---

## 🎯 Next Steps After Backend is Running

1. **Check database in phpMyAdmin**
   - You'll see all tables created
   - users, patients, patient_visits, etc.

2. **Create admin user**
   ```powershell
   npx prisma db seed
   ```

3. **Start frontend**
   ```powershell
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Access application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

---

**Start with Step 1 above!** 🚀
