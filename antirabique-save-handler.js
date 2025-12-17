console.log('🔧 Script de sauvegarde Antirabique chargé');

// Intercepter l'ouverture des fenêtres de certificats antirabiques
// Sauvegarder les fonctions originales
let originalFunctions = {};

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM chargé, interception des fonctions antirabiques...');
    
    // Liste des fonctions antirabiques à intercepter
    const antirabiqueFunctions = [
        'avecATCDVaccinauxIM',
        'risqueHemorragiqueClasse2',
        'prophylaxiePreExpositionSchema1Classe2',
        'prophylaxiePreExpositionSchema2Classe2',
        'Tissulaireavecsar',
        'vaccinc3',
        'essen3'
    ];
    
    // Intercepter chaque fonction
    antirabiqueFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            originalFunctions[funcName] = window[funcName];
            
            window[funcName] = function() {
                console.log(`🔍 Interception de ${funcName}`);
                
                // Appeler la fonction originale
                const result = originalFunctions[funcName].apply(this, arguments);
                
                // Ajouter le bouton de sauvegarde immédiatement après l'ouverture
                // Utiliser une vérification immédiate et des tentatives répétées si nécessaire
                if (window.lastOpenedWindow) {
                    // Essayer immédiatement
                    setTimeout(() => {
                        ajouterBoutonSiAntirabique(window.lastOpenedWindow, funcName);
                    }, 100);
                    
                    // Essayer après que le DOM soit chargé
                    try {
                        if (window.lastOpenedWindow.document.readyState === 'loading') {
                            window.lastOpenedWindow.document.addEventListener('DOMContentLoaded', () => {
                                setTimeout(() => {
                                    ajouterBoutonSiAntirabique(window.lastOpenedWindow, funcName);
                                }, 100);
                            });
                        } else {
                            // DOM déjà chargé
                            setTimeout(() => {
                                ajouterBoutonSiAntirabique(window.lastOpenedWindow, funcName);
                            }, 100);
                        }
                    } catch (e) {
                        console.log(`⚠️ Erreur lors de l'ajout du listener pour ${funcName}:`, e);
                    }
                    
                    // Fallback: essayer plusieurs fois avec des intervalles courts
                    for (let i = 0; i < 10; i++) {
                        setTimeout(() => {
                            ajouterBoutonSiAntirabique(window.lastOpenedWindow, funcName);
                        }, i * 200);
                    }
                }
                
                return result;
            };
            
            console.log(`✅ Fonction ${funcName} interceptée`);
        } else {
            console.log(`❌ Fonction ${funcName} non trouvée`);
        }
    });
});

