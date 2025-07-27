import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TestDataFactory } from '../utils/TestDataFactory';
import * as dotenv from 'dotenv';

dotenv.config();

type UserRole = 'admin' | 'user';

type RoleFixtures = {
  loginAs: (role: UserRole) => Promise<Page>;
  loginPage: LoginPage;
};

export const test = base.extend<RoleFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  loginAs: async ({ page, loginPage }, use) => {
    const credentials = TestDataFactory.getValidCredentials();

    const loginAs = async (role: UserRole): Promise<Page> => {
      const { username, password } = credentials[role];
      
      if (!username || !password) {
        throw new Error(`Credentials not configured for role: ${role}`);
      }

      await loginPage.goto();
      await loginPage.login(username, password);
      return page;
    };

    await use(loginAs);
  },
});