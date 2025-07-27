# Playwright API + UI Testing Framework

A comprehensive end-to-end testing framework built with Playwright, TypeScript, and modern testing practices.

## 🚀 Features

- **Multi-Browser Support**: Chrome, Firefox, Safari, and mobile devices
- **API + UI Testing**: Comprehensive testing coverage for both API and UI
- **Page Object Model**: Scalable and maintainable test architecture
- **Role-Based Testing**: Fixtures for different user roles and permissions
- **Dynamic Test Data**: Faker.js integration for realistic test data
- **CI/CD Ready**: GitHub Actions workflow for automated testing
- **Code Quality**: ESLint, Prettier, and TypeScript for code quality
- **Comprehensive Reporting**: HTML, JSON, and JUnit reports
- **Visual Testing**: Screenshots and videos on test failures
- **Parallel Execution**: Fast test execution with parallel running

## 📁 Project Structure

```
├── .github/workflows/     # CI/CD workflows
├── fixtures/              # Test fixtures and data
├── pages/                 # Page Object Model classes
├── tests/                 # Test specifications
│   ├── api/              # API tests
│   └── ui/               # UI tests
├── utils/                 # Utility classes and helpers
├── test-results/          # Test execution results
├── playwright-report/     # HTML test reports
└── screenshots/           # Test screenshots
```

## 🛠️ Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd playwright-api-ui-framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install:browsers
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
BASE_URL=https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
ADMIN_USER=Admin
ADMIN_PASS=admin123
USER_USER=user
USER_PASS=user123
```

## 🧪 Running Tests

### All Tests
```bash
npm test
```

### UI Tests Only
```bash
npm run test:ui
```

### API Tests Only
```bash
npm run test:api
```

### Specific Browser
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Mobile Tests
```bash
npm run test:mobile
```

### Debug Mode
```bash
npm run test:debug
```

### Headed Mode (See Browser)
```bash
npm run test:headed
```

## 📊 Reports

### View HTML Report
```bash
npm run report
```

### Test Results
- HTML reports: `playwright-report/`
- JSON results: `test-results/results.json`
- JUnit XML: `test-results/results.xml`
- Screenshots: `test-results/`
- Videos: `test-results/`

## 🎯 Writing Tests

### Page Objects

Create page objects extending the `BasePage` class:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyPage extends BasePage {
  readonly myElement: Locator;

  constructor(page: Page) {
    super(page);
    this.myElement = page.locator('[data-testid="my-element"]');
  }

  async performAction(): Promise<void> {
    await this.clickElement(this.myElement);
  }
}
```

### UI Tests

```typescript
import { test, expect } from '@playwright/test';
import { MyPage } from '../../pages/MyPage';

test.describe('My Feature Tests', () => {
  test('should perform action', async ({ page }) => {
    const myPage = new MyPage(page);
    await myPage.goto('/my-page');
    await myPage.performAction();
    await expect(myPage.myElement).toBeVisible();
  });
});
```

### API Tests

```typescript
import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../utils/ApiHelper';

test.describe('API Tests', () => {
  let apiHelper: ApiHelper;

  test.beforeAll(async () => {
    apiHelper = new ApiHelper(process.env.API_BASE_URL!);
    await apiHelper.init();
  });

  test('should return successful response', async () => {
    const response = await apiHelper.get('/api/endpoint');
    expect(response.status).toBe(200);
  });
});
```

### Test Data

Use the `TestDataFactory` for dynamic test data:

```typescript
import { TestDataFactory } from '../../utils/TestDataFactory';

const userData = TestDataFactory.generateUserProfile();
const credentials = TestDataFactory.getValidCredentials();
```

## 🔧 Code Quality

### Linting
```bash
npm run lint
npm run lint:fix
```

### Formatting
```bash
npm run format
npm run format:check
```

## 🚀 CI/CD

The project includes GitHub Actions workflow for:

- **Multi-browser testing** (Chrome, Firefox, Safari)
- **Multi-node version** (18, 20)
- **Parallel execution**
- **Automated reporting**
- **Code quality checks**

### Required Secrets

Configure these secrets in your GitHub repository:

- `ADMIN_USER`: Admin username
- `ADMIN_PASS`: Admin password
- `USER_USER`: Regular user username
- `USER_PASS`: Regular user password
- `BASE_URL`: Application base URL
- `API_BASE_URL`: API base URL

## 📋 Best Practices

### Test Organization
- Group related tests using `test.describe()`
- Use descriptive test names
- Keep tests independent and isolated
- Use appropriate test data setup/teardown

### Page Objects
- Extend `BasePage` for common functionality
- Use meaningful locator names
- Implement waiting strategies
- Handle errors gracefully

### Assertions
- Use Playwright's built-in assertions
- Verify both positive and negative scenarios
- Test edge cases and error conditions

### Data Management
- Use environment variables for configuration
- Generate dynamic test data with TestDataFactory
- Clean up test data after tests

## 🐛 Debugging

### Debug Mode
```bash
npm run test:debug
```

### VS Code Integration
Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Playwright Tests",
  "program": "${workspaceFolder}/node_modules/.bin/playwright",
  "args": ["test", "--debug"],
  "console": "integratedTerminal"
}
```

### Common Issues

1. **Timeouts**: Increase timeout in `playwright.config.ts`
2. **Flaky Tests**: Add proper waits and assertions
3. **Element Not Found**: Verify locators and page state
4. **CI Failures**: Check environment variables and secrets

## 📈 Performance

### Parallel Execution
- Tests run in parallel by default
- Configure workers in `playwright.config.ts`
- Use test isolation for independence

### Optimization Tips
- Use efficient locators (data-testid preferred)
- Minimize page navigations
- Share authentication state when possible
- Use screenshot/video only on failures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Run linting and formatting
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For issues and questions:
- Create GitHub issues for bugs
- Use discussions for questions
- Check existing documentation first