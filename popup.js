﻿// popup.js
// Ã‰couter les messages pour ouvrir popup.js
browser.runtime.onMessage.addListener((message) => {
    if (message.action === "ouvrirPopup") {
        // Ouvrir la modale ou effectuer d'autres actions necessaires
        document.getElementById("modal").style.display = "block";
        // Vous pouvez egalement appeler d'autres fonctions ici si necessaire
    }
});


// Declaration de la variable pour stocker les medicaments
const ordonnanceMedicaments = [];
// Gerer l'ouverture de la modale
document.getElementById("gerer-medicaments").addEventListener("click", () => {
    afficherMedicamentsPersonnalises();
    document.getElementById("modal").style.display = "block";
});



// Gerer la fermeture de la modale
document.querySelector(".close").onclick = function () {
    document.getElementById("modal").style.display = "none";
};

window.onclick = function (event) {
    if (event.target == document.getElementById("modal")) {
        document.getElementById("modal").style.display = "none";
    }
};

// Vider les medicaments
document.getElementById("vider-medicaments").addEventListener("click", () => {
    if (confirm("Voulez-vous vraiment supprimer tous les medicaments enregistres ?")) {
        localStorage.setItem("medicaments", JSON.stringify([]));
        afficherMedicamentsPersonnalises();
        remplirDatalist([]);
    }
});

// Fonction pour capitaliser automatiquement les noms et prénoms
function capitalizeNames(text) {
    if (!text) return text;
    return text.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase());
}

function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag]));
}

document.addEventListener("DOMContentLoaded", async () => {
    // Gestion de la navigation au clavier entre les champs
    const medicamentInput = document.getElementById('medicament');
    const posologieInput = document.getElementById('posologie');
    const quantiteInput = document.getElementById('quantite');
    const boutonAjouter = document.getElementById('ajouter');

    medicamentInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            posologieInput.focus();
        }
    });

    posologieInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            quantiteInput.focus();
        }
    });

    quantiteInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            boutonAjouter.focus();
        }
    });

    boutonAjouter.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            medicamentInput.focus();
        }
    });

    // Charger les ordonnances types au chargement
    // Charger les ordonnances types au chargement
    await chargerOrdonnancesTypes();

    // Remplir les champs de texte avec les valeurs recuperees
    document.getElementById("polyclinique").value = localStorage.getItem("polyclinique") || '';
    document.getElementById("polyclinique-ar").value = localStorage.getItem("polyclinique-ar") || '';
    document.getElementById("docteur").value = localStorage.getItem("docteur") || '';
    // Définir la date de consultation par défaut
    const dateConsultation = document.querySelector('input[name="date-consultation"]');
    if (dateConsultation) {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        dateConsultation.value = formattedDate;
    }

    // Gérer le chargement des préférences
    function chargerPreferences() {
        const savedHeaderOption = localStorage.getItem('headerOption');
        if (savedHeaderOption) {
            const radioButton = document.querySelector(`input[name="header-option"][value="${savedHeaderOption}"]`);
            if (radioButton) {
                radioButton.checked = true;
                handleHeaderOptionChange(); // Appelle handleHeaderOptionChange pour lier la fonction
            }
        }

        // Charger les données depuis localStorage
        const polyclinique = localStorage.getItem("polyclinique") || '';
        const polycliniqueAr = localStorage.getItem("polyclinique-ar") || '';
        const docteur = localStorage.getItem("docteur") || '';
        document.getElementById("polyclinique").value = polyclinique;
        document.getElementById("polyclinique-ar").value = polycliniqueAr;
        document.getElementById("docteur").value = docteur;

        // Charger les données de l'utilisateur
        browser.storage.local.get(['nom', 'prenom', 'dob', 'numero', 'poids']).then((data) => {
            document.getElementById('nom').value = data.nom || '';
            document.getElementById('prenom').value = data.prenom || '';
            document.getElementById('date-naissance').value = data.dob || '';
            document.getElementById('numero').value = data.numero || '';
            document.getElementById('poids').value = data.poids || '';

            // Calculer l'âge si la date de naissance existe
            if (data.dob) {
                calculateAge(data.dob);
            }
        }).catch((error) => {
            console.error("Erreur lors de la récupération des données : ", error);
        });
    }

    // Appel initial des préférences
    chargerPreferences();

    // Gérer le changement du radio button
    function handleHeaderOptionChange() {
        const headerOption = document.querySelector('input[name="header-option"]:checked').value;
        const genererPdfButton = document.getElementById("generer-pdf");

        // Supprimer tous les ecouteurs existants
        genererPdfButton.removeEventListener("click", ordonnance);
        genererPdfButton.removeEventListener("click", ordonnancedem);

        // Ajouter le nouvel ecouteur
        if (headerOption === "DEM-header") {
            genererPdfButton.addEventListener("click", ordonnancedem);
        } else {
            genererPdfButton.addEventListener("click", ordonnance);
        }
    }

    // Ajouter l'ecouteur d'evenements pour le changement du radio button
    document.querySelectorAll('input[name="header-option"]').forEach(radio => {
        radio.addEventListener('change', handleHeaderOptionChange);
    });

    // Charger les donnees depuis localStorage
    const polyclinique = localStorage.getItem("polyclinique") || '';
    const polycliniqueAr = localStorage.getItem("polyclinique-ar") || '';
    const docteur = localStorage.getItem("docteur") || '';
    document.getElementById("polyclinique").value = polyclinique;
    document.getElementById("polyclinique-ar").value = polycliniqueAr;
    document.getElementById("docteur").value = docteur;

    // Recuperer les donnees stockees
    browser.storage.local.get(['nom', 'prenom', 'dob', 'numero']).then((data) => {
        document.getElementById('nom').value = data.nom || '';
        document.getElementById('prenom').value = data.prenom || '';
        document.getElementById('date-naissance').value = data.dob || '';
        document.getElementById('numero').value = data.numero || '';

        // Calculer l'Ã¢ge si la date de naissance existe
        if (data.dob) {
            calculateAge(data.dob);
        }
    }).catch((error) => {
        console.error("Erreur lors de la recuperation des donnees : ", error);
    });

    document.getElementById("etablissemnt").addEventListener("click", transfererEtablissement);

    // Load header preference
    const savedHeaderOption = localStorage.getItem('headerOption');
    if (savedHeaderOption) {
        document.querySelector(`input[name="header-option"][value="${savedHeaderOption}"]`).checked = true;
        handleHeaderOptionChange();  // Appeler handleHeaderOptionChange aprÃ¨s le chargement
    }

    // Enregistrer le choix d'en-tÃªte quand le bouton radio change
    document.querySelectorAll('input[name="header-option"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            localStorage.setItem('headerOption', e.target.value);
        });
    });


    chargerMedicaments();
    //chargerOrdonnancesTypes();
    await chargerOrdonnancesTypes();
    configurerEcouteurs();
    handleHeaderOptionChange();
    afficherMedicamentsPersonnalises(); // Afficher les medicaments personnalises
    afficherInfosEtab(); // Affiche les infos au chargement de la page
    // Event listener pour sauvegarder les informations de la polyclinique et du docteur

    // Ajouter un ecouteur pour le bouton "Charger"
    document.getElementById("charger-ordonnance-type").addEventListener("click", chargerOrdonnanceType);

    document.getElementById("certificat").addEventListener("click", () => {
        const nom = capitalizeNames(document.getElementById("nom").value.trim());
        const prenom = capitalizeNames(document.getElementById("prenom").value.trim());
        const dateNaissance = document.getElementById("date-naissance").value;
        const age = document.getElementById("age").value;
        const numero = document.getElementById("numero").value;

        // Stocker dans localStorage avec capitalisation
        localStorage.setItem("nom", nom);
        localStorage.setItem("prenom", prenom);
        localStorage.setItem("dateNaissance", dateNaissance);
        localStorage.setItem("age", age);
        localStorage.setItem("numero", numero);

        // Ouvre ord.html dans un nouvel onglet
        chrome.tabs.create({ url: chrome.runtime.getURL('certificat.html') });

    });

    document.getElementById("certdece").addEventListener("click", () => {
        const nom = capitalizeNames(document.getElementById("nom").value.trim());
        const prenom = capitalizeNames(document.getElementById("prenom").value.trim());
        const dateNaissance = document.getElementById("date-naissance").value;
        const age = document.getElementById("age").value;
        const numero = document.getElementById("numero").value;



        // Stocker dans localStorage avec capitalisation
        localStorage.setItem("nom", nom);
        localStorage.setItem("prenom", prenom);
        localStorage.setItem("dateNaissance", dateNaissance);
        localStorage.setItem("age", age);
        localStorage.setItem("numero", numero);


        // Ouvre ord.html dans un nouvel onglet
        chrome.tabs.create({ url: chrome.runtime.getURL('dece/popup.html') });

    });
});



