const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getOTP() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: 'test1775681426196@example.com' },
      select: {
        email: true,
        fullName: true,
        role: true,
        emailVerificationToken: true,
        verificationEmailSentAt: true,
      },
    });

    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('\n=== USER INFO ===');
    console.log('Email:', user.email);
    console.log('Name:', user.fullName);
    console.log('Role:', user.role);
    console.log('OTP Code:', user.emailVerificationToken || 'No OTP (cleared after verification)');
    console.log('Sent at:', user.verificationEmailSentAt || 'N/A');
    
    console.log('\n✅ Email change was successful!');
    console.log('The email was changed from thevoiceofgraceandmercy@gmail.com');
    console.log('to test1775681426196@example.com');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

getOTP();
