// essen3-certificat.js
window.addEventListener('certDataReady', function () {
    const certData = window.certData || {};

    document.getElementById('patientName').value = (certData.nom || '') + ' ' + (certData.prenom || '');
    document.getElementById('patientDob').value = certData.dob || '';
    document.getElementById('doctorName').textContent = 'Dr ' + (certData.docteur || '');
    document.getElementById('dateJour0').value = certData.dateFormattedJour0 || '';
    document.getElementById('datePlus3').value = certData.dateFormattedPlus3 || '';
    document.getElementById('datePlus7').value = certData.dateFormattedPlus7 || '';
    document.getElementById('datePlus14').value = certData.dateFormattedPlus14 || '';
    document.getElementById('poids').value = certData.poidsInput ? certData.poidsInput + ' kg' : '';
    document.getElementById('sar').textContent = certData.sar ? certData.sar + ' cc' : '';

    if (certData.enteteContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(certData.enteteContent, 'text/html');
        const enteteElement = document.getElementById('enteteContent');
        enteteElement.textContent = '';
        Array.from(doc.body.childNodes).forEach(node => {
            enteteElement.appendChild(node.cloneNode(true));
        });
    }

    document.getElementById('printButton').addEventListener('click', function () {
        window.print();
    });

    document.getElementById('saveEssen3Button').addEventListener('click', function () {
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
            type_de_vaccin: 'cellulaire',
            shema: 'Essen',
            classe: '03',
            animal: document.getElementById('animal').value,
            medecin: medecin
        };

        if (typeof envoyerMessageNatifRabique === 'function') {
            envoyerMessageNatifRabique(data)
                .then(() => {
                    alert("✅ Succès !\n\nLe certificat antirabique (Essen3) a été sauvegardé.");
                })
                .catch(err => {
                    console.error("Erreur lors de la sauvegarde du certificat Essen3:", err);
                    alert("❌ Erreur !\n\nImpossible de sauvegarder le certificat. Vérifiez la console (F12) pour plus de détails.");
                });
        } else {
            console.error('La fonction envoyerMessageNatifRabique n est pas définie.');
            alert('Erreur : la fonction de sauvegarde n est pas disponible.');
        }
    });
});
