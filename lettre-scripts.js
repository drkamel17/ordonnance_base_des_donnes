// Scripts pour la lettre médicale

// Fonction d'initialisation des champs de recherche
function initialiserChampsRecherche() {
    console.log('Initialisation des champs de recherche...');
    
    // Liste des IDs des champs de recherche
    const searchInputs = ['searchInput', 'searchInput2', 'searchInput3', 'searchInput4'];
    
    // Fonction pour initialiser un champ
    function initialiserChamp(id) {
        const input = document.getElementById(id);
        if (!input) {
            console.warn('Champ non trouvé:', id);
            return;
        }
        
        console.log('Initialisation du champ:', id);
        
        // Ajouter un écouteur d'événement input
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            console.log('Saisie détectée dans', id, ':', value);
            
            // Sauvegarder dans le localStorage
            localStorage.setItem(id, value);
            
            // Appeler autoSaveNewTerm si disponible
            if (window.autoSaveNewTerm) {
                console.log('Appel de autoSaveNewTerm avec:', value);
                window.autoSaveNewTerm(value);
            } else {
                console.error('La fonction autoSaveNewTerm n\'est pas disponible');
            }
        });
        
        // Restaurer la valeur sauvegardée si elle existe
        const savedValue = localStorage.getItem(id);
        if (savedValue) {
            input.value = savedValue;
        }
    }
    
    // Initialiser tous les champs
    searchInputs.forEach(initialiserChamp);
    
    console.log('Initialisation des champs terminée');
}

// Fonction pour sauvegarder automatiquement les nouveaux termes
window.autoSaveNewTerm = function(inputValue) {
    console.log('autoSaveNewTerm appelée avec:', inputValue);
    
    if (!inputValue || typeof inputValue !== 'string') {
        console.log('Valeur invalide, sortie');
        return;
    }
    
    console.log('Analyse de la valeur:', inputValue);
    const words = inputValue.trim().split(/\s+/);
    
    if (words.length >= 1 && inputValue.endsWith(' ')) {
        // Prendre le dernier mot avant l'espace
        const completedWord = words[words.length - 1].trim();
        console.log("Mot complété détecté :", completedWord);

        if (completedWord && completedWord.length > 1) {
            console.log('Tentative de sauvegarde du terme:', completedWord);
            // Utiliser le localStorage pour stocker les termes
            try {
                const savedTerms = JSON.parse(localStorage.getItem('medicalTerms') || '[]');
                if (!savedTerms.includes(completedWord)) {
                    savedTerms.push(completedWord);
                    localStorage.setItem('medicalTerms', JSON.stringify(savedTerms));
                    console.log('Terme sauvegardé automatiquement :', completedWord);
                    
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

// Fonction pour sauvegarder les modifications dans le localStorage
function sauvegarderModifications() {
    console.log('Initialisation des écouteurs de champs...');
    
    // Fonction pour initialiser un champ de recherche
    function initSearchField(input) {
        if (!input) {
            console.warn('Champ non valide pour l\'initialisation');
            return;
        }
        
        // Vérifier si l'écouteur est déjà attaché
        if (input.dataset.initialized === 'true') {
            console.log('Le champ', input.id, 'est déjà initialisé');
            return;
        }
        
        console.log('Initialisation du champ', input.id);
        
        // Ajouter la classe pour le style
        input.classList.add('search-field');
        
        // Ajouter l'écouteur d'événement
        input.addEventListener('input', function handleInput(e) {
            const value = e.target.value;
            console.log('Saisie détectée dans', e.target.id, ':', value);
            
            // Sauvegarder la valeur dans le stockage local
            if (e.target.id) {
                localStorage.setItem(e.target.id, value);
            }
            
            // Appeler autoSaveNewTerm si disponible
            if (window.autoSaveNewTerm) {
                console.log('Appel de autoSaveNewTerm avec:', value);
                window.autoSaveNewTerm(value);
            } else {
                console.error('La fonction autoSaveNewTerm n\'est pas disponible');
            }
        });
        
        // Récupérer la valeur sauvegardée si elle existe
        const savedValue = localStorage.getItem(input.id);
        if (savedValue) {
            input.value = savedValue;
        }
        
        // Marquer comme initialisé
        input.dataset.initialized = 'true';
    }
    
    // Initialiser les champs de recherche
    const searchInputs = ['searchInput', 'searchInput2', 'searchInput3', 'searchInput4'];
    searchInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            initSearchField(input);
        }
    });
}

// Initialiser quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    initialiserChampsRecherche();
    sauvegarderModifications();
});
