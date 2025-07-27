import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { TestDataFactory } from '../../utils/TestDataFactory';

test.describe('Dashboard UI Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    
    // Login before each test
    const credentials = TestDataFactory.getValidCredentials();
    await loginPage.goto();
    await loginPage.login(credentials.admin.username, credentials.admin.password);
  });

  test('should display dashboard after successful login', async () => {
    await dashboardPage.verifyDashboardLoaded();
    await expect(dashboardPage.dashboardTitle).toBeVisible();
  });

  test('should display main menu items', async () => {
    const menuItems = await dashboardPage.getMainMenuItems();
    expect(menuItems.length).toBeGreaterThan(0);
    
    // Common menu items that should be present
    const expectedItems = ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment'];
    const menuText = menuItems.join(' ');
    
    expectedItems.forEach(item => {
      expect(menuText).toContain(item);
    });
  });

  test('should display dashboard widgets', async () => {
    const isTimeWidgetVisible = await dashboardPage.isTimeAtWorkWidgetVisible();
    const isActionsWidgetVisible = await dashboardPage.isMyActionsWidgetVisible();
    
    // At least one widget should be visible
    expect(isTimeWidgetVisible || isActionsWidgetVisible).toBeTruthy();
  });

  test('should allow navigation to different modules', async () => {
    await dashboardPage.navigateToModule('Admin');
    await expect(dashboardPage.page).toHaveURL(/.*admin.*/);
  });

  test('should allow user logout', async () => {
    await dashboardPage.logout();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(dashboardPage.page).toHaveURL(/.*login.*/);
  });

  test('should display quick launch items', async ({ page }) => {
    // Skip this test if quick launch is not available
    const hasQuickLaunch = await dashboardPage.quickLaunchItems.count() > 0;
    test.skip(!hasQuickLaunch, 'Quick launch items not available');
    
    const quickLaunchItems = await dashboardPage.getQuickLaunchItems();
    expect(quickLaunchItems.length).toBeGreaterThan(0);
  });

  test('should handle responsive layout on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await dashboardPage.verifyDashboardLoaded();
    await expect(dashboardPage.dashboardTitle).toBeVisible();
  });
});