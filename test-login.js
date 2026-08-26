const http = require('http');

async function testLogin() {
  // 1. Get CSRF Token
  const csrfRes = await fetch('http://localhost:3000/api/auth/csrf');
  const csrfData = await csrfRes.json();
  const csrfToken = csrfData.csrfToken;
  const cookies = csrfRes.headers.get('set-cookie');

  // 2. Post Login
  const body = new URLSearchParams({
    csrfToken,
    username: 'admin',
    password: 'password123',
    json: 'true'
  });

  const loginRes = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies
    },
    body: body.toString()
  });

  const loginData = await loginRes.json();
  console.log('Login Response:', loginData);
}

testLogin().catch(console.error);
