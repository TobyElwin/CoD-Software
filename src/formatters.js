// formatting helpers for currency display

// Format currency with no decimals, show negative values in red parentheses
export function formatCurrency(value) {
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
}

// Format currency with two decimals (used for hourly rates, etc.)
export function formatCurrencyDetailed(value) {
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
}
