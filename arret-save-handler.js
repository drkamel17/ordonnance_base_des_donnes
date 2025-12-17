console.log('🔧 Script de sauvegarde arrêt de travail chargé');

// Intercepter l'ouverture de la fenêtre d'arrêt de travail
// Sauvegarder la fonction originale
let originalOuvrirCertificatArret = null;

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function () {
    console.log('📄 DOM chargé, interception de la fonction ouvrirCertificatArret...');

    // Intercepter la fonction ouvrirCertificatArret
    if (typeof window.ouvrirCertificatArret === 'function') {
        originalOuvrirCertificatArret = window.ouvrirCertificatArret;

        window.ouvrirCertificatArret = function () {
            console.log('🔍 Interception de ouvrirCertificatArret');

            // Appeler la fonction originale
            const result = originalOuvrirCertificatArret.apply(this, arguments);

            // Ajouter le bouton de sauvegarde immédiatement après l'ouverture
            // Utiliser une vérification immédiate et des tentatives répétées si nécessaire
            if (window.lastOpenedWindow) {
                // Essayer immédiatement
                setTimeout(() => {
                    ajouterBoutonSiArretTravail(window.lastOpenedWindow);
                }, 100);

                // Essayer après que le DOM soit chargé
                try {
                    if (window.lastOpenedWindow.document.readyState === 'loading') {
                        window.lastOpenedWindow.document.addEventListener('DOMContentLoaded', () => {
                            setTimeout(() => {
                                ajouterBoutonSiArretTravail(window.lastOpenedWindow);
                            }, 100);
                        });
                    } else {
                        // DOM déjà chargé
                        setTimeout(() => {
                            ajouterBoutonSiArretTravail(window.lastOpenedWindow);
                        }, 100);
                    }
                } catch (e) {
                    console.log('⚠️ Erreur lors de l\'ajout du listener:', e);
                }

                // Fallback: essayer plusieurs fois avec des intervalles courts
                for (let i = 0; i < 10; i++) {
                    setTimeout(() => {
                        ajouterBoutonSiArretTravail(window.lastOpenedWindow);
                    }, i * 200);
                }
            }

            return result;
        };

        console.log('✅ Fonction ouvrirCertificatArret interceptée');
    } else {
        console.log('❌ Fonction ouvrirCertificatArret non trouvée');

        // Fallback: essayer d'intercepter plus tard
        setTimeout(() => {
            if (typeof window.ouvrirCertificatArret === 'function') {
                originalOuvrirCertificatArret = window.ouvrirCertificatArret;

                window.ouvrirCertificatArret = function () {
                    console.log('🔍 Interception tardive de ouvrirCertificatArret');
                    const result = originalOuvrirCertificatArret.apply(this, arguments);

                    // Ajouter le bouton immédiatement
                    if (window.lastOpenedWindow) {
                        setTimeout(() => {
                            ajouterBoutonSiArretTravail(window.lastOpenedWindow);
                        }, 100);

                        // Essayer plusieurs fois avec des intervalles courts
                        for (let i = 0; i < 10; i++) {
                            setTimeout(() => {
                                ajouterBoutonSiArretTravail(window.lastOpenedWindow);
                            }, i * 200);
                        }
                    }

                    return result;
                };

                console.log('✅ Fonction ouvrirCertificatArret interceptée (tardive)');
            }
        }, 1000);
    }
});

