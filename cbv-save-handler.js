console.log('🔧 Script de sauvegarde CBV chargé');


// Fonction pour envoyer un message à l'application native depuis une popup
async function envoyerMessageNatifDepuisPopup(message, popupWindow) {
    console.log('Tentative de connexion à l\'application native depuis popup...');

    // Vérifier que le message est un objet valide et pas une fenêtre
    if (!message || typeof message !== 'object' || message.constructor.name === 'Window') {
        console.error('❌ Message invalide: doit être un objet de données, pas:', typeof message, message?.constructor?.name || 'undefined');
        throw new Error('Message invalide: doit être un objet de données');
    }

    // Log the message safely, avoiding circular reference errors
    try {
        console.log('Message à envoyer:', JSON.stringify(message, getCircularReplacer()));
    } catch (e) {
        console.log('Message à envoyer: [Impossible de sérialiser - objet complexe]');
        console.log('Message keys:', Object.keys(message));
    }

    try {
        let response;

        // Essayer d'utiliser l'API depuis la fenêtre parent (opener)
        const parentWindow = popupWindow.opener || window;

        // Vérifier les APIs disponibles dans la fenêtre parent
        console.log('🔍 APIs disponibles dans fenêtre parent:');
        console.log('- browser:', typeof parentWindow.browser !== 'undefined' ? 'Disponible' : 'Non disponible');
        console.log('- chrome:', typeof parentWindow.chrome !== 'undefined' ? 'Disponible' : 'Non disponible');

        // Essayer avec l'API Firefox d'abord
        if (typeof parentWindow.browser !== 'undefined' && parentWindow.browser.runtime && parentWindow.browser.runtime.sendNativeMessage) {
            console.log('🦊 Utilisation de l\'API Firefox depuis parent...');

            try {
                response = await parentWindow.browser.runtime.sendNativeMessage("com.daoudi.certificat", message);
                console.log('✅ Réponse Firefox:', response);
            } catch (firefoxError) {
                console.error('❌ Erreur Firefox complète:', firefoxError);
                throw firefoxError;
            }
        }
        // Essayer avec l'API Chrome en fallback
        else if (typeof parentWindow.chrome !== 'undefined' && parentWindow.chrome.runtime && parentWindow.chrome.runtime.sendNativeMessage) {
            console.log('🌐 Utilisation de l\'API Chrome depuis parent...');

            response = await new Promise((resolve, reject) => {
                parentWindow.chrome.runtime.sendNativeMessage("com.daoudi.certificat", message, (response) => {
                    if (parentWindow.chrome.runtime.lastError) {
                        reject(new Error(parentWindow.chrome.runtime.lastError.message));
                    } else {
                        resolve(response);
                    }
                });
            });
            console.log('✅ Réponse Chrome:', response);
        } else {
            throw new Error('Aucune API de messagerie native disponible dans la fenêtre parent');
        }

        // Traiter la réponse
        if (response && response.ok) {
            console.log('✅ CBV sauvegardé avec succès depuis popup');

            // Instead of showing a detailed message, show the success indicator
            try {
                // Try to show the success indicator in the popup
                if (popupWindow && popupWindow.document) {
                    const indicator = popupWindow.document.getElementById('saveStatusIndicatorCBV');
                    if (indicator) {
                        indicator.textContent = '✅';
                        indicator.style.color = '#28a745';
                        indicator.style.fontSize = '28px';
                        indicator.title = 'Enregistré avec succès';
                        indicator.style.opacity = '1';

                        // Hide after 1 second (1000ms)
                        setTimeout(() => {
                            if (indicator) {
                                indicator.style.opacity = '0';
                            }
                        }, 1000);
                    } else {
                        console.error('[CBV] Indicateur non trouvé dans la popup !');
                        // Fallback to showing message in popup
                        afficherMessageDansPopup(popupWindow, '✅ Sauvegardé avec succès !', 'success');
                    }
                } else {
                    console.error('[CBV] Popup window not accessible !');
                }
            } catch (e) {
                console.error('[CBV] Erreur lors de l\'affichage de l\'indicateur:', e);
                // Fallback to showing message in popup
                if (popupWindow) {
                    afficherMessageDansPopup(popupWindow, '✅ Sauvegardé avec succès !', 'success');
                }
            }
        } else {
            const errorMsg = response ? response.error : 'Réponse invalide de l\'application native';
            console.error('❌ Erreur de sauvegarde:', errorMsg);

            // Show error indicator
            try {
                if (popupWindow && popupWindow.document) {
                    const indicator = popupWindow.document.getElementById('saveStatusIndicatorCBV');
                    if (indicator) {
                        indicator.textContent = '❌';
                        indicator.style.color = '#dc3545';
                        indicator.style.fontSize = '28px';
                        indicator.title = 'Erreur lors de l\'enregistrement';
                        indicator.style.opacity = '1';

                        // Hide after 3 seconds
                        setTimeout(() => {
                            if (indicator) {
                                indicator.style.opacity = '0';
                            }
                        }, 3000);
                    } else {
                        console.error('[CBV] Indicateur non trouvé dans la popup !');
                        // Fallback to showing error message
                        afficherMessageDansPopup(popupWindow, '❌ Erreur lors de la sauvegarde: ' + errorMsg, 'error');
                    }
                }
            } catch (e) {
                console.error('[CBV] Erreur lors de l\'affichage de l\'indicateur d\'erreur:', e);
                // Fallback to showing error message
                if (popupWindow) {
                    afficherMessageDansPopup(popupWindow, '❌ Erreur lors de la sauvegarde: ' + errorMsg, 'error');
                }
            }
        }

    } catch (error) {
        console.error('❌ Erreur de communication native depuis popup:', error);

        // Show error indicator for communication errors
        try {
            if (popupWindow && popupWindow.document) {
                const indicator = popupWindow.document.getElementById('saveStatusIndicatorCBV');
                if (indicator) {
                    indicator.textContent = '❌';
                    indicator.style.color = '#dc3545';
                    indicator.style.fontSize = '28px';
                    indicator.title = 'Erreur de communication';
                    indicator.style.opacity = '1';

                    // Hide after 3 seconds
                    setTimeout(() => {
                        if (indicator) {
                            indicator.style.opacity = '0';
                        }
                    }, 3000);
                } else {
                    console.error('[CBV] Indicateur non trouvé dans la popup !');
                    // Fallback to showing communication error message
                    let communicationError = `❌ ÉCHEC - Erreur de communication native
                    
🔍 Erreur: ${error.message}

📋 Données tentées:
• Patient: ${message.nom} ${message.prenom}
• Médecin: ${message.medecin}

🛠️ Causes possibles de communication:`;

                    // Analyser le type d'erreur de communication
                    if (error.message.includes('An unexpected error occurred')) {
                        communicationError += `
• L'application native n'est pas accessible
• Vérifiez que l'application native est enregistrée
• Redémarrez Firefox complètement
• Commande test: reg query "HKEY_CURRENT_USER\\SOFTWARE\\Mozilla\\NativeMessagingHosts\\com.daoudi.certificat"`;
                    } else if (error.message.includes('No such native application')) {
                        communicationError += `
• L'application native n'est pas enregistrée
• Exécutez: native_app\\register_firefox.bat
• Vérifiez le chemin: D:\\certnat\\native_app\\com.daoudi.certificat.json`;
                    } else if (error.message.includes('Native host has exited')) {
                        communicationError += `
• L'application native s'est fermée de manière inattendue
• Vérifiez que Python est installé et accessible
• Testez manuellement: cd native_app && native.bat`;
                    } else if (error.message.includes('Aucune API de messagerie native disponible')) {
                        communicationError += `
• Les APIs browser/chrome ne sont pas disponibles
• Vérifiez que l'extension a la permission nativeMessaging
• Rechargez l'extension dans about:debugging`;
                    } else {
                        communicationError += `
• Erreur de communication inconnue
• Vérifiez les logs de Firefox (F12 → Console)
• Redémarrez Firefox et rechargez l'extension
• Testez l'application native manuellement`;
                    }

                    communicationError += `

🔧 Actions de dépannage:
1. Fermez Firefox complètement
2. Exécutez: native_app\\register_firefox.bat
3. Relancez Firefox`;

                    afficherMessageDansPopup(popupWindow, communicationError, 'error');
                }
            }
        } catch (e) {
            console.error('[CBV] Erreur lors de l\'affichage de l\'indicateur d\'erreur de communication:', e);
            // Fallback to showing communication error message
            if (popupWindow) {
                afficherMessageDansPopup(popupWindow, '❌ Erreur de communication: ' + error.message, 'error');
            }
        }

        throw error;
    }
}

