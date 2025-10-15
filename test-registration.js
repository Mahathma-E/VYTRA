const axios = require('axios');

async function testRegistration() {
  try {
    const response = await axios.post('http://localhost:8003/api/auth/register', {
      email: 'test@example.com',
      password: 'TestPass123'
    });
    console.log('Registration successful:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Registration failed with status:', error.response.status);
      console.log('Error data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testRegistration();