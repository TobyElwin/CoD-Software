// Cost of Delay Calculator - JavaScript Logic

class CostOfDelayCalculator {
    constructor() {
        console.log('📊 Constructing CostOfDelayCalculator...');
        this.chart = null;
        this.comparisonChart = null;
        this.currentResults = null;
        this.comparisonProjects = [];
        this.comparisonSelections = new Set(); // runtime-only selection of projects for comparison
        this.visualsBuilt = false;
        console.log('🔧 Initializing event listeners...');
        try {
            this.initializeEventListeners();
            console.log('✅ Constructor complete');
        } catch (error) {
            console.error('❌ Error in constructor:', error);
            throw error;
        }
    }

    initializeEventListeners() {
        // Primary calculate button
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculate());
            console.log('✅ Calculate button listener attached');
        } else {
            console.error('❌ Calculate button not found');
        }

        // Add comparison button
        const addToComparisonBtn = document.getElementById('addToComparisonBtn');
        if (addToComparisonBtn) {
            addToComparisonBtn.addEventListener('click', () => this.addToComparison());
            console.log('✅ Add to Comparison button listener attached');
        } else {
            console.error('❌ Add to Comparison button not found');
        }

        // Export buttons
        const exportJsonBtn = document.getElementById('exportJsonBtn');
        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportJson();
            });
            console.log('✅ Export JSON button listener attached');
        } else {
            console.error('❌ Export JSON button not found');
        }

        const exportCsvBtn = document.getElementById('exportCsvBtn');
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportCsv();
            });
            console.log('✅ Export CSV button listener attached');
        } else {
            console.error('❌ Export CSV button not found');
        }

        // Export combined executive analysis
        const exportExecutiveBtn = document.getElementById('exportExecutiveBtn');
        if (exportExecutiveBtn) {
            exportExecutiveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportExecutiveAnalysis();
            });
            console.log('✅ Export Combined (Executive) button listener attached');
        } else {
            console.error('❌ Export Combined (Executive) button not found');
        }

        const exportExcelBtn = document.getElementById('exportExcelBtn');
        if (exportExcelBtn) {
            exportExcelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportExcel();
            });
            console.log('✅ Export Excel button listener attached');
        } else {
            console.error('❌ Export Excel button not found');
        }

        const generateImagesBtn = document.getElementById('generateImagesBtn');
        if (generateImagesBtn) {
            generateImagesBtn.addEventListener('click', () => this.generateImages());
            console.log('✅ Generate Images button listener attached');
        } else {
            console.error('❌ Generate Images button not found');
        }

        const saveAsBtn = document.getElementById('saveAsBtn');
        if (saveAsBtn) {
            saveAsBtn.addEventListener('click', () => this.saveAs());
            console.log('✅ Save As button listener attached');
        } else {
            console.error('❌ Save As button not found');
        }

        const loadFromFileBtn = document.getElementById('loadFromFileBtn');
        if (loadFromFileBtn) {
            loadFromFileBtn.addEventListener('click', () => this.loadFromFile());
            console.log('✅ Load From File button listener attached');
        } else {
            console.error('❌ Load From File button not found');
        }

        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileLoad(e));
            console.log('✅ File input listener attached');
        } else {
            console.error('❌ File input not found');
        }

        const clearComparisonBtn = document.getElementById('clearComparisonBtn');
        if (clearComparisonBtn) {
            clearComparisonBtn.addEventListener('click', () => this.clearComparison());
            console.log('✅ Clear Comparison button listener attached');
        } else {
            console.error('❌ Clear Comparison button not found');
        }

        // Add executive tab switching
        const executiveTabs = document.querySelectorAll('.executive-tab');
        if (executiveTabs.length > 0) {
            executiveTabs.forEach(tab => {
                tab.addEventListener('click', (e) => this.switchExecutiveTab(e.target.dataset.tab));
            });
            console.log(`✅ ${executiveTabs.length} Executive tab listeners attached`);
        }

        // Build Visuals button (user-triggered chart generation)
        const buildVisualsBtn = document.getElementById('buildVisualsBtn');
        if (buildVisualsBtn) {
            buildVisualsBtn.addEventListener('click', () => this.buildVisuals());
            console.log('✅ Build Visuals button listener attached');
        }

        // Add salary type toggle
        const salaryType = document.getElementById('salaryType');
        if (salaryType) {
            salaryType.addEventListener('change', () => this.toggleSalaryInput());
            console.log('✅ Salary type toggle listener attached');
        }

        // Add date field auto-formatting
        const targetLaunchDate = document.getElementById('targetLaunchDate');
        if (targetLaunchDate) {
            targetLaunchDate.addEventListener('input', (e) => this.formatDateInput(e));
            console.log('✅ Target date formatter attached');
        }

        const revisedLaunchDate = document.getElementById('revisedLaunchDate');
        if (revisedLaunchDate) {
            revisedLaunchDate.addEventListener('input', (e) => this.formatDateInput(e));
            console.log('✅ Revised date formatter attached');
        }

        // Add enter key support for inputs
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.calculate();
                }
            });
        });
        console.log(`✅ Enter key support added to ${inputs.length} inputs`);

        // Tooltip visibility (JS so tests and a11y can assert)
        document.querySelectorAll('.tooltip').forEach((el) => {
            const tip = el.querySelector('.tooltiptext');
            if (!tip) return;
            el.addEventListener('mouseenter', () => { tip.style.visibility = 'visible'; });
            el.addEventListener('mouseleave', () => { tip.style.visibility = 'hidden'; });
        });

        // Log initialization complete
        console.log('🎉 All event listeners initialized successfully');
    }

    toggleSalaryInput() {
        const salaryType = document.getElementById('salaryType').value;
        const annualGroup = document.getElementById('annualSalaryGroup');
        const hourlyGroup = document.getElementById('hourlyRateGroup');

        if (salaryType === 'annual') {
            annualGroup.style.display = 'block';
            hourlyGroup.style.display = 'none';
        } else {
            annualGroup.style.display = 'none';
            hourlyGroup.style.display = 'block';
        }
    }

    formatDateInput(event) {
        let input = event.target.value.replace(/\D/g, ''); // Remove non-digits
        
        if (input.length > 0) {
            // Format as MM-DD-YYYY
            if (input.length <= 2) {
                event.target.value = input;
            } else if (input.length <= 4) {
                event.target.value = input.slice(0, 2) + '-' + input.slice(2);
            } else {
                event.target.value = input.slice(0, 2) + '-' + input.slice(2, 4) + '-' + input.slice(4, 8);
            }
        }
    }

    calculate() {
        // Get input values
        const projectName = document.getElementById('projectName').value || 'Unnamed Project';
        const weeklyValue = parseFloat(document.getElementById('weeklyValue').value) || 0;
        const developmentWeeks = parseFloat(document.getElementById('developmentWeeks').value) || 0;
        const delayWeeks = parseFloat(document.getElementById('delayWeeks').value) || 0;
        const urgencyProfile = document.getElementById('urgencyProfile').value;
        
        // Get optional date fields
        const targetLaunchDate = document.getElementById('targetLaunchDate').value || null;
        const revisedLaunchDate = document.getElementById('revisedLaunchDate').value || null;
        
        // Get employee cost parameters
        const salaryType = document.getElementById('salaryType').value;
        let annualSalary = 0;
        
        if (salaryType === 'annual') {
            annualSalary = parseFloat(document.getElementById('annualSalary').value) || 0;
        } else {
            // Convert hourly to annual (2080 hours per year)
            const hourlyRate = parseFloat(document.getElementById('hourlyRate').value) || 0;
            annualSalary = hourlyRate * 2080;
        }
        
        const teamSize = parseFloat(document.getElementById('teamSize').value) || 0;
        const benefitsMultiplier = parseFloat(document.getElementById('benefitsMultiplier').value) || 1.5;

        // Validate inputs
        if (weeklyValue <= 0 || developmentWeeks <= 0) {
            alert('Please enter valid values for Weekly Value and Development Duration');
            return;
        }

        // Calculate employee costs
        const employeeCosts = this.calculateEmployeeCosts(
            annualSalary,
            teamSize,
            benefitsMultiplier,
            developmentWeeks,
            delayWeeks
        );

        // Calculate Cost of Delay metrics
        const results = this.calculateCostOfDelay(
            weeklyValue,
            developmentWeeks,
            delayWeeks,
            urgencyProfile
        );

        // Combine results with employee costs
        const combinedResults = {
            ...results,
            ...employeeCosts,
            projectName,
            targetLaunchDate,
            revisedLaunchDate
        };

        // Store current results
        this.currentResults = combinedResults;

        // Display results
        this.displayResults(projectName, combinedResults);
        
        // Create visualization only if visuals have been requested by the user
        if (this.visualsBuilt) {
            this.createChart(combinedResults);
        } else {
            const buildBtn = document.getElementById('buildVisualsBtn');
            if (buildBtn) buildBtn.style.display = 'inline-block';
        }

        // Show action buttons and output note
        const estActionsEl = document.getElementById('estimateActions');
        if (estActionsEl) estActionsEl.style.display = 'flex';
        const headerActionsEl = document.getElementById('headerActions');
        if (headerActionsEl) headerActionsEl.style.display = 'flex';
        const outputNoteEl = document.getElementById('outputNote');
        if (outputNoteEl) outputNoteEl.style.display = 'block';

        // Update quick stats
        this.updateQuickStats(combinedResults);
    }

    updateQuickStats(results) {
        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(Math.abs(value));
        };

        const totalImpact = results.totalCostOfDelay + (results.totalDelayCost || 0);

        document.getElementById('quickCod').innerHTML = `<span class="negative-value">${formatCurrency(results.totalCostOfDelay)}</span>`;
        document.getElementById('quickCd3').textContent = formatCurrency(results.cd3) + '/wk';
        document.getElementById('quickImpact').innerHTML = `<span class="negative-value">${formatCurrency(totalImpact)}</span>`;
        
        document.getElementById('quickStats').style.display = 'block';
    }

    buildVisuals() {
        this.visualsBuilt = true;
        const buildBtn = document.getElementById('buildVisualsBtn');
        if (buildBtn) buildBtn.style.display = 'none';

        if (this.currentResults) {
            try { this.createChart(this.currentResults); } catch (e) { console.error('Error creating delay chart:', e); }
        }

        if (this.comparisonProjects && this.comparisonProjects.length > 0) {
            try { this.createComparisonChart([...this.comparisonProjects].sort((a,b)=>b.cd3-a.cd3)); } catch (e) { console.error('Error creating comparison chart:', e); }
        }
    }

    saveAs() {
        if (!this.currentResults) {
            alert('Please calculate a project first');
            return;
        }

        // Prompt for filename
        const defaultFilename = `cod-${this.currentResults.projectName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}`;
        const filename = prompt('Enter filename (without extension):', defaultFilename);
        
        if (!filename) return; // User cancelled

        // Create comprehensive save data
        const saveData = {
            savedDate: new Date().toISOString(),
            projectData: this.currentResults,
            inputs: {
                projectName: document.getElementById('projectName').value,
                weeklyValue: document.getElementById('weeklyValue').value,
                developmentWeeks: document.getElementById('developmentWeeks').value,
                delayWeeks: document.getElementById('delayWeeks').value,
                urgencyProfile: document.getElementById('urgencyProfile').value,
                targetLaunchDate: document.getElementById('targetLaunchDate').value,
                revisedLaunchDate: document.getElementById('revisedLaunchDate').value,
                salaryType: document.getElementById('salaryType').value,
                annualSalary: document.getElementById('annualSalary').value,
                hourlyRate: document.getElementById('hourlyRate').value,
                teamSize: document.getElementById('teamSize').value,
                benefitsMultiplier: document.getElementById('benefitsMultiplier').value
            },
            comparisonProjects: this.comparisonProjects
        };

        // Save as JSON
        const jsonStr = JSON.stringify(saveData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert(`✅ Saved as ${filename}.json\n\n📁 Complete state saved including:\n• All input values\n• Calculation results\n• Comparison projects\n• Timestamps\n\nYou can load this file later using the "Load From File" button.`);
    }

    loadFromFile() {
        document.getElementById('fileInput').click();
    }

    handleFileLoad(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Validate data structure
                if (!data.inputs || !data.projectData) {
                    alert('Invalid file format. Please select a valid Cost of Delay save file.');
                    return;
                }

                // Restore all input fields
                document.getElementById('projectName').value = data.inputs.projectName || '';
                document.getElementById('weeklyValue').value = data.inputs.weeklyValue || '';
                document.getElementById('developmentWeeks').value = data.inputs.developmentWeeks || '';
                document.getElementById('delayWeeks').value = data.inputs.delayWeeks || '';
                document.getElementById('urgencyProfile').value = data.inputs.urgencyProfile || 'standard';
                document.getElementById('targetLaunchDate').value = data.inputs.targetLaunchDate || '';
                document.getElementById('revisedLaunchDate').value = data.inputs.revisedLaunchDate || '';
                document.getElementById('salaryType').value = data.inputs.salaryType || 'annual';
                document.getElementById('annualSalary').value = data.inputs.annualSalary || '';
                document.getElementById('hourlyRate').value = data.inputs.hourlyRate || '';
                document.getElementById('teamSize').value = data.inputs.teamSize || '';
                document.getElementById('benefitsMultiplier').value = data.inputs.benefitsMultiplier || 1.5;

                // Toggle salary input visibility
                this.toggleSalaryInput();

                // Restore comparison projects if any
                if (data.comparisonProjects && data.comparisonProjects.length > 0) {
                    this.comparisonProjects = data.comparisonProjects;
                    this.updateComparisonView();
                }

                // Auto-calculate to restore results
                this.calculate();

                const savedDate = new Date(data.savedDate).toLocaleString();
                alert(`✅ File loaded successfully!\n\n📅 Saved: ${savedDate}\n📊 Project: ${data.inputs.projectName}\n\nAll inputs and calculations have been restored.`);

            } catch (error) {
                alert('❌ Error loading file. Please ensure it is a valid Cost of Delay save file.\n\nError: ' + error.message);
            }
        };

        reader.readAsText(file);
        
        // Reset file input so the same file can be loaded again if needed
        event.target.value = '';
    }

    calculateEmployeeCosts(annualSalary, teamSize, benefitsMultiplier, developmentWeeks, delayWeeks) {
        if (annualSalary <= 0 || teamSize <= 0) {
            return {
                hasEmployeeCosts: false
            };
        }

        // Calculate true cost with benefits
        const trueCostPerPerson = annualSalary * benefitsMultiplier;
        
        // Calculate various time-based costs
        const hourlyRate = trueCostPerPerson / 2080; // Standard 2080 work hours per year
        const dailyRate = hourlyRate * 8; // 8-hour workday
        const weeklyRate = trueCostPerPerson / 52; // 52 weeks per year
        
        // Calculate team costs
        const teamDailyCost = dailyRate * teamSize;
        const teamWeeklyCost = weeklyRate * teamSize;
        
        // Calculate project costs
        const totalDevelopmentCost = teamWeeklyCost * developmentWeeks;
        const totalDelayCost = teamWeeklyCost * delayWeeks;
        const totalProjectCost = totalDevelopmentCost + totalDelayCost;
        
        // Calculate cost per week of delay
        const costPerWeekDelay = teamWeeklyCost;

        return {
            hasEmployeeCosts: true,
            annualSalary,
            teamSize,
            benefitsMultiplier,
            trueCostPerPerson,
            hourlyRate,
            dailyRate,
            weeklyRate,
            teamDailyCost,
            teamWeeklyCost,
            totalDevelopmentCost,
            totalDelayCost,
            totalProjectCost,
            costPerWeekDelay
        };
    }

    calculateCostOfDelay(weeklyValue, developmentWeeks, delayWeeks, urgencyProfile) {
        const validProfiles = ['standard', 'expedite', 'fixed-date', 'intangible'];
        if (typeof urgencyProfile !== 'string' || !validProfiles.includes(urgencyProfile)) {
            throw new Error('Invalid urgency profile: "' + urgencyProfile + '". Must be one of: ' + validProfiles.join(', '));
        }
        if (Number(weeklyValue) < 0 || Number(developmentWeeks) < 0 || Number(delayWeeks) < 0) {
            throw new Error('weeklyValue, developmentWeeks, and delayWeeks must be non-negative');
        }
        let totalCostOfDelay = 0;
        let peakWeeklyLoss = 0;
        let weeklyLosses = [];

        // Calculate based on urgency profile
        switch (urgencyProfile) {
            case 'standard':
                // Linear - consistent value per week
                totalCostOfDelay = weeklyValue * delayWeeks;
                peakWeeklyLoss = weeklyValue;
                for (let i = 0; i < delayWeeks; i++) {
                    weeklyLosses.push(weeklyValue);
                }
                break;

            case 'expedite':
                // High urgency - exponential decay (higher cost early)
                for (let i = 0; i < delayWeeks; i++) {
                    const weeklyLoss = weeklyValue * Math.exp(-i / (delayWeeks || 1) * 0.5);
                    weeklyLosses.push(weeklyLoss);
                    totalCostOfDelay += weeklyLoss;
                }
                peakWeeklyLoss = weeklyLosses[0] || 0;
                break;

            case 'fixed-date':
                // Fixed deadline - all value lost after certain point
                const deadlineWeek = Math.floor(delayWeeks * 0.7); // 70% through is deadline
                for (let i = 0; i < delayWeeks; i++) {
                    if (i < deadlineWeek) {
                        weeklyLosses.push(weeklyValue * 0.5); // Reduced value but still some
                    } else {
                        weeklyLosses.push(weeklyValue * 2); // Double penalty after deadline
                    }
                    totalCostOfDelay += weeklyLosses[i];
                }
                peakWeeklyLoss = weeklyValue * 2;
                break;

            case 'intangible':
                // Low urgency - value grows over time
                for (let i = 0; i < delayWeeks; i++) {
                    const weeklyLoss = weeklyValue * (0.3 + (i / delayWeeks) * 0.7);
                    weeklyLosses.push(weeklyLoss);
                    totalCostOfDelay += weeklyLoss;
                }
                peakWeeklyLoss = weeklyLosses[weeklyLosses.length - 1] || 0;
                break;
        }

        // Calculate CD3 (Cost of Delay Divided by Duration)
        const cd3 = totalCostOfDelay / developmentWeeks;

        // Calculate opportunity cost
        const totalProjectValue = weeklyValue * 52; // Annualized
        const opportunityCost = (totalCostOfDelay / totalProjectValue) * 100;

        // Calculate payback period impact
        const normalPaybackWeeks = developmentWeeks;
        const delayedPaybackWeeks = developmentWeeks + delayWeeks;
        const additionalPaybackTime = delayWeeks;

        return {
            totalCostOfDelay,
            cd3,
            peakWeeklyLoss,
            weeklyLosses,
            opportunityCost,
            weeklyValue,
            developmentWeeks,
            delayWeeks,
            urgencyProfile,
            normalPaybackWeeks,
            delayedPaybackWeeks,
            additionalPaybackTime,
            totalProjectValue
        };
    }

    displayResults(projectName, results) {
        const resultsDiv = document.getElementById('results');
        const cdppSection = document.getElementById('cdppSection');
        const employeeCostSection = document.getElementById('employeeCostSection');

        // Format currency - negative values in parentheses and red
        const formatCurrency = (value) => {
            const absValue = Math.abs(value);
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(absValue);
            
            if (value < 0) {
                return `<span class="negative-value">${formatted}</span>`;
            }
            return formatted;
        };

        // Format currency with decimals for hourly rates
        const formatCurrencyDetailed = (value) => {
            const absValue = Math.abs(value);
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(absValue);
            
            if (value < 0) {
                return `<span class="negative-value">${formatted}</span>`;
            }
            return formatted;
        };

        // Calculate total economic impact if employee costs are available
        let totalEconomicImpact = results.totalCostOfDelay;
        if (results.hasEmployeeCosts) {
            totalEconomicImpact = results.totalCostOfDelay + results.totalDelayCost;
        }

        // Create results HTML
        resultsDiv.innerHTML = `
            <div class="metric">
                <div class="metric-label">Total Cost of Delay</div>
                <div class="metric-value danger">${formatCurrency(results.totalCostOfDelay)}</div>
                <div class="metric-description">
                    Lost revenue/savings from ${results.delayWeeks} week${results.delayWeeks !== 1 ? 's' : ''} delay
                </div>
            </div>

            ${results.hasEmployeeCosts ? `
            <div class="metric">
                <div class="metric-label">Employee Cost During Delay</div>
                <div class="metric-value danger">${formatCurrency(results.totalDelayCost)}</div>
                <div class="metric-description">
                    Team cost for ${results.teamSize} person${results.teamSize !== 1 ? 's' : ''} during delay period
                </div>
            </div>

            <div class="metric">
                <div class="metric-label">Total Economic Impact</div>
                <div class="metric-value danger">${formatCurrency(totalEconomicImpact)}</div>
                <div class="metric-description">
                    Combined opportunity cost + employee cost
                </div>
            </div>
            ` : `
            <div class="metric">
                <div class="metric-label">Peak Weekly Loss</div>
                <div class="metric-value warning">${formatCurrency(results.peakWeeklyLoss)}</div>
                <div class="metric-description">
                    Maximum value lost in a single week
                </div>
            </div>
            `}

            <div class="metric">
                <div class="metric-label">Opportunity Cost</div>
                <div class="metric-value ${results.opportunityCost > 50 ? 'danger' : 'warning'}">
                    ${results.opportunityCost.toFixed(1)}%
                </div>
                <div class="metric-description">
                    Percentage of annual project value lost to delay
                </div>
            </div>

            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-item-label">Weekly Value</div>
                    <div class="summary-item-value">${formatCurrency(results.weeklyValue)}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-item-label">Development Time</div>
                    <div class="summary-item-value">${results.developmentWeeks}w</div>
                </div>
                <div class="summary-item">
                    <div class="summary-item-label">Delay Period</div>
                    <div class="summary-item-value">${results.delayWeeks}w</div>
                </div>
                <div class="summary-item">
                    <div class="summary-item-label">Urgency Type</div>
                    <div class="summary-item-value" style="font-size: 1rem; text-transform: capitalize;">
                        ${results.urgencyProfile.replace('-', ' ')}
                    </div>
                </div>
                ${results.targetLaunchDate ? `
                <div class="summary-item">
                    <div class="summary-item-label">Target Launch</div>
                    <div class="summary-item-value" style="font-size: 0.95rem;">
                        ${results.targetLaunchDate}
                    </div>
                </div>
                ` : ''}
                ${results.revisedLaunchDate ? `
                <div class="summary-item">
                    <div class="summary-item-label">Revised Launch</div>
                    <div class="summary-item-value" style="font-size: 0.95rem;">
                        ${results.revisedLaunchDate}
                    </div>
                </div>
                ` : ''}
            </div>
        `;

        // Show and update CD3 section
        cdppSection.style.display = 'block';
        cdppSection.querySelector('.cdpp-value').textContent = formatCurrency(results.cd3) + ' / week';

        // Show and update employee cost section if applicable
        if (results.hasEmployeeCosts) {
            employeeCostSection.style.display = 'block';
            
            const employeeMetricsDiv = employeeCostSection.querySelector('.employee-metrics');
            employeeMetricsDiv.innerHTML = `
                <div class="employee-metric-item">
                    <div class="employee-metric-label">Base Annual Salary</div>
                    <div class="employee-metric-value">${formatCurrency(results.annualSalary)}</div>
                </div>
                <div class="employee-metric-item">
                    <div class="employee-metric-label">True Annual Cost</div>
                    <div class="employee-metric-value">${formatCurrency(results.trueCostPerPerson)}</div>
                    <small style="font-size: 0.7rem; color: #64748b;">Salary × ${results.benefitsMultiplier}x benefits</small>
                </div>
                <div class="employee-metric-item">
                    <div class="employee-metric-label">Hourly Rate</div>
                    <div class="employee-metric-value">${formatCurrencyDetailed(results.hourlyRate)}/hr</div>
                    <small style="font-size: 0.7rem; color: #64748b;">Based on 2,080 hrs/year</small>
                </div>
                <div class="employee-metric-item">
                    <div class="employee-metric-label">Daily Cost</div>
                    <div class="employee-metric-value">${formatCurrency(results.dailyRate)}</div>
                    <small style="font-size: 0.7rem; color: #64748b;">Per person (8 hrs)</small>
                </div>
                <div class="employee-metric-item">
                    <div class="employee-metric-label">Weekly Cost</div>
                    <div class="employee-metric-value">${formatCurrency(results.weeklyRate)}</div>
                    <small style="font-size: 0.7rem; color: #64748b;">Per person</small>
                </div>
                <div class="employee-metric-item">
                    <div class="employee-metric-label">Team Daily Burn</div>
                    <div class="employee-metric-value">${formatCurrency(results.teamDailyCost)}</div>
                    <small style="font-size: 0.7rem; color: #64748b;">${results.teamSize} × daily cost</small>
                </div>
                <div class="employee-metric-item">
                    <div class="employee-metric-label">Team Weekly Burn</div>
                    <div class="employee-metric-value">${formatCurrency(results.teamWeeklyCost)}</div>
                    <small style="font-size: 0.7rem; color: #64748b;">${results.teamSize} people</small>
                </div>
                <div class="employee-metric-item">
                    <div class="employee-metric-label">Development Cost</div>
                    <div class="employee-metric-value">${formatCurrency(results.totalDevelopmentCost)}</div>
                    <small style="font-size: 0.7rem; color: #64748b;">${results.developmentWeeks} weeks × team</small>
                </div>
                <div class="employee-metric-item">
                    <div class="employee-metric-label">Total Project Cost</div>
                    <div class="employee-metric-value">${formatCurrency(results.totalProjectCost)}</div>
                    <small style="font-size: 0.7rem; color: #64748b;">Dev + Delay costs</small>
                </div>
            `;
        } else {
            employeeCostSection.style.display = 'none';
        }

        // Generate and display executive perspectives
        this.generateExecutivePerspectives(results);
        // Also populate the integrated Overview card
        try { this.generateOverview(results); } catch (e) { console.error('Error generating overview:', e); }
    }

    generateExecutivePerspectives(results) {
        const perspectivesSection = document.getElementById('executivePerspectives');
        perspectivesSection.style.display = 'block';

        const formatCurrency = (value) => {
            const absValue = Math.abs(value);
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(absValue);
        };

        const totalImpact = results.totalCostOfDelay + (results.totalDelayCost || 0);
        const delayMonths = (results.delayWeeks / 4.33).toFixed(1);

        // CEO Perspective
        const ceoAnalysis = document.getElementById('ceo-analysis');
        if (ceoAnalysis) {
            ceoAnalysis.innerHTML = `
            <div class="impact-highlight">
                <strong>Executive Summary:</strong>
                <p>${results.projectName} has an estimated total economic impact of ${formatCurrency(totalImpact)} due to a ${results.delayWeeks}-week delay.</p>
            </div>
            <h4>Strategic Implications</h4>
            <p>The delay affects top-line growth and market timing. Each week recovered returns ${formatCurrency(results.weeklyValue)} in potential value.</p>
            <div class="recommendation-box">
                <strong>CEO Recommendation:</strong>
                <p>Evaluate this initiative relative to portfolio CD3 values; accelerate or remove blockers for high-impact items.</p>
            </div>
            `;
        }

        // CTO Perspective
        const ctoAnalysis = document.getElementById('cto-analysis');
        if (ctoAnalysis) {
            ctoAnalysis.innerHTML = `
            <div class="impact-highlight">
                <strong>Technology & Delivery Impact:</strong>
                <p>Delay of ${results.delayWeeks} weeks increases technical risk and may compound technical debt if rushed.</p>
            </div>
            <h4>Engineering Considerations</h4>
            <ul>
                <li>Assess critical-path dependencies and technical blockers.</li>
                <li>Consider scope reduction or parallelization to shorten delivery.</li>
                <li>Protect quality — avoid rushed work that increases rework.</li>
            </ul>
            <div class="recommendation-box">
                <strong>CTO Recommendation:</strong>
                <p>Prioritize technical impediments and enable the team with clear decisions and required resources.</p>
            </div>
            `;
        }

        // CFO Perspective
        const cfoAnalysis = document.getElementById('cfo-analysis');
        cfoAnalysis.innerHTML = `
            <div class="impact-highlight">
                <strong>Financial Impact Summary:</strong>
                <p>This ${results.delayWeeks}-week delay represents a total economic impact of ${formatCurrency(totalImpact)}, 
                comprising ${formatCurrency(results.totalCostOfDelay)} in lost revenue/savings and 
                ${results.hasEmployeeCosts ? formatCurrency(results.totalDelayCost) + ' in continued employee costs' : 'additional employee costs not calculated'}.</p>
            </div>

            <h4>Cash Flow Implications</h4>
            <p>The delay of ${delayMonths} months postpones revenue recognition and extends the payback period for this investment. 
            At a weekly value of ${formatCurrency(results.weeklyValue)}, each additional week of delay costs the organization 
            ${formatCurrency(results.weeklyValue)} in unrealized value.</p>

            <h4>Opportunity Cost Analysis</h4>
            <ul>
                <li><strong>Direct Cost of Delay:</strong> ${formatCurrency(results.totalCostOfDelay)} in foregone revenue or cost savings</li>
                <li><strong>Annual Impact Ratio:</strong> ${results.opportunityCost.toFixed(1)}% of projected annual value lost to this delay</li>
                <li><strong>Cost Per Week:</strong> ${formatCurrency(results.cd3)} average weekly economic impact (CD3)</li>
                ${results.hasEmployeeCosts ? `<li><strong>Team Burn Rate:</strong> ${formatCurrency(results.teamWeeklyCost)} per week in employee costs during delay</li>` : ''}
            </ul>

            <h4>ROI Impact</h4>
            <p>The ${results.developmentWeeks}-week development timeline requires an investment of 
            ${results.hasEmployeeCosts ? formatCurrency(results.totalDevelopmentCost) : '[calculated when team size provided]'}. 
            The delay extends time-to-value by ${results.delayWeeks} weeks, reducing effective ROI and increasing the project's 
            total cost by ${results.hasEmployeeCosts ? formatCurrency(results.totalDelayCost) : 'the cost of continued resource allocation'}.</p>

            <div class="recommendation-box">
                <strong>CFO Recommendation:</strong>
                <p>Prioritize this initiative based on its CD3 value of ${formatCurrency(results.cd3)} per week. 
                Consider reallocating resources to eliminate bottlenecks. Every week saved recovers ${formatCurrency(results.weeklyValue)} 
                in value and reduces the total project cost. ${results.cd3 > 50000 ? 'This high CD3 indicates this should be a portfolio priority.' : 
                'Compare this CD3 to other initiatives to optimize portfolio allocation.'}</p>
            </div>
        `;

        // CMO Perspective
        const cmoAnalysis = document.getElementById('cmo-analysis');
        cmoAnalysis.innerHTML = `
            <div class="impact-highlight">
                <strong>Market & Brand Impact:</strong>
                <p>A ${results.delayWeeks}-week delay in delivering "${results.projectName}" creates significant competitive vulnerability. 
                The market opportunity window is closing at a rate of ${formatCurrency(results.weeklyValue)} per week in potential value.</p>
            </div>

            <h4>Competitive Positioning Risks</h4>
            <ul>
                <li><strong>First-Mover Disadvantage:</strong> Competitors gain ${delayMonths} months to capture market share and establish customer relationships</li>
                <li><strong>Market Share Erosion:</strong> Each week of delay allows competitors to serve ${formatCurrency(results.weeklyValue)} worth of customer needs</li>
                <li><strong>Pricing Power Loss:</strong> Late market entry typically requires discounting to win customers from established competitors</li>
                <li><strong>Category Definition:</strong> Competitors who launch first define customer expectations and product standards</li>
            </ul>

            <h4>Customer Satisfaction & Retention</h4>
            <p>Customer expectations are shaped by promises and timelines. This delay affects:</p>
            <ul>
                <li><strong>Trust Erosion:</strong> Missed commitments damage brand credibility and customer confidence</li>
                <li><strong>Churn Risk:</strong> Customers waiting for promised features may defect to competitors offering similar solutions today</li>
                <li><strong>Net Promoter Impact:</strong> Delays typically correlate with decreased NPS scores and increased detractor rates</li>
                <li><strong>Customer Acquisition Cost:</strong> Regaining lost customers costs 5-25x more than retention</li>
            </ul>

            <h4>Brand Perception & Market Momentum</h4>
            <p>In fast-moving markets, perception of innovation leadership is critical. This delay signals:</p>
            <ul>
                <li>Slower innovation velocity compared to competitors</li>
                <li>Potential operational or strategic challenges</li>
                <li>Reduced market confidence in execution capability</li>
                <li>Lost opportunities for thought leadership and earned media</li>
            </ul>

            <div class="recommendation-box">
                <strong>CMO Recommendation:</strong>
                <p>The ${formatCurrency(results.weeklyValue)} weekly value represents real customer demand and market opportunity. 
                Accelerate delivery to capture first-mover advantages and prevent market share loss. ${results.urgencyProfile === 'expedite' ? 
                'The expedite profile indicates rapidly declining value—immediate action is critical.' : 
                results.urgencyProfile === 'fixed-date' ? 'Missing the fixed deadline will result in severe market penalties.' : 
                'Consistent execution builds brand trust and market momentum.'} Consider interim releases or MVP approaches to 
                capture value sooner while completing full scope.</p>
            </div>
        `;

        // COO Perspective
        const cooAnalysis = document.getElementById('coo-analysis');
        cooAnalysis.innerHTML = `
            <div class="impact-highlight">
                <strong>Operational Efficiency Impact:</strong>
                <p>This ${results.delayWeeks}-week delay indicates systemic operational challenges that are costing the organization 
                ${formatCurrency(results.cd3)} per week in economic value. ${results.hasEmployeeCosts ? 
                `The team of ${results.teamSize} is burning ${formatCurrency(results.teamWeeklyCost)} per week during this delay.` : 
                'Resource costs are not yet calculated but represent significant operational expense.'}</p>
            </div>

            <h4>Resource Utilization Analysis</h4>
            ${results.hasEmployeeCosts ? `
            <ul>
                <li><strong>Team Composition:</strong> ${results.teamSize} full-time equivalents allocated to this initiative</li>
                <li><strong>True Cost per FTE:</strong> ${formatCurrency(results.trueCostPerPerson)} annually (${results.benefitsMultiplier}x loaded cost)</li>
                <li><strong>Daily Burn Rate:</strong> ${formatCurrency(results.teamDailyCost)} per day in team costs</li>
                <li><strong>Delay Cost:</strong> ${formatCurrency(results.totalDelayCost)} spent on a team that isn't delivering value</li>
                <li><strong>Productivity Loss:</strong> ${results.delayWeeks} weeks of ${results.teamSize} people = ${results.delayWeeks * results.teamSize} person-weeks unproductively allocated</li>
            </ul>
            ` : `
            <p>Team resource costs have not been entered. To fully understand operational efficiency, input team size and salary information.</p>
            `}

            <h4>Capacity Planning Implications</h4>
            <p>Delays signal capacity constraints or process inefficiencies:</p>
            <ul>
                <li><strong>Bottleneck Identification:</strong> What resource, approval, or dependency is blocking progress?</li>
                <li><strong>Work in Progress (WIP):</strong> Is the team context-switching across too many concurrent initiatives?</li>
                <li><strong>Cycle Time Analysis:</strong> Are processes optimized for throughput or creating artificial delays?</li>
                <li><strong>Throughput Capacity:</strong> Can the system handle the demand placed on it?</li>
            </ul>

            <h4>Process & Flow Optimization</h4>
            <p>Common operational root causes of delay:</p>
            <ul>
                <li><strong>Unclear Prioritization:</strong> Teams lack clear guidance on what matters most</li>
                <li><strong>Excessive Multitasking:</strong> Context switching reduces productivity by 20-40%</li>
                <li><strong>Approval Bottlenecks:</strong> Slow decision-making creates queuing delays</li>
                <li><strong>Scope Creep:</strong> Uncontrolled scope expansion extends timelines</li>
                <li><strong>Technical Debt:</strong> Accumulated shortcuts slow future development</li>
                <li><strong>Dependency Management:</strong> External dependencies block critical path progress</li>
            </ul>

            <h4>Quality & Rework Considerations</h4>
            <p>The pressure to recover from delays often leads to:</p>
            <ul>
                <li>Rushed work resulting in defects and technical debt</li>
                <li>Skipped testing and validation steps</li>
                <li>Increased rework cycles that further extend timelines</li>
                <li>Morale impacts from sustained high-pressure periods</li>
            </ul>

            <div class="recommendation-box">
                <strong>COO Recommendation:</strong>
                <p>Apply Lean principles to eliminate waste and optimize flow. With a CD3 of ${formatCurrency(results.cd3)}, 
                this initiative should be prioritized using Weighted Shortest Job First (WSJF) methodology. 
                ${results.hasEmployeeCosts ? `The team's ${formatCurrency(results.teamWeeklyCost)} weekly cost is only productive if delivering value—` : 
                'Once team costs are calculated, focus on maximizing value delivered per dollar invested. '}
                reduce Work in Progress limits, eliminate approval bottlenecks, and establish clear decision authority. 
                Consider daily standups focused on blockers, visual management of workflow, and empowering teams to escalate 
                impediments immediately. Each week saved recovers ${formatCurrency(results.weeklyValue)} in value and 
                ${results.hasEmployeeCosts ? formatCurrency(results.teamWeeklyCost) + ' in team costs' : 'reduces resource burn'}.</p>
            </div>
        `;
    }

    generateOverview(results) {
        const overviewEl = document.getElementById('overviewSection');
        const contentEl = document.getElementById('overviewContent');
        if (!overviewEl || !contentEl) return;

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(Math.abs(value));
        };

        const totalImpact = results.totalCostOfDelay + (results.totalDelayCost || 0);
        const lines = [];
        lines.push(`<p><strong>${results.projectName}</strong> — ${results.developmentWeeks}w dev, ${results.delayWeeks}w delay.</p>`);
        lines.push(`<p><strong>Total Cost of Delay:</strong> ${formatCurrency(results.totalCostOfDelay)} &nbsp; <strong>CD3:</strong> ${formatCurrency(results.cd3)} /wk</p>`);
        if (results.hasEmployeeCosts) {
            lines.push(`<p><strong>Team Burn:</strong> ${results.teamSize} × ${formatCurrency(results.teamWeeklyCost)} per week → ${formatCurrency(results.totalDelayCost)} while delayed.</p>`);
        }
        lines.push(`<p><strong>Total Economic Impact:</strong> ${formatCurrency(totalImpact)}</p>`);

        // Recommendations (brief)
        const recs = [];
        recs.push('Prioritize based on CD3 to maximize value recovered per week.');
        if (results.urgencyProfile === 'expedite') recs.push('Expedite: consider immediate resource allocation or scope reduction.');
        if (results.urgencyProfile === 'fixed-date') recs.push('Fixed-date: identify critical-path dependencies and negotiate deadlines.');
        if (results.hasEmployeeCosts) recs.push('Evaluate reallocation or temporary scaling to reduce delay weeks.');
        recs.push('Consider incremental delivery to capture partial value earlier.');

        lines.push('<h4>Recommendations</h4>');
        lines.push('<ul>' + recs.map(r => `<li>${r}</li>`).join('') + '</ul>');

        contentEl.innerHTML = lines.join('\n');
        overviewEl.style.display = 'block';
    }

    exportExecutiveAnalysis() {
        try {
            const parts = [];
            const header = `Executive Combined Analysis - ${new Date().toLocaleString()}\nProject: ${this.currentResults ? this.currentResults.projectName : 'N/A'}\n\n`;
            parts.push(header);

            const overview = document.getElementById('overviewContent');
            if (overview) parts.push('Overview:\n' + overview.innerText + '\n\n');

            const ids = ['ceo-analysis','cfo-analysis','cmo-analysis','cto-analysis','coo-analysis'];
            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    const title = el.closest('.executive-content')?.querySelector('h3')?.textContent || id;
                    parts.push((title ? title + ':\n' : '') + el.innerText + '\n\n');
                }
            });

            const text = parts.join('\n');
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `executive-analysis-${(this.currentResults && this.currentResults.projectName ? this.currentResults.projectName.replace(/\s+/g,'-') : 'analysis')}-${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('✅ Executive analysis exported');
            return text;
        } catch (e) {
            console.error('Error exporting executive analysis:', e);
            alert('❌ Error exporting executive analysis. Check console for details.');
        }
    }

    switchExecutiveTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.executive-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content sections
        document.querySelectorAll('.executive-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-content`).classList.add('active');
    }

    createChart(results) {
        const chartSection = document.getElementById('chartSection');
        chartSection.style.display = 'block';

        const ctx = document.getElementById('delayChart').getContext('2d');

        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }

        // Prepare chart data
        const labels = [];
        const cumulativeData = [];
        let cumulative = 0;

        for (let i = 0; i < results.delayWeeks; i++) {
            labels.push(`Week ${i + 1}`);
            cumulative += results.weeklyLosses[i] || 0;
            cumulativeData.push(cumulative);
        }

        // Create chart
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Cumulative Cost of Delay',
                        data: cumulativeData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3
                    },
                    {
                        label: 'Weekly Loss',
                        data: results.weeklyLosses,
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        fill: false,
                        tension: 0.4,
                        borderWidth: 2,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Cost Accumulation Over Delay Period',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0
                                }).format(context.parsed.y);
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    addToComparison() {
        if (!this.currentResults) {
            alert('Please calculate a project first');
            return;
        }

        // Check if project already exists
        const existingIndex = this.comparisonProjects.findIndex(
            p => p.projectName === this.currentResults.projectName
        );

        if (existingIndex >= 0) {
            if (confirm('A project with this name already exists. Replace it?')) {
                this.comparisonProjects[existingIndex] = { ...this.currentResults };
            } else {
                return;
            }
        } else {
            this.comparisonProjects.push({ ...this.currentResults });
        }

        this.updateComparisonView();
        alert(`"${this.currentResults.projectName}" added to comparison!`);
    }

    updateComparisonView() {
        if (this.comparisonProjects.length === 0) {
            document.getElementById('comparisonSection').style.display = 'none';
            return;
        }

        document.getElementById('comparisonSection').style.display = 'block';

        // Sort projects by CD3 (highest priority first)
        const sortedProjects = [...this.comparisonProjects].sort((a, b) => b.cd3 - a.cd3);

        // Initialize runtime selection (select all by default)
        if (!this.comparisonSelections || this.comparisonSelections.size === 0) {
            this.comparisonSelections = new Set(sortedProjects.map(p => p.projectName));
        }

        // Create comparison table with checkboxes
        this.createComparisonTable(sortedProjects);

        // Build filtered list according to runtime selections
        const filtered = sortedProjects.filter(p => this.comparisonSelections.has(p.projectName));
        const toChart = filtered.length > 0 ? filtered : sortedProjects;

        // Create comparison chart only if visuals have been requested
        if (this.visualsBuilt) {
            this.createComparisonChart(toChart);
        }
    }

    createComparisonTable(projects) {
        const tableDiv = document.getElementById('comparisonTable');
        
        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        };

        let tableHTML = '<div class="comparison-table">';

        // Controls: Select All
        tableHTML += `<div class="comparison-controls"><label><input type="checkbox" id="comparison-select-all" checked> Select all</label></div>`;

        tableHTML += '<table>';
        tableHTML += `
            <thead>
                <tr>
                    <th></th>
                    <th>Rank</th>
                    <th>Project Name</th>
                    <th>CD3 ($/wk)</th>
                    <th>Total CoD</th>
                    <th>Employee Cost</th>
                    <th>Total Impact</th>
                    <th>Dev Time</th>
                    <th>Delay</th>
                    <th>Team Size</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
        `;

        projects.forEach((project, index) => {
            const priorityClass = index === 0 ? 'priority-1' : (index === 1 ? 'priority-2' : 'priority-3');
            const totalImpact = project.totalCostOfDelay + (project.totalDelayCost || 0);
            
            tableHTML += `
                <tr class="${priorityClass}" data-name="${encodeURIComponent(project.projectName)}">
                    <td><input type="checkbox" class="comparison-select" data-name="${encodeURIComponent(project.projectName)}" ${this.comparisonSelections.has(project.projectName) ? 'checked' : ''}></td>
                    <td><strong>${index + 1}</strong></td>
                    <td><strong>${project.projectName}</strong></td>
                    <td>${formatCurrency(project.cd3)}</td>
                    <td>${formatCurrency(project.totalCostOfDelay)}</td>
                    <td>${project.hasEmployeeCosts ? formatCurrency(project.totalDelayCost) : 'N/A'}</td>
                    <td><strong>${formatCurrency(totalImpact)}</strong></td>
                    <td>${project.developmentWeeks}w</td>
                    <td>${project.delayWeeks}w</td>
                    <td>${project.teamSize || 'N/A'}</td>
                    <td><span class="delete-project" data-name="${encodeURIComponent(project.projectName)}">×</span></td>
                </tr>
            `;
        });

        tableHTML += '</tbody></table></div>';
        tableDiv.innerHTML = tableHTML;

        // Wire up controls
        const selectAll = tableDiv.querySelector('#comparison-select-all');
        const checkboxes = Array.from(tableDiv.querySelectorAll('.comparison-select'));
        const deleteBtns = Array.from(tableDiv.querySelectorAll('.delete-project'));

        const rebuild = () => {
            // update selection set
            this.comparisonSelections.clear();
            checkboxes.forEach(cb => {
                if (cb.checked) this.comparisonSelections.add(decodeURIComponent(cb.dataset.name));
            });

            // Update header with selected names
            try {
                const compSection = document.getElementById('comparisonSection');
                if (compSection) {
                    const header = compSection.querySelector('.comparison-header h2');
                    if (header) {
                        const names = [...this.comparisonSelections].join(', ');
                        header.textContent = names.length > 0 ? `Project Comparison — ${names}` : 'Project Comparison';
                        header.title = names;
                    }
                }
            } catch (e) { console.error(e); }

            // Rebuild chart when visuals are enabled
            if (this.visualsBuilt) {
                const sorted = [...this.comparisonProjects].sort((a,b)=>b.cd3-a.cd3);
                const filtered = sorted.filter(p => this.comparisonSelections.has(p.projectName));
                const toChart = filtered.length > 0 ? filtered : sorted;
                this.createComparisonChart(toChart);
            }
        };

        if (selectAll) {
            selectAll.addEventListener('change', (e) => {
                const checked = e.target.checked;
                checkboxes.forEach(cb => cb.checked = checked);
                rebuild();
            });
        }

        checkboxes.forEach(cb => cb.addEventListener('change', rebuild));

        deleteBtns.forEach(btn => btn.addEventListener('click', (e) => {
            const name = decodeURIComponent(btn.dataset.name || btn.getAttribute('data-name'));
            if (name) this.removeProject(name);
        }));
    }

    createComparisonChart(projects) {
        const ctx = document.getElementById('comparisonChart').getContext('2d');

        if (this.comparisonChart) {
            this.comparisonChart.destroy();
        }

        const labels = projects.map(p => p.projectName);
        const cd3Values = projects.map(p => p.cd3);
        const codValues = projects.map(p => p.totalCostOfDelay);
        const employeeValues = projects.map(p => p.totalDelayCost || 0);

        this.comparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'CD3 ($/week)',
                        data: cd3Values,
                        backgroundColor: 'rgba(37, 99, 235, 0.7)',
                        borderColor: 'rgba(37, 99, 235, 1)',
                        borderWidth: 2,
                        yAxisID: 'y1'
                    },
                    {
                        label: 'Opportunity Cost',
                        data: codValues,
                        backgroundColor: 'rgba(239, 68, 68, 0.7)',
                        borderColor: 'rgba(239, 68, 68, 1)',
                        borderWidth: 2,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Employee Cost',
                        data: employeeValues,
                        backgroundColor: 'rgba(245, 158, 11, 0.7)',
                        borderColor: 'rgba(245, 158, 11, 1)',
                        borderWidth: 2,
                        yAxisID: 'y'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Project Prioritization Comparison (Sorted by CD3)',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0
                                }).format(context.parsed.y);
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Total Cost ($)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'CD3 ($/week)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    removeProject(projectName) {
        this.comparisonProjects = this.comparisonProjects.filter(p => p.projectName !== projectName);
        this.updateComparisonView();
    }

    clearComparison() {
        if (this.comparisonProjects.length === 0) return;
        
        if (confirm('Clear all projects from comparison?')) {
            this.comparisonProjects = [];
            this.updateComparisonView();
        }
    }

    exportJson() {
        if (!this.currentResults) {
            alert('No results to export');
            return;
        }

        const data = {
            exportDate: new Date().toISOString(),
            project: this.currentResults,
            comparison: this.comparisonProjects
        };

        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cost-of-delay-${String(this.currentResults.projectName || 'export').replace(/\s+/g, '-')}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return jsonStr;
    }

    generateImages() {
        if (!this.currentResults) {
            alert('Please calculate a project first');
            return;
        }

        // Use html2canvas to generate images of the results
        alert('Generating images of your Cost of Delay analysis...\n\nThis will capture:\n• Cost of Delay Analysis\n• Charts and Visualizations\n• Executive Perspectives\n\nNote: Install html2canvas library for full functionality.');
        
        // Future implementation with html2canvas:
        // html2canvas(document.querySelector('.results-section')).then(canvas => {
        //     const link = document.createElement('a');
        //     link.download = `cod-analysis-${this.currentResults.projectName}-${Date.now()}.png`;
        //     link.href = canvas.toDataURL();
        //     link.click();
        // });
    }

    exportCsv() {
        if (this.comparisonProjects.length === 0 && !this.currentResults) {
            alert('No results to export');
            return;
        }

        // Use comparison projects if available, otherwise current result
        const projects = this.comparisonProjects.length > 0 
            ? this.comparisonProjects 
            : [this.currentResults];

        // Sort by CD3
        const sortedProjects = [...projects].sort((a, b) => b.cd3 - a.cd3);

        // CSV Headers
        const headers = [
            'Rank',
            'Project Name',
            'CD3 ($/week)',
            'Total Cost of Delay',
            'Employee Cost During Delay',
            'Total Economic Impact',
            'Development Time (weeks)',
            'Delay Period (weeks)',
            'Team Size',
            'Weekly Value',
            'Urgency Profile',
            'Opportunity Cost %'
        ];

        // Build CSV content
        let csvContent = headers.join(',') + '\n';

        sortedProjects.forEach((project, index) => {
            const totalImpact = project.totalCostOfDelay + (project.totalDelayCost || 0);
            const row = [
                index + 1,
                `"${project.projectName}"`,
                project.cd3.toFixed(2),
                project.totalCostOfDelay.toFixed(2),
                (project.totalDelayCost || 0).toFixed(2),
                totalImpact.toFixed(2),
                project.developmentWeeks,
                project.delayWeeks,
                project.teamSize || 'N/A',
                project.weeklyValue.toFixed(2),
                `"${project.urgencyProfile}"`,
                project.opportunityCost.toFixed(2)
            ];
            csvContent += row.join(',') + '\n';
        });

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cost-of-delay-analysis-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return csvContent;
    }

    exportExcel() {
        if (this.comparisonProjects.length === 0 && !this.currentResults) {
            alert('No results to export');
            return;
        }

        // Use comparison projects if available, otherwise current result
        const projects = this.comparisonProjects.length > 0 
            ? this.comparisonProjects 
            : [this.currentResults];

        // Sort by CD3
        const sortedProjects = [...projects].sort((a, b) => b.cd3 - a.cd3);

        // Create Excel-compatible HTML table
        let htmlContent = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="utf-8">
                <!--[if gte mso 9]>
                <xml>
                    <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                            <x:ExcelWorksheet>
                                <x:Name>Cost of Delay Analysis</x:Name>
                                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                </xml>
                <![endif]-->
                <style>
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #2563eb; color: white; font-weight: bold; }
                    .priority-1 { background-color: #d1fae5; }
                    .priority-2 { background-color: #fef3c7; }
                    .priority-3 { background-color: #fee2e2; }
                    .negative { color: #ef4444; }
                </style>
            </head>
            <body>
                <h1>Cost of Delay Analysis</h1>
                <p>Export Date: ${new Date().toLocaleString()}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Project Name</th>
                            <th>CD3 ($/week)</th>
                            <th>Total Cost of Delay</th>
                            <th>Employee Cost</th>
                            <th>Total Economic Impact</th>
                            <th>Dev Time (wks)</th>
                            <th>Delay (wks)</th>
                            <th>Team Size</th>
                            <th>Weekly Value</th>
                            <th>Urgency Profile</th>
                            <th>Opportunity Cost %</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        sortedProjects.forEach((project, index) => {
            const priorityClass = index === 0 ? 'priority-1' : (index === 1 ? 'priority-2' : 'priority-3');
            const totalImpact = project.totalCostOfDelay + (project.totalDelayCost || 0);
            
            htmlContent += `
                <tr class="${priorityClass}">
                    <td>${index + 1}</td>
                    <td>${project.projectName}</td>
                    <td>$${project.cd3.toLocaleString()}</td>
                    <td class="negative">($${project.totalCostOfDelay.toLocaleString()})</td>
                    <td class="negative">${project.hasEmployeeCosts ? '($' + project.totalDelayCost.toLocaleString() + ')' : 'N/A'}</td>
                    <td class="negative">($${totalImpact.toLocaleString()})</td>
                    <td>${project.developmentWeeks}</td>
                    <td>${project.delayWeeks}</td>
                    <td>${project.teamSize || 'N/A'}</td>
                    <td>$${project.weeklyValue.toLocaleString()}</td>
                    <td>${project.urgencyProfile}</td>
                    <td>${project.opportunityCost.toFixed(1)}%</td>
                </tr>
            `;
        });

        htmlContent += `
                    </tbody>
                </table>
            </body>
            </html>
        `;

        // Download as Excel file
        const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cost-of-delay-analysis-${Date.now()}.xls`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return htmlContent;
    }

    printReport() {
        window.print();
    }
}

// Expose for test runner and reuse
window.CostOfDelayCalculator = CostOfDelayCalculator;

// Initialize calculator when DOM is ready
let calculator;
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM Content Loaded - Initializing Cost of Delay Calculator...');
    try {
        calculator = new CostOfDelayCalculator();
        console.log('✅ Calculator initialized successfully');
        console.log('Calculator instance:', calculator);
    } catch (error) {
        console.error('❌ Error initializing calculator:', error);
        console.error('Error stack:', error.stack);
        alert('Error initializing calculator. Check console for details.');
    }
});

// Also try immediate initialization in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    console.log('Document still loading, waiting for DOMContentLoaded...');
} else {
    console.log('Document already loaded, initializing immediately...');
    try {
        calculator = new CostOfDelayCalculator();
        console.log('✅ Calculator initialized immediately');
    } catch (error) {
        console.error('❌ Error in immediate initialization:', error);
    }
}