function handleHeaderOptionChange() {
    const headerOption = document.querySelector('input[name="header-option"]:checked')?.value || "with-header";
    const genererPdfButton = document.getElementById("generer-pdf");

    // Supprimer les anciens écouteurs
    genererPdfButton.removeEventListener("click", ordonnance);
    genererPdfButton.removeEventListener("click", ordonnancedem);

    // Ajouter le nouvel écouteur
    if (headerOption === "DEM-header") {
        genererPdfButton.addEventListener("click", ordonnancedem);
    } else {
        genererPdfButton.addEventListener("click", ordonnance);
    }
}


// Ajouter les écouteurs pour les changements de boutons radio
document.querySelectorAll('input[name="header-option"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        localStorage.setItem('headerOption', e.target.value);
        handleHeaderOptionChange();
    });
});
// Fonction de calcul d'Ã¢ge
function calculateAge(dateString) {
    const birthDate = new Date(dateString);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
        document.getElementById('age').value = "";

        return;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Ajouter la comparaison du jour si mÃªme mois
    if (monthDiff === 0 && today.getDate() < birthDate.getDate()) {
        age--;
    } else if (monthDiff < 0) {
        age--;
    }

    document.getElementById('age').value = age + " ans" || '';
}


// Charger les medicaments depuis le fichier JSON et le localStorage
function chargerMedicaments() {
    fetch("medicaments.json")
        .then(response => response.json())
        .then(jsonMedicaments => {
            const medicamentsPerso = JSON.parse(localStorage.getItem("medicaments")) || [];
            const tousLesMedicaments = [...new Set([...jsonMedicaments, ...medicamentsPerso])];
            remplirDatalist(tousLesMedicaments);
        })
        .catch(error => {
            console.error("Erreur lors du chargement de medicaments.json :", error);
        });
}



// Configurer les ecouteurs d'evenements
function configurerEcouteurs() {
    document.getElementById("savePolycliniqueDocteur").addEventListener("click", () => {
        console.log("Sauvegarder clique"); // Pour deboguer

        // Fonction personnalisee pour conserver les retours Ã  la ligne
        function trimPreserveNewlines(text) {
            return text.replace(/^[\s\n]+|[\s\n]+$/g, '');
        }

        const polyFr = trimPreserveNewlines(document.getElementById("polyclinique").value);
        const polyAr = trimPreserveNewlines(document.getElementById("polyclinique-ar").value);
        const docteur = document.getElementById("docteur").value.trim();

        // Enregistrement des informations dans le localStorage
        localStorage.setItem("polyclinique", polyFr);
        localStorage.setItem("polyclinique-ar", polyAr);
        localStorage.setItem("docteur", docteur);


        // Affichage dynamique
        document.getElementById("affichage-polyclinique").textContent =
            polyFr || polyAr ? `🏥 ${polyFr} ${polyAr ? '(' + polyAr + ')' : ''}` : "";

        document.getElementById("affichage-docteur").textContent =
            docteur ? `👨‍⚕️ Dr. ${docteur}` : "";
    });

    document.getElementById("ajouter").addEventListener("click", ajouterMedicamentOrdonnance);
    document.getElementById("ajouter-personnel").addEventListener("click", ajouterMedicamentPersonnel);
    // document.getElementById("generer-pdf").addEventListener("click", genererPDF);
    document.getElementById("generer-pdf").addEventListener("click", ordonnance);


    document.getElementById("ouvrir-options").addEventListener("click", () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
    });

    document.getElementById("gerer-medicaments").addEventListener("click", () => {
        afficherMedicamentsPersonnalises();
        document.getElementById("zone-gestion").style.display = "block";
    });
    document.getElementById("reset-liste").addEventListener("click", reinitialiserListeMedicaments);
}

// Ajouter un medicament Ã  l'ordonnance

