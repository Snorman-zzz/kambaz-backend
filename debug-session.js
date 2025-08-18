import axios from 'axios';

const BASE_URL = 'https://kambaz-backend-4bo9.onrender.com';

console.log('🔍 Debugging Session Handling...');

// Test with curl-style cookie jar
const axiosWithJar = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Origin': 'https://a6--kambaz-react-web-application.netlify.app',
        'Content-Type': 'application/json'
    }
});

let sessionCookie = '';

// Add request interceptor to add cookie
axiosWithJar.interceptors.request.use(request => {
    if (sessionCookie) {
        request.headers['Cookie'] = sessionCookie;
    }
    console.log(`→ ${request.method?.toUpperCase()} ${request.url}`);
    if (request.headers['Cookie']) {
        console.log(`  Cookie: ${request.headers['Cookie'].substring(0, 50)}...`);
    }
    return request;
});

// Add response interceptor to capture cookies
axiosWithJar.interceptors.response.use(response => {
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
        sessionCookie = setCookieHeader[0].split(';')[0];
        console.log(`← Set-Cookie captured: ${sessionCookie.substring(0, 50)}...`);
    }
    console.log(`← ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
});

try {
    // Test login
    console.log('Testing login...');
    const loginResponse = await axiosWithJar.post('/api/users/signin', {
        username: 'iron_man',
        password: 'stark123'
    });
    console.log('✅ Login successful');
    
    // Test profile immediately after
    console.log('Testing profile access...');
    const profileResponse = await axiosWithJar.post('/api/users/profile');
    console.log('✅ Profile access successful:', profileResponse.data.username);
    
    console.log('🎉 Session handling working correctly!');
    
} catch (error) {
    console.error('❌ Session test failed:', error.response?.status, error.response?.data);
}