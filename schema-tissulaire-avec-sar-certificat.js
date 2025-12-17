// schema-tissulaire-avec-sar-certificat.js

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

    document.getElementById('patientName').value = (certData.nom || '') + ' ' + (certData.prenom || '');
    document.getElementById('patientDob').value = certData.dob || '';
    document.getElementById('doctorName').textContent = 'Dr ' + (certData.docteur || '');
    document.getElementById('dateJour0').value = certData.dateFormattedJour0 || '';
    document.getElementById('datePlus1').value = certData.dateFormattedPlus1 || '';
    document.getElementById('datePlus2').value = certData.dateFormattedPlus2 || '';
    document.getElementById('datePlus3').value = certData.dateFormattedPlus3 || '';
    document.getElementById('datePlus4').value = certData.dateFormattedPlus4 || '';
    document.getElementById('datePlus5').value = certData.dateFormattedPlus5 || '';
    document.getElementById('datePlus6').value = certData.dateFormattedPlus6 || '';
    document.getElementById('datePlus10').value = certData.dateFormattedPlus10 || '';
    document.getElementById('datePlus14').value = certData.dateFormattedPlus14 || '';
    document.getElementById('datePlus29').value = certData.dateFormattedPlus29 || '';
    document.getElementById('datePlus90').value = certData.dateFormattedPlus90 || '';
    document.getElementById('poids').value = certData.poidsInput ? certData.poidsInput + ' kg' : '';
    document.getElementById('sar').textContent = certData.sar ? certData.sar + ' cc' : '';

    if (certData.enteteContent) {
        const enteteContainer = document.getElementById('enteteContent');
        enteteContainer.textContent = '';
        const parser = new DOMParser();
        const doc = parser.parseFromString(certData.enteteContent, 'text/html');
        while (doc.body.firstChild) {
            enteteContainer.appendChild(doc.body.firstChild);
        }
    }

    document.getElementById('printButton').addEventListener('click', function () {
        window.print();
    });

    document.getElementById('saveSchemaTissulaireAvecSARButton').addEventListener('click', function () {
        console.log("Clic sur le bouton de sauvegarde Schéma Tissulaire avec SAR.");

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
            date_de_certificat: document.getElementById('dateJour0').value,
            type_de_vaccin: 'Tissulaire',
            shema: 'Tissulaire avec SAR',
            classe: '03',
            animal: document.getElementById('animal').value,
            medecin: medecin
        };

        console.log("Données collectées pour la sauvegarde :", JSON.stringify(data, null, 2));

        if (typeof envoyerMessageNatifRabique === 'function') {
            console.log("Appel de envoyerMessageNatifRabique...");
            envoyerMessageNatifRabique(data)
                .then(() => {
                    console.log("Sauvegarde du certificat Schéma Tissulaire avec SAR réussie.");
                    alert("✅ Succès !\n\nLe certificat antirabique (Schéma Tissulaire avec SAR) a été sauvegardé.");
                })
                .catch(err => {
                    console.error("Erreur lors de la sauvegarde du certificat Schéma Tissulaire avec SAR:", err);
                    alert("❌ Erreur !\n\nImpossible de sauvegarder le certificat. Vérifiez la console (F12) pour plus de détails.");
                });
        } else {
            console.error('La fonction envoyerMessageNatifRabique n est pas définie. Assurez-vous que le script rabique-save-handler.js est correctement chargé.');
            alert('Erreur : la fonction de sauvegarde n est pas disponible.');
        }
    });
});