// Fonction globale pour vérifier si c'est une fenêtre de certificat antirabique et ajouter le bouton
function ajouterBoutonSiAntirabique(win, funcName) {
    try {
        if (!win || !win.document) {
            return;
        }
        
        // Vérifier si c'est une fenêtre de certificat antirabique
        const title = win.document.title || '';
        const h1 = win.document.querySelector('h1');
        const h1Text = h1 ? h1.textContent : '';
        
        // Vérifier aussi le contenu du body pour être plus robuste
        const bodyText = win.document.body ? win.document.body.textContent || '' : '';
        
        const isAntirabiqueWindow = title.includes('Antirabique') || 
                                  title.includes('antirabique') ||
                                  h1Text.includes('Antirabique') || 
                                  h1Text.includes('antirabique') ||
                                  bodyText.includes('Antirabique') ||
                                  bodyText.includes('antirabique') ||
                                  title.includes('Rabique') || 
                                  title.includes('rabique') ||
                                  h1Text.includes('Rabique') || 
                                  h1Text.includes('rabique') ||
                                  bodyText.includes('Rabique') ||
                                  bodyText.includes('rabique');
        
        if (isAntirabiqueWindow) {
            console.log(`✅ Fenêtre de certificat antirabique détectée (${funcName})`);
            
            const printButton = win.document.getElementById('printButton');
            const saveButton = win.document.getElementById('saveButtonRc2');
            
            if (printButton && !saveButton) {
                console.log('✅ Ajout du bouton de sauvegarde dans la popup antirabique');
                    
                // Créer le bouton de sauvegarde
                const boutonSauvegarde = win.document.createElement('button');
                boutonSauvegarde.id = 'saveButtonRc2';
                boutonSauvegarde.innerHTML = '<i class="fas fa-save"></i> Sauvegarder';
                boutonSauvegarde.style.cssText = `
                    background-color: #28a745;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    margin-left: 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.3s;
                `;
                
                // Ajouter l'effet hover
                boutonSauvegarde.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = '#218838';
                });
                boutonSauvegarde.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = '#28a745';
                });
                
                // Ajouter le bouton à côté du bouton d'impression
                printButton.parentNode.appendChild(boutonSauvegarde);
                
                // Ajouter l'événement de sauvegarde
                boutonSauvegarde.addEventListener('click', function() {
                    sauvegarderCertificatAntirabiqueDepuisPopupDirect(win, funcName);
                });
                
                console.log('✅ Bouton de sauvegarde ajouté dans la popup antirabique');
            } else if (!printButton) {
                console.log('⏳ Bouton printButton pas encore disponible, réessai dans 100ms...');
            } else if (saveButton) {
                console.log('ℹ️ Bouton de sauvegarde déjà présent');
            }
        }
    } catch (e) {
        // Ignore les erreurs d'accès cross-origin
        console.log('❌ Erreur d\'accès à la fenêtre antirabique:', e.message);
    }
}

