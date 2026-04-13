const API_URL = 'http://localhost:5000/api/v1';

async function testLabOrderCreation() {
  try {
    console.log('🧪 Testing Lab Order Creation Flow\n');

    // Step 1: Login as doctor
    console.log('1️⃣ Logging in as doctor...');
    const loginResp = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'doctor',
        password: 'doctor123'
      })
    });
    
    const loginData = await loginResp.json();
    const token = loginData.token;
    console.log('✅ Login successful\n');

    // Step 2: Get doctor queue to find a visit
    console.log('2️⃣ Getting doctor queue...');
    const queueResp = await fetch(`${API_URL}/doctor/queue`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const queueData = await queueResp.json();
    const visits = queueData.data;
    console.log(`✅ Found ${visits.length} visits in queue\n`);

    if (visits.length === 0) {
      console.log('❌ No visits found. Please create a patient visit first.');
      return;
    }

    const visit = visits[0];
    console.log(`📋 Using visit: ${visit.visitNumber} for patient: ${visit.patient.fullName}\n`);

    // Step 3: Create lab order
    console.log('3️⃣ Creating lab order...');
    const labOrderResp = await fetch(`${API_URL}/doctor/lab-order`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        visitId: visit.visitId,
        tests: [
          {
            testName: 'Complete Blood Count',
            testCode: 'CBC',
            instructions: 'Fasting required'
          },
          {
            testName: 'Blood Glucose (Fasting)',
            testCode: 'FBS',
            instructions: '12-hour fast'
          }
        ],
        clinicalNotes: 'Routine checkup - suspected anemia',
        urgency: 'ROUTINE'
      })
    });

    const labOrderData = await labOrderResp.json();
    
    if (!labOrderResp.ok) {
      console.error('❌ Lab order creation failed:', labOrderData);
      return;
    }

    console.log('✅ Lab order created successfully!');
    console.log('Order ID:', labOrderData.data.id);
    console.log('Order Number:', labOrderData.data.orderNumber);
    console.log('Status:', labOrderData.data.status);
    console.log('Items:', labOrderData.data.items.length, 'tests\n');

    // Step 4: Check lab queue
    console.log('4️⃣ Checking lab queue...');
    const labQueueResp = await fetch(`${API_URL}/lab/orders/queue`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const labQueueData = await labQueueResp.json();
    const labOrders = labQueueData.data;
    console.log(`✅ Lab queue has ${labOrders.length} orders`);
    
    const ourOrder = labOrders.find(o => o.id === labOrderData.data.id);
    if (ourOrder) {
      console.log('✅ Our order is in the lab queue!');
      console.log('   Order Number:', ourOrder.orderNumber);
      console.log('   Patient:', ourOrder.patient.fullName);
      console.log('   Tests:', ourOrder.items.map(i => i.testName).join(', '));
    } else {
      console.log('❌ Order not found in lab queue');
    }

    console.log('\n🎉 All tests passed!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

testLabOrderCreation();
