const axios = require('axios');
const { MongoClient } = require('mongodb');

// Test MongoDB connection directly
async function testMongoDB() {
  try {
    console.log('Testing MongoDB connection directly...');
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);
    await client.connect();
    console.log('MongoDB connection successful!');
    
    // List databases
    const databases = await client.db().admin().listDatabases();
    console.log('Available databases:');
    databases.databases.forEach(db => {
      console.log(` - ${db.name}`);
    });
    
    await client.close();
  } catch (error) {
    console.log('MongoDB connection failed:', error.message);
  }
}

// Test the backend health endpoint
async function testBackend() {
  try {
    console.log('Testing backend connection...');
    const response = await axios.get('http://localhost:8004/health');
    console.log('Backend health check response:', response.data);
  } catch (error) {
    console.log('Backend connection failed:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

// Test the main endpoint
async function testMainEndpoint() {
  try {
    console.log('\nTesting main endpoint...');
    const response = await axios.get('http://localhost:8004/');
    console.log('Main endpoint response:', response.data);
  } catch (error) {
    console.log('Main endpoint failed:', error.message);
  }
}

async function runTests() {
  console.log('Starting connection tests...');
  await testMongoDB();
  await testBackend();
  await testMainEndpoint();
  console.log('All tests completed.');
}

runTests().catch(console.error);