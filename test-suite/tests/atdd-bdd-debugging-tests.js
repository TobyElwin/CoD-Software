/**
 * ATDD/BDD Debugging Standards (Simple)
 *
 * Intent:
 * - Keep core scenarios readable as Given/When/Then.
 * - Validate key behavior paths before manual UI debugging.
 */

describe('ATDD/BDD Debugging Standards - Core Scenarios', () => {
    let calculator;
    const CalculatorClass = typeof CostOfDelayCalculator !== 'undefined'
        ? CostOfDelayCalculator
        : (typeof window !== 'undefined' ? window.CostOfDelayCalculator : null);

    beforeEach(() => {
        if (typeof CalculatorClass !== 'function') {
            throw new Error('CostOfDelayCalculator is not available for BDD debug scenarios.');
        }
        calculator = new CalculatorClass();
    });

    afterEach(() => {
        calculator = null;
    });

    it('Given valid inputs, When standard profile is calculated, Then CD3 and CoD are consistent', () => {
        const result = calculator.calculateCostOfDelay(100000, 10, 4, 'standard');

        expect(result.totalCostOfDelay).toBe(400000);
        expect(result.cd3).toBe(40000);
        expect(result.weeklyLosses.length).toBe(4);
    });

    it('Given invalid urgency profile, When calculateCostOfDelay is called, Then a clear validation error is thrown', () => {
        expect(() => calculator.calculateCostOfDelay(1000, 4, 2, 'invalid-profile'))
            .toThrowError(/Invalid urgency profile/);
    });

    it('Given no team data, When employee costs are calculated, Then employee-cost mode is disabled safely', () => {
        const costs = calculator.calculateEmployeeCosts(0, 0, 1.5, 6, 2);

        expect(costs.hasEmployeeCosts).toBe(false);
    });

    it('Given a completed calculation, When added to comparison, Then comparison view becomes visible', () => {
        calculator.currentResults = calculator.calculateCostOfDelay(75000, 8, 3, 'standard');
        calculator.currentResults.projectName = 'BDD Scenario Project';
        calculator.currentResults.totalDelayCost = 0;

        calculator.addToComparison();

        expect(calculator.comparisonProjects.length).toBe(1);
        expect(document.getElementById('comparisonSection').style.display).toBe('block');
    });
});
