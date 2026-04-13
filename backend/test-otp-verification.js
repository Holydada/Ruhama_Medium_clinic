/**
 * Test OTP verification flow
 * Run this after requesting an email change to test OTP verification
 */

const API_URL = 'http://localhost:5000/api/v1';

async function makeRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.error || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
}

async function testOTPVerification() {
  console.log('=== OTP VERIFICATION TEST ===\n');
  
  // Get OTP from command line argument
  const otp = process.argv[2];
  
  if (!otp) {
    console.error('❌ Please provide OTP as argument');
    console.log('\nUsage: node test-otp-verification.js <OTP_CODE>');
    console.log('Example: node test-otp-verification.js 123456');
    return;
  }
  
  if (otp.length !== 6 || !/^\d+$/.test(otp)) {
    console.error('❌ OTP must be exactly 6 digits');
    return;
  }
  
  try {
    // Step 1: Login
    console.log('Step 1: Logging in...');
    const loginData = await makeRequest(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'thevoiceofgraceandmercy@gmail.com',
        password: 'Test@1234'
      }),
    });
    
    const { token } = loginData.data;
    console.log('✓ Login successful');
    console.log('');
    
    // Step 2: Verify OTP
    console.log(`Step 2: Verifying OTP: ${otp}...`);
    const verifyData = await makeRequest(
      `${API_URL}/users/confirm-email-change`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ otp }),
      }
    );
    
    console.log('✓ OTP verification successful!');
    console.log('  New email:', verifyData.data.email);
    console.log('  Response:', verifyData);
    console.log('');
    
    console.log('=== TEST PASSED ===');
    console.log('Email has been changed successfully!');
    console.log('You can now login with the new email address.');
    
  } catch (error) {
    console.error('✗ Test failed');
    console.error('  Error:', error.message);
    if (error.status) {
      console.error('  Status:', error.status);
      console.error('  Data:', error.data);
    }
    
    if (error.message.includes('Invalid OTP')) {
      console.error('\n⚠️  The OTP code is incorrect or has expired.');
      console.error('Please check your email for the correct code.');
    }
  }
}

testOTPVerification();
