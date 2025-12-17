document.addEventListener('DOMContentLoaded', function () {
    let selectedRowData = null;
    let currentTable = null;
    let isEditing = false;

    // Table Schemas Configuration
    const tableSchemas = {
        'arrets_travail': [
            { key: 'id', label: 'ID', type: 'text', editable: false },
            { key: 'nom', label: 'Nom', type: 'text', editable: true },
            { key: 'prenom', label: 'Prénom', type: 'text', editable: true },
            { key: 'medecin', label: 'Médecin', type: 'text', editable: true },
            { key: 'nombre_jours', label: 'Jours', type: 'number', editable: true },
            { key: 'date_certificat', label: 'Date certificat', type: 'date', editable: true },
            { key: 'date_naissance', label: 'Date naissance', type: 'date', editable: true },
            { key: 'age', label: 'Âge', type: 'number', editable: true },
            { key: 'created_at', label: 'Créé le', type: 'text', editable: false }
        ],
        'prolongation': [
            { key: 'id', label: 'ID', type: 'text', editable: false },
            { key: 'nom', label: 'Nom', type: 'text', editable: true },
            { key: 'prenom', label: 'Prénom', type: 'text', editable: true },
            { key: 'medecin', label: 'Médecin', type: 'text', editable: true },
            { key: 'nombre_jours', label: 'Jours', type: 'number', editable: true },
            { key: 'date_certificat', label: 'Date certificat', type: 'date', editable: true },
            { key: 'date_naissance', label: 'Date naissance', type: 'date', editable: true },
            { key: 'age', label: 'Âge', type: 'number', editable: true },
            { key: 'created_at', label: 'Créé le', type: 'text', editable: false }
        ],
        'cbv': [
            { key: 'id', label: 'ID', type: 'text', editable: false },
            { key: 'nom', label: 'Nom', type: 'text', editable: true },
            { key: 'prenom', label: 'Prénom', type: 'text', editable: true },
            { key: 'medecin', label: 'Médecin', type: 'text', editable: true },
            { key: 'date_certificat', label: 'Date certificat', type: 'date', editable: true },
            { key: 'heure', label: 'Heure', type: 'time', editable: true },
            { key: 'date_naissance', label: 'Date naissance', type: 'date', editable: true },
            { key: 'titre', label: 'Titre', type: 'text', editable: true },
            { key: 'examen', label: 'Examen', type: 'text', editable: true },
            { key: 'created_at', label: 'Créé le', type: 'text', editable: false }
        ],
        'antirabique': [
            { key: 'id', label: 'ID', type: 'text', editable: false },
            { key: 'nom', label: 'Nom', type: 'text', editable: true },
            { key: 'prenom', label: 'Prénom', type: 'text', editable: true },
            { key: 'medecin', label: 'Médecin', type: 'text', editable: true },
            { key: 'classe', label: 'Classe', type: 'text', editable: true },
            { key: 'type_de_vaccin', label: 'Type vaccin', type: 'text', editable: true },
            { key: 'shema', label: 'Schéma', type: 'text', editable: true },
            { key: 'date_de_certificat', label: 'Date certificat', type: 'date', editable: true },
            { key: 'date_de_naissance', label: 'Date naissance', type: 'date', editable: true },
            { key: 'animal', label: 'Animal', type: 'text', editable: true },
            { key: 'created_at', label: 'Créé le', type: 'text', editable: false }
        ]
    };

    // Set default dates
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const dateFinInput = document.getElementById('dateFin');
    const dateDebutInput = document.getElementById('dateDebut');

    if (dateFinInput) dateFinInput.value = today.toISOString().split('T')[0];
    if (dateDebutInput) dateDebutInput.value = thirtyDaysAgo.toISOString().split('T')[0];

    // Form submission handler
    const dateForm = document.getElementById('dateForm');
    if (dateForm) {
        dateForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form values
            const table = document.getElementById('table').value;
            const dateDebut = document.getElementById('dateDebut').value;
            const dateFin = document.getElementById('dateFin').value;

            currentTable = table;
            selectedRowData = null;
            isEditing = false;
            updateToolbarState();

            // Reset messages
            const successMessage = document.getElementById('successMessage');
            const errorMessage = document.getElementById('errorMessage');
            const resultsDiv = document.getElementById('results');
            const loadingDiv = document.getElementById('loading');

            if (successMessage) successMessage.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'none';
            if (resultsDiv) resultsDiv.style.display = 'none';
            if (loadingDiv) loadingDiv.style.display = 'block';

            try {
                // Call retrieval function
                const resultat = await recupererDonneesEntreDates(table, dateDebut, dateFin);

                if (loadingDiv) loadingDiv.style.display = 'none';

                if (resultat && resultat.ok) {
                    // Show success message
                    if (successMessage) {
                        successMessage.textContent = `✅ ${resultat.returned} enregistrements trouvés sur ${resultat.total} au total`;
                        successMessage.style.display = 'block';
                    }

                    // Display results
                    afficherResultats(resultat.data, table);

                } else {
                    // Show error
                    if (errorMessage) {
                        errorMessage.textContent = `❌ Erreur: ${resultat ? resultat.error : 'Réponse invalide'}`;
                        errorMessage.style.display = 'block';
                    }
                }
            } catch (error) {
                if (loadingDiv) loadingDiv.style.display = 'none';
                if (errorMessage) {
                    errorMessage.textContent = `❌ Erreur: ${error.message}`;
                    errorMessage.style.display = 'block';
                }
            }
        });
    }

    function afficherResultats(data, table) {
        const resultsContent = document.getElementById('resultsContent');
        const toolbar = document.getElementById('toolbar');
        const resultsDiv = document.getElementById('results');

        if (!resultsContent) return;

        if (!data || data.length === 0) {
            resultsContent.innerHTML = '<p>Aucun enregistrement trouvé.</p>';
            if (resultsDiv) resultsDiv.style.display = 'block';
            if (toolbar) toolbar.style.display = 'none';
            return;
        }

        if (toolbar) toolbar.style.display = 'flex';

        // Get schema for the table
        const schema = tableSchemas[table];

        // Create HTML table
        const tableElement = document.createElement('table');
        tableElement.id = 'dataTable';

        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        if (schema) {
            schema.forEach(field => {
                const th = document.createElement('th');
                th.textContent = field.label;
                headerRow.appendChild(th);
            });
        } else {
            // Fallback for unknown tables
            if (data.length > 0) {
                Object.keys(data[0]).forEach(key => {
                    const th = document.createElement('th');
                    th.textContent = key;
                    headerRow.appendChild(th);
                });
            }
        }
        thead.appendChild(headerRow);
        tableElement.appendChild(thead);

        // Create table body
        const tbody = document.createElement('tbody');
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', row.id);
            tr.style.cursor = 'pointer';

            // Store full data in a hidden input
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.className = 'row-data';
            hiddenInput.value = JSON.stringify(row);
            tr.appendChild(hiddenInput);

            if (schema) {
                schema.forEach(field => {
                    const val = row[field.key] !== null && row[field.key] !== undefined ? row[field.key] : '';
                    const td = document.createElement('td');
                    td.setAttribute('data-key', field.key);
                    td.textContent = val;
                    tr.appendChild(td);
                });
            } else {
                Object.values(row).forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell !== null ? cell : '';
                    tr.appendChild(td);
                });
            }
            tbody.appendChild(tr);
        });
        tableElement.appendChild(tbody);

        resultsContent.textContent = '';
        resultsContent.appendChild(tableElement);
        if (resultsDiv) resultsDiv.style.display = 'block';

        // Add selection listeners
        const rows = resultsContent.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.addEventListener('click', function (e) {
                // Prevent selection change if editing
                if (isEditing) return;

                // Deselect others
                rows.forEach(r => r.style.backgroundColor = '');

                // Select current
                this.style.backgroundColor = '#e2e6ea';

                // Retrieve data
                const hiddenInput = this.querySelector('.row-data');
                if (hiddenInput) {
                    try {
                        selectedRowData = JSON.parse(hiddenInput.value);
                        updateToolbarState();
                    } catch (e) {
                        console.error('Error parsing row data', e);
                    }
                }
            });
        });
    }

    function updateToolbarState() {
        const btnModifier = document.getElementById('btnModifier');
        const btnSupprimer = document.getElementById('btnSupprimer');
        const selectedInfo = document.getElementById('selectedInfo');

        if (selectedRowData) {
            if (btnModifier) {
                btnModifier.disabled = false;
                btnModifier.style.opacity = '1';
                btnModifier.style.cursor = 'pointer';

                // Update button text/icon based on edit mode
                if (isEditing) {
                    btnModifier.innerHTML = '<i class="fas fa-save"></i> Enregistrer';
                    btnModifier.style.backgroundColor = '#28a745'; // Green
                    btnModifier.style.color = 'white';
                } else {
                    btnModifier.innerHTML = '<i class="fas fa-edit"></i> Modifier';
                    btnModifier.style.backgroundColor = '#ffc107'; // Yellow
                    btnModifier.style.color = 'black';
                }
            }

            if (btnSupprimer) {
                // Disable delete while editing
                if (isEditing) {
                    btnSupprimer.disabled = true;
                    btnSupprimer.style.opacity = '0.5';
                    btnSupprimer.style.cursor = 'not-allowed';
                } else {
                    btnSupprimer.disabled = false;
                    btnSupprimer.style.opacity = '1';
                    btnSupprimer.style.cursor = 'pointer';
                }
            }

            if (selectedInfo) {
                selectedInfo.textContent = `Sélectionné : ${selectedRowData.nom || ''} ${selectedRowData.prenom || ''} (ID: ${selectedRowData.id})`;
            }
        } else {
            if (btnModifier) {
                btnModifier.disabled = true;
                btnModifier.style.opacity = '0.5';
                btnModifier.style.cursor = 'not-allowed';
                btnModifier.innerHTML = '<i class="fas fa-edit"></i> Modifier';
                btnModifier.style.backgroundColor = '#ffc107';
                btnModifier.style.color = 'black';
            }

            if (btnSupprimer) {
                btnSupprimer.disabled = true;
                btnSupprimer.style.opacity = '0.5';
                btnSupprimer.style.cursor = 'not-allowed';
            }

            if (selectedInfo) {
                selectedInfo.textContent = 'Aucune ligne sélectionnée';
            }
        }
    }

    // Delete button handler
    const btnSupprimer = document.getElementById('btnSupprimer');
    if (btnSupprimer) {
        btnSupprimer.addEventListener('click', async function () {
            if (!selectedRowData || !currentTable || isEditing) return;

            if (!confirm(`Êtes-vous sûr de vouloir supprimer l'enregistrement de ${selectedRowData.nom} ${selectedRowData.prenom} ?\nCette action est irréversible.`)) {
                return;
            }

            try {
                const message = {
                    action: 'supprimer_enregistrement',
                    table: currentTable,
                    id: selectedRowData.id
                };

                const response = await envoyerMessageNatif(message);

                if (response && (response.ok || response.status === 'success')) {
                    alert('✅ Enregistrement supprimé avec succès.');
                    // Refresh list
                    const dateForm = document.getElementById('dateForm');
                    if (dateForm) dateForm.dispatchEvent(new Event('submit'));
                } else {
                    alert(`❌ Erreur lors de la suppression : ${response.error || 'Erreur inconnue'}`);
                }
            } catch (error) {
                console.error('Erreur suppression:', error);
                alert(`❌ Erreur lors de la suppression : ${error.message}`);
            }
        });
    }

    // Modify button handler
    const btnModifier = document.getElementById('btnModifier');
    if (btnModifier) {
        btnModifier.addEventListener('click', async function () {
            if (!selectedRowData || !currentTable) return;

            if (!isEditing) {
                // ENTER EDIT MODE
                isEditing = true;
                updateToolbarState();

                // Find the selected row
                const row = document.querySelector(`tr[data-id="${selectedRowData.id}"]`);
                if (!row) return;

                const schema = tableSchemas[currentTable];
                if (!schema) {
                    alert("Schéma de table non trouvé pour l'édition.");
                    isEditing = false;
                    updateToolbarState();
                    return;
                }

                // Convert cells to inputs
                schema.forEach(field => {
                    if (field.editable) {
                        const cell = row.querySelector(`td[data-key="${field.key}"]`);
                        if (cell) {
                            const currentValue = cell.textContent;
                            let inputType = field.type || 'text';

                            // Special handling for dates to ensure YYYY-MM-DD format for input type="date"
                            let valueToSet = currentValue;

                            cell.textContent = '';
                            const input = document.createElement('input');
                            input.type = inputType;
                            input.className = 'edit-input';
                            input.setAttribute('data-key', field.key);
                            input.value = valueToSet;
                            input.style.width = '100%';
                            input.style.boxSizing = 'border-box';
                            cell.appendChild(input);
                        }
                    }
                });

            } else {
                // SAVE CHANGES
                const row = document.querySelector(`tr[data-id="${selectedRowData.id}"]`);
                if (!row) return;

                const inputs = row.querySelectorAll('.edit-input');
                const newData = { ...selectedRowData }; // Start with existing data

                // Update with input values
                inputs.forEach(input => {
                    const key = input.getAttribute('data-key');
                    newData[key] = input.value;
                });

                try {
                    const message = {
                        action: 'modifier_enregistrement',
                        table: currentTable,
                        data: newData
                    };

                    const response = await envoyerMessageNatif(message);

                    if (response && (response.ok || response.status === 'success')) {
                        alert('✅ Enregistrement modifié avec succès.');
                        isEditing = false;
                        // Refresh list to show updated data and exit edit mode cleanly
                        const dateForm = document.getElementById('dateForm');
                        if (dateForm) dateForm.dispatchEvent(new Event('submit'));
                    } else {
                        alert(`❌ Erreur lors de la modification : ${response.error || 'Erreur inconnue'}`);
                    }
                } catch (error) {
                    console.error('Erreur modification:', error);
                    alert(`❌ Erreur lors de la modification : ${error.message}`);
                }
            }
        });
    }

    // Export Excel button
    const exportExcelBtn = document.getElementById('exportExcel');
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', function () {
            const rows = document.querySelectorAll('#dataTable tbody tr');
            if (rows.length === 0) {
                alert('Aucune donnée à exporter');
                return;
            }

            const data = [];
            rows.forEach(row => {
                const hiddenInput = row.querySelector('.row-data');
                if (hiddenInput) {
                    try {
                        data.push(JSON.parse(hiddenInput.value.replace(/&quot;/g, '"')));
                    } catch (e) { }
                }
            });

            exportToExcel(currentTable, data);
        });
    }

    // Print Table button
    const printTableBtn = document.getElementById('printTable');
    if (printTableBtn) {
        printTableBtn.addEventListener('click', function () {
            printTable();
        });
    }

    // Export to Excel function
    function exportToExcel(tableName, data) {
        if (!data || data.length === 0) {
            alert('Aucune donnée à exporter');
            return;
        }

        if (typeof XLSX === 'undefined') {
            exportToCSV(tableName, data);
            return;
        }

        try {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');
            const filename = `donnees_${tableName}_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(workbook, filename);
        } catch (error) {
            console.error('Erreur lors de l\'export XLSX:', error);
            exportToCSV(tableName, data);
        }
    }

    // Export to CSV function
    function exportToCSV(tableName, data) {
        let csvContent = '';
        const headers = Object.keys(data[0]);
        csvContent += headers.join(',') + '\n';

        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            });
            csvContent += values.join(',') + '\n';
        });

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `donnees_${tableName}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('Bibliothèque XLSX non disponible. Le fichier a été exporté au format CSV.');
    }

    // Print table function
    function printTable() {
        const table = document.querySelector('#resultsContent table');

        if (!table) {
            alert('Aucun tableau à imprimer');
            return;
        }

        const tableHTML = table.outerHTML;
        const printContent = `
            <html>
                <head>
                    <title>Impression des données</title>
                    <style>
                        table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        h1 { text-align: center; }
                    </style>
                </head>
                <body>
                    <h1>Données exportées - ${currentTable || ''}</h1>
                    ${tableHTML}
                </body>
            </html>
        `;

        const blob = new Blob([printContent], { type: 'text/html' });
        const blobURL = URL.createObjectURL(blob);
        const printWindow = window.open(blobURL, '_blank');

        printWindow.addEventListener('load', () => {
            printWindow.print();
            URL.revokeObjectURL(blobURL);
        });
    }
});
