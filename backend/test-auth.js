const mongoose = require('mongoose');
const { app } = require('./src/server');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const { requireRole } = require('./src/middleware/auth.middleware');

// Helper to make HTTP requests using native fetch
const request = async (serverPort, method, path, headers = {}, body = null) => {
  const url = `http://127.0.0.1:${serverPort}${path}`;
  const options = {
    method,
    headers: { ...headers }
  };

  if (body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }
  return { status: res.status, body: data };
};

const runAuthTests = async () => {
  console.log('🧪 Starting Phase 3 Authentication & RBAC Verification Tests...\n');

  await connectDB();

  const TEST_PORT = 5088;
  const server = app.listen(TEST_PORT, '127.0.0.1');
  console.log(`🌐 Test server listening on http://127.0.0.1:${TEST_PORT}`);

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${details}`);
      failed++;
    }
  };

  const testEmail = `test.citizen.${Date.now()}@swasthyagrid.demo`;
  const officerEmail = `test.officer.${Date.now()}@swasthyagrid.demo`;

  try {
    // 1. Health check still works
    const healthRes = await request(TEST_PORT, 'GET', '/api/health');
    assert(
      healthRes.status === 200 && healthRes.body.success === true,
      'GET /api/health returns 200 and success: true',
      JSON.stringify(healthRes.body)
    );

    // 2. Register valid user
    const regRes = await request(TEST_PORT, 'POST', '/api/auth/register', {}, {
      name: 'Test Citizen User',
      email: testEmail,
      password: 'StrongPassword123!',
      role: 'CITIZEN',
      area: 'Ward 4 - Test'
    });
    assert(
      regRes.status === 201 && regRes.body.success === true && regRes.body.token && regRes.body.user,
      'POST /api/auth/register registers user and returns safe user + token',
      JSON.stringify(regRes.body)
    );
    assert(
      regRes.body.user && !regRes.body.user.passwordHash,
      'Register response never exposes passwordHash'
    );

    const citizenToken = regRes.body.token;

    // 3. Reject duplicate email registration
    const dupRes = await request(TEST_PORT, 'POST', '/api/auth/register', {}, {
      name: 'Duplicate Citizen',
      email: testEmail,
      password: 'StrongPassword123!',
      role: 'CITIZEN'
    });
    assert(
      dupRes.status === 409 && dupRes.body.success === false,
      'POST /api/auth/register rejects duplicate email with 409',
      JSON.stringify(dupRes.body)
    );

    // 4. Reject invalid registration (short password)
    const shortPassRes = await request(TEST_PORT, 'POST', '/api/auth/register', {}, {
      name: 'Bad Pass',
      email: `badpass.${Date.now()}@swasthyagrid.demo`,
      password: '123'
    });
    assert(
      shortPassRes.status === 400 && shortPassRes.body.success === false,
      'POST /api/auth/register rejects passwords under 6 characters'
    );

    // 5. Login with valid credentials
    const loginRes = await request(TEST_PORT, 'POST', '/api/auth/login', {}, {
      email: testEmail,
      password: 'StrongPassword123!'
    });
    assert(
      loginRes.status === 200 && loginRes.body.success === true && loginRes.body.token && loginRes.body.user.email === testEmail,
      'POST /api/auth/login succeeds with correct credentials and returns JWT',
      JSON.stringify(loginRes.body)
    );
    assert(
      loginRes.body.user && !loginRes.body.user.passwordHash,
      'Login response never exposes passwordHash'
    );

    // 6. Login with incorrect password
    const badLoginRes = await request(TEST_PORT, 'POST', '/api/auth/login', {}, {
      email: testEmail,
      password: 'WrongPassword999!'
    });
    assert(
      badLoginRes.status === 401 && badLoginRes.body.success === false,
      'POST /api/auth/login rejects incorrect password with 401',
      JSON.stringify(badLoginRes.body)
    );

    // 7. Login with non-existent email
    const noUserLogin = await request(TEST_PORT, 'POST', '/api/auth/login', {}, {
      email: 'nonexistent.user.123@demo.com',
      password: 'Password123!'
    });
    assert(
      noUserLogin.status === 401 && noUserLogin.body.success === false,
      'POST /api/auth/login returns generic 401 for unknown user'
    );

    // 8. GET /api/auth/me with valid JWT token
    const meRes = await request(TEST_PORT, 'GET', '/api/auth/me', {
      Authorization: `Bearer ${citizenToken}`
    });
    assert(
      meRes.status === 200 && meRes.body.success === true && meRes.body.user.email === testEmail,
      'GET /api/auth/me returns safe profile for authenticated user',
      JSON.stringify(meRes.body)
    );
    assert(
      meRes.body.user && !meRes.body.user.passwordHash,
      '/api/auth/me does not expose passwordHash'
    );

    // 9. GET /api/auth/me rejects missing token
    const noTokenRes = await request(TEST_PORT, 'GET', '/api/auth/me');
    assert(
      noTokenRes.status === 401 && noTokenRes.body.success === false,
      'GET /api/auth/me rejects request when Authorization header is missing'
    );

    // 10. GET /api/auth/me rejects invalid token
    const badTokenRes = await request(TEST_PORT, 'GET', '/api/auth/me', {
      Authorization: 'Bearer invalid.bogus.jwt.token'
    });
    assert(
      badTokenRes.status === 401 && badTokenRes.body.success === false,
      'GET /api/auth/me rejects invalid JWT token'
    );

    // 11. Role-based authorization test
    // Register an OFFICER
    const regOfficer = await request(TEST_PORT, 'POST', '/api/auth/register', {}, {
      name: 'Test Officer',
      email: officerEmail,
      password: 'OfficerPassword123!',
      role: 'OFFICER',
      area: 'Ward 12'
    });
    const officerToken = regOfficer.body.token;

    // Test middleware function directly
    const officerRoleCheck = requireRole('OFFICER');
    let officerAllowed = false;
    officerRoleCheck({ user: { role: 'OFFICER' } }, {}, () => { officerAllowed = true; });
    assert(officerAllowed === true, 'requireRole("OFFICER") permits OFFICER');

    let citizenBlocked = false;
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          if (code === 403) citizenBlocked = true;
        }
      })
    };
    officerRoleCheck({ user: { role: 'CITIZEN' } }, mockRes, () => {});
    assert(citizenBlocked === true, 'requireRole("OFFICER") blocks CITIZEN with 403');

    // Clean up created test accounts
    await User.deleteMany({ email: { $in: [testEmail, officerEmail] } });
    console.log('\n🧹 Cleaned up temporary test user records.');

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
    await mongoose.disconnect();
    console.log('\n=============================================');
    console.log(`Test Results: ${passed} passed, ${failed} failed`);
    console.log('=============================================\n');
    process.exit(failed > 0 ? 1 : 0);
  }
};

runAuthTests();
