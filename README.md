# Servita Automation Framework

A TypeScript + Jest automation framework for UI and API testing, built for the Servita SDET technical assessment.

---

## Tech Stack

| Layer      | Tool              | Purpose                                           |
| ---------- | ----------------- | ------------------------------------------------- |
| Language   | TypeScript        | Strict typing across the entire framework          |
| Test Runner| Jest              | Test execution, assertions, and reporting          |
| UI Driver  | Playwright        | Browser automation for external site testing       |
| HTTP Client| Native `fetch`    | API request execution                              |
| Reporting  | jest-junit, jest-html-reporters | JUnit XML + HTML reports          |
| CI         | GitHub Actions    | Automated pipeline on push/PR                     |

---

## Framework Structure

```
src/
  config/           # Environment and runtime configuration
                    #   envLoader.ts — multi-env .env file loading
                    #   screenshotEnvironment.ts — custom Jest env for failure tracking
  core/
    constants/      # App constants, URLs, user credentials
    types/          # Shared TypeScript interfaces
    utils/          # Data generators, random value helpers
    helpers/        # Browser session management, screenshot capture
  ui/
    pages/          # Page Object abstractions (LoginPage, ProductsPage, etc.)
    flows/          # Reusable multi-step business flows (AuthFlow, CheckoutFlow)
    assertions/     # UI-specific assertion helpers
    data/           # Product names and test data
  api/
    clients/        # Reusable API client wrapper
    builders/       # Request payload builders/factories
    assertions/     # API response assertion helpers
  tests/
    ui/             # UI test specifications
    api/            # API test specifications
```

---

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9

---

## Installation

```bash
git clone <repo-url>
cd servita-automation-framework
npm install
npx playwright install --with-deps chromium
```

---

## Running Tests

### All tests

```bash
npm test
```

### UI tests only

```bash
npm run test:ui
```

### API tests only

```bash
npm run test:api
```

### Watch mode

```bash
npm run test:watch
```

### Type checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

---

## Environment Variables

| Variable          | Default                         | Description                         |
| ----------------- | ------------------------------- | ----------------------------------- |
| `REQRES_API_KEY`  | *(required)*                    | ReqRes API key (free tier)          |
| `TEST_ENV`        | `local`                         | Target environment (see below)      |
| `UI_BASE_URL`     | `https://www.saucedemo.com`     | Base URL for UI tests               |
| `API_BASE_URL`    | `https://reqres.in`             | Base URL for API tests              |
| `API_USER_AGENT`  | `ServitaTestFramework/1.0`      | User-Agent header for API           |
| `HEADLESS`        | `true`                          | Run browser in headless mode        |
| `CI`              | `false`                         | CI environment flag                 |
| `DEFAULT_TIMEOUT` | `30000`                         | Default timeout in ms               |

### ReqRes API Key Setup (local)

