/**
 * Test script to verify email change flow with proper authentication
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

async function testEmailChangeFlow() {
  console.log('=== EMAIL CHANGE FLOW TEST ===\n');
  
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
    
    const { token, user } = loginData.data;
    console.log('✓ Login successful');
    console.log('  User:', user.email);
    console.log('  Token:', token.substring(0, 30) + '...');
    console.log('  Token length:', token.length);
    console.log('');
    
    // Step 2: Get profile (verify token works)
    console.log('Step 2: Getting profile...');
    const profileData = await makeRequest(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✓ Profile retrieved successfully');
    console.log('  Email:', profileData.data.email);
    console.log('');
    
    // Step 3: Request email change
    console.log('Step 3: Requesting email change...');
    const newEmail = `test${Date.now()}@example.com`;
    
    try {
      const emailChangeData = await makeRequest(
        `${API_URL}/users/request-email-change`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            newEmail: newEmail,
            password: 'Test@1234'
          }),
        }
      );
      console.log('✓ Email change request successful');
      console.log('  Response:', emailChangeData);
      console.log('');
      
      console.log('=== TEST PASSED ===');
      console.log('Email change flow is working correctly!');
      console.log('Check the email inbox for OTP code.');
      
    } catch (emailError) {
      console.error('✗ Email change request failed');
      console.error('  Status:', emailError.status);
      console.error('  Error:', emailError.data);
      console.error('  Error code:', emailError.data?.errorCode);
      
      if (emailError.status === 401) {
        console.error('\n⚠️  AUTHENTICATION ISSUE DETECTED');
        console.error('The token is not being accepted by the backend.');
        console.error('Possible causes:');
        console.error('  1. Token format is incorrect');
        console.error('  2. JWT secret mismatch');
        console.error('  3. Token expired');
        console.error('  4. Middleware not receiving the token');
      }
    }
    
  } catch (error) {
    console.error('✗ Test failed at login step');
    console.error('  Error:', error.message);
    if (error.status) {
      console.error('  Status:', error.status);
      console.error('  Data:', error.data);
    }
  }
}

// Run the test
testEmailChangeFlow();
