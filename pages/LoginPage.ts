import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.page.fill('input[placeholder="Username"]', username);
    await this.page.fill('input[placeholder="Password"]', password);
    await this.page.click('button[type="submit"]');

    if (await this.page.isVisible('.oxd-alert-content-text')) {
      throw new Error('Login failed: Invalid credentials');
    }

    await this.page.waitForSelector('h6:has-text("Dashboard")');
  }
}