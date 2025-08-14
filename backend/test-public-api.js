const fetch = require('node-fetch');

async function testPublicAPI() {
  try {
    const courseId = '689d804279d4b3e420b66e80';
    const url = `http://localhost:3000/api/lessons/course/${courseId}/public`;
    
    console.log('🧪 Testing public API endpoint...');
    console.log('🔗 URL:', url);
    
    const response = await fetch(url);
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Response:', JSON.stringify(data, null, 2));
      
      if (data.success && data.data) {
        console.log(`📚 Found ${data.data.length} lessons:`);
        data.data.forEach((lesson, index) => {
          console.log(`   ${index + 1}. ${lesson.title} (${lesson.status})`);
        });
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Fetch error:', error);
  }
}

testPublicAPI();
