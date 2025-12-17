// Data Management System for Medical Extension Web

class DataManager {
    constructor() {
        this.dataCategories = {
            'arrets_travail': 'Arrêts de travail',
            'prolongation': 'Prolongations',
            'cbv': 'Certificats de bonne santé',
            'antirabique': 'Certificats antirabiques',
            'brucellose': 'Certificats de brucellose'
        };
        
        // Initialize with sample data
        this.initializeSampleData();
    }
    
    // Initialize with sample data
    initializeSampleData() {
        // Check if we already have data in localStorage
        if (localStorage.getItem('medicalData')) {
            return;
        }
        
        // Sample data
        const sampleData = {
            'arrets_travail': [
                { id: 1, patient: 'Jean Dupont', date: '15/12/2025', duration: '5 jours', doctor: 'Dr. Martin' },
                { id: 2, patient: 'Marie Leroy', date: '10/12/2025', duration: '3 jours', doctor: 'Dr. Bernard' }
            ],
            'prolongation': [
                { id: 3, patient: 'Paul Moreau', date: '08/12/2025', duration: '2 jours', doctor: 'Dr. Petit' }
            ],
            'cbv': [
                { id: 4, patient: 'Sophie Lambert', date: '05/12/2025', result: 'Apte', doctor: 'Dr. Robert' }
            ]
        };
        
        localStorage.setItem('medicalData', JSON.stringify(sampleData));
    }
    
    // Retrieve data between dates
    retrieveData(category, startDate, endDate) {
        try {
            const allData = JSON.parse(localStorage.getItem('medicalData') || '{}');
            const categoryData = allData[category] || [];
            
            // Filter by date range
            const filteredData = categoryData.filter(item => {
                const itemDate = this.parseDate(item.date);
                const start = this.parseDate(startDate);
                const end = this.parseDate(endDate);
                
                return itemDate >= start && itemDate <= end;
            });
            
            return filteredData;
        } catch (error) {
            console.error('Error retrieving data:', error);
            return [];
        }
    }
    
    // Helper function to parse dates
    parseDate(dateString) {
        const parts = dateString.split('/');
        return new Date(parts[2], parts[1] - 1, parts[0]); // DD/MM/YYYY
    }
    
    // Export data to Excel format (returns CSV string)
    exportToExcel(data, category) {
        if (!data || data.length === 0) {
            return '';
        }
        
        // Create CSV header
        const headers = Object.keys(data[0]).filter(key => key !== 'id');
        let csv = headers.join(',') + '\n';
        
        // Add data rows
        data.forEach(item => {
            const values = headers.map(header => {
                const value = item[header] || '';
                // Escape commas and quotes in values
                return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
                    ? `"${value.replace(/"/g, '""')}"` 
                    : value;
            });
            csv += values.join(',') + '\n';
        });
        
        return csv;
    }
    
    // Get all categories
    getCategories() {
        return this.dataCategories;
    }
    
    // Add new record
    addRecord(category, record) {
        try {
            const allData = JSON.parse(localStorage.getItem('medicalData') || '{}');
            
            if (!allData[category]) {
                allData[category] = [];
            }
            
            // Generate ID
            const maxId = allData[category].reduce((max, item) => Math.max(max, item.id || 0), 0);
            record.id = maxId + 1;
            
            allData[category].push(record);
            localStorage.setItem('medicalData', JSON.stringify(allData));
            
            return record.id;
        } catch (error) {
            console.error('Error adding record:', error);
            return null;
        }
    }
    
    // Delete record
    deleteRecord(category, id) {
        try {
            const allData = JSON.parse(localStorage.getItem('medicalData') || '{}');
            
            if (allData[category]) {
                allData[category] = allData[category].filter(item => item.id !== id);
                localStorage.setItem('medicalData', JSON.stringify(allData));
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Error deleting record:', error);
            return false;
        }
    }
    
    // Generate HTML table for data
    generateDataTable(data, category) {
        if (!data || data.length === 0) {
            return '<p>Aucune donnée trouvée pour cette période.</p>';
        }
        
        // Create table headers based on category
        let headers = ['Patient', 'Date'];
        if (category === 'arrets_travail' || category === 'prolongation') {
            headers.push('Durée', 'Médecin');
        } else if (category === 'cbv') {
            headers.push('Résultat', 'Médecin');
        } else {
            headers.push('Détails', 'Médecin');
        }
        headers.push('Actions');
        
        // Create table rows
        let rows = '';
        data.forEach(item => {
            rows += '<tr>';
            rows += `<td>${item.patient || ''}</td>`;
            rows += `<td>${item.date || ''}</td>`;
            
            if (category === 'arrets_travail' || category === 'prolongation') {
                rows += `<td>${item.duration || ''}</td>`;
                rows += `<td>${item.doctor || ''}</td>`;
            } else if (category === 'cbv') {
                rows += `<td>${item.result || ''}</td>`;
                rows += `<td>${item.doctor || ''}</td>`;
            } else {
                rows += `<td>${item.details || ''}</td>`;
                rows += `<td>${item.doctor || ''}</td>`;
            }
            
            // Use data attributes instead of inline event handlers
            rows += `<td>
                <button class="btn" style="padding: 4px 8px; font-size: 0.8rem;" data-action="view" data-category="${category}" data-id="${item.id}">Voir</button>
                <button class="btn btn-danger" style="padding: 4px 8px; font-size: 0.8rem;" data-action="delete" data-category="${category}" data-id="${item.id}">Suppr.</button>
            </td>`;
            rows += '</tr>';
        });
        
        return `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f1f1f1;">
                        ${headers.map(h => `<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
    }
    
    // View record details
    viewRecord(category, id) {
        // In a real implementation, this would show detailed view
        alert(`Affichage du dossier #${id} dans la catégorie ${this.dataCategories[category]}`);
    }
}

// Initialize the data manager
const dataManager = new DataManager();