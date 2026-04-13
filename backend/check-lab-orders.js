const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkLabOrders() {
  try {
    console.log('🔍 Checking lab orders in database...\n');

    const orders = await prisma.labOrder.findMany({
      include: {
        patient: {
          select: {
            fullName: true,
            cardNumber: true
          }
        },
        orderedBy: {
          select: {
            fullName: true,
            email: true
          }
        },
        items: {
          include: {
            test: true
          }
        }
      },
      orderBy: {
        orderedAt: 'desc'
      },
      take: 10
    });

    console.log(`Found ${orders.length} lab orders:\n`);

    orders.forEach((order, index) => {
      console.log(`${index + 1}. Order #${order.orderNumber}`);
      console.log(`   ID: ${order.id}`);
      console.log(`   Patient: ${order.patient.fullName} (${order.patient.cardNumber})`);
      console.log(`   Doctor: ${order.orderedBy.fullName} (${order.orderedBy.email})`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Priority: ${order.priority}`);
      console.log(`   Ordered: ${order.orderedAt.toLocaleString()}`);
      console.log(`   Tests: ${order.items.length}`);
      order.items.forEach((item, i) => {
        console.log(`      ${i + 1}. ${item.testName} (${item.test?.testCode || 'N/A'}) - ${item.status}`);
      });
      console.log('');
    });

    if (orders.length === 0) {
      console.log('❌ No lab orders found in database');
    } else {
      console.log('✅ Lab orders exist in database');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkLabOrders();
