// Simple test script to verify the Notes API
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/notes';

async function testAPI() {
  console.log('🚀 Starting Notes API Tests...\n');
  
  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get('http://localhost:3000/');
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('📋 Available endpoints:', healthResponse.data.endpoints);
    console.log('');
    
    // Test 2: Create a note
    console.log('2. Creating a new note...');
    const newNote = {
      title: 'Test Note',
      content: 'This is a test note created by the test script.'
    };
    
    const createResponse = await axios.post(BASE_URL, newNote);
    console.log('✅ Note created successfully!');
    console.log('📝 Created note:', createResponse.data.data);
    const noteId = createResponse.data.data._id;
    console.log('');
    
    // Test 3: Get all notes
    console.log('3. Fetching all notes...');
    const getAllResponse = await axios.get(BASE_URL);
    console.log('✅ Retrieved all notes!');
    console.log('📊 Total notes:', getAllResponse.data.pagination.total);
    console.log('📄 Notes:', getAllResponse.data.data);
    console.log('');
    
    // Test 4: Get specific note
    console.log('4. Fetching specific note...');
    const getOneResponse = await axios.get(`${BASE_URL}/${noteId}`);
    console.log('✅ Retrieved specific note!');
    console.log('📝 Note:', getOneResponse.data.data);
    console.log('');
    
    // Test 5: Update note
    console.log('5. Updating note...');
    const updatedNote = {
      title: 'Updated Test Note',
      content: 'This note has been updated by the test script!'
    };
    
    const updateResponse = await axios.put(`${BASE_URL}/${noteId}`, updatedNote);
    console.log('✅ Note updated successfully!');
    console.log('📝 Updated note:', updateResponse.data.data);
    console.log('');
    
    // Test 6: Test validation - missing title
    console.log('6. Testing validation (missing title)...');
    try {
      await axios.post(BASE_URL, { content: 'Note without title' });
    } catch (error) {
      console.log('✅ Validation working - caught missing title error');
      console.log('❌ Error:', error.response.data.message);
    }
    console.log('');
    
    // Test 7: Test validation - title too long
    console.log('7. Testing validation (title too long)...');
    try {
      const longTitleNote = {
        title: 'A'.repeat(101), // 101 characters
        content: 'Note with title too long'
      };
      await axios.post(BASE_URL, longTitleNote);
    } catch (error) {
      console.log('✅ Validation working - caught title too long error');
      console.log('❌ Error:', error.response.data.message);
    }
    console.log('');
    
    // Test 8: Delete note
    console.log('8. Deleting note...');
    const deleteResponse = await axios.delete(`${BASE_URL}/${noteId}`);
    console.log('✅ Note deleted successfully!');
    console.log('🗑️ Deleted note:', deleteResponse.data.data);
    console.log('');
    
    // Test 9: Try to get deleted note (should return 404)
    console.log('9. Testing 404 error for deleted note...');
    try {
      await axios.get(`${BASE_URL}/${noteId}`);
    } catch (error) {
      console.log('✅ 404 error working correctly');
      console.log('❌ Error:', error.response.data.message);
    }
    console.log('');
    
    console.log('🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Check if axios is available
try {
  require.resolve('axios');
  testAPI();
} catch (error) {
  console.log('📦 Installing axios for testing...');
  const { exec } = require('child_process');
  exec('npm install axios', (err, stdout, stderr) => {
    if (err) {
      console.error('❌ Failed to install axios:', err);
      return;
    }
    console.log('✅ Axios installed successfully!');
    console.log('🚀 Starting tests...\n');
    testAPI();
  });
}
