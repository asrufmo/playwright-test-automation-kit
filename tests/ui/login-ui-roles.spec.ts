import {test} from "../../fixtures/role-fixtures";
import {expect} from "@playwright/test";

test('Admin can login and see dashboard', async ({ loginAs }) => {
  const page = await loginAs('admin');
  await expect(page.locator('h6')).toHaveText('Dashboard');
});