function ajouterMedicamentOrdonnance() {
    const med = document.getElementById("medicament").value.trim();
    const poso = document.getElementById("posologie").value.trim();
    const qt = document.getElementById("quantite").value.trim();

    if (!med || !poso || !qt) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    // Ajouter au tableau
    const nouveauMedicament = { medicament: med, posologie: poso, quantite: qt };
    ordonnanceMedicaments.push(nouveauMedicament);

    const tbody = document.querySelector("#ordonnance-table tbody");
    const nouvelleLigne = document.createElement("tr");

    const tdMed = document.createElement("td");
    const inputMed = document.createElement("input");
    inputMed.type = "text";
    inputMed.value = med;
    inputMed.className = "medicament-input";
    tdMed.appendChild(inputMed);
    nouvelleLigne.appendChild(tdMed);

    const tdPoso = document.createElement("td");
    const inputPoso = document.createElement("input");
    inputPoso.type = "text";
    inputPoso.value = poso;
    inputPoso.className = "posologie-input";
    tdPoso.appendChild(inputPoso);
    nouvelleLigne.appendChild(tdPoso);

    const tdQt = document.createElement("td");
    const inputQt = document.createElement("input");
    inputQt.type = "text";
    inputQt.value = qt;
    inputQt.className = "quantite-input";
    tdQt.appendChild(inputQt);
    nouvelleLigne.appendChild(tdQt);

    const tdBtn = document.createElement("td");
    tdBtn.className = "no-print";
    const btn = document.createElement("button");
    btn.textContent = "Supprimer";
    tdBtn.appendChild(btn);
    nouvelleLigne.appendChild(tdBtn);

    // Ajouter le gestionnaire d'evenements pour le bouton de suppression
    nouvelleLigne.querySelector("button").onclick = () => {
        const index = ordonnanceMedicaments.indexOf(nouveauMedicament);
        if (index > -1) {
            ordonnanceMedicaments.splice(index, 1); // Supprimer le medicament du tableau
        }
        nouvelleLigne.remove(); // Supprimer la ligne de la table
    };

    // Mettre Ã  jour les donnees lorsque les inputs changent
    nouvelleLigne.querySelector(".medicament-input").onchange = (e) => {
        nouveauMedicament.medicament = e.target.value;
        console.log("Medicament mis Ã  jour:", nouveauMedicament);
    };

    nouvelleLigne.querySelector(".posologie-input").onchange = (e) => {
        nouveauMedicament.posologie = e.target.value;
        console.log("Posologie mise Ã  jour:", nouveauMedicament);
    };

    nouvelleLigne.querySelector(".quantite-input").onchange = (e) => {
        nouveauMedicament.quantite = e.target.value;
        console.log("Quantite mise Ã  jour:", nouveauMedicament);
    };

    tbody.appendChild(nouvelleLigne);
    viderChampsSaisie();
}
// Ajouter un bouton de suppression Ã  une entree de l'ordonnance
function ajouterBoutonSuppression(li) {
    const btn = document.createElement("button");
    btn.textContent = "Supprimer";
    btn.classList.add("no-print");
    btn.style.marginLeft = "10px";
    btn.style.color = "red";
    btn.style.cursor = "pointer";
    btn.onclick = () => {
        const texte = li.childNodes[0].nodeValue.trim();
        let liste = JSON.parse(localStorage.getItem("ordonnanceListe")) || [];
        liste = liste.filter(item => `${item.medicament} - ${item.posologie} - ${item.quantite}` !== texte);
        localStorage.setItem("ordonnanceListe", JSON.stringify(liste));
        li.remove();
    };
    li.appendChild(btn);
}

// Vider les champs de saisie
function viderChampsSaisie() {
    document.getElementById("medicament").value = "";
    document.getElementById("posologie").value = "";
    document.getElementById("quantite").value = "";
}

// Ajouter un medicament personnalise
function ajouterMedicamentPersonnel() {
    const nouveauMedicament = prompt("Entrez le nom du nouveau medicament :");
    if (nouveauMedicament) {
        let medicaments = JSON.parse(localStorage.getItem("medicaments")) || [];

        if (!medicaments.includes(nouveauMedicament)) {
            medicaments.push(nouveauMedicament);
            localStorage.setItem("medicaments", JSON.stringify(medicaments));

            const datalist = document.getElementById("medicaments");
            const option = new Option(nouveauMedicament, nouveauMedicament);
            datalist.appendChild(option);
        } else {
            alert("Ce medicament existe dejÃ  !");
        }
    }
}






// Afficher les medicaments personnalises enregistres dans le localStorage
function afficherMedicamentsPersonnalises() {
    const container = document.getElementById("liste-medicaments-enregistres");
    container.innerHTML = ""; // Vide d'abord la liste existante

    const meds = JSON.parse(localStorage.getItem("medicaments")) || [];
    if (meds.length === 0) {
        container.innerHTML = "<p>Aucun medicament enregistre</p>";
    } else {
        meds.forEach(med => {
            const div = document.createElement("div");
            div.textContent = med;

            const btn = document.createElement("button");
            btn.textContent = "Supprimer";
            btn.style.marginLeft = "10px";
            btn.onclick = () => {
                supprimerMedicament(med);
            };

            div.appendChild(btn);
            container.appendChild(div);
        });
    }
}

// Supprimer un medicament personnalise
function supprimerMedicament(med) {
    let meds = JSON.parse(localStorage.getItem("medicaments")) || [];
    meds = meds.filter(item => item !== med);
    localStorage.setItem("medicaments", JSON.stringify(meds));

    afficherMedicamentsPersonnalises(); // Met Ã  jour la modale
    remplirDatalist(meds); // Met Ã  jour le datalist
}

// Remplir le datalist avec les medicaments
function remplirDatalist(meds) {
    const datalist = document.getElementById("medicaments");
    datalist.innerHTML = "";
    meds.forEach(med => {
        const option = document.createElement("option");
        option.value = med;
        datalist.appendChild(option);
    });
}

// Reinitialiser la liste des medicaments
function reinitialiserListeMedicaments() {
    if (confirm("Voulez-vous vraiment reinitialiser la liste des medicaments ?")) {
        localStorage.setItem("medicaments", JSON.stringify([]));
        afficherMedicamentsPersonnalises();
    }
}
document.getElementById('date-naissance').addEventListener('change', function () {
    const birthDate = new Date(this.value);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
        document.getElementById('age').value = "";
        return;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Ajustement si l'anniversaire n'est pas encore passe cette annee
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    document.getElementById('age').value = age + " ans";
});





