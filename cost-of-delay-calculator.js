// Cost of Delay Calculator - JavaScript Logic

// paired-down class now delegates major operations to helper modules
import { calculateEmployeeCosts, calculateCostOfDelay } from './src/calculations.js';
import { formatCurrency, formatCurrencyDetailed } from './src/formatters.js';
import { exportJson as exportJsonHelper, exportCsv as exportCsvHelper, exportExcel as exportExcelHelper, exportExecutiveAnalysis as exportExecutiveHelper } from './src/exporters.js';
import { saveAs as saveAsHelper, loadFromFile as loadFromFileHelper, handleFileLoad as handleFileLoadHelper } from './src/fileIO.js';
import { createDelayChart as createDelayChartHelper, createComparisonChart as createComparisonChartHelper } from './src/ui/charts.js';
import { updateComparisonView as updateComparisonViewHelper, createComparisonTable as createComparisonTableHelper } from './src/ui/comparisonView.js';

export class CostOfDelayCalculator {
    constructor() {
        console.log('📊 Constructing CostOfDelayCalculator...');
        this.chart = null;
        this.comparisonChart = null;
        this.currentResults = null;
        this.lockedSalaryType = null;
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

        const exportDropdownBtn = document.getElementById('exportDropdownBtn');
        const exportDropdown = document.getElementById('exportDropdown');
        if (exportDropdownBtn && exportDropdown) {
            exportDropdownBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isOpen = exportDropdown.classList.toggle('show');
                exportDropdownBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });

            document.addEventListener('click', (e) => {
                if (!exportDropdown.classList.contains('show')) return;
                if (e.target === exportDropdownBtn || exportDropdown.contains(e.target)) return;
                exportDropdown.classList.remove('show');
                exportDropdownBtn.setAttribute('aria-expanded', 'false');
            });

            exportDropdown.addEventListener('click', () => {
                exportDropdown.classList.remove('show');
                exportDropdownBtn.setAttribute('aria-expanded', 'false');
            });

