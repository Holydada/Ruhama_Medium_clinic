const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('Creating admin user...\n');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { email: 'admin@ruhama.clinic' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log('\nLogin Credentials:');
      console.log('Email: admin@ruhama.clinic');
      console.log('Password: Admin@123');
      console.log('\nIf you forgot the password, delete this user and run this script again.');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@ruhama.clinic',
        passwordHash: hashedPassword,
        fullName: 'System Administrator',
        phone: '+251911000000',
        role: 'SUPER_ADMIN',
        department: 'Administration',
        employmentType: 'FULL_TIME',
        isActive: true,
        isApproved: true,
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    console.log('✅ Admin user created successfully!\n');
    console.log('Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:    admin@ruhama.clinic');
    console.log('Password: Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nYou can now login at: http://localhost:3000');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
    if (error.code === 'P2002') {
      console.log('\n✅ Admin user already exists!');
      console.log('\nLogin Credentials:');
      console.log('Email: admin@ruhama.clinic');
      console.log('Password: Admin@123');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