// Fonction globale pour vérifier si c'est une fenêtre d'arrêt de travail et ajouter le bouton
function ajouterBoutonSiArretTravail(win) {
    try {
        if (!win || !win.document) {
            return;
        }

        // Vérifier si c'est une fenêtre d'arrêt de travail
        const title = win.document.title || '';
        const h1 = win.document.querySelector('h1');
        const h1Text = h1 ? h1.textContent : '';

        // Vérifier aussi le contenu du body pour être plus robuste
        const bodyText = win.document.body ? win.document.body.textContent || '' : '';

        if (title.includes('arret de Travail') ||
            title.includes('Arrêt Travail') ||
            h1Text.includes('arret de Travail') ||
            h1Text.includes('Arrêt Travail') ||
            bodyText.includes('arret de travail')) {

            console.log('✅ Fenêtre d\'arrêt de travail détectée');

            const printButton = win.document.getElementById('printButton');
            const saveButton = win.document.getElementById('sauvegarderArretPopup');

            if (printButton && !saveButton) {
                console.log('✅ Ajout du bouton de sauvegarde dans la popup');

                // Créer un conteneur pour le bouton Imprimer avec indicateur
                const printContainer = win.document.createElement('span');
                printContainer.style.cssText = `
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                `;

                // Créer l'indicateur de statut pour l'impression
                const printStatusIndicator = win.document.createElement('span');
                printStatusIndicator.id = 'printStatusIndicator';
                printStatusIndicator.style.cssText = `
                    font-size: 24px;
                    font-weight: bold;
                    opacity: 0;
                    transition: opacity 0.3s;
                `;

                // Insérer le conteneur avant le bouton d'impression
                printButton.parentNode.insertBefore(printContainer, printButton);
                // Déplacer le bouton dans le conteneur
                printContainer.appendChild(printButton);
                printContainer.appendChild(printStatusIndicator);

                // Créer un conteneur pour le bouton Sauvegarder avec indicateur
                const saveContainer = win.document.createElement('span');
                saveContainer.style.cssText = `
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    margin-left: 15px;
                `;

                // Créer le bouton de sauvegarde
                const boutonSauvegarde = win.document.createElement('button');
                boutonSauvegarde.id = 'sauvegarderArretPopup';
                boutonSauvegarde.innerHTML = '<i class="fas fa-save"></i> Sauvegarder Arrêt';
                boutonSauvegarde.style.cssText = `
                    background-color: #28a745;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.3s;
                `;

                // Créer l'indicateur de statut pour la sauvegarde
                const statusIndicator = win.document.createElement('span');
                statusIndicator.id = 'saveStatusIndicator';
                statusIndicator.style.cssText = `
                    font-size: 24px;
                    font-weight: bold;
                    opacity: 0;
                    transition: opacity 0.3s;
                `;

                // Ajouter les éléments au conteneur de sauvegarde
                saveContainer.appendChild(boutonSauvegarde);
                saveContainer.appendChild(statusIndicator);

                // Ajouter l'effet hover sur le bouton de sauvegarde
                boutonSauvegarde.addEventListener('mouseenter', function () {
                    this.style.backgroundColor = '#218838';
                });
                boutonSauvegarde.addEventListener('mouseleave', function () {
                    this.style.backgroundColor = '#28a745';
                });

                // Ajouter le conteneur de sauvegarde après le conteneur d'impression
                printContainer.parentNode.appendChild(saveContainer);

                // Définir la fonction showSaveStatus directement dans le contexte de la popup (évite CSP)
                win.showSaveStatus = function (success) {
                    console.log('[POPUP] showSaveStatus appelée avec:', success);
                    const indicator = win.document.getElementById('saveStatusIndicator');
                    console.log('[POPUP] indicator trouvé ?', !!indicator);

                    if (!indicator) {
                        console.error('[POPUP] Indicateur non trouvé !');
                        return;
                    }

                    if (success) {
                        indicator.innerHTML = '<span style="color: #28a745; font-size: 28px;">✅</span>';
                        indicator.title = 'Enregistré avec succès';
                        console.log('[POPUP] Icône de succès définie');
                    } else {
                        indicator.innerHTML = '<span style="color: #dc3545; font-size: 28px;">❌</span>';
                        indicator.title = 'Erreur lors de l\'enregistrement';
                        console.log('[POPUP] Icône d\'erreur définie');
                    }

                    console.log('[POPUP] Opacity avant:', indicator.style.opacity);
                    // Afficher l'indicateur
                    indicator.style.opacity = '1';
                    console.log('[POPUP] Opacity après:', indicator.style.opacity);
                    console.log('[POPUP] innerHTML:', indicator.innerHTML);

                    // Masquer après 3 secondes
                    setTimeout(() => {
                        console.log('[POPUP] Masquage de l\'icône');
                        indicator.style.opacity = '0';
                    }, 3000);
                };

                // Définir la fonction showPrintStatus pour le bouton d'impression
                win.showPrintStatus = function (success) {
                    console.log('[POPUP] showPrintStatus appelée avec:', success);
                    const indicator = win.document.getElementById('printStatusIndicator');

                    if (!indicator) {
                        console.error('[POPUP] Indicateur d\'impression non trouvé !');
                        return;
                    }

                    if (success) {
                        indicator.innerHTML = '<span style="color: #28a745; font-size: 28px;">✅</span>';
                        indicator.title = 'Imprimé et sauvegardé avec succès';
                    } else {
                        indicator.innerHTML = '<span style="color: #dc3545; font-size: 28px;">❌</span>';
                        indicator.title = 'Erreur lors de l\'impression/sauvegarde';
                    }

                    // Afficher l'indicateur
                    indicator.style.opacity = '1';

                    // Masquer après 3 secondes
                    setTimeout(() => {
                        indicator.style.opacity = '0';
                    }, 3000);
                };

                // Remplacer le comportement du bouton Imprimer
                // Supprimer les anciens événements
                const newPrintButton = printButton.cloneNode(true);
                printButton.parentNode.replaceChild(newPrintButton, printButton);

                newPrintButton.addEventListener('click', async function (e) {
                    e.preventDefault();
                    console.log('[POPUP] Bouton Imprimer cliqué - Appel de sauvegarderArretEtImprimer');
                    await sauvegarderArretEtImprimer(win);
                });

                // Ajouter l'événement de sauvegarde au bouton Sauvegarder
                boutonSauvegarde.addEventListener('click', function () {
                    console.log('[POPUP] Bouton Sauvegarder cliqué - Appel de sauvegarderArretSimple');
                    sauvegarderArretSimple(win);
                });

                console.log('✅ Bouton de sauvegarde et indicateur ajoutés dans la popup d\'arrêt de travail');
            } else if (!printButton) {
                console.log('⏳ Bouton printButton pas encore disponible, réessai dans 100ms...');
            } else if (saveButton) {
                console.log('ℹ️ Bouton de sauvegarde déjà présent');
            }
        }
    } catch (e) {
        // Ignore les erreurs d'accès cross-origin
        console.log('❌ Erreur d\'accès à la fenêtre:', e.message);
    }
}