            console.log('✅ Export dropdown toggle listener attached');
        } else {
            console.error('❌ Export dropdown button/menu not found');
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

        const autofillDemoBtn = document.getElementById('autofillDemoBtn');
        if (autofillDemoBtn) {
            autofillDemoBtn.addEventListener('click', () => this.autofillDemoProjects());
            console.log('✅ Autofill Demo Projects button listener attached');
        } else {
            console.error('❌ Autofill Demo Projects button not found');
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
        const salaryTypeAnnual = document.getElementById('salaryTypeAnnual');
        const salaryTypeHourly = document.getElementById('salaryTypeHourly');
        if (salaryTypeAnnual && salaryTypeHourly) {
            salaryTypeAnnual.addEventListener('change', () => {
                this.setExclusiveCheckbox(salaryTypeAnnual, salaryTypeHourly);
                if (!this.enforceSalaryTypeConsistency()) return;
                this.toggleSalaryInput();
                this.updateSalaryTypeHelper();
            });
            salaryTypeHourly.addEventListener('change', () => {
                this.setExclusiveCheckbox(salaryTypeHourly, salaryTypeAnnual);
                if (!this.enforceSalaryTypeConsistency()) return;
                this.toggleSalaryInput();
                this.updateSalaryTypeHelper();
            });
            console.log('✅ Salary type checkbox listeners attached');
        }

        const itemTypeProject = document.getElementById('itemTypeProject');
        const itemTypeProduct = document.getElementById('itemTypeProduct');
        if (itemTypeProject && itemTypeProduct) {
            itemTypeProject.addEventListener('change', () => {
                this.setExclusiveCheckbox(itemTypeProject, itemTypeProduct);
                this.updateValueTypeLabels();
            });
            itemTypeProduct.addEventListener('change', () => {
                this.setExclusiveCheckbox(itemTypeProduct, itemTypeProject);
                this.updateValueTypeLabels();
            });
            console.log('✅ Project/Product checkbox listeners attached');
        }

        const valueTypeRevenue = document.getElementById('valueTypeRevenue');
        const valueTypeCostSavings = document.getElementById('valueTypeCostSavings');
        if (valueTypeRevenue && valueTypeCostSavings) {
            valueTypeRevenue.addEventListener('change', () => {
                this.setExclusiveCheckbox(valueTypeRevenue, valueTypeCostSavings);
                this.updateValueTypeLabels();
                this.updateAnnualizedEstimate();
            });
            valueTypeCostSavings.addEventListener('change', () => {
                this.setExclusiveCheckbox(valueTypeCostSavings, valueTypeRevenue);
                this.updateValueTypeLabels();
                this.updateAnnualizedEstimate();
            });
            console.log('✅ Revenue/Cost Savings checkbox listeners attached');
        }

        const weeklyValueInput = document.getElementById('weeklyValue');
        const currencyCodeInput = document.getElementById('currencyCode');
        [weeklyValueInput].forEach((el) => {
            if (!el) return;
            el.addEventListener('input', () => this.updateAnnualizedEstimate());
            el.addEventListener('change', () => this.updateAnnualizedEstimate());
        });
        if (currencyCodeInput) {
            currencyCodeInput.addEventListener('change', () => this.updateAnnualizedEstimate());
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

        this.updateValueTypeLabels();
        this.updateSalaryTypeHelper();
        this.updateAnnualizedEstimate();

        // Log initialization complete
        console.log('🎉 All event listeners initialized successfully');
    }

    setExclusiveCheckbox(primaryCheckbox, secondaryCheckbox) {
        if (primaryCheckbox.checked) {
            secondaryCheckbox.checked = false;
            return;
        }
        secondaryCheckbox.checked = true;
    }

    getSelectedItemType() {
        const project = document.getElementById('itemTypeProject');
        const product = document.getElementById('itemTypeProduct');
        if (product && product.checked) return 'product';
        if (project && project.checked) return 'project';
        return 'project';
    }

    getSelectedValueType() {
        const revenue = document.getElementById('valueTypeRevenue');
        const costSavings = document.getElementById('valueTypeCostSavings');
        if (costSavings && costSavings.checked) return 'cost-savings';
        if (revenue && revenue.checked) return 'revenue';
        return 'revenue';
    }

    getSelectedValueTypeLabel() {
        return this.getSelectedValueType() === 'cost-savings' ? 'Cost Savings' : 'Revenue';
    }

    formatCodeValue(value, currencyCode, maxFractionDigits = 0) {
        const safeCode = currencyCode || 'USD';
        const formattedValue = Number(value || 0).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: maxFractionDigits
        });
        return `${safeCode} ${formattedValue}`;
    }

    updateValueTypeLabels() {
        const valueType = this.getSelectedValueType();
        const itemType = this.getSelectedItemType();
        const itemName = itemType === 'product' ? 'Product' : 'Project';
        const weeklyValueLabelText = document.getElementById('weeklyValueLabelText');
        const annualizedEstimateLabel = document.getElementById('annualizedEstimateLabel');
        if (weeklyValueLabelText) {
            weeklyValueLabelText.textContent = valueType === 'cost-savings'
                ? `Expected Cost Savings Per Week for this ${itemName} (in selected currency)`
                : `Expected Revenue Per Week for this ${itemName} (in selected currency)`;
        }
        if (annualizedEstimateLabel) {
            annualizedEstimateLabel.textContent = 'Annualized Revenue/Savings Estimate';
        }
    }

    updateAnnualizedEstimate() {
        const weeklyValue = parseFloat(document.getElementById('weeklyValue')?.value) || 0;
        const currencyCode = document.getElementById('currencyCode')?.value || 'USD';
        const annualizedValue = weeklyValue * 52;
        const estimateEl = document.getElementById('annualizedEstimate');
        if (!estimateEl) return;
        estimateEl.value = this.formatCodeValue(annualizedValue, currencyCode, 0);
    }

    getSelectedSalaryType() {
        const annualCheckbox = document.getElementById('salaryTypeAnnual');
        const hourlyCheckbox = document.getElementById('salaryTypeHourly');
        if (hourlyCheckbox && hourlyCheckbox.checked) return 'hourly';
        if (annualCheckbox && annualCheckbox.checked) return 'annual';

        // Backward compatibility if a select exists in saved/older markup.
        const salaryTypeSelect = document.getElementById('salaryType');
        if (salaryTypeSelect && (salaryTypeSelect.value === 'annual' || salaryTypeSelect.value === 'hourly')) {
            return salaryTypeSelect.value;
        }
        return 'annual';
    }

    getSalaryTypeDisplayName(salaryType) {
        return salaryType === 'hourly' ? 'Hourly' : 'Annual';
    }

    setSalaryTypeSelection(salaryType) {
        const salaryTypeAnnual = document.getElementById('salaryTypeAnnual');
        const salaryTypeHourly = document.getElementById('salaryTypeHourly');
        if (!salaryTypeAnnual || !salaryTypeHourly) return;
        salaryTypeAnnual.checked = salaryType !== 'hourly';
        salaryTypeHourly.checked = salaryType === 'hourly';
    }

    showSalaryTypeHelper(text, isWarning = false) {
        const helper = document.getElementById('salaryTypeHelperText');
        if (!helper) return;
        if (!text) {
            helper.textContent = '';
            helper.style.display = 'none';
            helper.classList.remove('warning');
            return;
        }
        helper.textContent = text;
        helper.style.display = 'block';
        helper.classList.toggle('warning', !!isWarning);
    }

    updateSalaryTypeHelper() {
        if (!this.lockedSalaryType) {
            this.showSalaryTypeHelper('');
            return;
        }
        const lockedLabel = this.getSalaryTypeDisplayName(this.lockedSalaryType);
        this.showSalaryTypeHelper(`Locked to ${lockedLabel} for this review to keep cost comparison consistent.`, false);
    }

    enforceSalaryTypeConsistency() {
        if (!this.lockedSalaryType) return true;
        const selected = this.getSelectedSalaryType();
        if (selected === this.lockedSalaryType) return true;
        this.setSalaryTypeSelection(this.lockedSalaryType);
        this.toggleSalaryInput();
        const lockedLabel = this.getSalaryTypeDisplayName(this.lockedSalaryType);
        this.showSalaryTypeHelper(`Use ${lockedLabel} for all initiatives in this review to keep cost comparison consistent.`, true);
        return false;
    }

    toggleSalaryInput() {
        const salaryType = this.getSelectedSalaryType();
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

    getWorkItemType(projectName, explicitType = null) {
        if (explicitType === 'project' || explicitType === 'product') return explicitType;
        const name = String(projectName || '').toLowerCase();
        const productSignals = ['product', 'app', 'mobile', 'checkout', 'platform', 'dashboard', 'feature', 'experience'];
        return productSignals.some(signal => name.includes(signal)) ? 'product' : 'project';
    }

    calculate() {
        // clear any previous error message and field highlights
        const errEl = document.getElementById('errorMessage');
        if (errEl) {
            errEl.style.display = 'none';
            errEl.textContent = '';
        }
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

        // Get input values
        const projectName = document.getElementById('projectName').value || 'Unnamed Project';
        const itemType = this.getSelectedItemType();
        const valueType = this.getSelectedValueType();
        const weeklyValueLocal = parseFloat(document.getElementById('weeklyValue').value) || 0;
        const currencyCode = document.getElementById('currencyCode').value || 'USD';
        const weeklyValue = weeklyValueLocal;
        const developmentWeeks = parseFloat(document.getElementById('developmentWeeks').value) || 0;
        const delayWeeks = parseFloat(document.getElementById('delayWeeks').value) || 0;
        const urgencyProfile = document.getElementById('urgencyProfile').value;
        
        // Get optional date fields
        const targetLaunchDate = document.getElementById('targetLaunchDate').value || null;
        const revisedLaunchDate = document.getElementById('revisedLaunchDate').value || null;
        
        // Get employee cost parameters
        const salaryType = this.getSelectedSalaryType();
        if (!this.enforceSalaryTypeConsistency()) {
            return;
        }
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

        // Gather and validate inputs with user-friendly messages
        const validationErrors = [];
        if (weeklyValueLocal <= 0) {
            validationErrors.push('Weekly Value must be greater than 0');
            document.getElementById('weeklyValue').classList.add('input-error');
        }
        if (developmentWeeks <= 0) {
            validationErrors.push('Development Duration must be greater than 0');
            document.getElementById('developmentWeeks').classList.add('input-error');
        }
        if (delayWeeks < 0) {
            validationErrors.push('Delay Period cannot be negative');
            document.getElementById('delayWeeks').classList.add('input-error');
        }
        if (teamSize < 0) {
            validationErrors.push('Team Size cannot be negative');
            document.getElementById('teamSize').classList.add('input-error');
        }
        if (benefitsMultiplier < 1) {
            validationErrors.push('Benefits multiplier must be at least 1');
            document.getElementById('benefitsMultiplier').classList.add('input-error');
        }
        if (annualSalary < 0) {
            validationErrors.push('Salary cannot be negative');
            if (salaryType === 'annual') {
                document.getElementById('annualSalary').classList.add('input-error');
            } else {
                document.getElementById('hourlyRate').classList.add('input-error');
            }
        }

        if (validationErrors.length > 0) {
            const message = validationErrors.join('. ');
            if (errEl) {
                errEl.textContent = message;
                errEl.style.display = 'block';
            } else {
                alert(message);
            }
            return;
        }

        // Perform calculations within try/catch to surface validation errors
        let combinedResults;
        try {
            // Calculate employee costs
            // delegate to calculation module
            const employeeCosts = calculateEmployeeCosts(
                annualSalary,
                teamSize,
                benefitsMultiplier,
                developmentWeeks,
                delayWeeks
            );

            // Calculate Cost of Delay metrics
            const results = calculateCostOfDelay(
                weeklyValue,
                developmentWeeks,
                delayWeeks,
                urgencyProfile
            );

            // Combine results with employee costs
            combinedResults = {
                ...results,
                ...employeeCosts,
                projectName,
                itemType,
                valueType,
                currencyCode,
                weeklyValueLocal,
                annualizedValue: weeklyValue * 52,
                targetLaunchDate,
                revisedLaunchDate
            };

            // Store current results
            this.currentResults = combinedResults;
            if (!this.lockedSalaryType) {
                this.lockedSalaryType = salaryType;
            }
            this.updateSalaryTypeHelper();

            // Display results
            this.displayResults(projectName, combinedResults);
        } catch (err) {
            if (errEl) {
                errEl.textContent = err.message;
                errEl.style.display = 'block';
            } else {
                alert(err.message);
            }
            return;
        }
        
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
        document.getElementById('quickCd3').textContent = formatCurrency(results.cd3) + ' per week';
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
        saveAsHelper(this.currentResults);
    }

    loadFromFile() {
        document.getElementById('fileInput').click();
    }

    handleFileLoad(event) {
        // delegate parsing to helper and restore state in callback
        handleFileLoadHelper(event, (data) => {
            // restore UI fields if inputs present
            if (data.inputs) {
                Object.entries(data.inputs).forEach(([id,val]) => {
                    const el = document.getElementById(id);
                    if (el) el.value = val;
                });
                this.toggleSalaryInput();
            }
            if (data.comparisonProjects && data.comparisonProjects.length > 0) {
                this.comparisonProjects = data.comparisonProjects;
                this.updateComparisonView();
            }
            if (data.projectData) {
                this.currentResults = data.projectData;
            }
            if (data.savedDate) {
                const savedDate = new Date(data.savedDate).toLocaleString();
                alert(`✅ File loaded successfully!\n\n📅 Saved: ${savedDate}\n\nAll inputs and calculations have been restored.`);
            }
            // recalc
            this.calculate();
        });
    }

    calculateEmployeeCosts(annualSalary, teamSize, benefitsMultiplier, developmentWeeks, delayWeeks) {
        // simple proxy for the calculations module
        return calculateEmployeeCosts(annualSalary, teamSize, benefitsMultiplier, developmentWeeks, delayWeeks);
    }

    calculateCostOfDelay(weeklyValue, developmentWeeks, delayWeeks, urgencyProfile) {
        return calculateCostOfDelay(weeklyValue, developmentWeeks, delayWeeks, urgencyProfile);
    }

    displayResults(projectName, results) {
        const resultsDiv = document.getElementById('results');
        const cdppSection = document.getElementById('cdppSection');
        const employeeCostSection = document.getElementById('employeeCostSection');
        const workItemType = this.getWorkItemType(projectName, results.itemType);
        const workItemTypeCapitalized = workItemType.charAt(0).toUpperCase() + workItemType.slice(1);
        const valueTypeLabel = results.valueType === 'cost-savings' ? 'Cost Savings' : 'Revenue';
        const valueTypeLabelLower = valueTypeLabel.toLowerCase();
        const annualizedValue = typeof results.annualizedValue === 'number'
            ? results.annualizedValue
            : (results.weeklyValue * 52);

        // format helpers imported at module level
        // (formatCurrency and formatCurrencyDetailed are available)

        // Calculate total economic impact if employee costs are available
        let totalEconomicImpact = results.totalCostOfDelay;
        if (results.hasEmployeeCosts) {
            totalEconomicImpact = results.totalCostOfDelay + results.totalDelayCost;
        }

        // Create results HTML
        resultsDiv.innerHTML = `
            <div class="metrics-grid">
                <div class="metric">
                    <div class="metric-label">Total Cost of Delay</div>
                    <div class="metric-value danger">${formatCurrency(results.totalCostOfDelay)}</div>
                    <div class="metric-description">
                        Lost ${valueTypeLabelLower} from ${results.delayWeeks} week${results.delayWeeks !== 1 ? 's' : ''} delay
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
                        Percentage of annual ${workItemType} value lost to delay
                    </div>
                </div>
            </div>

            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-item-label">Weekly ${valueTypeLabel} (Selected Currency)</div>
                    <div class="summary-item-value">${this.formatCodeValue((results.weeklyValueLocal || results.weeklyValue), (results.currencyCode || 'USD'), 2)}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-item-label">Weekly ${valueTypeLabel} (Calculation Currency)</div>
                    <div class="summary-item-value">${this.formatCodeValue(results.weeklyValue, (results.currencyCode || 'USD'), 2)}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-item-label">Annualized ${valueTypeLabel} (Calculation Currency)</div>
                    <div class="summary-item-value">${this.formatCodeValue(annualizedValue, (results.currencyCode || 'USD'), 0)}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-item-label">Development Time</div>
                    <div class="summary-item-value">${results.developmentWeeks} week${results.developmentWeeks !== 1 ? 's' : ''}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-item-label">Delay Period</div>
                    <div class="summary-item-value">${results.delayWeeks} week${results.delayWeeks !== 1 ? 's' : ''}</div>
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
                    <div class="employee-metric-label">Total ${workItemTypeCapitalized} Cost</div>
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
        const workItemType = this.getWorkItemType(results.projectName, results.itemType);
        const workItemTypeCapitalized = workItemType.charAt(0).toUpperCase() + workItemType.slice(1);
        const valueTypeLabel = results.valueType === 'cost-savings' ? 'Cost Savings' : 'Revenue';
        const valueTypeLabelLower = valueTypeLabel.toLowerCase();
        const delayRatio = results.developmentWeeks > 0 ? results.delayWeeks / results.developmentWeeks : 0;
        const valueToBurnRatio = results.hasEmployeeCosts && results.teamWeeklyCost > 0
            ? results.weeklyValue / results.teamWeeklyCost
            : null;
        const cognitiveDiversityNeeded =
            results.urgencyProfile === 'expedite' ||
            results.urgencyProfile === 'fixed-date' ||
            delayRatio >= 0.4 ||
            results.opportunityCost >= 25 ||
            (valueToBurnRatio !== null && valueToBurnRatio < 2);

        const cognitiveDiversityInsightByRole = (roleTitle) => {
            if (!cognitiveDiversityNeeded) return '';
            const base = `<div class="impact-highlight"><strong>Cognitive Diversity Insight:</strong><p><strong>${results.projectName}</strong> shows mixed signals across risk, value timing, and cost structure. Balance this ${roleTitle} view with cross-functional lenses before final prioritization.</p>`;
            if (roleTitle === 'CEO') return base + `<ul><li><strong>Bias Watch:</strong> Strategy urgency may overweight speed.</li><li><strong>Counterbalance:</strong> Validate execution realism with Chief Technology Officer and Chief Operations Officer capacity constraints.</li></ul></div>`;
            if (roleTitle === 'CFO') return base + `<ul><li><strong>Bias Watch:</strong> Cost control may underweight market timing.</li><li><strong>Counterbalance:</strong> Factor Chief Marketing Officer and Chief Executive Officer downside from delayed adoption windows.</li></ul></div>`;
            if (roleTitle === 'CTO') return base + `<ul><li><strong>Bias Watch:</strong> Quality and architecture rigor may stretch delivery timelines.</li><li><strong>Counterbalance:</strong> Align with Chief Financial Officer and Chief Executive Officer on value-at-risk per week.</li></ul></div>`;
            if (roleTitle === 'CMO') return base + `<ul><li><strong>Bias Watch:</strong> Market-speed emphasis may understate delivery risk.</li><li><strong>Counterbalance:</strong> Test campaign timing against Chief Technology Officer and Chief Operations Officer execution confidence.</li></ul></div>`;
            return base + `<ul><li><strong>Bias Watch:</strong> Throughput optimization can underweight strategic differentiation.</li><li><strong>Counterbalance:</strong> Keep Chief Executive Officer and Chief Marketing Officer value-priority signals in the sequencing decision.</li></ul></div>`;
        };

        const comparativeRoleInsight = (roleTitle) => this.generateComparativeRoleInsight(roleTitle, results, formatCurrency);

        const roleLayout = (qualitativeBody, quantitativeBody, roleTitle, recommendationBody) => `
            <div class="impact-highlight">
                <strong>${roleTitle} Summary:</strong>
                <p><strong>${results.projectName}</strong> carries an estimated ${formatCurrency(totalImpact)} economic exposure over a ${results.delayWeeks} week delay window.</p>
            </div>
            ${comparativeRoleInsight(roleTitle)}
            <div class="executive-two-column">
                <div class="executive-col executive-col-qualitative">
                    <h4>Qualitative View</h4>
                    <p><strong>${workItemTypeCapitalized} Focus:</strong> <strong>${results.projectName}</strong> (${results.developmentWeeks} week build, ${results.delayWeeks} week delay)</p>
                    ${qualitativeBody}
                </div>
                <div class="executive-col executive-col-quantitative">
                    <h4>Quantitative View</h4>
                    <p><strong>Entry Metrics:</strong> <strong>${results.projectName}</strong> at ${formatCurrency(results.weeklyValue)} weekly ${valueTypeLabelLower}, Cost of Delay Divided by Duration ${formatCurrency(results.cd3)} per week</p>
                    ${quantitativeBody}
                </div>
            </div>
            ${cognitiveDiversityInsightByRole(roleTitle)}
            <div class="recommendation-box">
                <strong>${roleTitle} Recommendation:</strong>
                <p>${recommendationBody}</p>
            </div>
        `;

        // CEO Perspective
        const ceoAnalysis = document.getElementById('ceo-analysis');
        if (ceoAnalysis) {
            ceoAnalysis.innerHTML = roleLayout(
                `
                <p>The ${results.projectName} delay weakens leadership confidence in execution speed and shifts value-delivery timing against portfolio commitments.</p>
                <ul>
                    <li><strong>${workItemTypeCapitalized} Outcomes:</strong> ${results.projectName} delivers customer value later, slowing realization of planned strategic differentiators.</li>
                    <li><strong>Portfolio Tradeoff:</strong> Capital and leadership attention remain tied to delayed initiatives instead of redeployment to next-best bets.</li>
                    <li><strong>Enterprise Signal:</strong> Delay patterns indicate decision-latency or governance friction that scales portfolio risk.</li>
                </ul>
                `,
                `
                <ul class="exec-kpi-list">
                    <li><strong>Total Economic Exposure:</strong> ${formatCurrency(totalImpact)}</li>
                    <li><strong>Deferred Value (Benefit Loss):</strong> ${formatCurrency(results.totalCostOfDelay)} in delayed ${valueTypeLabelLower}</li>
                    <li><strong>Weekly Value Delivery Gap:</strong> ${formatCurrency(results.weeklyValue)} per week in ${valueTypeLabelLower}</li>
                    <li><strong>Delay Duration:</strong> ${results.delayWeeks} weeks (${delayMonths} months)</li>
                    <li><strong>Portfolio Priority Signal:</strong> Cost of Delay Divided by Duration ${formatCurrency(results.cd3)} per week</li>
                </ul>
                `,
                'CEO',
                `Re-baseline this initiative against portfolio Cost of Delay Divided by Duration and strategic outcomes. If it remains top-tier, assign direct executive sponsorship, time-box blocker removal, and track weekly recovery on value delivered, delay reduction, and avoidable cost.`
            );
        }

        // CTO Perspective
        const ctoAnalysis = document.getElementById('cto-analysis');
        if (ctoAnalysis) {
            ctoAnalysis.innerHTML = roleLayout(
                `
                <p>The ${results.projectName} delay suggests delivery-system constraints in dependencies, sequencing, or architecture readiness that reduce confidence in predictable value delivery.</p>
                <ul>
                    <li><strong>${workItemTypeCapitalized} Risk:</strong> Prolonged queue time can force scope pressure and quality compromises.</li>
                    <li><strong>Portfolio Effect:</strong> Shared platform bottlenecks can cascade into other roadmap commitments.</li>
                    <li><strong>Engineering Quality:</strong> Rushed recovery attempts increase defect and rework probability.</li>
                </ul>
                `,
                `
                <ul class="exec-kpi-list">
                    <li><strong>Value at Risk per Week:</strong> ${formatCurrency(results.weeklyValue)}</li>
                    <li><strong>Delay-Period Exposure:</strong> ${formatCurrency(results.totalCostOfDelay)}</li>
                    <li><strong>Delivery Priority:</strong> Cost of Delay Divided by Duration ${formatCurrency(results.cd3)} per week</li>
                    <li><strong>Schedule Slip:</strong> ${results.delayWeeks} weeks over ${results.developmentWeeks} weeks planned</li>
                    ${results.hasEmployeeCosts ? `<li><strong>Team Burn During Delay:</strong> ${formatCurrency(results.teamWeeklyCost)} per week</li>` : ''}
                </ul>
                `,
                'CTO',
                `Stabilize the critical path: isolate top blockers, reduce concurrent Work In Progress, and prioritize the thinnest releasable increments that recover value without compromising reliability.`
            );
        }

        // CFO Perspective
        const cfoAnalysis = document.getElementById('cfo-analysis');
        cfoAnalysis.innerHTML = roleLayout(
            `
            <p>This ${results.projectName} delay stretches time-to-value and worsens portfolio efficiency by keeping spend active while expected benefits remain unrealized.</p>
            <ul>
                <li><strong>${workItemTypeCapitalized} Lens:</strong> ${valueTypeLabel} inflection point shifts right, delaying cash-flow contribution.</li>
                <li><strong>Portfolio Lens:</strong> Capital efficiency declines when high-impact initiatives under-deliver on planned timelines.</li>
                <li><strong>Decision Lens:</strong> Priority should be set by economic recovery speed, not sunk-cost bias.</li>
            </ul>
            `,
            `
            <ul class="exec-kpi-list">
                <li><strong>Total Economic Impact:</strong> ${formatCurrency(totalImpact)}</li>
                <li><strong>Direct Cost of Delay:</strong> ${formatCurrency(results.totalCostOfDelay)}</li>
                <li><strong>Annual Impact Ratio:</strong> ${results.opportunityCost.toFixed(1)}%</li>
                <li><strong>Cost of Delay Divided by Duration Weekly Economic Impact:</strong> ${formatCurrency(results.cd3)} per week</li>
                ${results.hasEmployeeCosts ? `<li><strong>Delay Burn Cost:</strong> ${formatCurrency(results.totalDelayCost)} (${formatCurrency(results.teamWeeklyCost)} per week)</li>` : ''}
                ${results.hasEmployeeCosts ? `<li><strong>Development Investment:</strong> ${formatCurrency(results.totalDevelopmentCost)}</li>` : ''}
            </ul>
            `,
            'CFO',
            `Use Cost of Delay Divided by Duration and total exposure to rank this against competing initiatives; recover weeks where marginal value recapture exceeds incremental recovery cost.`
        );

        // CMO Perspective
        const cmoAnalysis = document.getElementById('cmo-analysis');
        cmoAnalysis.innerHTML = roleLayout(
            `
            <p>Delay in ${results.projectName} reduces momentum in customer acquisition narratives and weakens market confidence in delivery reliability for this product line.</p>
            <ul>
                <li><strong>${workItemTypeCapitalized} Story:</strong> Value proposition lands later, giving competitors narrative and category-defining advantage.</li>
                <li><strong>Portfolio Story:</strong> Launch sequencing drift can cannibalize adjacent campaign plans and dilute cross-sell timing.</li>
                <li><strong>Customer Trust:</strong> Missed delivery expectations increase churn risk and raise future win-back effort.</li>
            </ul>
            `,
            `
            <ul class="exec-kpi-list">
                <li><strong>Market Opportunity at Risk:</strong> ${formatCurrency(results.weeklyValue)} per week</li>
                <li><strong>Total Delay Window:</strong> ${results.delayWeeks} weeks (${delayMonths} months)</li>
                <li><strong>Economic Priority Signal:</strong> Cost of Delay Divided by Duration ${formatCurrency(results.cd3)} per week</li>
                <li><strong>Portfolio Exposure:</strong> ${formatCurrency(totalImpact)} total impact</li>
                <li><strong>Urgency Profile:</strong> ${results.urgencyProfile.replace('-', ' ')}</li>
            </ul>
            `,
            'CMO',
            `Prioritize interim value-delivery moments (MVP/release slices) to protect market share while full scope is completed; align campaign timing to recovered delivery milestones.`
        );

        // COO Perspective
        const cooAnalysis = document.getElementById('coo-analysis');
        cooAnalysis.innerHTML = roleLayout(
            `
            <p>The ${results.projectName} delay indicates flow inefficiency in execution, where throughput and decision latency are reducing realized value from this ${workItemType}.</p>
            <ul>
                <li><strong>${workItemTypeCapitalized} Delivery:</strong> Bottlenecks in approvals, dependencies, or coordination are extending cycle time.</li>
                <li><strong>Portfolio Operations:</strong> Delay on one high-value stream can starve downstream initiatives and shared teams.</li>
                <li><strong>Operating Discipline:</strong> Excess Work In Progress and multitasking reduce predictable value-delivery velocity.</li>
            </ul>
            `,
            `
            <ul class="exec-kpi-list">
                <li><strong>Weekly Economic Impact (Cost of Delay Divided by Duration):</strong> ${formatCurrency(results.cd3)} per week</li>
                <li><strong>Delay Duration:</strong> ${results.delayWeeks} weeks</li>
                ${results.hasEmployeeCosts ? `<li><strong>Team Weekly Burn:</strong> ${formatCurrency(results.teamWeeklyCost)}</li>` : ''}
                ${results.hasEmployeeCosts ? `<li><strong>Delay Cost of Resources:</strong> ${formatCurrency(results.totalDelayCost)}</li>` : ''}
                ${results.hasEmployeeCosts ? `<li><strong>Person-Weeks Delayed:</strong> ${(results.delayWeeks * results.teamSize).toFixed(0)}</li>` : ''}
                <li><strong>Total Economic Exposure:</strong> ${formatCurrency(totalImpact)}</li>
            </ul>
            `,
            'COO',
            `Apply flow-based recovery: reduce Work In Progress, remove top bottlenecks this week, and sequence work by Cost of Delay Divided by Duration so each recovered week returns ${formatCurrency(results.weeklyValue)} in value${results.hasEmployeeCosts ? ` plus ${formatCurrency(results.teamWeeklyCost)} in avoidable burn` : ''}.`
        );
    }

    generateOverview(results) {
        const overviewEl = document.getElementById('overviewSection');
        const contentEl = document.getElementById('overviewContent');
        if (!overviewEl || !contentEl) return;

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(Math.abs(value));
        };

        const totalImpact = results.totalCostOfDelay + (results.totalDelayCost || 0);
        const workItemType = this.getWorkItemType(results.projectName, results.itemType);
        const valueTypeLabel = results.valueType === 'cost-savings' ? 'Cost Savings' : 'Revenue';
        const lines = [];
        lines.push(`<p><strong>${results.projectName}</strong> — ${results.developmentWeeks} week development, ${results.delayWeeks} week delay (${workItemType}).</p>`);
        lines.push(`<p><strong>Weekly ${valueTypeLabel}:</strong> ${this.formatCodeValue(results.weeklyValue, (results.currencyCode || 'USD'), 2)} &nbsp; <strong>Annualized ${valueTypeLabel}:</strong> ${this.formatCodeValue((results.annualizedValue || (results.weeklyValue * 52)), (results.currencyCode || 'USD'), 0)}</p>`);
        lines.push(`<p><strong>Total Cost of Delay:</strong> ${formatCurrency(results.totalCostOfDelay)} &nbsp; <strong>Cost of Delay Divided by Duration:</strong> ${formatCurrency(results.cd3)} per week</p>`);
        if (results.hasEmployeeCosts) {
            lines.push(`<p><strong>Team Burn:</strong> ${results.teamSize} × ${formatCurrency(results.teamWeeklyCost)} per week → ${formatCurrency(results.totalDelayCost)} while delayed.</p>`);
        }
        lines.push(`<p><strong>Total Economic Impact:</strong> ${formatCurrency(totalImpact)}</p>`);

        // Recommendations (brief)
        const recs = [];
        recs.push('Prioritize based on Cost of Delay Divided by Duration to maximize value recovered per week.');
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
        return exportExecutiveHelper(this.currentResults);
    }

    getExecutiveAnalysisOptions(currentResults) {
        const list = [];
        const seen = new Set();
        const add = (option) => {
            if (!option || !option.projectName || seen.has(option.projectName)) return;
            seen.add(option.projectName);
            list.push(option);
        };

        add(currentResults);
        (this.comparisonProjects || []).forEach(add);

        if (this.comparisonSelections && this.comparisonSelections.size > 0) {
            const selected = list.filter((option) =>
                option.projectName === currentResults.projectName ||
                this.comparisonSelections.has(option.projectName)
            );
            if (selected.length > 0) return selected;
        }
        return list;
    }

    generateComparativeRoleInsight(roleTitle, currentResults, formatCurrencyFn) {
        const options = this.getExecutiveAnalysisOptions(currentResults);
        if (options.length <= 1) {
            return `<div class="impact-highlight"><strong>Analysis Scope:</strong><p>This ${roleTitle} view is focused on <strong>${currentResults.projectName}</strong> only.</p></div>`;
        }

        const ranked = [...options].sort((a, b) => b.cd3 - a.cd3);
        const topOption = ranked[0];
        const bottomOption = ranked[ranked.length - 1];

        const tradeoffByRole = {
            CEO: `Favoring <strong>${topOption.projectName}</strong> accelerates strategic value delivery, but deprioritizing <strong>${bottomOption.projectName}</strong> can defer optionality and portfolio resilience.`,
            CFO: `Prioritizing <strong>${topOption.projectName}</strong> improves near-term economic return velocity, but <strong>${bottomOption.projectName}</strong> may still protect cost structure or risk-adjusted returns depending on execution certainty.`,
            CTO: `Accelerating <strong>${topOption.projectName}</strong> improves value capture speed, but sequencing tradeoffs can increase technical concentration risk if <strong>${bottomOption.projectName}</strong> reduces architecture debt or platform fragility.`,
            CMO: `Backing <strong>${topOption.projectName}</strong> preserves market momentum, while delaying <strong>${bottomOption.projectName}</strong> can weaken campaign timing and customer narrative depth.`,
            COO: `Executing <strong>${topOption.projectName}</strong> first improves flow return per week, but delaying <strong>${bottomOption.projectName}</strong> may create downstream bottlenecks if dependencies are operationally coupled.`
        };

        const rows = ranked.map((option) => {
            const totalImpact = option.totalCostOfDelay + (option.totalDelayCost || 0);
            return `<li><strong>${option.projectName}</strong>: CD3 ${formatCurrencyFn(option.cd3)} per week, Cost of Delay ${formatCurrencyFn(option.totalCostOfDelay)}, Total Impact ${formatCurrencyFn(totalImpact)}, Delay ${option.delayWeeks} week${option.delayWeeks !== 1 ? 's' : ''}</li>`;
        }).join('');

        return `
            <div class="impact-highlight">
                <strong>Comparative Options View:</strong>
                <p>This ${roleTitle} perspective compares <strong>${ranked.length}</strong> options, including <strong>${currentResults.projectName}</strong>.</p>
                <ul>${rows}</ul>
                <p><strong>Tradeoff Implication:</strong> ${tradeoffByRole[roleTitle] || tradeoffByRole.COO}</p>
            </div>
        `;
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
        this.chart = createDelayChartHelper(this.chart, results);
    }

    upsertCurrentResultInComparison({ showAlerts = true, confirmReplace = true } = {}) {
        if (!this.currentResults) {
            if (showAlerts) alert('Please calculate a project first');
            return;
        }

        const existingIndex = this.comparisonProjects.findIndex(
            p => p.projectName === this.currentResults.projectName
        );

        if (existingIndex >= 0) {
            if (!confirmReplace || confirm('A project with this name already exists. Replace it?')) {
                this.comparisonProjects[existingIndex] = { ...this.currentResults };
            } else {
                return;
            }
        } else {
            this.comparisonProjects.push({ ...this.currentResults });
        }

        this.updateComparisonView();
        if (showAlerts) alert(`"${this.currentResults.projectName}" added to comparison!`);
    }

    addToComparison() {
        this.upsertCurrentResultInComparison({ showAlerts: true, confirmReplace: true });
    }

    autofillDemoProjects() {
        const demoProjects = [
            {
                projectName: 'Mobile Checkout Redesign',
                itemType: 'product',
                valueType: 'revenue',
                currencyCode: 'USD',
                targetLaunchDate: '03-15-2026',
                revisedLaunchDate: '04-12-2026',
                weeklyValue: 125000,
                developmentWeeks: 8,
                delayWeeks: 4,
                urgencyProfile: 'expedite',
                salaryType: 'annual',
                annualSalary: 135000,
                teamSize: 7,
                benefitsMultiplier: 1.6
            },
            {
                projectName: 'Enterprise SSO Integration',
                itemType: 'project',
                valueType: 'cost-savings',
                currencyCode: 'EUR',
                targetLaunchDate: '05-01-2026',
                revisedLaunchDate: '06-05-2026',
                weeklyValue: 90000,
                developmentWeeks: 10,
                delayWeeks: 5,
                urgencyProfile: 'fixed-date',
                salaryType: 'annual',
                annualSalary: 145000,
                teamSize: 6,
                benefitsMultiplier: 1.5
            },
            {
                projectName: 'Analytics Self-Serve Dashboard',
                itemType: 'product',
                valueType: 'revenue',
                currencyCode: 'GBP',
                targetLaunchDate: '04-20-2026',
                revisedLaunchDate: '05-11-2026',
                weeklyValue: 70000,
                developmentWeeks: 7,
                delayWeeks: 3,
                urgencyProfile: 'standard',
                salaryType: 'annual',
                annualSalary: 120000,
                teamSize: 5,
                benefitsMultiplier: 1.4
            }
        ];

        this.comparisonProjects = [];
        this.comparisonSelections = new Set();

        demoProjects.forEach((project, index) => {
            document.getElementById('projectName').value = project.projectName;
            document.getElementById('itemTypeProject').checked = project.itemType !== 'product';
            document.getElementById('itemTypeProduct').checked = project.itemType === 'product';
            document.getElementById('valueTypeRevenue').checked = project.valueType !== 'cost-savings';
            document.getElementById('valueTypeCostSavings').checked = project.valueType === 'cost-savings';
            document.getElementById('targetLaunchDate').value = project.targetLaunchDate;
            document.getElementById('revisedLaunchDate').value = project.revisedLaunchDate;
            document.getElementById('weeklyValue').value = project.weeklyValue;
            document.getElementById('currencyCode').value = project.currencyCode;
            document.getElementById('developmentWeeks').value = project.developmentWeeks;
            document.getElementById('delayWeeks').value = project.delayWeeks;
            document.getElementById('urgencyProfile').value = project.urgencyProfile;
            document.getElementById('salaryTypeAnnual').checked = project.salaryType !== 'hourly';
            document.getElementById('salaryTypeHourly').checked = project.salaryType === 'hourly';
            document.getElementById('annualSalary').value = project.annualSalary;
            document.getElementById('teamSize').value = project.teamSize;
            document.getElementById('benefitsMultiplier').value = project.benefitsMultiplier;

            this.updateValueTypeLabels();
            this.updateAnnualizedEstimate();
            this.toggleSalaryInput();
            this.calculate();
            this.upsertCurrentResultInComparison({ showAlerts: false, confirmReplace: false });

            if (index === demoProjects.length - 1) {
                this.visualsBuilt = true;
                this.buildVisuals();
            }
        });

        alert('✅ Autofilled 3 demo projects. Analysis, comparison, and executive perspectives are ready.');
    }

    updateComparisonView() {
        updateComparisonViewHelper(this);
    }

    createComparisonTable(projects) {
        createComparisonTableHelper(this, projects);
    }

    createComparisonChart(projects) {
        this.comparisonChart = createComparisonChartHelper(this.comparisonChart, projects);
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
        return exportJsonHelper(this.currentResults, this.comparisonProjects);
    }

    generateImages() {
        if (!this.currentResults) {
            alert('Please calculate a project first');
            return;
        }

        // placeholder behaviour remains
        alert('Generating images of your Cost of Delay analysis...\n\nThis will capture:\n• Cost of Delay Analysis\n• Charts and Visualizations\n• Executive Perspectives\n\nNote: Install html2canvas library for full functionality.');
    }

    exportCsv() {
        return exportCsvHelper(this.currentResults, this.comparisonProjects);
    }

    exportExcel() {
        return exportExcelHelper(this.currentResults, this.comparisonProjects);
    }

    printReport() {
        window.print();
    }
}

// Expose for test runner and reuse
window.CostOfDelayCalculator = CostOfDelayCalculator;

// Initialize calculator once and reuse the same instance
let calculator;
function initializeCalculator() {
    if (calculator) return calculator;

    console.log('🚀 Initializing Cost of Delay Calculator...');
    try {
        calculator = new CostOfDelayCalculator();
        window.calculator = calculator;
        console.log('✅ Calculator initialized successfully');
        console.log('Calculator instance:', calculator);
    } catch (error) {
        console.error('❌ Error initializing calculator:', error);
        console.error('Error stack:', error.stack);
        alert('Error initializing calculator. Check console for details.');
    }
    return calculator;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCalculator, { once: true });
} else {
    initializeCalculator();
}
