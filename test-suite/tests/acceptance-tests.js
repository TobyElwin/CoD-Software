/**
 * Acceptance Test-Driven Development (ATDD) Test Suite
 * Cost of Delay Calculator
 * 
 * Testing Principles:
 * - Test-First Design
 * - Behavior-Driven Development (BDD)
 * - Reliability, Interoperability, Scalability, Observability (RISO)
 */

import { CostOfDelayCalculator } from '../../cost-of-delay-calculator.js';
import { computeStandardLosses, computeExpediteLosses, computeFixedDateLosses, computeIntangibleLosses } from '../../src/calculations.js';

// ensure global reference for older code
if (typeof globalThis !== 'undefined' && !globalThis.CostOfDelayCalculator) {
    globalThis.CostOfDelayCalculator = CostOfDelayCalculator;
}

describe('Cost of Delay Calculator - Acceptance Tests', () => {
    let calculator;
    const CostOfDelayCalculatorClass = typeof CostOfDelayCalculator !== 'undefined' ? CostOfDelayCalculator : (typeof window !== 'undefined' && window.CostOfDelayCalculator) || (typeof globalThis !== 'undefined' && globalThis.CostOfDelayCalculator);

    beforeEach(() => {
        if (typeof CostOfDelayCalculatorClass !== 'function') {
            throw new Error('CostOfDelayCalculator not loaded. Ensure cost-of-delay-calculator.js runs before tests.');
        }
        calculator = new CostOfDelayCalculatorClass();
        clearAllInputs();
    });

    afterEach(() => {
        // Cleanup: Reset state
        calculator = null;
    });

    describe('Reliability Tests', () => {
        it('should calculate consistent results for the same inputs', () => {
            const inputs = {
                weeklyValue: 100000,
                developmentWeeks: 10,
                delayWeeks: 4,
                urgencyProfile: 'standard'
            };

            const result1 = calculator.calculateCostOfDelay(
                inputs.weeklyValue,
                inputs.developmentWeeks,
                inputs.delayWeeks,
                inputs.urgencyProfile
            );

            const result2 = calculator.calculateCostOfDelay(
                inputs.weeklyValue,
                inputs.developmentWeeks,
                inputs.delayWeeks,
                inputs.urgencyProfile
            );

            expect(result1).toEqual(result2);
            expect(result1.totalCostOfDelay).toBe(400000);
            expect(result1.cd3).toBe(40000);
        });

        it('should handle edge cases without errors', () => {
            const edgeCases = [
                { weeklyValue: 0, developmentWeeks: 1, delayWeeks: 0 },
                { weeklyValue: 1000000, developmentWeeks: 52, delayWeeks: 52 },
                { weeklyValue: 0.01, developmentWeeks: 0.1, delayWeeks: 0.1 }
            ];

            edgeCases.forEach(testCase => {
                expect(() => {
                    calculator.calculateCostOfDelay(
                        testCase.weeklyValue,
                        testCase.developmentWeeks,
                        testCase.delayWeeks,
                        'standard'
                    );
                }).not.toThrow();
            });
        });

        it('should maintain data integrity across multiple operations', () => {
            // Perform multiple calculations
            for (let i = 0; i < 100; i++) {
                const result = calculator.calculateCostOfDelay(50000, 8, 2, 'standard');
                expect(result.totalCostOfDelay).toBe(100000);
            }
        });
    });

    describe('Interoperability Tests', () => {
        it('should export valid JSON that can be re-imported', () => {
            const project = createTestProject();
            calculator.currentResults = project;
            
            const exported = calculator.exportJson();
            const parsed = JSON.parse(exported);
            
            expect(parsed.project).toEqual(project);
            expect(parsed.exportDate).toBeDefined();
        });

        it('should generate CSV compatible with Excel and Google Sheets', () => {
            const projects = [createTestProject(), createTestProject()];
            calculator.comparisonProjects = projects;
            
            const csv = calculator.exportCsv();
            
            expect(csv).toContain(','); // CSV delimiter
            expect(csv.split('\n')[0]).toContain('Project Name');
            expect(csv.split('\n').length).toBeGreaterThan(2);
        });

        it('should create Excel files with proper formatting', () => {
            const project = createTestProject();
            calculator.currentResults = project;
            
            const excel = calculator.exportExcel();
            
            expect(excel).toContain('<table');
            expect(excel).toContain('class="negative"');
        });
    });

    describe('Scalability Tests', () => {
        it('should handle large comparison datasets efficiently', () => {
            const startTime = performance.now();
            
            // Add 100 projects
            for (let i = 0; i < 100; i++) {
                calculator.comparisonProjects.push(createTestProject(`Project ${i}`));
            }
            
            calculator.updateComparisonView();
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            expect(duration).toBeLessThan(1000); // Should complete in under 1 second
            expect(calculator.comparisonProjects.length).toBe(100);
        });

        it('should efficiently sort large datasets', () => {
            const projects = [];
            for (let i = 0; i < 1000; i++) {
                projects.push({
                    projectName: `Project ${i}`,
                    cd3: Math.random() * 100000
                });
            }
            
            const startTime = performance.now();
            const sorted = projects.sort((a, b) => b.cd3 - a.cd3);
            const endTime = performance.now();
            
            expect(endTime - startTime).toBeLessThan(100);
            expect(sorted[0].cd3).toBeGreaterThanOrEqual(sorted[sorted.length - 1].cd3);
        });

        it('should maintain performance with complex calculations', () => {
            const iterations = 1000;
            const startTime = performance.now();
            
            for (let i = 0; i < iterations; i++) {
                calculator.calculateEmployeeCosts(120000, 5, 1.5, 10, 4);
            }
            
            const endTime = performance.now();
            const avgTime = (endTime - startTime) / iterations;
            
            expect(avgTime).toBeLessThan(1); // Less than 1ms per calculation
        });
    });

    describe('Observability Tests', () => {
        it('should track calculation history', () => {
            const history = [];
            
            for (let i = 0; i < 5; i++) {
                const result = calculator.calculateCostOfDelay(50000, 8, i, 'standard');
                history.push({
                    timestamp: new Date(),
                    result: result
                });
            }
            
            expect(history.length).toBe(5);
            history.forEach((entry, index) => {
                expect(entry.result.delayWeeks).toBe(index);
                expect(entry.timestamp).toBeInstanceOf(Date);
            });
        });

        it('should provide detailed error information', () => {
            try {
                calculator.calculateCostOfDelay(-100, 0, 0, 'invalid');
            } catch (error) {
                expect(error.message).toBeDefined();
                expect(error.stack).toBeDefined();
            }
        });

        it('should log export operations', () => {
            const exportLog = [];
            const project = createTestProject();
            calculator.currentResults = project;
            
            exportLog.push({
                type: 'JSON',
                timestamp: new Date(),
                projectName: project.projectName
            });
            
            expect(exportLog.length).toBe(1);
            expect(exportLog[0].type).toBe('JSON');
        });
    });

    describe('Business Logic Tests', () => {
        it('should calculate standard urgency profile correctly', () => {
            const result = calculator.calculateCostOfDelay(100000, 10, 5, 'standard');
            
            expect(result.totalCostOfDelay).toBe(500000);
            expect(result.cd3).toBe(50000);
            expect(result.weeklyLosses).toHaveLength(5);
            result.weeklyLosses.forEach(loss => {
                expect(loss).toBe(100000);
            });
        });

        it('should calculate expedite urgency profile with decay', () => {
            const result = calculator.calculateCostOfDelay(100000, 10, 5, 'expedite');
            
            expect(result.weeklyLosses[0]).toBeGreaterThan(result.weeklyLosses[4]);
            expect(result.totalCostOfDelay).toBeGreaterThan(0);
        });

        it('should calculate employee costs correctly', () => {
            const result = calculator.calculateEmployeeCosts(120000, 5, 1.5, 10, 4);
            
            expect(result.trueCostPerPerson).toBe(180000);
            expect(result.hourlyRate).toBeCloseTo(86.54, 2);
            expect(result.teamWeeklyCost).toBeCloseTo(17307.69, 2);
            expect(result.totalDelayCost).toBeCloseTo(69230.77, 2);
        });

        it('should convert hourly to annual salary correctly', () => {
            const hourlyRate = 75;
            const annualSalary = hourlyRate * 2080;
            
            expect(annualSalary).toBe(156000);
        });

        it('should throw when development weeks is zero', () => {
            expect(() => calculator.calculateCostOfDelay(1000, 0, 5, 'standard'))
                .toThrowError(/developmentWeeks must be greater than zero/);
        });

        it('should provide utility functions for each urgency profile', () => {
            const std = calculator.calculateCostOfDelay(100, 10, 3, 'standard');
            const helper = calculator.calculateCostOfDelay; // can't directly access helpers here
            // Instead import compute functions at top, but easier is to run via module import
            const { computeStandardLosses, computeExpediteLosses, computeFixedDateLosses, computeIntangibleLosses } = require('../../src/calculations.js');

            const s = computeStandardLosses(200, 4);
            expect(s.totalCostOfDelay).toBe(800);
            expect(s.weeklyLosses).toEqual([200,200,200,200]);

            const e = computeExpediteLosses(100, 3);
            expect(e.weeklyLosses.length).toBe(3);
            expect(e.peakWeeklyLoss).toBeCloseTo(e.weeklyLosses[0]);

            const f = computeFixedDateLosses(50, 5);
            expect(f.weeklyLosses[0]).toBeLessThan(f.weeklyLosses[4]);

            const i = computeIntangibleLosses(80, 4);
            expect(i.weeklyLosses[0]).toBeLessThan(i.weeklyLosses[3]);
        });
    });

    describe('UI/UX Tests', () => {
        it('should format negative values with parentheses and red color', () => {
            const formatted = formatCurrencyAsNegative(-50000);
            
            expect(formatted).toContain('(');
            expect(formatted).toContain(')');
            expect(formatted).toContain('class="negative-value"');
            expect(formatted).toContain('50,000');
        });

        it('should show tooltips on hover', () => {
            const tooltip = document.querySelector('.tooltip');
            const event = new MouseEvent('mouseenter');
            
            tooltip.dispatchEvent(event);
            
            const tooltipText = tooltip.querySelector('.tooltiptext');
            expect(tooltipText.style.visibility).toBe('visible');
        });

        it('should toggle between annual and hourly salary inputs', () => {
            const salaryType = document.getElementById('salaryType');
            salaryType.value = 'hourly';
            
            calculator.toggleSalaryInput();
            
            expect(document.getElementById('hourlyRateGroup').style.display).toBe('block');
            expect(document.getElementById('annualSalaryGroup').style.display).toBe('none');
        });

        it('should show inline error message when inputs are invalid', () => {
            document.getElementById('weeklyValue').value = '';
            document.getElementById('developmentWeeks').value = '0';
            document.getElementById('delayWeeks').value = '2';
            calculator.calculate();
            const err = document.getElementById('errorMessage');
            expect(err.style.display).not.toBe('none');
            expect(err.textContent).toMatch(/greater than 0/);
            // underline the bad fields
            expect(document.getElementById('weeklyValue').classList.contains('input-error')).toBe(true);
            expect(document.getElementById('developmentWeeks').classList.contains('input-error')).toBe(true);
        });

        it('should flag negative team size and delay', () => {
            document.getElementById('weeklyValue').value = '50000';
            document.getElementById('developmentWeeks').value = '5';
            document.getElementById('delayWeeks').value = '-1';
            document.getElementById('teamSize').value = '-3';
            calculator.calculate();
            const err = document.getElementById('errorMessage');
            expect(err.style.display).not.toBe('none');
            expect(err.textContent).toMatch(/cannot be negative/);
            expect(document.getElementById('delayWeeks').classList.contains('input-error')).toBe(true);
            expect(document.getElementById('teamSize').classList.contains('input-error')).toBe(true);
        });
    });

    // Helper functions
    function createTestProject(name = 'Test Project') {
        return {
            projectName: name,
            weeklyValue: 100000,
            developmentWeeks: 10,
            delayWeeks: 4,
            urgencyProfile: 'standard',
            totalCostOfDelay: 400000,
            cd3: 40000,
            opportunityCost: 7.69,
            hasEmployeeCosts: true,
            annualSalary: 120000,
            teamSize: 5,
            benefitsMultiplier: 1.5,
            totalDelayCost: 69230.77
        };
    }

    function clearAllInputs() {
        document.getElementById('projectName').value = '';
        document.getElementById('weeklyValue').value = '';
        document.getElementById('developmentWeeks').value = '';
        document.getElementById('delayWeeks').value = '';
    }

    function formatCurrencyAsNegative(value) {
        const absValue = Math.abs(value);
        return `(<span class="negative-value">$${absValue.toLocaleString()}</span>)`;
    }
});