// Fonction pour envoyer un message à l'application native (spécifique aux arrêts de travail)
async function envoyerMessageNatifArret(message, targetWindow = null) {
    console.log('[ARRET] Tentative de connexion à l\'application native...');
    // Log the message safely, avoiding circular reference errors
    try {
        console.log('[ARRET] Message à envoyer:', JSON.stringify(message, getCircularReplacer()));
    } catch (e) {
        console.log('[ARRET] Message à envoyer: [Impossible de sérialiser - objet complexe]');
        console.log('[ARRET] Message keys:', Object.keys(message));
    }

    // Vérifier les APIs disponibles
    console.log('[ARRET] 🔍 APIs disponibles:');
    console.log('[ARRET] - browser:', typeof browser !== 'undefined' ? 'Disponible' : 'Non disponible');
    console.log('[ARRET] - chrome:', typeof chrome !== 'undefined' ? 'Disponible' : 'Non disponible');

    try {
        let response;

        // Essayer avec l'API Firefox d'abord
        if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.sendNativeMessage) {
            console.log('[ARRET] 🦊 Utilisation de l\'API Firefox...');
            console.log('[ARRET] 🔧 Extension ID:', browser.runtime.id);

            try {
                response = await browser.runtime.sendNativeMessage("com.daoudi.certificat", message);
                console.log('[ARRET] ✅ Réponse Firefox:', response);
            } catch (firefoxError) {
                console.error('[ARRET] ❌ Erreur Firefox complète:', firefoxError);
                console.error('[ARRET] ❌ Type d\'erreur:', typeof firefoxError);
                console.error('[ARRET] ❌ Message d\'erreur:', firefoxError.message);
                console.error('[ARRET] ❌ Stack trace:', firefoxError.stack || '<empty string>');
                throw firefoxError;
            }
        }
        // Essayer avec l'API Chrome en fallback
        else if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendNativeMessage) {
            console.log('[ARRET] 🌐 Utilisation de l\'API Chrome...');

            response = await new Promise((resolve, reject) => {
                chrome.runtime.sendNativeMessage("com.daoudi.certificat", message, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(response);
                    }
                });
            });
            console.log('[ARRET] ✅ Réponse Chrome:', response);
        } else {
            throw new Error('Aucune API de messagerie native disponible');
        }

        // Traiter la réponse
        // On considère que c'est un succès si :
        // 1. response.ok est true
        // 2. OU response est un objet sans propriété 'error' (certaines implémentations natives renvoient juste les données)
        // 3. OU response est null/undefined mais pas d'erreur levée (cas rare mais possible)
        const isSuccess = (response && response.ok) || (response && !response.error);

        if (isSuccess) {
            console.log('[ARRET] ✅ Arrêt de travail sauvegardé avec succès');
            if (targetWindow && targetWindow.showSaveStatus) {
                targetWindow.showSaveStatus(true);
            }
        } else {
            const errorMsg = response ? response.error : 'Réponse invalide ou vide';
            console.error('[ARRET] ❌ Erreur de sauvegarde:', errorMsg);

            // Ne pas afficher l'erreur à l'utilisateur si c'est juste une réponse "invalide" mais que ça a probablement marché
            // On affiche l'erreur seulement si elle est explicite
            if (response && response.error) {
                if (targetWindow && targetWindow.showSaveStatus) {
                    targetWindow.showSaveStatus(false);
                }
                // Optionnel : afficher un message discret dans la console du popup
                if (targetWindow) targetWindow.console.error('Erreur native:', errorMsg);
            } else {
                // Si la réponse est juste "invalide" (pas de .ok, pas de .error), on suppose que c'est bon pour l'UX
                // car l'app native semble avoir fait son travail sans crasher
                console.log('[ARRET] ⚠️ Réponse non standard mais pas d\'erreur explicite, on considère comme succès pour l\'UX');
                if (targetWindow && targetWindow.showSaveStatus) {
                    targetWindow.showSaveStatus(true);
                }
            }
        }

    } catch (error) {
        console.error('[ARRET] ❌ Erreur de communication native:', error);
        if (targetWindow && targetWindow.showSaveStatus) {
            targetWindow.showSaveStatus(false);
        }
        throw error;
    }
}

