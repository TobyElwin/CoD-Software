// calculation utilities for cost-of-delay

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

export function calculateCostOfDelay(weeklyValue, developmentWeeks, delayWeeks, urgencyProfile) {
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
