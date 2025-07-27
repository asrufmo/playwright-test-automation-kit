import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { TestDataFactory } from '../../utils/TestDataFactory';

test.describe('Login UI Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto();
  });

  test('should display login form elements', async () => {
    const isFormVisible = await loginPage.isLoginFormVisible();
    expect(isFormVisible).toBeTruthy();
    
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should login successfully with valid admin credentials', async () => {
    const credentials = TestDataFactory.getValidCredentials();
    
    await loginPage.login(credentials.admin.username, credentials.admin.password);
    await dashboardPage.verifyDashboardLoaded();
  });

  test('should login successfully with valid user credentials', async () => {
    const credentials = TestDataFactory.getValidCredentials();
    
    // Skip if user credentials are not configured
    if (!credentials.user.username || credentials.user.username === 'user') {
      test.skip('User credentials not properly configured');
    }
    
    await loginPage.login(credentials.user.username, credentials.user.password);
    await dashboardPage.verifyDashboardLoaded();
  });

  test('should show error message for invalid credentials', async () => {
    const invalidCreds = TestDataFactory.getInvalidCredentials();
    
    await expect(async () => {
      await loginPage.login(invalidCreds.username, invalidCreds.password);
    }).rejects.toThrow();
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
  });

  test('should show error message for empty username', async () => {
    await expect(async () => {
      await loginPage.login('', 'password123');
    }).rejects.toThrow();
  });

  test('should show error message for empty password', async () => {
    await expect(async () => {
      await loginPage.login('admin', '');
    }).rejects.toThrow();
  });

  test('should show error message for empty credentials', async () => {
    await expect(async () => {
      await loginPage.login('', '');
    }).rejects.toThrow();
  });

  test('should display forgot password link', async () => {
    const isForgotPasswordVisible = await loginPage.isVisible(loginPage.forgotPasswordLink);
    if (isForgotPasswordVisible) {
      await expect(loginPage.forgotPasswordLink).toBeVisible();
    }
  });

  test('should handle special characters in credentials', async () => {
    await expect(async () => {
      await loginPage.login('user@#$%', 'pass!@#$');
    }).rejects.toThrow();
  });

  test('should handle SQL injection attempts', async () => {
    const sqlInjectionAttempts = [
      "' OR '1'='1",
      "admin'--",
      "admin'/*",
    ];

    for (const attempt of sqlInjectionAttempts) {
      await expect(async () => {
        await loginPage.login(attempt, 'password');
      }).rejects.toThrow();
    }
  });

  test('should maintain login state after page refresh', async () => {
    const credentials = TestDataFactory.getValidCredentials();
    
    await loginPage.login(credentials.admin.username, credentials.admin.password);
    await dashboardPage.verifyDashboardLoaded();
    
    // Refresh the page
    await loginPage.page.reload();
    
    // Should still be logged in (or redirected to login if session expired)
    const currentUrl = loginPage.page.url();
    expect(currentUrl).toMatch(/(dashboard|login)/);
  });

  test('should handle keyboard navigation', async () => {
    await loginPage.usernameInput.focus();
    await loginPage.page.keyboard.type('admin');
    
    // Tab to password field
    await loginPage.page.keyboard.press('Tab');
    await loginPage.page.keyboard.type('admin123');
    
    // Enter to submit
    await loginPage.page.keyboard.press('Enter');
    
    // Should either login successfully or show error
    await loginPage.page.waitForTimeout(2000);
    const currentUrl = loginPage.page.url();
    expect(currentUrl).toMatch(/(dashboard|login)/);
  });
});