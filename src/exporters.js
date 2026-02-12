// functions for exporting data (CSV, Excel, JSON, executive analysis etc.)

export function exportJson(currentResults, comparisonProjects) {
    if (!currentResults) {
        alert('No results to export');
        return;
    }

    const data = {
        exportDate: new Date().toISOString(),
        project: currentResults,
        comparison: comparisonProjects
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cost-of-delay-${String(currentResults.projectName || 'export').replace(/\s+/g, '-')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return jsonStr;
}

function getUniqueProjects(currentResults, comparisonProjects) {
    const comparison = Array.isArray(comparisonProjects) ? comparisonProjects : [];
    const sourceProjects = comparison.length > 0 ? comparison : [currentResults];
    const seen = new Set();

    return sourceProjects.filter((project) => {
        if (!project) return false;
        const key = [
            project.projectName,
            project.cd3,
            project.totalCostOfDelay,
            project.totalDelayCost || 0,
            project.developmentWeeks,
            project.delayWeeks,
            project.teamSize || '',
            project.weeklyValue,
            project.urgencyProfile,
            project.opportunityCost
        ].join('|');

        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

export function exportCsv(currentResults , comparisonProjects) {
    const projects = getUniqueProjects(currentResults, comparisonProjects);
    if (projects.length === 0) {
        alert('No results to export');
        return;
    }

    const sortedProjects = [...projects].sort((a, b) => b.cd3 - a.cd3);
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

export function exportExcel(currentResults, comparisonProjects) {
    const projects = getUniqueProjects(currentResults, comparisonProjects);
    if (projects.length === 0) {
        alert('No results to export');
        return;
    }

    const sortedProjects = [...projects].sort((a, b) => b.cd3 - a.cd3);

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
    // Append rows
    sortedProjects.forEach((project, idx) => {
        const totalImpact = project.totalCostOfDelay + (project.totalDelayCost || 0);
        htmlContent += `
            <tr>
                <td>${idx + 1}</td>
                <td>${project.projectName}</td>
                <td>${project.cd3.toFixed(2)}</td>
                <td>${project.totalCostOfDelay.toFixed(2)}</td>
                <td>${(project.totalDelayCost || 0).toFixed(2)}</td>
                <td>${totalImpact.toFixed(2)}</td>
                <td>${project.developmentWeeks}</td>
                <td>${project.delayWeeks}</td>
                <td>${project.teamSize || 'N/A'}</td>
                <td>${project.weeklyValue.toFixed(2)}</td>
                <td>${project.urgencyProfile}</td>
                <td>${project.opportunityCost.toFixed(2)}</td>
            </tr>
        `;
    });
    htmlContent += `
                    </tbody>
                </table>
            </body>
            </html>
        `;

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

export function exportExecutiveAnalysis(currentResults) {
    if (!currentResults) {
        alert('Calculate something first');
        return;
    }

    try {
        const parts = [];
        const header = `Executive Combined Analysis - ${new Date().toLocaleString()}\nProject: ${currentResults ? currentResults.projectName : 'N/A'}\n\n`;
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
        a.download = `executive-analysis-${(currentResults && currentResults.projectName ? currentResults.projectName.replace(/\s+/g,'-') : 'analysis')}-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('✅ Executive analysis exported');
        return text;
    } catch (e) {
        console.error('Error exporting executive analysis:', e);
        alert('❌ Error exporting executive analysis. Check console for details.');
        return null;
    }
}
