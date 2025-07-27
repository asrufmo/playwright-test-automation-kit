import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly dashboardTitle: Locator;
  readonly userDropdown: Locator;
  readonly logoutOption: Locator;
  readonly mainMenuItems: Locator;
  readonly quickLaunchItems: Locator;
  readonly timeAtWorkWidget: Locator;
  readonly myActionsWidget: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardTitle = page.locator('h6:has-text("Dashboard")');
    this.userDropdown = page.locator('.oxd-userdropdown');
    this.logoutOption = page.locator('text="Logout"');
    this.mainMenuItems = page.locator('.oxd-main-menu-item');
    this.quickLaunchItems = page.locator('.oxd-quick-launch-item');
    this.timeAtWorkWidget = page.locator('.oxd-dashboard-widget').filter({ hasText: 'Time at Work' });
    this.myActionsWidget = page.locator('.oxd-dashboard-widget').filter({ hasText: 'My Actions' });
  }

  async verifyDashboardLoaded(): Promise<void> {
    await this.waitForElement(this.dashboardTitle);
    await this.verifyTitle(/Dashboard/);
  }

  async logout(): Promise<void> {
    await this.clickElement(this.userDropdown);
    await this.clickElement(this.logoutOption);
    await this.page.waitForURL('**/auth/login');
  }

  async navigateToModule(moduleName: string): Promise<void> {
    const moduleLink = this.page.locator(`text="${moduleName}"`).first();
    await this.clickElement(moduleLink);
  }

  async getQuickLaunchItems(): Promise<string[]> {
    await this.waitForElement(this.quickLaunchItems.first());
    return await this.quickLaunchItems.allTextContents();
  }

  async clickQuickLaunchItem(itemName: string): Promise<void> {
    const item = this.quickLaunchItems.filter({ hasText: itemName });
    await this.clickElement(item);
  }

  async isTimeAtWorkWidgetVisible(): Promise<boolean> {
    return await this.isVisible(this.timeAtWorkWidget);
  }

  async isMyActionsWidgetVisible(): Promise<boolean> {
    return await this.isVisible(this.myActionsWidget);
  }

  async getMainMenuItems(): Promise<string[]> {
    await this.waitForElement(this.mainMenuItems.first());
    return await this.mainMenuItems.allTextContents();
  }
}