console.log('🔧 Script de sauvegarde Antirabique chargé');

// Cette fonction est une copie adaptée de cbv-save-handler.js
// pour gérer la sauvegarde des données du certificat antirabique.

// Fonction pour envoyer un message à l'application native
async function envoyerMessageNatifRabique(message) {
    return new Promise(async (resolve, reject) => {
        console.log('Tentative de connexion à l\'application native pour sauvegarde antirabique...');
        
        if (!message || typeof message !== 'object' || message.constructor.name === 'Window') {
            const errorMsg = `Message invalide: doit être un objet de données, pas: ${typeof message} ${message?.constructor?.name || ''}`;
            console.error(`❌ ${errorMsg}`);
            alert(`❌ Erreur de développement: ${errorMsg}`);
            return reject(new Error(errorMsg));
        }
        
        console.log('Message à envoyer:', JSON.stringify(message, getCircularReplacer(), 2));
        
        try {
            let response;
            
            if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.sendNativeMessage) {
                console.log('🦊 Utilisation de l\'API Firefox...');
                response = await browser.runtime.sendNativeMessage("com.daoudi.certificat", message);
                console.log('✅ Réponse de l\'application native (Firefox):', response);
            }
            else if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendNativeMessage) {
                console.log('🌐 Utilisation de l\'API Chrome...');
                response = await new Promise((res, rej) => {
                    chrome.runtime.sendNativeMessage("com.daoudi.certificat", message, (r) => {
                        if (chrome.runtime.lastError) {
                            rej(new Error(chrome.runtime.lastError.message));
                        } else {
                            res(r);
                        }
                    });
                });
                console.log('✅ Réponse de l\'application native (Chrome):', response);
            } else {
                throw new Error('Aucune API de messagerie native disponible (ni browser.runtime.sendNativeMessage ni chrome.runtime.sendNativeMessage)');
            }
            
            if (response && response.ok) {
                console.log('✅ Données antirabiques sauvegardées avec succès via l\'application native.');
                // L'alerte de succès est maintenant gérée dans le script appelant (certificat.js)
                resolve(response);
            } else {
                const errorMsg = response ? response.error : 'Réponse invalide ou vide de l\'application native.';
                console.error('❌ Erreur de sauvegarde (antirabique) reçue de l\'application native:', errorMsg);
                // L'alerte d'erreur est maintenant gérée dans le script appelant (certificat.js)
                reject(new Error(errorMsg));
            }
            
        } catch (error) {
            console.error('❌ Erreur de communication native (antirabique):', error);
            // L'alerte d'erreur est maintenant gérée dans le script appelant (certificat.js)
            reject(error);
        }
    });
}


// Helper function to handle circular references in JSON.stringify
function getCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return "[Circular Reference]";
            }
            seen.add(value);
        }
        return value;
    };
}

console.log('🚀 Script de sauvegarde Antirabique initialisé');