The API tests run against [reqres.in](https://reqres.in/), which requires a free API key.

1. Navigate to **[https://reqres.in/](https://reqres.in/)** and click **Get started**
2. **Sign up** (or sign in if you already have an account)
3. On the dashboard, go to **API Keys** in the left sidebar
4. Click **+ Create free API key**, give it a name (e.g. `Servita Automation Test`), and keep the default **Read only (safest)** permission — this is sufficient for the full test suite including POST/PUT/DELETE, since ReqRes data is non-persistent
5. Copy the generated key (it looks like `reqres_xxxx...`)
6. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

7. Paste your key into `.env`:

```
REQRES_API_KEY=reqres_your_key_here
```

8. Run the API tests:

```bash
npm run test:api
```

> **Note:** The `.env` file is git-ignored and will not be committed. If the key is missing, the test runner will fail immediately with a clear error message explaining how to set it up.

### ReqRes API Key Setup (CI/CD)

In a CI/CD pipeline the API key must **never** be hard-coded or committed to source control. Instead, store it as a secret and inject it as an environment variable at runtime.

**GitHub Actions (configured in this repo):**

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `REQRES_API_KEY`, Value: your key
4. The CI workflow (`.github/workflows/ci.yml`) is already configured to read this secret and pass it to the API test step

**Azure DevOps / other providers:**

- Store the key in your pipeline's secret variables or link it from Azure Key Vault
- Map it to the `REQRES_API_KEY` environment variable in the test step

This approach demonstrates that secrets are treated as first-class concerns — never checked into version control, always injected at runtime.

Override other variables by setting them before running tests:

```bash
HEADLESS=false npm run test:ui
```

---

## Multi-Environment Support

The framework is designed to run against multiple environments (local, dev, UAT, preprod, etc.) without code changes. Only the configuration differs per environment.

### How it works

1. Set `TEST_ENV` to the target environment name (defaults to `local`)
2. The framework loads `.env.<TEST_ENV>` first (e.g. `.env.dev`, `.env.uat`)
3. It then falls back to `.env` for any values not set in the environment-specific file — this means shared secrets like `REQRES_API_KEY` only need to exist in `.env`

### Running against a specific environment

```bash
# Using dedicated npm scripts
npm run test:api:dev        # loads .env.dev → falls back to .env
npm run test:api:uat        # loads .env.uat → falls back to .env
npm run test:api:preprod    # loads .env.preprod → falls back to .env

# Or set TEST_ENV directly
TEST_ENV=dev npm run test:api
TEST_ENV=uat npm test
```

### Setting up a new environment

1. Copy the relevant example file:

```bash
cp .env.dev.example .env.dev
```

2. Edit the URLs to point at your environment's instances:

```
UI_BASE_URL=https://dev.saucedemo.com
API_BASE_URL=https://dev-api.reqres.in
```

3. Shared values like `REQRES_API_KEY` are inherited from `.env` — no need to duplicate them.

All `.env.*` files are git-ignored. Example files (`.env.*.example`) are committed as templates.

### CI/CD multi-environment pipeline

The GitHub Actions workflow uses a matrix strategy to run tests across all environments in parallel:

```yaml
strategy:
  matrix:
    environment: [local, dev, uat, preprod]
```

Each environment gets its own job run, its own test report artifact, and reads environment-specific config from the corresponding `.env.<env>` file. In a real project, each environment would have its own set of secrets and URLs configured in the repository settings or an external secret store.

---

## Reporting

After test execution, reports are generated in the `reports/` directory:

- **JUnit XML**: `reports/junit-report.xml` — machine-readable, CI-friendly
- **HTML Report**: `reports/test-report.html` — human-readable with pass/fail detail
- **Failure Screenshots**: `reports/screenshots/` — full-page PNG screenshots captured automatically when a UI test fails

Jest console output shows total, passed, and failed tests by default.

### Screenshots on failure

UI tests automatically capture a full-page screenshot when a test fails. Screenshots are named with the test suite, test name, and timestamp for easy traceability:

```
reports/screenshots/
  Login_and_Logout--should_show_error_for_locked_out_user--2026-03-15T10-30-45-123Z.png
  Single_Item_Checkout--should_complete_checkout--2026-03-15T10-31-02-456Z.png
```

This is powered by a [custom Jest environment](src/config/screenshotEnvironment.ts) that tracks which test has failed, so the `afterEach` hook only captures when needed — no wasted screenshots on passing tests.

In CI, failure screenshots are uploaded as a separate artifact (`failure-screenshots-<environment>`) for quick debugging without needing to reproduce locally.

### Test retries

UI tests are configured with `jest.retryTimes(1, { logErrorsBeforeRetry: true })` — each failing test is retried once before being reported as failed. This mitigates intermittent failures from network latency, browser timing, or CI environment variability. The original error is logged before the retry so root causes aren't hidden.

---

## Test Coverage

### UI Tests (saucedemo.com)

| Test Suite             | Scenarios                                                      |
| ---------------------- | -------------------------------------------------------------- |
| Login & Logout         | Standard user login, products page landing, logout, locked user|
| Single Item Checkout   | Add item → cart verification → checkout → order confirmation   |
| Multiple Items Checkout| Add 3 items → cart verification → checkout → order confirmation|

### API Tests (reqres.in)

| Test Suite     | Scenarios                                                              |
| -------------- | ---------------------------------------------------------------------- |
| Users API      | GET paginated list, GET single, GET 404, pagination, POST create, PUT update, DELETE |
| Resources API  | GET paginated list, field validation, support info, GET single, GET 404 |
| Auth API       | POST register success, register missing password, register unsupported user, POST login success, login missing password |

---

## Design Decisions

### ReqRes API key authentication

ReqRes (`reqres.in`) now requires a free API key sent via the `x-api-key` header. The framework reads the key from the `REQRES_API_KEY` environment variable and injects it into every API request via the `ApiClient` constructor. If the key is missing, tests fail immediately with a clear setup error — this prevents confusing 401/403 failures and guides the developer to the solution.

### Why Playwright instead of React Testing Library for UI tests?

React Testing Library (RTL) is designed for testing React components within a project you own — it operates on a virtual DOM and requires access to the component source code.

The target application (`saucedemo.com`) is an external deployed website. For black-box journey automation against a live external site, browser automation (Playwright) is the technically appropriate tool.

In a production environment, the testing strategy would be layered:

- **RTL + Jest** for component and integration tests in owned React code
- **Playwright/browser E2E** for journey automation against deployed applications
- **Jest** for API validation

This approach keeps the solution honest and technically defensible rather than forcing an inappropriate tool into the wrong layer.

### Page Object pattern

Selectors are isolated inside page classes. Tests describe **what** should happen; page objects implement **how**. This keeps tests readable and maintainable — a selector change only requires updating one file.

### Reusable flows

Multi-step business flows (login, checkout) are encapsulated in flow classes, making tests concise and avoiding duplication across test files.

### Screenshot capture on failure

Rather than capturing screenshots on every test (which creates noise), the framework uses a custom Jest test environment (`screenshotEnvironment.ts`) that listens for the `test_fn_failure` event and sets a `__TEST_FAILED__` flag. The `afterEach` hook in each UI test checks this flag and only captures when a test has actually failed. Screenshots are saved with a descriptive filename (suite + test name + timestamp) so they can be traced directly to the failing test in CI logs.

### Test retry strategy

UI tests use `jest.retryTimes(1, { logErrorsBeforeRetry: true })` scoped to each test suite. This retries a failing test once — enough to filter out genuine flakiness without masking real bugs. The `logErrorsBeforeRetry` flag ensures the original failure is always visible. API tests do not use retries because they are deterministic.

### Configuration layer

All environment-specific values flow through a typed configuration layer, making the framework portable across local, QA, and CI environments without code changes.

---

## Future Improvements

- Test tagging and filtering for selective execution
- Parallel test execution across browsers
- API contract/schema validation (e.g. with Zod or Ajv)
- Visual regression testing
- Accessibility checks
- Service mocking for isolated component tests
- RTL component tests if React source code becomes available
