import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as dotenv from 'dotenv';

dotenv.config();

type UserRole = 'admin' | 'user';

type RoleFixtures = {
  loginAs: (role: UserRole) => Promise<Page>;
};

export const test = base.extend<RoleFixtures>({
  loginAs: async ({ page }, use) => {
    const creds = {
      admin: {
        username: process.env.ADMIN_USER ?? 'Admin',
        password: process.env.ADMIN_PASS ?? 'admin123'
      },
      user: {
        username: process.env.USER_USER ?? 'user',
        password: process.env.USER_PASS ?? 'user123'
      }
    };

    const loginAs = async (role: UserRole): Promise<Page> => {
      const { username, password } = creds[role];
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(username, password);
      return page;
    };

    await use(loginAs);
  }
});