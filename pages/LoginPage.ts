import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[placeholder="Username"]');
    this.passwordInput = page.locator('input[placeholder="Password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.forgotPasswordLink = page.locator('text="Forgot your password?"');
  }

  async goto(): Promise<void> {
    await super.goto('/');
    await this.waitForPageLoad();
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);

    // Check for error message
    if (await this.isVisible(this.errorMessage)) {
      const errorText = await this.getText(this.errorMessage);
      throw new Error(`Login failed: ${errorText}`);
    }

    // Wait for successful login redirect
    await this.page.waitForSelector('h6:has-text("Dashboard")', { timeout: 10000 });
  }

  async getErrorMessage(): Promise<string> {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }

  async isLoginFormVisible(): Promise<boolean> {
    return await this.isVisible(this.usernameInput) && 
           await this.isVisible(this.passwordInput) && 
           await this.isVisible(this.loginButton);
  }
}