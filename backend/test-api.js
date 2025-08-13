const fetch = require('node-fetch');

async function testAPIs() {
  console.log('🔍 Testing APIs...\n');

  try {
    // Test 1: Server status
    const serverResponse = await fetch('http://localhost:3000/');
    console.log('✅ Server is running:', serverResponse.status);

    // Test 2: Lesson API without token
    const lessonResponse = await fetch('http://localhost:3000/api/lessons/teacher');
    console.log('📚 Lesson API (no token):', lessonResponse.status);
    
    if (lessonResponse.status === 401) {
      console.log('   ✅ Lesson API exists (401 expected without token)');
    } else if (lessonResponse.status === 404) {
      console.log('   ❌ Lesson API not found - route not loaded');
    }

    // Test 3: Admin API without token
    const adminResponse = await fetch('http://localhost:3000/api/admin/instructor-applications');
    console.log('👑 Admin API (no token):', adminResponse.status);
    
    if (adminResponse.status === 401) {
      console.log('   ✅ Admin API exists (401 expected without token)');
    } else if (adminResponse.status === 404) {
      console.log('   ❌ Admin API not found');
    }

    // Test 4: Auth API without token
    const authResponse = await fetch('http://localhost:3000/api/auth/profile');
    console.log('🔐 Auth API (no token):', authResponse.status);
    
    if (authResponse.status === 401) {
      console.log('   ✅ Auth API exists (401 expected without token)');
    } else if (authResponse.status === 404) {
      console.log('   ❌ Auth API not found');
    }

  } catch (error) {
    console.error('❌ Error testing APIs:', error.message);
  }
}

testAPIs();
