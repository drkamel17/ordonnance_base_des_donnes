// Listen for the custom event when data is ready
window.addEventListener('certDataReady', function () {
    // Données passées depuis l'extension
    const certData = window.certData || {};

    // Remplir les champs avec les données
    document.getElementById('patientName').value = (certData.nom || '') + ' ' + (certData.prenom || '');
    document.getElementById('patientDob').value = certData.dob || '';
    document.getElementById('doctorName').textContent = 'Dr ' + (certData.docteur || '');

    // Remplir les dates de vaccination calculées
    if (certData.dateFormattedJour0) {
        document.getElementById('dateJour0').value = certData.dateFormattedJour0;
    }
    if (certData.dateFormattedPlus3) {
        document.getElementById('datePlus3').value = certData.dateFormattedPlus3;
    }
    if (certData.dateFormattedPlus7) {
        document.getElementById('datePlus7').value = certData.dateFormattedPlus7;
    }
    if (certData.dateFormattedPlus14) {
        document.getElementById('datePlus14').value = certData.dateFormattedPlus14;
    }

    // Remplir l'en-tête si disponible
    if (certData.enteteContent) {
        const enteteDiv = document.getElementById('enteteContent');
        if (enteteDiv) {
            enteteDiv.innerHTML = certData.enteteContent;
        }
    }

    // Save button listener
    document.getElementById('saveEssenButton').addEventListener('click', function () {
        console.log("Clic sur le bouton de sauvegarde Essen.");

        // Correctly parse the patient name
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

        // Get doctor from certData or fallback to localStorage
        const medecin = certData.docteur || localStorage.getItem('docteur') || '';

        const data = {
            command: 'save_antirabique',
            nom: patientNom,
            prenom: patientPrenom,
            date_de_naissance: document.getElementById('patientDob').value,
            date_de_certificat: document.getElementById('dateJour0').value,
            type_de_vaccin: 'cellulaire',
            shema: 'Essen',
            classe: '02',
            animal: document.getElementById('animal').value,
            medecin: medecin
        };

        console.log("Données collectées pour la sauvegarde :", JSON.stringify(data, null, 2));

        if (typeof envoyerMessageNatifRabique === 'function') {
            console.log("Appel de envoyerMessageNatifRabique...");
            envoyerMessageNatifRabique(data)
                .then(() => {
                    console.log("Sauvegarde du certificat Essen réussie.");
                    alert("✅ Succès !\n\nLe certificat antirabique (Essen) a été sauvegardé.");
                })
                .catch(err => {
                    console.error("Erreur lors de la sauvegarde du certificat Essen:", err);
                    alert("❌ Erreur !\n\nImpossible de sauvegarder le certificat. Vérifiez la console (F12) pour plus de détails.");
                });
        } else {
            console.error('La fonction envoyerMessageNatifRabique n est pas définie. Assurez-vous que le script rabique-save-handler.js est correctement chargé.');
            alert('Erreur : la fonction de sauvegarde n est pas disponible.');
        }
    });
});