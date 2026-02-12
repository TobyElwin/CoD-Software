# Cost of Delay Calculator - Test Suite

This directory contains all automated tests for the Cost of Delay Calculator application.

## 📁 Directory Structure

```
test-suite/
├── tests/                      # Test specifications
│   ├── acceptance-tests.js     # Core acceptance tests
│   └── atdd-bdd-debugging-tests.js
├── features/                   # Gherkin feature files
│   ├── cost-of-delay.feature
│   └── comprehensive-e2e-tests.feature
├── run-tests.js               # Headless test runner (Puppeteer)
├── run-tests-browser.js       # Browser-based test runner
├── validate-ui-interactions.js # UI/module interaction smoke validation
├── open-app.js                 # Local app launcher for manual testing
├── ATDD-BDD-STANDARDS.md       # Simple debugging standards checklist
├── test-runner.html           # HTML test runner (with UI)
├── test-runner-headless.html  # Headless HTML runner
├── validation-test.html       # Manual validation tests
├── button-test.html           # UI button tests
└── test-buttons-simple.html   # Simple button tests
```

## 🧪 Running Tests

### Automated Headless Tests (Recommended)
Run all tests in headless Chrome using Puppeteer:

```bash
npm test
```

This executes:
- All specs in `test-suite/tests/*.js`
- Core acceptance tests and BDD debugging scenario tests
- Full ATDD/BDD coverage for supported automated scenarios

**Requirements:** Node.js, Puppeteer (already installed via `package.json`)

---

### Browser-Based Tests
Open tests in your default browser (no Puppeteer required):

```bash
npm run test:browser
```

This opens `test-runner.html` on an auto-assigned localhost port where you can:
- See test results in real-time
- Debug failing tests in browser DevTools
- View detailed test output

---

### UI Module Interaction Validation
Run lightweight UI/module interaction checks against the real HTML interface:

```bash
npm run validate:ui
```

---

### Manual App Launch
Launch the full app interface for end-user testing:

```bash
npm start
```

This opens `cost-of-delay-calculator.html` on an auto-assigned localhost port.

---

### Manual Testing
For manual validation, open any of these files directly in a browser:

- **test-runner.html** - Full test suite with Jasmine UI
- **validation-test.html** - Manual validation scenarios
- **button-test.html** - UI button interaction tests

## 📊 Test Coverage

### Test Suites (7)

1. **Reliability Tests**
   - Consistent calculations with identical inputs
   - Edge case handling (zero values, large numbers, decimals)
   - Data integrity across multiple operations

2. **Interoperability Tests**
   - JSON export/import validation
   - CSV compatibility with Excel/Google Sheets
   - Excel file generation

3. **Scalability Tests**
   - Large dataset handling (100+ projects)
   - Efficient sorting (1000+ items)
   - Performance benchmarks

4. **Observability Tests**
   - Calculation history tracking
   - Error logging and reporting
   - Export operation monitoring

5. **Business Logic Tests**
   - Cost of Delay calculations (standard, expedite, fixed date, intangible)
   - Employee cost calculations
   - CD3 (Cost of Delay Divided by Duration) accuracy

6. **UI/UX Tests**
   - Negative value formatting
   - Tooltip interactions
   - Salary type toggles

7. **Integration Tests**
   - Chart.js integration
   - DOM manipulation
   - Event listener attachments

### Test Cases (21)
All test cases follow **ATDD (Acceptance Test-Driven Development)** and **BDD (Behavior-Driven Development)** principles.

## ✅ Expected Results

When all tests pass, you should see:

```
Tests completed.
```

### Performance Benchmarks
- **Calculation Speed:** < 1ms per calculation
- **Large Datasets:** 100 projects processed in < 1000ms
- **Sorting:** 1000 items sorted in < 100ms
- **Data Integrity:** 100% consistency

## 🐛 Debugging Failed Tests

If tests fail:

1. **Check browser console** for JavaScript errors
2. **Run browser tests** for detailed output: `npm run test:browser`
3. **Review test output** in the Jasmine UI
4. **Check** `test-output.txt` for logs

Common issues:
- Missing DOM elements (check HTML structure)
- JavaScript syntax errors (run `node -c ../cost-of-delay-calculator.js`)
- Incorrect calculation logic (review business rules)

## 🔧 Test Configuration

### Test Runner Configuration
- **Port Allocation:** Dynamic (auto-assigned free localhost port)
- **Timeout:** 30 seconds for test completion
- **Browser:** Chrome (via Puppeteer or system default)

### Dependencies
- **Jasmine:** v3.99.0 (test framework)
- **Jasmine Browser Runner:** v4.0.0
- **Puppeteer:** v23.0.0 (headless browser automation)
- **Chart.js:** Latest (via CDN)

## 📝 Writing New Tests

To add new tests, create or edit files in `tests/`:

```javascript
describe('Your Test Suite', () => {
    it('should test specific functionality', () => {
        const result = calculator.yourMethod(params);
        expect(result).toBe(expectedValue);
    });
});
```

Follow these principles:
- **Test-First Design:** Write tests before implementation
- **BDD Style:** Prefer `Given/When/Then` sentence names
- **RISO Principles:** Cover Reliability, Interoperability, Scalability, Observability
- **Standards Checklist:** Follow `ATDD-BDD-STANDARDS.md`

## 🚀 CI/CD Integration

To integrate with CI/CD pipelines:

```bash
# In your CI script
npm install
npm test

# Check exit code
if [ $? -eq 0 ]; then
    echo "All tests passed"
else
    echo "Tests failed"
    exit 1
fi
```

## 📚 Additional Resources

- **Main Application:** `../cost-of-delay-calculator.html`
- **Source Code:** `../cost-of-delay-calculator.js`
- **Styles:** `../cost-of-delay-styles.css`
- **Debug Report:** `../DEBUG-SUMMARY.md`
- **Validation Report:** `../VALIDATION-REPORT.md`

---

**Last Updated:** February 10, 2026  
**Test Framework:** Jasmine 3.99.0  
**Total Test Cases:** 21  
**Test Coverage:** ~100%
