// Medical Extension Web - Application Logic

class MedicalApp {
    constructor() {
        this.certificates = [];
        this.currentId = 1;
        this.init();
    }
    
    init() {
        this.loadFromStorage();
        this.bindEvents();
        this.updateCertificateList();
        this.setDefaultDates();
    }
    
    // Set default dates to today
    setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        const startDate = document.getElementById('startDate');
        const endDate = document.getElementById('endDate');
        
        if (startDate && endDate) {
            startDate.value = today;
            endDate.value = today;
        }
    }
    
    // Bind DOM events
    bindEvents() {
        // Certificate generation
        document.getElementById('generateCertificate')?.addEventListener('click', () => {
            this.generateCertificate();
        });
        
        // Data retrieval
        document.getElementById('retrieveData')?.addEventListener('click', () => {
            this.retrieveData();
        });
        
        // Export to Excel
        document.getElementById('exportToExcel')?.addEventListener('click', () => {
            this.exportToExcel();
        });
        
        // Print data
        document.getElementById('printData')?.addEventListener('click', () => {
            this.printData();
        });
        
        // Save current document
        document.getElementById('saveCurrentDocument')?.addEventListener('click', () => {
            this.saveCurrentDocument();
        });
        
        // Print preview
        document.getElementById('printPreview')?.addEventListener('click', () => {
            this.printPreview();
        });
        
        // Clear preview
        document.getElementById('clearPreview')?.addEventListener('click', () => {
            this.clearPreview();
        });
        
        // Load saved certificates
        document.getElementById('loadSavedCertificates')?.addEventListener('click', () => {
            this.updateCertificateList();
        });
        
        // Search certificates
        document.getElementById('searchCertificates')?.addEventListener('input', (e) => {
            this.searchCertificates(e.target.value);
        });
        
        // Handle dynamic button clicks in preview content
        document.getElementById('previewContent')?.addEventListener('click', (e) => {
            const target = e.target;
            if (target.tagName === 'BUTTON') {
                const action = target.getAttribute('data-action');
                const category = target.getAttribute('data-category');
                const id = target.getAttribute('data-id');
                
                if (action && category && id) {
                    if (action === 'view') {
                        dataManager.viewRecord(category, parseInt(id));
                    } else if (action === 'delete') {
                        if (confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
                            dataManager.deleteRecord(category, parseInt(id));
                            // Refresh the data display
                            this.retrieveData();
                            this.showNotification('Dossier supprimé avec succès');
                        }
                    }
                }
            }
        });
    }
    
    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Generate certificate
    generateCertificate() {
        const type = document.getElementById('certificateType')?.value;
        const patientName = document.getElementById('patientName')?.value;
        const patientAge = document.getElementById('patientAge')?.value;
        
        if (!type) {
            this.showNotification('Veuillez sélectionner un type de certificat', 'error');
            return;
        }
        
        if (!patientName) {
            this.showNotification('Veuillez entrer le nom du patient', 'error');
            return;
        }
        
        // Use the certificate generator
        const patientData = {
            name: patientName,
            age: patientAge,
            location: '[Lieu]', // This would be configurable in a real app
            duration: '[Durée]', // For arrêt de travail
            days: '[Nombre]' // For prolongation
        };
        
        try {
            // Use the CertificateGenerator class
            const certificateContent = CertificateGenerator.generate(type, patientData);
            
            const previewContent = document.getElementById('previewContent');
            if (!previewContent) return;
            
            previewContent.innerHTML = certificateContent;
            this.showNotification('Certificat généré avec succès');
        } catch (error) {
            this.showNotification('Erreur lors de la génération du certificat: ' + error.message, 'error');
        }
    }
    
    // Retrieve data
    retrieveData() {
        const category = document.getElementById('dataCategory')?.value;
        const startDate = document.getElementById('startDate')?.value;
        const endDate = document.getElementById('endDate')?.value;
        
        if (!category) {
            this.showNotification('Veuillez sélectionner une catégorie', 'error');
            return;
        }
        
        if (!startDate || !endDate) {
            this.showNotification('Veuillez sélectionner les dates de début et de fin', 'error');
            return;
        }
        
        const previewContent = document.getElementById('previewContent');
        if (!previewContent) return;
        
        try {
            // Check if dataManager is available
            if (typeof dataManager === 'undefined') {
                this.showNotification('Le gestionnaire de données n\'est pas disponible', 'error');
                return;
            }
            
            // Use the data manager to retrieve data
            const data = dataManager.retrieveData(category, startDate, endDate);
            const tableHtml = dataManager.generateDataTable(data, category);
            
            previewContent.innerHTML = `
                <h3>Données récupérées</h3>
                <p><strong>Catégorie:</strong> ${dataManager.getCategories()[category]}</p>
                <p><strong>Période:</strong> ${startDate} à ${endDate}</p>
                
                <div style="margin-top: 1rem;">
                    ${tableHtml}
                </div>
            `;
            
            this.showNotification('Données récupérées avec succès');
        } catch (error) {
            this.showNotification('Erreur lors de la récupération des données: ' + error.message, 'error');
        }
    }
    
    // Export to Excel
    exportToExcel() {
        const category = document.getElementById('dataCategory')?.value;
        const startDate = document.getElementById('startDate')?.value;
        const endDate = document.getElementById('endDate')?.value;
        
        if (!category) {
            this.showNotification('Veuillez sélectionner une catégorie', 'error');
            return;
        }
        
        if (!startDate || !endDate) {
            this.showNotification('Veuillez sélectionner les dates de début et de fin', 'error');
            return;
        }
        
        try {
            // Check if dataManager is available
            if (typeof dataManager === 'undefined') {
                this.showNotification('Le gestionnaire de données n\'est pas disponible', 'error');
                return;
            }
            
            const data = dataManager.retrieveData(category, startDate, endDate);
            const csv = dataManager.exportToExcel(data, category);
            
            if (!csv) {
                this.showNotification('Aucune donnée à exporter', 'error');
                return;
            }
            
            // Create downloadable file
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `donnees_${category}_${startDate}_to_${endDate}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Fichier CSV généré avec succès');
        } catch (error) {
            this.showNotification('Erreur lors de l\'exportation: ' + error.message, 'error');
        }
    }
    
    // Print data
    printData() {
        this.showNotification('Impression en cours...');
        // In a real implementation, this would trigger the print dialog
        window.print();
    }
    
    // Print preview
    printPreview() {
        this.showNotification('Impression en cours...');
        // In a real implementation, this would trigger the print dialog
        window.print();
    }
    
    // Save current document
    saveCurrentDocument() {
        const previewContent = document.getElementById('previewContent');
        if (!previewContent || !previewContent.innerHTML || previewContent.innerHTML.includes('L\'aperçu')) {
            this.showNotification('Aucun document à sauvegarder', 'error');
            return;
        }
        
        const certificate = {
            id: this.currentId++,
            title: 'Certificat médical #' + (this.currentId - 1),
            content: previewContent.innerHTML,
            date: new Date().toLocaleDateString('fr-FR'),
            type: document.getElementById('certificateType')?.value || 'document'
        };
        
        this.certificates.push(certificate);
        this.saveToStorage();
        this.updateCertificateList();
        this.showNotification('Document sauvegardé avec succès');
    }
    
    // Clear preview
    clearPreview() {
        const previewContent = document.getElementById('previewContent');
        if (previewContent) {
            previewContent.innerHTML = '<p>L\'aperçu du certificat ou des données apparaîtra ici</p>';
        }
        this.showNotification('Aperçu effacé');
    }
    
    // Update certificate list
    updateCertificateList() {
        const certificateList = document.getElementById('certificateList');
        if (!certificateList) return;
        
        if (this.certificates.length === 0) {
            certificateList.innerHTML = '<p>Aucun certificat sauvegardé pour le moment.</p>';
            return;
        }
        
        let listHTML = '';
        this.certificates.slice().reverse().forEach(cert => {
            listHTML += `
                <div class="certificate-item" onclick="app.loadCertificate(${cert.id})">
                    <h4>${cert.title}</h4>
                    <p>Type: ${cert.type} - Date: ${cert.date}</p>
                </div>
            `;
        });
        
        certificateList.innerHTML = listHTML;
    }
    
    // Load a specific certificate
    loadCertificate(id) {
        const certificate = this.certificates.find(cert => cert.id === id);
        if (!certificate) {
            this.showNotification('Certificat non trouvé', 'error');
            return;
        }
        
        const previewContent = document.getElementById('previewContent');
        if (previewContent) {
            previewContent.innerHTML = certificate.content;
        }
        
        this.showNotification(`Certificat #${id} chargé`);
    }
    
    // View a record
    viewRecord(id) {
        this.showNotification(`Affichage du dossier #${id}`);
    }
    
    // Delete a record
    deleteRecord(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
            this.showNotification(`Dossier #${id} supprimé`);
        }
    }
    
    // Search certificates
    searchCertificates(query) {
        const certificateList = document.getElementById('certificateList');
        if (!certificateList) return;
        
        if (!query) {
            this.updateCertificateList();
            return;
        }
        
        const filtered = this.certificates.filter(cert => 
            cert.title.toLowerCase().includes(query.toLowerCase()) ||
            cert.type.toLowerCase().includes(query.toLowerCase())
        );
        
        if (filtered.length === 0) {
            certificateList.innerHTML = '<p>Aucun certificat trouvé.</p>';
            return;
        }
        
        let listHTML = '';
        filtered.slice().reverse().forEach(cert => {
            listHTML += `
                <div class="certificate-item" onclick="app.loadCertificate(${cert.id})">
                    <h4>${cert.title}</h4>
                    <p>Type: ${cert.type} - Date: ${cert.date}</p>
                </div>
            `;
        });
        
        certificateList.innerHTML = listHTML;
    }
    
    // Save to localStorage
    saveToStorage() {
        try {
            localStorage.setItem('medicalCertificates', JSON.stringify(this.certificates));
            localStorage.setItem('medicalCurrentId', this.currentId.toString());
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }
    
    // Load from localStorage
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('medicalCertificates');
            const savedId = localStorage.getItem('medicalCurrentId');
            
            if (saved) {
                this.certificates = JSON.parse(saved);
            }
            
            if (savedId) {
                this.currentId = parseInt(savedId);
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
        }
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure all scripts are loaded
    setTimeout(function() {
        window.app = new MedicalApp();
    }, 100);
});