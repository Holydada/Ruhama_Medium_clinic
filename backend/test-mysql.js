/**
 * MySQL Connection Test Script
 * Run this to verify your MySQL database connection
 * 
 * Usage: node test-mysql.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  console.log('========================================');
  console.log('MySQL Connection Test');
  console.log('========================================\n');

  try {
    // Test 1: Basic Connection
    console.log('[1/5] Testing database connection...');
    await prisma.$connect();
    console.log('✓ Successfully connected to MySQL database\n');

    // Test 2: Query Execution
    console.log('[2/5] Testing query execution...');
    const result = await prisma.$queryRaw`SELECT VERSION() as version`;
    console.log(`✓ MySQL Version: ${result[0].version}\n`);

    // Test 3: Check Tables
    console.log('[3/5] Checking database tables...');
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `;
    console.log(`✓ Found ${tables.length} tables in database`);
    if (tables.length > 0) {
      console.log('  Tables:', tables.map(t => t.TABLE_NAME).join(', '));
    } else {
      console.log('  ⚠ No tables found. Run: npx prisma db push');
    }
    console.log('');

    // Test 4: Count Records
    console.log('[4/5] Checking data...');
    try {
      const userCount = await prisma.user.count();
      const patientCount = await prisma.patient.count();
      console.log(`✓ Users: ${userCount}`);
      console.log(`✓ Patients: ${patientCount}\n`);
    } catch (error) {
      console.log('⚠ Could not count records (tables might not exist yet)\n');
    }

    // Test 5: Connection Pool
    console.log('[5/5] Testing connection pool...');
    const promises = Array(5).fill(null).map(() => 
      prisma.$queryRaw`SELECT 1 as test`
    );
    await Promise.all(promises);
    console.log('✓ Connection pool working correctly\n');

    console.log('========================================');
    console.log('✅ All tests passed!');
    console.log('========================================\n');
    console.log('Your MySQL database is ready to use.');
    console.log('');

  } catch (error) {
    console.error('========================================');
    console.error('❌ Connection test failed!');
    console.error('========================================\n');
    console.error('Error:', error.message);
    console.error('');
    console.error('Common issues:');
    console.error('1. DATABASE_URL not set or incorrect in .env file');
    console.error('2. MySQL database does not exist');
    console.error('3. MySQL user does not have correct privileges');
    console.error('4. MySQL server is not running');
    console.error('5. Wrong host, port, username, or password');
    console.error('');
    console.error('DATABASE_URL format:');
    console.error('mysql://username:password@localhost:3306/database');
    console.error('');
    console.error('For cPanel:');
    console.error('mysql://cpanel_user_dbuser:password@localhost:3306/cpanel_user_dbname');
    console.error('');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testConnection()
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
