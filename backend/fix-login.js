const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixLogin() {
  try {
    console.log('Fixing login issues...\n');

    // Delete all expired sessions
    const deletedSessions = await prisma.userSession.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    console.log(`✅ Deleted ${deletedSessions.count} expired sessions`);

    // Delete all sessions (fresh start)
    const allDeleted = await prisma.userSession.deleteMany({});
    console.log(`✅ Deleted ${allDeleted.count} total sessions for fresh start`);

    // Check admin user
    const admin = await prisma.user.findUnique({
      where: { email: 'thevoiceofgraceandmercy@gmail.com' }
    });

    if (admin) {
      console.log('\n✅ Admin user found!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Email:', admin.email);
      console.log('Name:', admin.fullName);
      console.log('Role:', admin.role);
      console.log('Active:', admin.isActive);
      console.log('Approved:', admin.isApproved);
      console.log('Email Verified:', admin.emailVerified);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      if (!admin.isActive) {
        await prisma.user.update({
          where: { id: admin.id },
          data: { isActive: true }
        });
        console.log('✅ Activated admin user');
      }

      if (!admin.isApproved) {
        await prisma.user.update({
          where: { id: admin.id },
          data: { isApproved: true }
        });
        console.log('✅ Approved admin user');
      }

      if (!admin.emailVerified) {
        await prisma.user.update({
          where: { id: admin.id },
          data: { 
            emailVerified: true,
            emailVerifiedAt: new Date()
          }
        });
        console.log('✅ Verified admin email');
      }

      console.log('\n✅ Login should work now!');
      console.log('\nTry logging in at: http://localhost:3000');
      console.log('Email: thevoiceofgraceandmercy@gmail.com');
      console.log('Password: [Your password]');
    } else {
      console.log('\n❌ Admin user not found!');
      console.log('\nSearching for other admin users...');
      
      const admins = await prisma.user.findMany({
        where: { role: 'SUPER_ADMIN' }
      });

      if (admins.length > 0) {
        console.log(`\n✅ Found ${admins.length} admin user(s):`);
        admins.forEach((user, index) => {
          console.log(`\n${index + 1}. ${user.email}`);
          console.log(`   Name: ${user.fullName}`);
          console.log(`   Active: ${user.isActive}`);
          console.log(`   Approved: ${user.isApproved}`);
        });
      } else {
        console.log('\n❌ No admin users found in database!');
        console.log('\nRun this to create one:');
        console.log('node create-admin.js');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixLogin();
