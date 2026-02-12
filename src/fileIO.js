// Utilities for saving and loading project state to/from files

export function saveAs(currentResults) {
    if (!currentResults) {
        alert('Nothing to save');
        return;
    }

    const dataStr = JSON.stringify(currentResults, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cod-save-${String(currentResults.projectName || 'project').replace(/\s+/g, '-')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function loadFromFile(callback) {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput) return;

    fileInput.addEventListener('change', (e) => handleFileLoad(e, callback));
}

export function handleFileLoad(event, callback) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (typeof callback === 'function') {
                callback(data);
            }
        } catch (error) {
            alert('❌ Error loading file. Please ensure it is a valid Cost of Delay save file.\n\nError: ' + error.message);
        }
    };
    reader.readAsText(file);
    // reset
    event.target.value = '';
}
