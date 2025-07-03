import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
    trace: 'on',
  },
  reporter: 'html',
});