// Variable pour le debounce
let lastMessageTime = 0;

// Fonction pour afficher un message personnalisé dans la popup
function afficherMessageDansPopup(popupWindow, message, type = 'info') {
    try {
        // Debounce: Éviter l'affichage multiple si appelé trop rapidement (moins de 1s)
        const now = Date.now();
        if (now - lastMessageTime < 1000) {
            console.log('🚫 Message ignoré (doublon détecté)');
            return;
        }
        lastMessageTime = now;

        // Supprimer TOUS les messages existants
        const existingMessages = popupWindow.document.querySelectorAll('#messageCBV');
        existingMessages.forEach(msg => msg.remove());

        // Créer le conteneur du message
        const messageDiv = popupWindow.document.createElement('div');
        messageDiv.id = 'messageCBV';

        // Définir les styles selon le type de message
        let backgroundColor, borderColor, textColor, icon;

        switch (type) {
            case 'success':
                backgroundColor = '#d4edda';
                borderColor = '#c3e6cb';
                textColor = '#155724';
                icon = '✅';
                break;
            case 'error':
                backgroundColor = '#f8d7da';
                borderColor = '#f5c6cb';
                textColor = '#721c24';
                icon = '❌';
                break;
            case 'warning':
                backgroundColor = '#fff3cd';
                borderColor = '#ffeaa7';
                textColor = '#856404';
                icon = '⚠️';
                break;
            default: // info
                backgroundColor = '#d1ecf1';
                borderColor = '#bee5eb';
                textColor = '#0c5460';
                icon = 'ℹ️';
        }

        // Appliquer les styles
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            max-width: 90%;
            width: 500px;
            padding: 15px 20px;
            background-color: ${backgroundColor};
            border: 2px solid ${borderColor};
            border-radius: 8px;
            color: ${textColor};
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.4;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            white-space: pre-line;
            animation: slideDown 0.3s ease-out;
        `;

        // Ajouter l'animation CSS
        const style = popupWindow.document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
            }
        `;
        popupWindow.document.head.appendChild(style);

        // Créer le contenu du message avec DOM manipulation
        const messageContent = popupWindow.document.createElement('div');

        // Create flex container
        const flexContainer = popupWindow.document.createElement('div');
        flexContainer.style.display = 'flex';
        flexContainer.style.alignItems = 'flex-start';
        flexContainer.style.gap = '10px';

        // Create icon
        const iconSpan = popupWindow.document.createElement('span');
        iconSpan.style.fontSize = '20px';
        iconSpan.style.flexShrink = '0';
        iconSpan.textContent = icon;

        // Create content wrapper
        const contentWrapper = popupWindow.document.createElement('div');
        contentWrapper.style.flex = '1';

        // Create title
        const titleDiv = popupWindow.document.createElement('div');
        titleDiv.style.fontWeight = 'bold';
        titleDiv.style.marginBottom = '8px';
        titleDiv.style.fontSize = '16px';
        titleDiv.textContent = type === 'success' ? 'Sauvegarde Réussie' :
            type === 'error' ? 'Erreur de Sauvegarde' :
                type === 'warning' ? 'Attention' : 'Information';

        // Create message text
        const messageText = popupWindow.document.createElement('div');
        messageText.style.whiteSpace = 'pre-line';
        messageText.style.fontSize = '13px';
        messageText.textContent = message;

        // Create close button
        const closeBtn = popupWindow.document.createElement('button');
        closeBtn.id = 'closeMessageBtn';
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: ${textColor};
            padding: 0;
            margin-left: 10px;
            flex-shrink: 0;
            opacity: 0.7;
            transition: opacity 0.2s;
        `;

        // Assemble the structure
        contentWrapper.appendChild(titleDiv);
        contentWrapper.appendChild(messageText);
        flexContainer.appendChild(iconSpan);
        flexContainer.appendChild(contentWrapper);
        flexContainer.appendChild(closeBtn);
        messageContent.appendChild(flexContainer);

        messageDiv.appendChild(messageContent);

        // Ajouter le message au body de la popup
        popupWindow.document.body.appendChild(messageDiv);

        // Ajouter l'événement de fermeture
        closeBtn.addEventListener('click', function () {
            fermerMessage(messageDiv);
        });

        // Ajouter les événements de survol pour l'opacité (remplace onmouseover/onmouseout pour CSP)
        closeBtn.addEventListener('mouseenter', function () {
            this.style.opacity = '1';
        });
        closeBtn.addEventListener('mouseleave', function () {
            this.style.opacity = '0.7';
        });

        // Auto-fermeture après 1 seconde pour les succès, 4 secondes pour les erreurs
        const autoCloseDelay = type === 'success' ? 1000 : 4000;
        setTimeout(() => {
            if (messageDiv && messageDiv.parentNode) {
                fermerMessage(messageDiv);
            }
        }, autoCloseDelay);

        console.log(`📢 Message ${type} affiché dans la popup`);

    } catch (error) {
        console.error('❌ Erreur lors de l\'affichage du message dans la popup:', error);
        // Fallback vers alert système si l'affichage personnalisé échoue
        alert(message);
    }
}

// Fonction pour fermer le message avec animation
function fermerMessage(messageDiv) {
    if (messageDiv && messageDiv.parentNode) {
        messageDiv.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
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

console.log('🚀 Script de sauvegarde CBV initialisé');