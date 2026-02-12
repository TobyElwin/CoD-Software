function formatComparisonCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

export function createComparisonTable(calculator, projects) {
    const tableDiv = document.getElementById('comparisonTable');
    if (!tableDiv) return;

    let tableHTML = '<div class="comparison-table">';
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
                    <td><input type="checkbox" class="comparison-select" data-name="${encodeURIComponent(project.projectName)}" ${calculator.comparisonSelections.has(project.projectName) ? 'checked' : ''}></td>
                    <td><strong>${index + 1}</strong></td>
                    <td><strong>${project.projectName}</strong></td>
                    <td>${formatComparisonCurrency(project.cd3)}</td>
                    <td>${formatComparisonCurrency(project.totalCostOfDelay)}</td>
                    <td>${project.hasEmployeeCosts ? formatComparisonCurrency(project.totalDelayCost) : 'N/A'}</td>
                    <td><strong>${formatComparisonCurrency(totalImpact)}</strong></td>
                    <td>${project.developmentWeeks}w</td>
                    <td>${project.delayWeeks}w</td>
                    <td>${project.teamSize || 'N/A'}</td>
                    <td><span class="delete-project" data-name="${encodeURIComponent(project.projectName)}">×</span></td>
                </tr>
            `;
    });

    tableHTML += '</tbody></table></div>';
    tableDiv.innerHTML = tableHTML;

    const selectAll = tableDiv.querySelector('#comparison-select-all');
    const checkboxes = Array.from(tableDiv.querySelectorAll('.comparison-select'));
    const deleteBtns = Array.from(tableDiv.querySelectorAll('.delete-project'));

    const rebuild = () => {
        calculator.comparisonSelections.clear();
        checkboxes.forEach(cb => {
            if (cb.checked) calculator.comparisonSelections.add(decodeURIComponent(cb.dataset.name));
        });

        try {
            const compSection = document.getElementById('comparisonSection');
            if (compSection) {
                const header = compSection.querySelector('.comparison-header h2');
                if (header) {
                    const names = [...calculator.comparisonSelections].join(', ');
                    header.textContent = names.length > 0 ? `Project Comparison — ${names}` : 'Project Comparison';
                    header.title = names;
                }
            }
        } catch (e) {
            console.error(e);
        }

        if (calculator.visualsBuilt) {
            const sorted = [...calculator.comparisonProjects].sort((a, b) => b.cd3 - a.cd3);
            const filtered = sorted.filter(p => calculator.comparisonSelections.has(p.projectName));
            const toChart = filtered.length > 0 ? filtered : sorted;
            calculator.createComparisonChart(toChart);
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

    deleteBtns.forEach(btn => btn.addEventListener('click', () => {
        const name = decodeURIComponent(btn.dataset.name || btn.getAttribute('data-name'));
        if (name) calculator.removeProject(name);
    }));
}

export function updateComparisonView(calculator) {
    if (calculator.comparisonProjects.length === 0) {
        const section = document.getElementById('comparisonSection');
        if (section) section.style.display = 'none';
        return;
    }

    const section = document.getElementById('comparisonSection');
    if (section) section.style.display = 'block';

    const sortedProjects = [...calculator.comparisonProjects].sort((a, b) => b.cd3 - a.cd3);

    if (!calculator.comparisonSelections || calculator.comparisonSelections.size === 0) {
        calculator.comparisonSelections = new Set(sortedProjects.map(p => p.projectName));
    }

    createComparisonTable(calculator, sortedProjects);

    const filtered = sortedProjects.filter(p => calculator.comparisonSelections.has(p.projectName));
    const toChart = filtered.length > 0 ? filtered : sortedProjects;
    if (calculator.visualsBuilt) {
        calculator.createComparisonChart(toChart);
    }
}
