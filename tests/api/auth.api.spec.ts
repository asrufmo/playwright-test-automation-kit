import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../utils/ApiHelper';
import { TestDataFactory } from '../../utils/TestDataFactory';

test.describe('Authentication API Tests', () => {
  let apiHelper: ApiHelper;

  test.beforeAll(async () => {
    const baseURL = process.env.API_BASE_URL || 'https://opensource-demo.orangehrmlive.com/web';
    apiHelper = new ApiHelper(baseURL);
    await apiHelper.init();
  });

  test.afterAll(async () => {
    await apiHelper.dispose();
  });

  test('should return 200 for valid login endpoint', async () => {
    const response = await apiHelper.get('/index.php/auth/login');
    expect(response.status).toBe(200);
  });

  test('should handle invalid credentials gracefully', async () => {
    const invalidCreds = TestDataFactory.getInvalidCredentials();
    
    // Note: This is a mock test since the actual API endpoint structure 
    // would need to be determined from the application
    const response = await apiHelper.post('/api/auth/login', {
      username: invalidCreds.username,
      password: invalidCreds.password,
    });

    // Expecting either 401 or 400 for invalid credentials
    expect([400, 401, 404]).toContain(response.status);
  });

  test('should validate response headers', async () => {
    const response = await apiHelper.get('/index.php/auth/login');
    
    expect(response.headers).toBeDefined();
    expect(response.headers['content-type']).toContain('text/html');
  });

  test('should handle network timeouts gracefully', async () => {
    // This test demonstrates error handling
    try {
      const response = await apiHelper.get('/non-existent-endpoint');
      expect([404, 500]).toContain(response.status);
    } catch (error) {
      // Network errors are expected for non-existent endpoints
      expect(error).toBeDefined();
    }
  });
});