/**
 * Fonction pour récupérer les données entre deux dates depuis une table spécifique
 * @param {string} table - Nom de la table (arrets_travail, prolongation, cbv, antirabique)
 * @param {string} dateDebut - Date de début au format AAAA-MM-JJ
 * @param {string} dateFin - Date de fin au format AAAA-MM-JJ
 * @returns {Promise<Object>} - Résultats de la requête
 */
async function recupererDonneesEntreDates(table, dateDebut, dateFin) {
    console.log(`🔍 Récupération des données de la table ${table} entre ${dateDebut} et ${dateFin}`);
    
    // Valider les paramètres
    if (!table || !dateDebut || !dateFin) {
        throw new Error('Tous les paramètres sont requis: table, dateDebut, dateFin');
    }
    
    // Valider le format des dates
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateDebut) || !dateRegex.test(dateFin)) {
        throw new Error('Les dates doivent être au format AAAA-MM-JJ');
    }
    
    // Préparer le message pour l'application native
    const message = {
        action: "recuperer_donnees_entre_dates",
        table: table,
        date_debut: dateDebut,
        date_fin: dateFin
    };
    
    console.log('📤 Message à envoyer:', message);
    
    try {
        // Envoyer à l'application native
        const response = await envoyerMessageNatif(message);
        console.log('📥 Réponse reçue:', response);
        return response;
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des données:', error);
        throw error;
    }
}

/**
 * Fonction pour envoyer un message à l'application native
 * @param {Object} message - Le message à envoyer
 * @returns {Promise<Object>} - Réponse de l'application native
 */
async function envoyerMessageNatif(message) {
    console.log('Tentative de connexion à l\'application native...');
    
    try {
        let response;
        
        // Essayer avec l'API Firefox d'abord
        if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.sendNativeMessage) {
            console.log('🦊 Utilisation de l\'API Firefox...');
            response = await browser.runtime.sendNativeMessage("com.daoudi.certificat", message);
            console.log('✅ Réponse Firefox:', response);
        }
        // Essayer avec l'API Chrome en fallback
        else if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendNativeMessage) {
            console.log('🌐 Utilisation de l\'API Chrome...');
            response = await new Promise((resolve, reject) => {
                chrome.runtime.sendNativeMessage("com.daoudi.certificat", message, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(response);
                    }
                });
            });
            console.log('✅ Réponse Chrome:', response);
        } else {
            throw new Error('Aucune API de messagerie native disponible');
        }
        
        return response;
    } catch (error) {
        console.error('❌ Erreur de communication native:', error);
        throw error;
    }
}

/**
 * Exemple d'utilisation
 */
async function exempleUtilisation() {
    try {
        // Exemple: récupérer les arrêts de travail entre deux dates
        const resultat = await recupererDonneesEntreDates('arrets_travail', '2023-01-01', '2023-12-31');
        
        if (resultat && resultat.ok) {
            console.log(`✅ ${resultat.returned} enregistrements trouvés sur ${resultat.total} au total`);
            console.table(resultat.data);
        } else {
            console.error('❌ Erreur:', resultat ? resultat.error : 'Réponse invalide');
        }
    } catch (error) {
        console.error('❌ Erreur lors de l\'exemple d\'utilisation:', error);
    }
}

// Exporter les fonctions pour une utilisation externe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        recupererDonneesEntreDates,
        envoyerMessageNatif,
        exempleUtilisation
    };
}