// Fonction d'affichage des informations de la polyclinique et du docteur
function afficherInfosEtab() {
    const poly = localStorage.getItem('polyclinique') || '';
    const polyAr = localStorage.getItem('polyclinique-ar') || '';
    const doc = localStorage.getItem('docteur') || '';

    const container = document.getElementById('infos-etab');
    container.textContent = '';

    const strong = document.createElement('strong');
    strong.textContent = `${poly} / ${polyAr}`;
    container.appendChild(strong);

    container.appendChild(document.createElement('br'));

    const docText = document.createTextNode(`🧑‍⚕️ Dr. ${doc}`);
    container.appendChild(docText);
}
function generateHeader() {
    return `
    <div id="head" style="border: 1px solid #000; padding: 10px; margin-bottom: 20px;">
        <table style="width: 100%;">
            <tbody>
                <tr>
                    <td colspan="4">
                        <div style="text-align: center; width: 100%;">REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE</div>
                    </td>
                </tr>
                <tr>
                    <td colspan="4">
                        <div style="text-align: center; width: 100%;">MINISTERE DE LA SANTE</div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div style="width: 100%; font-size: 12px; white-space: pre-wrap;">${localStorage.getItem('polyclinique') || ''}</div>
                    </td>
                    <td colspan="2" style="text-align: right;">
                        <div style="text-align: right; width: 100%; font-size: 12px; white-space: pre-wrap;" class="arabic-text">${localStorage.getItem('polyclinique-ar') || ''}</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `;
}

function generateHeaderDem() {
    return `
    <div id="head" style="border: 1px solid #000; padding: 10px; margin-bottom: 20px;">
        <table style="width: 100%;">
            <tbody>
                <tr>
                    <td colspan="4">
                        <div style="text-align: center; width: 100%; font-size: 12px;">REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE</div>
                    </td>
                </tr>
                <tr>
                    <td colspan="4">
                        <div style="text-align: center; width: 100%; font-size: 12px;">MINISTERE DE LA SANTE</div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div style="width: 100%; font-size: 12px; white-space: pre-wrap;">${localStorage.getItem('polyclinique') || ''}</div>
                    </td>
                    <td colspan="2" style="text-align: right;">
                        <div style="text-align: right; width: 100%; font-size: 12px; white-space: pre-wrap;" class="arabic-text">${localStorage.getItem('polyclinique-ar') || ''}</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `;
}
function generateHeader2() {
    return `
	
    <div id="head" style="border: 1px solid #000; padding: 10px; margin-bottom: 20px;">
        <table style="width: 100%;">
		
            <tbody>
			 
                <tr>
                    <td colspan="4" style="text-align: center;">
                        <strong>REPUBLIQUE ALGERIENNE DEMOCRATIQUE ET POPULAIRE</strong>
                    </td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align: center;">
                        <strong>MINISTERE DE LA SANTE</strong>
                    </td>
                </tr>
                <tr>
                  
                </tr>
            </tbody>
        </table>
    </div>
    `;
}