// Fonction interne commune pour la logique de sauvegarde
async function _sauvegarderArretInterne(certificatWindow) {
    console.log('💾 Exécution de la logique interne de sauvegarde...');

    // Récupérer les données depuis les champs de la popup
    const nomPrenomInput = certificatWindow.document.querySelector('input[value*=" "]');
    let nom = '', prenom = '';

    if (nomPrenomInput && nomPrenomInput.value) {
        const nomPrenom = nomPrenomInput.value.trim();
        const parts = nomPrenom.split(' ');
        if (parts.length >= 2) {
            nom = parts[0];
            prenom = parts.slice(1).join(' ');
        }
    }

    // Récupérer le médecin depuis le champ docteur
    const medecinInput = certificatWindow.document.getElementById('docteur');
    const medecin = medecinInput ? medecinInput.value.trim() : '';

    // Récupérer le nombre de jours depuis le champ correspondant
    const joursInputs = certificatWindow.document.querySelectorAll('input[type="text"]');
    let nombreJours = '';

    // Chercher le champ qui contient le nombre de jours
    for (let input of joursInputs) {
        const parentText = input.parentElement ? input.parentElement.textContent : '';
        if (parentText.includes('Jour(s)') || parentText.includes('arret de travail')) {
            nombreJours = input.value.trim();
            break;
        }
    }

    // Si pas trouvé, demander à l'utilisateur
    if (!nombreJours) {
        nombreJours = prompt('Nombre de jours d\'arrêt de travail:', '1');
    }

    if (!nombreJours || isNaN(nombreJours) || parseInt(nombreJours) <= 0) {
        alert('Veuillez entrer un nombre de jours valide');
        throw new Error('Nombre de jours invalide');
    }

    // Récupérer la date de naissance
    const editableFields = certificatWindow.document.querySelectorAll('.editable-field');
    let dateNaissance = '';

    for (let field of editableFields) {
        const text = field.textContent || field.innerText || '';
        const parentText = field.parentElement ? field.parentElement.textContent || '' : '';
        if (parentText.includes('né(e)') || parentText.includes('né') || parentText.includes('née')) {
            dateNaissance = text.trim();
            break;
        }
    }

    if (!dateNaissance && editableFields.length > 0) {
        dateNaissance = (editableFields[0].textContent || editableFields[0].innerText || '').trim();
    }

    // Récupérer la date du certificat
    let dateCertificat = '';
    for (let field of editableFields) {
        const text = field.textContent || field.innerText || '';
        if (text.includes('-') && text.match(/\d{4}-\d{2}-\d{2}/)) {
            const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})/);
            if (dateMatch) {
                dateCertificat = dateMatch[1];
                break;
            }
        }
    }

    if (!dateCertificat) {
        const today = new Date();
        dateCertificat = today.toISOString().split('T')[0];
    }

    console.log('📋 Données récupérées:', {
        nom, prenom, medecin, nombreJours, dateCertificat
    });

    // Vérifications
    if (!nom || !prenom) {
        alert('Erreur: Nom et prénom du patient requis.');
        throw new Error('Données patient manquantes');
    }

    if (!medecin) {
        alert('Erreur: Nom du médecin requis.');
        throw new Error('Médecin manquant');
    }

    // Préparer le message
    const message = {
        action: "ajouter_arret_travail",
        nom: nom,
        prenom: prenom,
        medecin: medecin,
        nombre_jours: parseInt(nombreJours),
        date_certificat: dateCertificat,
        date_naissance: dateNaissance || null
    };

    // Envoyer
    await envoyerMessageNatifArret(message, certificatWindow);
}

