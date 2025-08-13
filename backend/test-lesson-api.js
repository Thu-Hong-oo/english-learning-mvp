const fetch = require('node-fetch');

async function testLessonAPI() {
  try {
    console.log('Testing lesson API...');
    
    // Test 1: Check if server is running
    const response = await fetch('http://localhost:3000/');
    console.log('Server status:', response.status);
    
    // Test 2: Check if lesson routes are loaded
    const lessonResponse = await fetch('http://localhost:3000/api/lessons/teacher', {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log('Lesson API status:', lessonResponse.status);
    
    if (lessonResponse.status === 401) {
      console.log('✅ Lesson API is working (401 is expected without valid token)');
    } else if (lessonResponse.status === 404) {
      console.log('❌ Lesson API route not found');
    } else {
      console.log('⚠️ Unexpected status:', lessonResponse.status);
    }
    
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testLessonAPI();
