// prophylaxie-pre-exposition-schema1-c2-certificat.js

// Écouter les messages de l'extension
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.certData) {
        window.certData = request.certData;
        // Déclencher l'événement personnalisé
        window.dispatchEvent(new CustomEvent('certDataReady'));
    }
});

window.addEventListener('certDataReady', function () {
    const certData = window.certData || {};

    // Remplir les champs patient
    document.getElementById('patientName').value = (certData.nom || '') + ' ' + (certData.prenom || '');
    document.getElementById('patientDob').value = certData.dob || '';
    
    const doctorNameElement = document.getElementById('doctorName');
    if (doctorNameElement) {
        doctorNameElement.textContent = 'Dr ' + (certData.docteur || '');
    }

    // Remplir les dates de vaccination
    if (certData.dateFormattedJour0 && document.getElementById('dateJour0')) {
        document.getElementById('dateJour0').value = certData.dateFormattedJour0;
    }
    if (certData.dateFormattedPlus3 && document.getElementById('datePlus3')) {
        document.getElementById('datePlus3').value = certData.dateFormattedPlus3;
    }
    if (certData.dateFormattedPlus7 && document.getElementById('datePlus7')) {
        document.getElementById('datePlus7').value = certData.dateFormattedPlus7;
    }
    if (certData.dateFormattedPlus14 && document.getElementById('datePlus14')) {
        document.getElementById('datePlus14').value = certData.dateFormattedPlus14;
    }
    if (certData.dateFormattedPlus21 && document.getElementById('datePlus21')) {
        document.getElementById('datePlus21').value = certData.dateFormattedPlus21;
    }
    if (certData.dateFormattedPlus28 && document.getElementById('datePlus28')) {
        document.getElementById('datePlus28').value = certData.dateFormattedPlus28;
    }

    // Remplir l'en-tête si disponible
    if (certData.enteteContent) {
        const enteteDiv = document.getElementById('enteteContent');
        if (enteteDiv) {
            enteteDiv.innerHTML = certData.enteteContent;
        }
    }

    const saveButton = document.getElementById('saveSchema1C2Button');
    if (saveButton) {
        saveButton.addEventListener('click', function () {
            console.log("Clic sur le bouton de sauvegarde Avec ATCD Vaccinaux (Schéma 1).");

            const patientFullName = document.getElementById('patientName').value.trim();
            let patientNom = '';
            let patientPrenom = '';

            if (patientFullName) {
                const nameParts = patientFullName.split(' ');
                if (nameParts.length >= 2) {
                    patientNom = nameParts[0];
                    patientPrenom = nameParts.slice(1).join(' ');
                } else {
                    patientNom = nameParts[0];
                }
            }

            const medecin = certData.docteur || localStorage.getItem('docteur') || '';

            const data = {
                command: 'save_antirabique',
                nom: patientNom,
                prenom: patientPrenom,
                date_de_naissance: document.getElementById('patientDob').value,
                date_de_certificat: document.getElementById('dateJour0') ? document.getElementById('dateJour0').value : '',
                type_de_vaccin: 'Cellulaire',
                shema: 'Avec ATCD Vaccinaux (Schéma 1)',
                classe: '02',
                animal: document.getElementById('animal') ? document.getElementById('animal').value : 'chien',
                medecin: medecin
            };

            console.log("Données collectées pour la sauvegarde :", JSON.stringify(data, null, 2));

            if (typeof envoyerMessageNatifRabique === 'function') {
                console.log("Appel de envoyerMessageNatifRabique...");
                envoyerMessageNatifRabique(data)
                    .then(() => {
                        console.log("Sauvegarde du certificat Avec ATCD Vaccinaux (Schéma 1) réussie.");
                        alert("✅ Succès !\n\nLe certificat antirabique (Avec ATCD Vaccinaux (Schéma 1)) a été sauvegardé.");
                    })
                    .catch(err => {
                        console.error("Erreur lors de la sauvegarde du certificat Avec ATCD Vaccinaux (Schéma 1):", err);
                        alert("❌ Erreur !\n\nImpossible de sauvegarder le certificat. Vérifiez la console (F12) pour plus de détails.");
                    });
            } else {
                console.error('La fonction envoyerMessageNatifRabique n est pas définie. Assurez-vous que le script rabique-save-handler.js est correctement chargé.');
                alert('Erreur : la fonction de sauvegarde n est pas disponible.');
            }
        });
    }
});
