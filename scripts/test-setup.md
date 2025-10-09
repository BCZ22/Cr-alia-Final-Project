# Test Setup & Commands

## 🧪 Testing Commands

### Unit Tests (Jest + React Testing Library)
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test SearchBar.test.tsx
```

### E2E Tests (Playwright)
```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run tests for specific browser
npx playwright test --project=chromium

# Run tests in debug mode
npx playwright test --debug
```

### Storybook
```bash
# Install Storybook dependencies
npm install @storybook/nextjs @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-a11y @storybook/addon-viewport

# Run Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

## 📋 Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

## 🔧 Dependencies to Install

### Testing Dependencies
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
```

### Playwright Dependencies
```bash
npm install --save-dev @playwright/test
```

### Storybook Dependencies
```bash
npm install --save-dev @storybook/nextjs @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-a11y @storybook/addon-viewport @storybook/addon-links @storybook/addon-onboarding
```

## 🚀 Development Workflow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Run Tests (in another terminal)
```bash
# Unit tests
npm test -- --watch

# E2E tests (when needed)
npx playwright test
```

### 3. Open Storybook (in another terminal)
```bash
npm run storybook
```

## 📊 Test Coverage Goals

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## 🎯 Performance Targets

- **Lighthouse Performance**: 70+
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 4s
- **Cumulative Layout Shift**: < 0.1

## 🔍 Accessibility Testing

### Automated Testing
```bash
# Run axe-core accessibility tests
npx playwright test --grep "accessibility"
```

### Manual Testing Checklist
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Color contrast compliance
- [ ] Focus indicators visible
- [ ] ARIA attributes correct

## 📱 Cross-browser Testing

### Desktop Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Browsers
- Chrome Mobile
- Safari Mobile
- Firefox Mobile

## 🐛 Debugging Tests

### Jest Debug
```bash
# Debug specific test
npm test -- --testNamePattern="SearchBar" --verbose

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Playwright Debug
```bash
# Debug mode with browser
npx playwright test --debug

# Debug specific test
npx playwright test homepage.spec.ts --debug
```

## 📈 Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npx playwright test
      - run: npm run build-storybook
```
