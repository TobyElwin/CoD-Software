// calculation utilities for cost-of-delay

/**
 * Compute employee costs taking salary/benefits and team size into account.
 *
 * @param {number} annualSalary - salary or equivalent annual cost per person
 * @param {number} teamSize - number of people on the team
 * @param {number} benefitsMultiplier - multiplier for benefits/overhead (e.g. 1.5)
 * @param {number} developmentWeeks - planned development duration (weeks)
 * @param {number} delayWeeks - weeks of delay being modelled
 * @returns {Object} detailed employee cost breakdown or { hasEmployeeCosts: false }
 */
export function calculateEmployeeCosts(annualSalary, teamSize, benefitsMultiplier, developmentWeeks, delayWeeks) {
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

/**
 * Convert a linear weekly value and delay into losses for the "standard" urgency profile.
 */
export function computeStandardLosses(weeklyValue, delayWeeks) {
    const losses = [];
    for (let i = 0; i < delayWeeks; i++) {
        losses.push(weeklyValue);
    }
    return {
        weeklyLosses: losses,
        totalCostOfDelay: weeklyValue * delayWeeks,
        peakWeeklyLoss: weeklyValue
    };
}

/**
 * Exponential decay profile used when expedite is selected.
 */
export function computeExpediteLosses(weeklyValue, delayWeeks) {
    const losses = [];
    let totalCost = 0;
    for (let i = 0; i < delayWeeks; i++) {
        const weeklyLoss = weeklyValue * Math.exp(-i / (delayWeeks || 1) * 0.5);
        losses.push(weeklyLoss);
        totalCost += weeklyLoss;
    }
    return {
        weeklyLosses: losses,
        totalCostOfDelay: totalCost,
        peakWeeklyLoss: losses[0] || 0
    };
}

/**
 * Fixed-date profile: penalty doubles after a deadline roughly 70% of the way through.
 */
export function computeFixedDateLosses(weeklyValue, delayWeeks) {
    const losses = [];
    let totalCost = 0;
    const deadlineWeek = Math.floor(delayWeeks * 0.70);
    for (let i = 0; i < delayWeeks; i++) {
        const loss = i < deadlineWeek ? weeklyValue * 0.5 : weeklyValue * 2;
        losses.push(loss);
        totalCost += loss;
    }
    return {
        weeklyLosses: losses,
        totalCostOfDelay: totalCost,
        peakWeeklyLoss: weeklyValue * 2
    };
}

/**
 * Intangible profile where value grows over time.
 */
export function computeIntangibleLosses(weeklyValue, delayWeeks) {
    const losses = [];
    let totalCost = 0;
    for (let i = 0; i < delayWeeks; i++) {
        const weeklyLoss = weeklyValue * (0.3 + (i / delayWeeks) * 0.7);
        losses.push(weeklyLoss);
        totalCost += weeklyLoss;
    }
    return {
        weeklyLosses: losses,
        totalCostOfDelay: totalCost,
        peakWeeklyLoss: losses[losses.length - 1] || 0
    };
}

/**
 * Main cost-of-delay entry point.  Validates inputs and dispatches to helper profiles.
 *
 * @param {number} weeklyValue
 * @param {number} developmentWeeks
 * @param {number} delayWeeks
 * @param {string} urgencyProfile - one of 'standard','expedite','fixed-date','intangible'
 * @returns {CoDResult}
 */
export function calculateCostOfDelay(weeklyValue, developmentWeeks, delayWeeks, urgencyProfile) {
    const validProfiles = ['standard', 'expedite', 'fixed-date', 'intangible'];
    if (typeof urgencyProfile !== 'string' || !validProfiles.includes(urgencyProfile)) {
        throw new Error('Invalid urgency profile: "' + urgencyProfile + '". Must be one of: ' + validProfiles.join(', '));
    }
    if (Number(weeklyValue) < 0 || Number(developmentWeeks) < 0 || Number(delayWeeks) < 0) {
        throw new Error('weeklyValue, developmentWeeks, and delayWeeks must be non-negative');
    }
    if (Number(developmentWeeks) === 0) {
        throw new Error('developmentWeeks must be greater than zero');
    }

    let breakdown;
    switch (urgencyProfile) {
        case 'standard':
            breakdown = computeStandardLosses(weeklyValue, delayWeeks);
            break;
        case 'expedite':
            breakdown = computeExpediteLosses(weeklyValue, delayWeeks);
            break;
        case 'fixed-date':
            breakdown = computeFixedDateLosses(weeklyValue, delayWeeks);
            break;
        case 'intangible':
            breakdown = computeIntangibleLosses(weeklyValue, delayWeeks);
            break;
    }

    const { weeklyLosses, totalCostOfDelay, peakWeeklyLoss } = breakdown;

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