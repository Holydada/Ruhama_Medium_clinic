const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function restoreEmail() {
  try {
    const user = await prisma.user.update({
      where: { email: 'test1775681426196@example.com' },
      data: {
        email: 'thevoiceofgraceandmercy@gmail.com',
        emailVerificationToken: null,
        verificationEmailSentAt: null,
      },
      select: {
        email: true,
        fullName: true,
        role: true,
      },
    });

    console.log('\n✅ Email restored successfully!');
    console.log('Email:', user.email);
    console.log('Name:', user.fullName);
    console.log('Role:', user.role);
    console.log('\nYou can now login with: thevoiceofgraceandmercy@gmail.com');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

restoreEmail();
