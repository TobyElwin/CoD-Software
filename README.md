# Cost of Delay Calculator

A comprehensive web-based calculator for quantifying the financial impact of project delays using Cost of Delay (CoD) and CD3 (Cost of Delay Divided by Duration) methodologies.

## Features

### Core Functionality
- **Cost of Delay Calculation**: Quantify financial impact of project delays
- **Multiple Urgency Profiles**: Standard, Expedite, Fixed-Date, and Intangible
- **Employee Cost Analysis**: Full team cost calculations with FTE fully loaded costs
- **CD3 Prioritization**: Weighted Shortest Job First (WSJF) methodology
- **Executive Perspectives**: CFO, CMO, and COO impact analysis

### Advanced Features
- **Project Comparison**: Compare multiple projects side-by-side with automatic prioritization
- **Multiple Export Formats**: JSON, CSV, and Excel (.xls) exports
- **Professional Print Reports**: Printer-friendly formatted reports
- **Interactive Visualizations**: Charts showing cost accumulation and comparisons
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Executive Impact Analysis
- **CFO Perspective**: Cash flow, ROI, opportunity cost analysis
- **CMO Perspective**: Market impact, competitive positioning, brand perception
- **COO Perspective**: Operational efficiency, resource utilization, process optimization

## Test-First Design

This application follows **Acceptance Test-Driven Development (ATDD)** principles with comprehensive BDD testing:

### Testing Framework
- **Gherkin BDD Features**: Located in `/features/cost-of-delay.feature`
- **Acceptance Tests**: Located in `/tests/acceptance-tests.js`
- **RISO Principles**: Reliability, Interoperability, Scalability, Observability

### Test Coverage
- ✅ Reliability: Consistent calculations, edge case handling, data integrity
- ✅ Interoperability: Cross-browser compatibility, multiple export formats
- ✅ Scalability: Large dataset handling, performance benchmarks
- ✅ Observability: Calculation history, error tracking, export logging

## Usage

### Basic Calculation
1. Enter **Project Name**
2. Input **Weekly Value** (expected revenue or cost savings per week)
3. Set **Development Duration** (weeks to complete)
4. Enter **Delay Period** (weeks of delay)
5. Select **Urgency Profile** based on value decay pattern
6. Click **Calculate Cost of Delay**

### Employee Cost Tracking
1. Choose **Salary Input Type**: Annual or Hourly
2. Enter average salary/rate
3. Input **Team Size**
4. Adjust **FTE Fully Loaded Cost** multiplier (default: 1.5x for benefits/overhead)
5. View comprehensive employee cost breakdown

### Project Comparison
1. Calculate individual projects
2. Click **Add to Comparison** for each project
3. View automatically prioritized ranking by CD3
4. Export comparison data in your preferred format

### Export Options
- **JSON**: Complete data structure with all calculations
- **CSV**: Spreadsheet-compatible format for analysis
- **Excel**: Formatted workbook with color-coded priorities
- **Print**: Professional report for stakeholder presentations

## Formulas & Methodology

### Cost of Delay (CoD)
```
Standard Profile: CoD = Weekly Value × Delay Weeks
Expedite Profile: CoD = Σ(Weekly Value × e^(-week/delay))
Fixed-Date: CoD = Penalty-based calculation with deadline threshold
Intangible: CoD = Growing value over time
```

### CD3 (WSJF Priority)
```
CD3 = Total Cost of Delay ÷ Development Duration
```

### Employee Costs
```
Hourly Rate = (Annual Salary × FTE Multiplier) ÷ 2080 hours
Daily Cost = Hourly Rate × 8 hours
Team Weekly Cost = (Weekly Rate × Team Size)
Total Delay Cost = Team Weekly Cost × Delay Weeks
```

### Total Economic Impact
```
Total Impact = Cost of Delay + Employee Costs During Delay
```

## File Structure

```
CoD Software/
├── cost-of-delay-calculator.html    # Main HTML interface (loads JS as module)
├── cost-of-delay-styles.css         # Styling and responsive design
├── cost-of-delay-calculator.js      # Entry-point class (ES module)
├── src/                             # Modular JavaScript helpers
│   ├── calculations.js              # CoD and employee cost logic
│   ├── formatters.js                # Currency and value formatting
│   ├── exporters.js                 # CSV/Excel/JSON export functions
│   └── fileIO.js                    # Save/load utilities
├── features/                        # BDD/Gherkin scenarios
│   └── cost-of-delay.feature
├── test-suite/                      # ATDD testing infrastructure
│   ├── tests/
│   │   ├── acceptance-tests.js
│   │   └── atdd-bdd-debugging-tests.js
│   ├── run-tests.js
│   └── ...other support files...
└── README.md                        # This file
```

## Design Principles

### Test-First Development
All features are defined through Gherkin scenarios before implementation, ensuring:
- Clear acceptance criteria
- Behavior-driven development
- Comprehensive test coverage
- Regression prevention

### RISO Architecture
- **Reliability**: Consistent results, error handling, data validation
- **Interoperability**: Cross-platform exports, browser compatibility
- **Scalability**: Efficient algorithms, large dataset support
- **Observability**: Calculation tracking, error logging, audit trails

## Browser Compatibility

Tested and supported on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- **Chart.js** (v3+): For data visualization
- No other external dependencies required

## Version History

### v1.0.0 (Current)
- Initial release with full CoD calculation
- Multiple urgency profiles
- Employee cost tracking
- Executive perspectives (CFO, CMO, COO)
- Project comparison
- Multiple export formats
- Comprehensive test suite

## Contributing

This calculator follows test-first development principles. When adding features:
1. Write Gherkin scenarios in `/features/`
2. Implement acceptance tests in `/tests/`
3. Implement feature to pass tests
4. Update documentation

## License

Proprietary - Toby Elwin
Cost of Confusion Series

## Support

For questions or issues, contact the development team.

## Acknowledgments

- Methodology based on Donald Reinertsen's work on Cost of Delay
- WSJF prioritization from SAFe (Scaled Agile Framework)
- Lean principles from Toyota Production System