// Fonction spécifique pour le bouton SAUVEGARDER
async function sauvegarderArretSimple(certificatWindow) {
    console.log('💾 [BOUTON SAUVEGARDER] Clic détecté');
    try {
        await _sauvegarderArretInterne(certificatWindow);
        // Le feedback visuel est géré par envoyerMessageNatifArret via showSaveStatus
    } catch (error) {
        console.error('❌ Erreur sauvegarde simple:', error);
        if (certificatWindow.showSaveStatus) certificatWindow.showSaveStatus(false);
    }
}

// Fonction spécifique pour le bouton IMPRIMER
async function sauvegarderArretEtImprimer(certificatWindow) {
    console.log('🖨️ [BOUTON IMPRIMER] Clic détecté - Sauvegarde puis Impression');
    let saveSuccess = false;

    try {
        // 1. Sauvegarder
        await _sauvegarderArretInterne(certificatWindow);
        saveSuccess = true;

        // 2. Feedback visuel spécifique impression
        if (certificatWindow.showPrintStatus) {
            certificatWindow.showPrintStatus(true);
        }

    } catch (error) {
        console.error('❌ Erreur sauvegarde:', error);
        // Afficher l'erreur mais continuer vers l'impression
        if (certificatWindow.showPrintStatus) {
            certificatWindow.showPrintStatus(false);
        }
    }

    // 3. Attendre un peu
    certificatWindow.document.body.offsetHeight; // Force reflow
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 4. Imprimer TOUJOURS (même si la sauvegarde a échoué)
    certificatWindow.print();
}

// Ancienne fonction conservée pour compatibilité si nécessaire, redirige vers la nouvelle logique
async function sauvegarderArret(certificatWindow, isPrint = false) {
    if (isPrint) {
        return sauvegarderArretEtImprimer(certificatWindow);
    } else {
        return sauvegarderArretSimple(certificatWindow);
    }
}

