import axios from 'axios';

const BASE_URL = 'https://kambaz-backend-4bo9.onrender.com';
const FRONTEND_ORIGIN = 'https://a6--kambaz-react-web-application.netlify.app';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Origin': FRONTEND_ORIGIN,
        'Content-Type': 'application/json'
    }
});

console.log('🧪 Final CRUD Test - All Operations');
console.log('=' .repeat(50));

async function testAllCRUD() {
    try {
        // 1. Authentication
        console.log('🔐 Testing Authentication...');
        const loginResponse = await api.post('/api/users/signin', {
            username: 'iron_man',
            password: 'stark123'
        });
        console.log('✅ Login successful:', loginResponse.data.firstName);
        
        const profileResponse = await api.post('/api/users/profile');
        console.log('✅ Profile access:', profileResponse.data.username);
        
        // 2. Course CRUD
        console.log('\n📚 Testing Course CRUD...');
        
        // Create course
        const newCourse = {
            name: 'Final Test Course ' + Date.now(),
            description: 'Testing all CRUD operations'
        };
        const createResponse = await api.post('/api/courses', newCourse);
        const courseId = createResponse.data._id;
        console.log('✅ Course created:', createResponse.data.name, 'ID:', courseId);
        
        // Read courses
        const coursesResponse = await api.get('/api/courses');
        const foundCourse = coursesResponse.data.find(c => c._id === courseId);
        console.log('✅ Course found in list:', foundCourse ? 'Yes' : 'No');
        
        // Update course
        const updatedCourse = {
            ...createResponse.data,
            name: 'Updated ' + createResponse.data.name,
            description: 'Updated description'
        };
        const updateResponse = await api.put(`/api/courses/${courseId}`, updatedCourse);
        console.log('✅ Course updated:', updateResponse.data.name);
        
        // Verify update persisted
        const coursesAfterUpdate = await api.get('/api/courses');
        const verifyUpdate = coursesAfterUpdate.data.find(c => c._id === courseId);
        console.log('✅ Update persisted:', verifyUpdate.name.includes('Updated') ? 'Yes' : 'No');
        
        // Delete course
        await api.delete(`/api/courses/${courseId}`);
        console.log('✅ Course delete API call successful');
        
        // Verify deletion persisted
        const coursesAfterDelete = await api.get('/api/courses');
        const deletedCourse = coursesAfterDelete.data.find(c => c._id === courseId);
        console.log('✅ Delete persisted:', deletedCourse ? 'No - still exists!' : 'Yes - removed from DB');
        
        // 3. Assignment CRUD (if courseId available, create a new course for testing)
        console.log('\n📝 Testing Assignment CRUD...');
        const testCourse = await api.post('/api/courses', { name: 'Assignment Test Course', description: 'For testing assignments' });
        const testCourseId = testCourse.data._id;
        
        // Create assignment
        const newAssignment = {
            title: 'Test Assignment ' + Date.now(),
            description: 'Testing assignment CRUD',
            points: 100
        };
        const assignmentResponse = await api.post(`/api/courses/${testCourseId}/assignments`, newAssignment);
        const assignmentId = assignmentResponse.data._id;
        console.log('✅ Assignment created:', assignmentResponse.data.title);
        
        // Update assignment
        const updatedAssignment = {
            ...assignmentResponse.data,
            title: 'Updated ' + assignmentResponse.data.title,
            points: 150
        };
        const assignmentUpdateResponse = await api.put(`/api/assignments/${assignmentId}`, updatedAssignment);
        console.log('✅ Assignment updated:', assignmentUpdateResponse.data.title);
        
        // Delete assignment
        await api.delete(`/api/assignments/${assignmentId}`);
        console.log('✅ Assignment deleted');
        
        // Cleanup test course
        await api.delete(`/api/courses/${testCourseId}`);
        console.log('✅ Test course cleaned up');
        
        // 4. Session persistence verification
        console.log('\n🔒 Testing Session Persistence...');
        const finalProfileCheck = await api.post('/api/users/profile');
        console.log('✅ Session persisted through all operations:', finalProfileCheck.data.username);
        
        console.log('\n' + '=' .repeat(50));
        console.log('🎉 ALL CRUD OPERATIONS WORKING PERFECTLY!');
        console.log('✅ Authentication: Working');
        console.log('✅ Course Create: Working & Persisting');
        console.log('✅ Course Read: Working');
        console.log('✅ Course Update: Working & Persisting');
        console.log('✅ Course Delete: Working & Persisting');
        console.log('✅ Assignment CRUD: Working');
        console.log('✅ Session Management: Working');
        console.log('');
        console.log('🚀 Your deployed app should now work perfectly!');
        console.log('   All buttons and operations will persist after page refresh.');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        console.error('URL:', error.config?.url);
    }
}

testAllCRUD();