function ordonnance() {
    const headerContent = generateHeader();
    const nom = capitalizeNames(document.getElementById("nom").value.trim());
    const prenom = capitalizeNames(document.getElementById("prenom").value.trim());
    const dateNaissance = document.getElementById("date-naissance").value;
    const age = document.getElementById("age").value;
    const numero = document.getElementById("numero").value;
    const poids = document.getElementById("poids").value.trim();

    const dateConsultation = document.querySelector('input[name="date-consultation"]').value;
    const [year, month, day] = dateConsultation.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    let itemsContent = '';

    ordonnanceMedicaments.forEach((item, index) => {
        const med = item.medicament;
        const poso = item.posologie;
        const qt = item.quantite;
        const nbr = index + 1;

        itemsContent += `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <span style="flex: 1;">
                        <span style="font-weight: bold; min-width: 20px; display: inline-block;" class="med-font">${nbr}.</span>
                        <span style="white-space: normal;" class="med-font">${escapeHTML(med)}</span>
                    </span>
                    <span style="margin-left: 20px; white-space: nowrap;" class="med-font">${escapeHTML(qt)}</span>
                </div>
                <div style="margin-left: 30px; color: #555; font-style: italic; margin-top: 5px;" class="med-font">${escapeHTML(poso)}</div>
            </div>`;
    });

    const avecEntete = document.querySelector('input[name="header-option"][value="with-header"]').checked;

    let enteteContent = '';
    if (avecEntete) {
        enteteContent = generateHeader();
    } else {
        enteteContent = '<div style="height: 155px;"></div>';
    }

    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ordonnance Medicale</title>
        <style>
            :root {
                --med-font-size: 12px;
            }
            body {
                font-family: Arial, sans-serif;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .certificat {
                background-color: white;
                border: 1px solid #ddd;
                padding: 20px;
                max-width: 600px;
                margin: 0 auto;
                margin-top: 60px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                position: relative;
            }
            
            .info {
                position: absolute;
            }
            .info.nom { top: 60px; left: 20px; }
            .info.prenom { top: 90px; left: 20px; }
            .info.date-naissance { top: 120px; left: 20px; }
            .info.today { top: 90px; left: 270px; }
            .info.numero { top: 60px; left: 270px; }
            .info.poids { top: 120px; left: 270px; }
            .info.barcode { 
                top: 20px; 
                left: 420px;
                display: none !important;
            }
            .info.barcode svg {
                height: 50%;
                width: 80%;
            }
            
            h1 {
                text-align: center;
                color: #333;
                text-decoration: underline;
                font-size: 20px;
                margin: 10px 0 20px 0;
            }
            
            .medication-list {
                margin-top: 150px;
                margin-bottom: 20px;
                margin-right: 14px;
            }
            
            .barcode-section {
                text-align: center;
                margin-top: 20px;
            }
            
            .barcode-section svg {
                height: 50px;
                width: 200px;
            }
            
            .print-button {
                text-align: center;
                margin-top: 20px;
            }
            .print-button button {
                padding: 10px 20px;
                font-size: 16px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            .print-button button:hover {
                background-color: #0056b3;
            }
            @media print {
                @page {
                    size: A5;
                    margin: 0.2cm 0.2cm 0.2cm 0.2cm;
                }
                
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                    font-size: 10pt !important;
                    line-height: 1.2 !important;
                    background-color: white;
                }
                
                .certificat {
                    border: none;
                    box-shadow: none;
                    margin: 0 !important;
                    padding: 2px !important;
                    max-width: 100% !important;
                }
                
                h1 {
                    font-size: 14pt !important;
                    margin: 5px 0 !important;
                }
                
                .info {
                    font-size: 9pt !important;
                }
                
                .info.barcode {
                    display: block !important;
                }
                
                .info.barcode svg {
                    height: 30px !important;
                    width: 150px !important;
                }
                
                div[style*="margin-bottom: 15px"] {
                    margin-bottom: 5px !important;
                }
                
                .medication-list span,
                .medication-list div[style*="margin-left: 30px"] {
                    font-size: var(--med-font-size) !important;
                }
                
                .print-button {
                    display: none;
                }
            }
        </style>
    </head>
    <body>
        ${enteteContent}
        <div class="certificat">
            <h1>Ordonnance Medicale</h1>
            <div class="info nom"><strong>Nom :</strong> ${escapeHTML(nom)}</div>
            <div class="info prenom"><strong>Prenom :</strong> ${escapeHTML(prenom)}</div>
            <div class="info date-naissance"><strong>Date de naissance :</strong> ${escapeHTML(dateNaissance)} (${escapeHTML(age)})</div>
            <div class="info today"><strong>La date :</strong> ${escapeHTML(formattedDate)}</div>
            <div class="info numero"><strong>Numero :</strong> ${escapeHTML(numero)}</div>
            ${poids ? `<div class="info poids" style="top: 120px; left: 400px;"><strong>Poids :</strong> ${escapeHTML(poids)}</div>` : ''}
            <div class="info barcode">
                <svg id="barcode" data-numero="${escapeHTML(numero)}"></svg>
            </div>
            <div class="medication-list">
                ${itemsContent}
            </div>
        </div>
        <div class="print-button">
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px;">
                <label for="numero-police-impression" style="font-size: 14px; font-weight: bold;">Taille police:</label>
                <input type="number" id="numero-police-impression" min="8" max="24" value="14" style="width: 80px; padding: 5px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <button id="printButton">Imprimer l'ordonnance</button>
        </div>
        <script>
        document.getElementById('printButton').addEventListener('click', function() {
            updateAndPrint();
        });
        </script>
        
        <script src="${chrome.runtime.getURL('ordonnance-print.js')}"></script>
        <script src="${chrome.runtime.getURL('JsBarcode.all.min.js')}"></script>
        <script src="${chrome.runtime.getURL('barcode.js')}"></script>
        <script src="${chrome.runtime.getURL('print.js')}"></script>
    </body>
    </html>`;

    const blob = new Blob([certificatContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, "_blank");

    if (!newWindow) {
        alert("Le popup a ete bloque par votre navigateur. Veuillez autoriser les popups pour ce site.");
    }
}

function ordonnancedem(taillePolice = '14') {
    const nom = capitalizeNames(document.getElementById("nom").value.trim());
    const prenom = capitalizeNames(document.getElementById("prenom").value.trim());
    const dateNaissance = document.getElementById("date-naissance").value;
    const age = document.getElementById("age").value;
    const numero = document.getElementById("numero").value;
    const poids = document.getElementById("poids").value.trim();

    const dateConsultation = document.querySelector('input[name="date-consultation"]').value;
    const [year, month, day] = dateConsultation.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    let itemsContent = '';

    ordonnanceMedicaments.forEach((item, index) => {
        const med = item.medicament;
        const poso = item.posologie;
        const qt = item.quantite;
        const nbr = index + 1;

        itemsContent += `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <span style="flex: 1;">
                        <span style="font-weight: bold; min-width: 20px; display: inline-block;" class="med-font">${nbr}.</span>
                        <span style="white-space: normal;" class="med-font">${escapeHTML(med)}</span>
                    </span>
                    <span style="margin-left: 20px; white-space: nowrap;" class="med-font">${escapeHTML(qt)}</span>
                </div>
                <div style="margin-left: 30px; color: #555; font-style: italic; margin-top: 5px;" class="med-font">${escapeHTML(poso)}</div>
            </div>`;
    });

    const enteteContent = generateHeaderDem();

    const certificatContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ordonnance Medicale</title>
        <style>
            :root {
                --med-font-size: 12px;
            }
            body {
                font-family: Arial, sans-serif;
                padding: 20px;
                background-color: #f9f9f9;
            }
            .certificat {
                background-color: white;
                border: 1px solid #ddd;
                padding: 200px 20px 20px 20px;
                max-width: 600px;
                margin: 0 auto;
                margin-top: 60px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                position: relative;
            }
            .info {
                position: absolute;
            }
            .info.nom { top: 10px; left: 20px; }
            .info.prenom { top: 40px; left: 20px; }
            .info.date-naissance { top: 70px; left: 20px; }
            .info.today { top: 40px; left: 270px; }
            .info.numero { 
                top: 10px; 
                left: 270px; 
                color: transparent;
            }
            .info.poids { top: 70px; left: 270px; }
            .info.barcode {
                top: -150px;
                left: 420px;
                display: none !important;
            }
            .info.barcode svg {
                height: 50%;
                width: 80%;
            }
            h1 {
                text-align: center;
                color: #333;
                text-decoration: underline;
                font-size: 20px;
                margin-top: 80px;
            }
            .medication-list {
                margin-top: 5px;
                margin-bottom: 20px;
                margin-right: 14px;
            }
            .print-button {
                text-align: center;
                margin-top: 20px;
            }
            .print-button button {
                padding: 10px 20px;
                font-size: 16px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            .print-button button:hover {
                background-color: #0056b3;
            }
            @media print {
                @page {
                    size: A5;
                    margin: 0.2cm 0.2cm 0.2cm 0.2cm;
                }
                
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                    font-size: 10pt !important;
                    line-height: 1.2 !important;
                    background-color: white;
                }
                
                .certificat {
                    border: none;
                    box-shadow: none;
                    margin: 0 !important;
                    padding: 2px !important;
                    max-width: 100% !important;
                }
                
                h1 {
                    font-size: 14pt !important;
                    margin: 5px 0 !important;
                }
                
                .info {
                    font-size: 9pt !important;
                }
                
                .info.numero {
                    color: inherit !important;
                }
                
                .info.barcode {
                    display: block !important;
                    top: -30px !important;
                    left: 420px !important;
                }
                
                .info.barcode svg {
                    height: 30px !important;
                    width: 150px !important;
                }
                
                .medication-list {
                    margin-top: 120px !important;
                    margin-bottom: 10px !important;
                    margin-right: 14px !important;
                }
                
                div[style*="margin-bottom: 15px"] {
                    margin-bottom: 5px !important;
                }
                
                .medication-list span,
                .medication-list div[style*="margin-left: 30px"] {
                    font-size: var(--med-font-size) !important;
                }
                
                .print-button {
                    display: none;
                }
            }
        </style>
    </head>
    <body>
        ${enteteContent}
        <div style="
            width: calc(100% - 5px);
            text-align: center;
            border: 1px solid #000;
            padding: 5px 0;
            font-size: 20px;
            font-weight: normal;
            margin-top: 20px;
            margin-bottom: 5px;
            margin-right: 10px;
            background-color: transparent;
        ">
            ORDONNANCE
        </div>
        <div class="certificat">
            <div class="info nom"><strong>Nom :</strong> ${escapeHTML(nom)}</div>
            <div class="info prenom"><strong>Prenom :</strong> ${escapeHTML(prenom)}</div>
            <div class="info date-naissance"><strong>Date de naissance :</strong> ${escapeHTML(dateNaissance)} (${escapeHTML(age)})</div>
            <div class="info today"><strong>La date :</strong> ${escapeHTML(formattedDate)}</div>
            <div class="info numero"><strong>Numero :</strong> ${escapeHTML(numero)}</div>
            ${poids ? `<div class="info poids" style="top: 70px; left: 400px;"><strong>Poids :</strong> ${escapeHTML(poids)}</div>` : ''}
            <div class="info barcode">
                <svg id="barcode" data-numero="${escapeHTML(numero || '0')}"></svg>
            </div>
            <div class="medication-list">
                ${itemsContent}
            </div>
        </div>
        <div class="print-button">
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px;">
                <label for="numero-police-impression" style="font-size: 14px; font-weight: bold;">Taille police:</label>
                <input type="number" id="numero-police-impression" min="8" max="24" value="14" style="width: 80px; padding: 5px; font-size: 14px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <button id="printButton">Imprimer l'ordonnance</button>
        </div>
        <script>
        document.getElementById('printButton').addEventListener('click', function() {
            updateAndPrint();
        });
        </script>
        <script src="${chrome.runtime.getURL('ordonnance-print.js')}"></script>
        <script src="${chrome.runtime.getURL('JsBarcode.all.min.js')}"></script>
        <script src="${chrome.runtime.getURL('barcode.js')}"></script>
        <script src="${chrome.runtime.getURL('print.js')}"></script>
    </body>
    </html>`;

    const blob = new Blob([certificatContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, "_blank");

    if (!newWindow) {
        alert("Le popup a ete bloque par votre navigateur. Veuillez autoriser les popups pour ce site.");
    }
}

// Charger les ordonnances types depuis le fichier JSON
async function chargerOrdonnancesTypesDepuisFichier() {
    try {
        const response = await fetch("ordonnances-types.json");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erreur lors du chargement du fichier ordonnances-types.json :", error);
        return {};
    }
}

// Charger les ordonnances types depuis le localStorage
function chargerOrdonnancesTypesDepuisStorage() {
    try {
        const data = JSON.parse(localStorage.getItem("ordonnancesTypes")) || {};
        return data;
    } catch (error) {
        console.error("Erreur lors du chargement du localStorage :", error);
        return {};
    }
}

// Synchroniser les données entre le fichier et le localStorage
async function synchroniserOrdonnancesTypes() {
    try {
        // Charger les données des deux sources
        const ordonnancesFichier = await chargerOrdonnancesTypesDepuisFichier();
        const ordonnancesStorage = chargerOrdonnancesTypesDepuisStorage();

        // Fusionner les données (priorité au localStorage)
        const ordonnancesFinales = { ...ordonnancesFichier, ...ordonnancesStorage };

        // Sauvegarder dans le localStorage
        localStorage.setItem("ordonnancesTypes", JSON.stringify(ordonnancesFinales));

        // Mettre à jour le fichier JSON
        await fetch('ordonnances-types.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ordonnancesFinales)
        });

        return ordonnancesFinales;
    } catch (error) {
        console.error("Erreur lors de la synchronisation des ordonnances types :", error);
        return {};
    }
}

// Supprimer une ordonnance type
async function supprimerOrdonnanceType(nom) {
    try {
        // Charger les données existantes
        const ordonnances = await chargerOrdonnancesTypesDepuisFichier();

        // Supprimer l'ordonnance
        delete ordonnances[nom];

        // Sauvegarder dans le localStorage
        localStorage.setItem("ordonnancesTypes", JSON.stringify(ordonnances));

        // Mettre à jour le fichier JSON
        await fetch('ordonnances-types.json', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ordonnances)
        });

        // Recharger la liste
        await chargerOrdonnancesTypes();

        // Une seule alerte de succès
        alert('Ordonnance type supprimée avec succès !');
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'ordonnance type :', error);
        alert('Erreur lors de la suppression de l\'ordonnance type');
    }
}

