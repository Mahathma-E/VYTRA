const mongoose = require('mongoose');
require('dotenv').config();

const testMongoConnection = async () => {
  console.log('🔍 Testing MongoDB Connection...\n');
  
  const uris = [
    process.env.MONGO_URI,
    'mongodb://localhost:27017/inventory',
    'mongodb://127.0.0.1:27017/inventory'
  ];
  
  let connected = false;
  
  for (const uri of uris) {
    try {
      console.log(`📡 Trying to connect to: ${uri}`);
      
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
      });
      
      console.log(`✅ Successfully connected to MongoDB!`);
      console.log(`📍 Host: ${mongoose.connection.host}`);
      console.log(`🗄️  Database: ${mongoose.connection.name}`);
      console.log(`🔌 Port: ${mongoose.connection.port}`);
      
      connected = true;
      break;
      
    } catch (error) {
      console.log(`❌ Failed to connect to ${uri}: ${error.message}`);
    }
  }
  
  if (!connected) {
    console.log('\n🚨 MongoDB Connection Failed!');
    console.log('Please ensure MongoDB is running on your system.');
    console.log('\nTo start MongoDB:');
    console.log('1. Windows: Run "mongod" in command prompt');
    console.log('2. macOS: brew services start mongodb-community');
    console.log('3. Linux: sudo systemctl start mongod');
    console.log('\nOr use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest');
  } else {
    console.log('\n🎉 MongoDB is ready for the inventory application!');
  }
  
  // Close connection
  await mongoose.connection.close();
  console.log('🔌 Connection closed.');
};

// Run the test
testMongoConnection().catch(console.error);
