// Scripts pour le certificat radiox

// Fonction pour sauvegarder automatiquement les nouveaux termes dans les champs textarea
window.autoSaveNewTerm = function(inputValue) {
    if (!inputValue || typeof inputValue !== 'string') {
        return;
    }
    
    const words = inputValue.trim().split(/\s+/);
    
    if (words.length >= 1 && inputValue.endsWith(' ')) {
        // Prendre le dernier mot avant l'espace
        const completedWord = words[words.length - 1].trim();

        if (completedWord && completedWord.length > 1) {
            // Utiliser le localStorage pour stocker les termes
            try {
                const savedTerms = JSON.parse(localStorage.getItem('medicalTerms') || '[]');
                if (!savedTerms.includes(completedWord)) {
                    savedTerms.push(completedWord);
                    localStorage.setItem('medicalTerms', JSON.stringify(savedTerms));
                    
                    // Afficher une notification
                    showNotification('Nouveau terme sauvegardé : ' + completedWord);
                }
            } catch (error) {
                console.error("Erreur lors de la sauvegarde du terme :", error);
            }
        }
    }
};

// Fonction pour afficher une notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '10000';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.animation = 'fadeIn 0.3s';
    
    // Style pour l'animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Supprimer la notification après 2 secondes
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'fadeOut 0.3s';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 2000);
}

// Fonction pour initialiser les champs textarea
function initialiserChampsTextarea() {
    // Liste des IDs des champs textarea à initialiser
    const textareaIds = ['raisonConsultation', 'typeExploration'];
    
    textareaIds.forEach(id => {
        const textarea = document.getElementById(id);
        if (!textarea) return;
        
        // Restaurer la valeur sauvegardée si elle existe
        const savedValue = localStorage.getItem(id);
        if (savedValue) {
            textarea.value = savedValue;
        }
        
        // Ajouter un écouteur d'événement input
        textarea.addEventListener('input', function(e) {
            const value = e.target.value;
            
            // Sauvegarder dans le localStorage
            localStorage.setItem(id, value);
            
            // Appeler autoSaveNewTerm pour la sauvegarde des termes
            if (window.autoSaveNewTerm) {
                window.autoSaveNewTerm(value);
            }
        });
    });
}

// Initialiser quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    initialiserChampsTextarea();
    
    // Initialiser le bouton d'impression
    const printButton = document.getElementById('printButton');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
});