// Modifiez la fonction chargerOrdonnancesTypes
// Fonction pour charger et afficher la liste des ordonnances types
async function chargerOrdonnancesTypes() {
    const select = document.getElementById("liste-ordonnances-types");
    const deleteButton = document.getElementById("supprimer-ordonnance");
    if (!select || !deleteButton) return;

    // Effacer les options existantes
    select.innerHTML = '<option value="">Selectionnez une ordonnance type</option>';

    try {
        // Charger les données du fichier
        const ordonnancesFichier = await chargerOrdonnancesTypesDepuisFichier();
        // Charger les données du localStorage
        const ordonnancesStorage = JSON.parse(localStorage.getItem("ordonnancesTypes")) || {};

        // Fusionner les données (priorité au localStorage)
        const ordonnances = { ...ordonnancesFichier, ...ordonnancesStorage };

        // Trier les noms des ordonnances
        const nomsTries = Object.keys(ordonnances).sort((a, b) => {
            return a.localeCompare(b, 'fr', { sensitivity: 'base' });
        });

        // Ajouter les options triées
        nomsTries.forEach(nom => {
            const option = document.createElement("option");
            option.value = nom;
            option.textContent = nom;
            select.appendChild(option);
        });

        // Mettre à jour l'état du bouton de suppression
        const selectedValue = select.value;
        deleteButton.disabled = !selectedValue;



    } catch (error) {
        console.error("Erreur lors du chargement des ordonnances types:", error);
    }
}

