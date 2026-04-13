const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testLabOrders() {
  try {
    console.log('Checking lab orders in database...');
    
    const orders = await prisma.labOrder.findMany({
      include: {
        patient: true,
        orderedBy: true,
        items: true
      }
    });
    
    console.log(`Found ${orders.length} lab orders:`);
    orders.forEach(order => {
      console.log(`- Order ${order.id}: ${order.patient.fullName}, Status: ${order.status}, Items: ${order.items.length}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLabOrders();
