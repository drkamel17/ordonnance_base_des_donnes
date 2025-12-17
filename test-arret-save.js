console.log('=== Test de sauvegarde arrêt de travail ===');

// Test des APIs disponibles
console.log('1. APIs disponibles:');
console.log('- browser:', typeof browser !== 'undefined' ? 'Disponible' : 'Non disponible');
console.log('- chrome:', typeof chrome !== 'undefined' ? 'Disponible' : 'Non disponible');

// Test de l'API Firefox browser.runtime
if (typeof browser !== 'undefined' && browser.runtime) {
    console.log('2. API Firefox browser.runtime: Disponible');
    console.log('- sendNativeMessage:', typeof browser.runtime.sendNativeMessage !== 'undefined' ? 'Disponible' : 'Non disponible');
}

// Fonction de test de la messagerie native pour arrêts de travail
async function testerSauvegardeArret() {
    console.log('🧪 Test de la messagerie native pour arrêts de travail...');
    
    const messageTest = {
        action: "ajouter_arret_travail",
        nom: "Test",
        prenom: "Patient",
        medecin: "Dr Test",
        nombre_jours: 3,
        date_certificat: "2025-11-18",
        date_naissance: "1980-01-01"
    };
    
    try {
        if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.sendNativeMessage) {
            console.log('🦊 Test avec l\'API Firefox...');
            
            try {
                const response = await browser.runtime.sendNativeMessage("com.daoudi.certificat", messageTest);
                console.log('✅ Réponse reçue:', response);
                
                if (response && response.ok) {
                    console.log('✅ Test réussi: Arrêt de travail sauvegardé');
                } else {
                    console.log('❌ Test échoué:', response ? response.error : 'Réponse invalide');
                }
            } catch (error) {
                console.log('❌ Test échoué:', error.message);
            }
        } else {
            console.log('❌ API de messagerie native non disponible');
        }
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
    }
}

console.log('=== Fin du test ===');
console.log('Pour tester manuellement, tapez: testerSauvegardeArret()');

// Rendre la fonction disponible globalement pour les tests manuels
window.testerSauvegardeArret = testerSauvegardeArret;