// Ajouter les écouteurs d'événements pour la suppression
const select = document.getElementById("liste-ordonnances-types");
const deleteButton = document.getElementById("supprimer-ordonnance");

if (select && deleteButton) {
    // Gérer l'événement de changement de sélection
    select.addEventListener('change', () => {
        const selectedValue = select.value;
        deleteButton.disabled = !selectedValue;
    });

    // Gérer l'événement de suppression
    deleteButton.addEventListener('click', async () => {
        const selectedValue = select.value;
        if (selectedValue) {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette ordonnance type ?')) {
                try {
                    await supprimerOrdonnanceType(selectedValue);
                    // Réinitialiser la sélection après la suppression
                    select.value = '';
                    deleteButton.disabled = true;
                } catch (error) {
                    console.error('Erreur lors de la suppression:', error);
                }
            }
        }
    });
}

// Ajouter les medicaments d'une ordonnance type Ã  la liste

async function chargerOrdonnanceType() {
    console.log("Debut du chargement de l'ordonnance type");
    const select = document.getElementById("liste-ordonnances-types");
    const maladie = select.value;

    if (!maladie) {
        console.log("Aucune maladie selectionnee");
        alert("Veuillez selectionner une ordonnance type.");
        return;
    }

    try {
        // Charger les donnees depuis le fichier JSON
        const response = await fetch("ordonnances-types.json");
        const ordonnancesFichier = await response.json();

        // Charger depuis le localStorage
        const ordonnancesStorage = JSON.parse(localStorage.getItem("ordonnancesTypes")) || {};

        // Fusionner les sources (le localStorage a priorite)
        const toutesOrdonnances = { ...ordonnancesFichier, ...ordonnancesStorage };
        console.log("Ordonnances disponibles:", toutesOrdonnances);

        const ordonnanceType = toutesOrdonnances[maladie];
        if (!ordonnanceType || ordonnanceType.length === 0) {
            console.log("Aucune ordonnance trouvee pour cette maladie");
            alert("Aucune ordonnance trouvee pour cette maladie.");
            return;
        }

        // Vider le tableau et la table
        ordonnanceMedicaments.length = 0;
        const tbody = document.querySelector("#ordonnance-table tbody");
        tbody.innerHTML = "";

        // Ajouter chaque medicament Ã  la table
        ordonnanceType.forEach(item => {
            ordonnanceMedicaments.push(item);
            const nouvelleLigne = document.createElement("tr");
            const tdMed = document.createElement("td");
            const inputMed = document.createElement("input");
            inputMed.type = "text";
            inputMed.value = item.medicament;
            inputMed.className = "medicament-input";
            tdMed.appendChild(inputMed);
            nouvelleLigne.appendChild(tdMed);

            const tdPoso = document.createElement("td");
            const inputPoso = document.createElement("input");
            inputPoso.type = "text";
            inputPoso.value = item.posologie;
            inputPoso.className = "posologie-input";
            tdPoso.appendChild(inputPoso);
            nouvelleLigne.appendChild(tdPoso);

            const tdQt = document.createElement("td");
            const inputQt = document.createElement("input");
            inputQt.type = "text";
            inputQt.value = item.quantite;
            inputQt.className = "quantite-input";
            tdQt.appendChild(inputQt);
            nouvelleLigne.appendChild(tdQt);

            const tdBtn = document.createElement("td");
            tdBtn.className = "no-print";
            const btn = document.createElement("button");
            btn.textContent = "Supprimer";
            btn.className = "supprimer-btn";
            tdBtn.appendChild(btn);
            nouvelleLigne.appendChild(tdBtn);

            // Gestionnaire pour le bouton Supprimer
            nouvelleLigne.querySelector(".supprimer-btn").onclick = () => {
                const index = ordonnanceMedicaments.indexOf(item);
                if (index > -1) {
                    ordonnanceMedicaments.splice(index, 1);
                    tbody.removeChild(nouvelleLigne);
                }
                console.log("Medicament supprime:", item);
            };

            // Mise Ã  jour dynamique des donnees
            nouvelleLigne.querySelector(".medicament-input").onchange = (e) => {
                item.medicament = e.target.value;
                console.log("Medicament mis Ã  jour:", item);
            };

            nouvelleLigne.querySelector(".posologie-input").onchange = (e) => {
                item.posologie = e.target.value;
                console.log("Posologie mise Ã  jour:", item);
            };

            nouvelleLigne.querySelector(".quantite-input").onchange = (e) => {
                item.quantite = e.target.value;
                console.log("Quantite mise Ã  jour:", item);
            };

            tbody.appendChild(nouvelleLigne);
        });

        console.log("Ordonnance chargee:", ordonnanceMedicaments);
    } catch (error) {
        console.error("Erreur lors du chargement de l'ordonnance type:", error);
        alert("Une erreur est survenue lors du chargement de l'ordonnance type.");
    }
}
function initialiserDonnees() {
    return new Promise((resolve) => {
        let ordonnancesTypes = JSON.parse(localStorage.getItem("ordonnancesTypes"));
        if (!ordonnancesTypes || Object.keys(ordonnancesTypes).length === 0) {
            const donneesInitiales = {
                "Angine": [
                    { "medicament": "Amoxicilline", "posologie": "1 comprime matin et soir", "quantite": "10" },
                    { "medicament": "Paracetamol", "posologie": "1 comprime toutes les 6h", "quantite": "20" }
                ],
                "Gynecologie": [
                    { "medicament": "Diane 35", "posologie": "1 comprime par jour", "quantite": "28" },
                    { "medicament": "Furosemide", "posologie": "1 comprime le matin", "quantite": "10" }
                ]
            };
            localStorage.setItem("ordonnancesTypes", JSON.stringify(donneesInitiales));
            ordonnancesTypes = donneesInitiales;
        }
        resolve(ordonnancesTypes);
    });
}
// Fonction pour enregistrer l'ordonnance actuelle comme type
document.getElementById("enregistrer-type").addEventListener("click", async () => {
    if (ordonnanceMedicaments.length === 0) {
        alert("L'ordonnance est vide ! Ajoutez des medicaments d'abord.");
        return;
    }

    try {
        // Charger les données existantes
        const ordonnancesTypes = await chargerOrdonnancesTypesDepuisFichier();
        const nomsExistants = Object.keys(ordonnancesTypes);

        const nomOrdonnance = prompt(
            `Donnez un nom à cette ordonnance type(ex: 'Angine', 'Grippe')`,
            ""
        );

        if (!nomOrdonnance) return;

        // Vérification des doublons
        if (ordonnancesTypes.hasOwnProperty(nomOrdonnance)) {
            if (!confirm(`Une ordonnance nommée "${nomOrdonnance}" existe déjà.\nVoulez - vous la remplacer ? `)) {
                return;
            }
        }

        // Ajouter la nouvelle ordonnance (avec copie profonde)
        ordonnancesTypes[nomOrdonnance] = JSON.parse(JSON.stringify(ordonnanceMedicaments));

        // Sauvegarder dans le localStorage
        localStorage.setItem("ordonnancesTypes", JSON.stringify(ordonnancesTypes));

        // Mettre à jour le fichier JSON
        await fetch('ordonnances-types.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ordonnancesTypes)
        });

        // Recharger la liste triée
        await chargerOrdonnancesTypes();

        alert(`âœ… Ordonnance "${nomOrdonnance}" enregistrée avec succès!`);
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de l\'ordonnance type :', error);
        alert('Erreur lors de l\'enregistrement de l\'ordonnance type');
    }
});