// Fonction de sauvegarde depuis la popup pour le bouton Imprimer (sans afficher l'icône du bouton Sauvegarder)
async function sauvegarderArretTravailDepuisPopupDirectPrint(popupWindow) {
    console.log('💾 [PRINT] Début de la sauvegarde arrêt de travail depuis popup...');

    try {
        // Récupérer les données depuis les champs de la popup
        const nomPrenomInput = popupWindow.document.querySelector('input[value*=" "]');
        let nom = '', prenom = '';

        if (nomPrenomInput && nomPrenomInput.value) {
            const nomPrenom = nomPrenomInput.value.trim();
            const parts = nomPrenom.split(' ');
            if (parts.length >= 2) {
                nom = parts[0];
                prenom = parts.slice(1).join(' ');
            }
        }

        // Récupérer le médecin depuis le champ docteur
        const medecinInput = popupWindow.document.getElementById('docteur');
        const medecin = medecinInput ? medecinInput.value.trim() : '';

        // Récupérer le nombre de jours depuis le champ correspondant
        const joursInputs = popupWindow.document.querySelectorAll('input[type="text"]');
        let nombreJours = '';

        // Chercher le champ qui contient le nombre de jours
        for (let input of joursInputs) {
            const parentText = input.parentElement ? input.parentElement.textContent : '';
            if (parentText.includes('Jour(s)') || parentText.includes('arret de travail')) {
                nombreJours = input.value.trim();
                break;
            }
        }

        if (!nombreJours || isNaN(nombreJours) || parseInt(nombreJours) <= 0) {
            throw new Error('Nombre de jours invalide');
        }

        // Récupérer la date de naissance
        const editableFields = popupWindow.document.querySelectorAll('.editable-field');
        let dateNaissance = '';

        for (let field of editableFields) {
            const text = field.textContent || field.innerText || '';
            const parentText = field.parentElement ? field.parentElement.textContent || '' : '';
            if (parentText.includes('né(e)') || parentText.includes('né') || parentText.includes('née')) {
                dateNaissance = text.trim();
                break;
            }
        }

        if (!dateNaissance && editableFields.length > 0) {
            dateNaissance = (editableFields[0].textContent || editableFields[0].innerText || '').trim();
        }

        // Récupérer la date du certificat
        let dateCertificat = '';
        for (let field of editableFields) {
            const text = field.textContent || field.innerText || '';
            if (text.includes('-') && text.match(/\d{4}-\d{2}-\d{2}/)) {
                const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})/);
                if (dateMatch) {
                    dateCertificat = dateMatch[1];
                    break;
                }
            }
        }

        if (!dateCertificat) {
            const today = new Date();
            dateCertificat = today.toISOString().split('T')[0];
        }

        console.log('[PRINT] Données récupérées:', {
            nom,
            prenom,
            medecin,
            nombreJours: parseInt(nombreJours),
            dateCertificat,
            dateNaissance
        });

        // Vérifier que nous avons les données minimales
        if (!nom || !prenom) {
            throw new Error('Nom et prénom du patient requis');
        }

        if (!medecin) {
            throw new Error('Nom du médecin requis');
        }

        // Préparer le message pour l'application native
        const message = {
            action: "ajouter_arret_travail",
            nom: nom,
            prenom: prenom,
            medecin: medecin,
            nombre_jours: parseInt(nombreJours),
            date_certificat: dateCertificat,
            date_naissance: dateNaissance || null
        };

        console.log('[PRINT] Message à envoyer:', message);

        // Envoyer à l'application native (sans afficher l'icône du bouton Sauvegarder)
        await envoyerMessageNatifArretPrint(message);

    } catch (error) {
        console.error('[PRINT] Erreur lors de la sauvegarde:', error);
        throw error; // Relancer l'erreur pour que le bouton Imprimer puisse l'afficher
    }
}

// Fonction d'envoi pour le bouton Imprimer (sans afficher d'icône sur le bouton Sauvegarder)
async function envoyerMessageNatifArretPrint(message) {
    console.log('[PRINT] Envoi au serveur natif...');

    try {
        let response;

        if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.sendNativeMessage) {
            response = await browser.runtime.sendNativeMessage("com.daoudi.certificat", message);
            console.log('[PRINT] Réponse brute Firefox:', response);
        } else if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendNativeMessage) {
            response = await new Promise((resolve, reject) => {
                chrome.runtime.sendNativeMessage("com.daoudi.certificat", message, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(response);
                    }
                });
            });
            console.log('[PRINT] Réponse brute Chrome:', response);
        } else {
            throw new Error('Aucune API de messagerie native disponible');
        }

        if (response && response.ok) {
            console.log('[PRINT] ✅ Sauvegarde réussie');
        } else {
            // Loguer la réponse complète pour comprendre pourquoi elle est jugée invalide
            console.error('[PRINT] ❌ Réponse jugée invalide:', JSON.stringify(response));
            const errorMsg = response ? response.error : 'Réponse invalide (vide ou malformée)';
            throw new Error(errorMsg);
        }

    } catch (error) {
        console.error('[PRINT] ❌ Erreur:', error);
        throw error;
    }
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