// Fonction de sauvegarde des certificats antirabiques depuis la popup avec extraction de données directe
async function sauvegarderCertificatAntirabiqueDepuisPopupDirect(popupWindow, funcName) {
    console.log(`💾 Début de la sauvegarde certificat antirabique depuis popup direct (${funcName})...`);
    
    try {
        // Récupérer les données depuis les champs de la popup
        const nomPrenomInput = popupWindow.document.querySelector('input[value*=" "]') || 
                              popupWindow.document.querySelector('input[type="text"]');
        let nom = '', prenom = '';
        
        if (nomPrenomInput && nomPrenomInput.value) {
            const nomPrenom = nomPrenomInput.value.trim();
            const parts = nomPrenom.split(' ');
            if (parts.length >= 2) {
                nom = parts[0];
                prenom = parts.slice(1).join(' ');
            } else if (parts.length === 1) {
                nom = parts[0];
            }
        }
        
        // Si on n'a pas pu extraire nom et prénom, essayer d'autres approches
        if (!nom || !prenom) {
            // Essayer de trouver des inputs séparés
            const inputs = popupWindow.document.querySelectorAll('input[type="text"]');
            if (inputs.length >= 2) {
                // Supposer que le premier est le nom et le deuxième le prénom
                const fullName = inputs[0].value.trim();
                const parts = fullName.split(' ');
                if (parts.length >= 2) {
                    nom = parts[0];
                    prenom = parts.slice(1).join(' ');
                } else {
                    nom = fullName;
                }
            }
        }
        
        // Récupérer le médecin depuis le champ docteur ou localStorage
        let medecin = '';
        const medecinInput = popupWindow.document.querySelector('.docteur') || 
                            popupWindow.document.getElementById('docteur');
        
        if (medecinInput) {
            medecin = medecinInput.textContent.trim() || medecinInput.innerText.trim();
            // Nettoyer le "Dr " si présent
            if (medecin.startsWith('Dr ')) {
                medecin = medecin.substring(3);
            }
        }
        
        // Fallback: utiliser localStorage
        if (!medecin) {
            medecin = localStorage.getItem('docteur') || '';
        }
        
        // Récupérer la date de naissance
        let dateNaissance = '';
        const dobInputs = popupWindow.document.querySelectorAll('input[type="text"]');
        for (let input of dobInputs) {
            const value = input.value.trim();
            // Chercher un pattern de date
            if (value.match(/\d{4}-\d{2}-\d{2}/) || value.match(/\d{2}\/\d{2}\/\d{4}/)) {
                dateNaissance = value;
                break;
            }
        }
        
        // Récupérer la date du certificat
        let dateCertificat = '';
        const dateInputs = popupWindow.document.querySelectorAll('input[type="date"]');
        if (dateInputs.length > 0) {
            dateCertificat = dateInputs[0].value; // Prendre la première date
        }
        
        // Si pas de date trouvée, utiliser aujourd'hui
        if (!dateCertificat) {
            const today = new Date();
            dateCertificat = today.toISOString().split('T')[0];
        }
        
        // Déterminer le type de vaccin, schéma et classe selon la fonction
        let typeDeVaccin = '';
        let shema = '';
        let classe = '';
        let animal = 'chien'; // Valeur par défaut
        
        // Déterminer les caractéristiques selon la fonction appelée
        switch(funcName) {
            case 'avecATCDVaccinauxIM':
                typeDeVaccin = 'IM';
                shema = 'Avec ATCD Vaccinaux (IM)';
                classe = '02';
                break;
            case 'risqueHemorragiqueClasse2':
                typeDeVaccin = 'Cellulaire';
                shema = 'Risque Hémorragique';
                classe = '02';
                break;
            case 'prophylaxiePreExpositionSchema1Classe2':
                typeDeVaccin = 'Cellulaire';
                shema = 'Avec ATCD Vaccinaux (Schéma 1)';
                classe = '02';
                break;
            case 'prophylaxiePreExpositionSchema2Classe2':
                typeDeVaccin = 'Cellulaire';
                shema = 'Avec ATCD Vaccinaux (Schéma 2)';
                classe = '02';
                break;
            case 'Tissulaireavecsar':
                typeDeVaccin = 'Tissulaire';
                shema = 'Tissulaire avec SAR';
                classe = '03';
                break;
            case 'vaccinc3':
                typeDeVaccin = 'Cellulaire';
                shema = 'Zagreb';
                classe = '03';
                break;
            case 'essen3':
                typeDeVaccin = 'Cellulaire';
                shema = 'Essen';
                classe = '03';
                break;
            default:
                typeDeVaccin = 'Inconnu';
                shema = funcName;
                classe = '02';
        }
        
        console.log('📋 Données récupérées depuis popup:', {
            nom,
            prenom,
            medecin,
            dateCertificat,
            dateNaissance,
            typeDeVaccin,
            shema,
            classe,
            animal
        });
        
        // Vérifier que nous avons les données minimales
        if (!nom) {
            alert('Erreur: Nom du patient requis. Veuillez remplir les informations patient d\'abord.');
            return;
        }
        
        if (!medecin) {
            alert('Erreur: Nom du médecin requis. Veuillez configurer le médecin dans les options.');
            return;
        }
        
        // Préparer le message pour l'application native
        const message = {
            action: "save_antirabique",
            nom: nom,
            prenom: prenom || '', // Prénom peut être vide
            medecin: medecin,
            classe: classe,
            type_de_vaccin: typeDeVaccin,
            shema: shema,
            date_de_certificat: dateCertificat,
            date_de_naissance: dateNaissance || null,
            animal: animal
        };
        
        console.log('📤 Message à envoyer:', message);
        
        // Envoyer à l'application native
        if (typeof envoyerMessageNatifRabique === 'function') {
            await envoyerMessageNatifRabique(message);
        } else {
            console.error('❌ Fonction envoyerMessageNatifRabique non disponible');
            alert('❌ Erreur: Fonction de sauvegarde non disponible');
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde depuis popup:', error);
        alert('Erreur lors de la sauvegarde: ' + error.message);
    }
}

console.log('🚀 Script de sauvegarde Antirabique initialisé');