// Fonction pour transférer les noms d'établissement
async function transfererEtablissement() {
    // Récupérer les noms d'établissement depuis localStorage
    const etablissementFr = localStorage.getItem('etablissementFr') || '';
    const etablissementAr = localStorage.getItem('etablissementAr') || '';

    if (!etablissementFr || !etablissementAr) {
        alert('Les noms d\'établissement n\'ont pas été trouvés dans le localStorage.');
        return;
    }

    // Ouvrir ord.html
    const tab = await browser.tabs.create({ url: chrome.runtime.getURL('ord.html') });

    // Attendre que la page soit chargée
    await new Promise(resolve => {
        const checkTabLoaded = setInterval(() => {
            browser.tabs.get(tab.id).then(tabInfo => {
                if (tabInfo.status === 'complete') {
                    clearInterval(checkTabLoaded);
                    resolve();
                }
            });
        }, 100);
    });

    // Exécuter le script pour remplir les champs
    await browser.tabs.executeScript(tab.id, {
        code: `
    document.getElementById('polyclinique').value = '${etablissementFr}';
    document.getElementById('polyclinique-ar').value = '${etablissementAr}';
    `
    });

    // Fermer la popup
    window.close();
}

// Gestion du basculement des colonnes
function initToggleColumns() {
    // Vérifier si le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initToggleColumns);
        return;
    }

    // Vérifier si les éléments existent
    const leftColumn = document.getElementById('leftColumn');
    const rightColumn = document.getElementById('rightColumn');
    const toggleButton = document.getElementById('toggleButton');
    const returnButton = document.getElementById('returnButton');

    if (!leftColumn || !rightColumn || !toggleButton) {
        console.error('Élément(s) manquant(s) pour le toggle');
        return;
    }

    // Fonction pour basculer
    function toggleColumns() {
        const isExpanded = rightColumn.classList.contains('expanded');
        const resizeDivider = document.getElementById('resizeDivider');

        leftColumn.classList.toggle('collapsed');
        rightColumn.classList.toggle('expanded');

        // Masquer/afficher le diviseur de redimensionnement
        if (resizeDivider) {
            if (leftColumn.classList.contains('collapsed')) {
                // Mode plein écran : masquer le diviseur
                resizeDivider.style.display = 'none';
            } else {
                // Mode normal : afficher le diviseur
                resizeDivider.style.display = 'block';
            }
        }

        // Changer le texte et l'icône du bouton
        if (leftColumn.classList.contains('collapsed')) {
            // État étendu (mode plein écran)
            toggleButton.innerHTML = '<i class="fas fa-compress-arrows-alt"></i> Écran principal';
        } else {
            // Retour à l'état normal
            toggleButton.innerHTML = '<i class="fas fa-expand-arrows-alt"></i> Mode plein écran';
        }

        console.log('Toggle clicked');
    }

    // Ajouter les écouteurs d'événements
    toggleButton.addEventListener('click', toggleColumns);
    if (returnButton) {
        returnButton.addEventListener('click', toggleColumns);
    }
}

// Initialiser le toggle dès maintenant
initToggleColumns();

// Functionality for resizable divider
function initResizableDivider() {
    const leftColumn = document.getElementById('leftColumn');
    const rightColumn = document.getElementById('rightColumn');
    const resizeDivider = document.getElementById('resizeDivider');

    if (!leftColumn || !rightColumn || !resizeDivider) {
        console.error('Éléments manquants pour le redimensionnement');
        return;
    }

    let isResizing = false;
    let startX = 0;
    let startLeftWidth = 0;

    resizeDivider.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startLeftWidth = leftColumn.offsetWidth;

        resizeDivider.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const newLeftWidth = startLeftWidth + deltaX;

        // Contraintes de largeur minimum et maximum
        const minLeftWidth = 300;
        const maxLeftWidth = window.innerWidth - 400; // Garde au moins 400px pour la colonne droite

        if (newLeftWidth >= minLeftWidth && newLeftWidth <= maxLeftWidth) {
            leftColumn.style.flex = `0 0 ${newLeftWidth} px`;
            leftColumn.style.width = `${newLeftWidth} px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            resizeDivider.classList.remove('dragging');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';

            // Sauvegarder la largeur préférée dans localStorage
            const currentWidth = leftColumn.offsetWidth;
            localStorage.setItem('leftColumnWidth', currentWidth.toString());
        }
    });

    // Restaurer la largeur sauvegardée
    const savedWidth = localStorage.getItem('leftColumnWidth');
    if (savedWidth) {
        const width = parseInt(savedWidth);
        if (width >= 300 && width <= 800) {
            leftColumn.style.flex = `0 0 ${width} px`;
            leftColumn.style.width = `${width} px`;
        }
    }
}

// Initialiser le redimensionnement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initResizableDivider);
} else {
    initResizableDivider();
}

// Ajouter l'écouteur au bouton
if (document.getElementById('etablissemnt')) {
    document.getElementById('etablissemnt').addEventListener('click', transfererEtablissement);
}
