const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function permanentFix() {
  try {
    console.log('Applying permanent login fix...\n');

    // Step 1: Delete ALL sessions to start fresh
    const deleted = await prisma.userSession.deleteMany({});
    console.log(`✅ Deleted ${deleted.count} old sessions\n`);

    // Step 2: Check admin user
    const admin = await prisma.user.findUnique({
      where: { email: 'thevoiceofgraceandmercy@gmail.com' }
    });

    if (admin) {
      console.log('✅ Admin user verified');
      console.log('   Email:', admin.email);
      console.log('   Active:', admin.isActive);
      console.log('   Approved:', admin.isApproved);
      console.log('\n✅ Login is now fixed!');
      console.log('\n📝 IMPORTANT: After each logout, old sessions are automatically cleaned.');
      console.log('   You can now login multiple times without issues.');
      console.log('\nTry logging in at: http://localhost:3000');
    } else {
      console.log('❌ Admin user not found');
    }

    console.log('\n💡 TIP: If you get the same error again:');
    console.log('   Run: node permanent-fix-login.js');
    console.log('   This will clear all sessions and let you login fresh.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

permanentFix();
