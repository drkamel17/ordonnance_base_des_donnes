
// Fonction personnalisée pour conserver les retours à la ligne
function trimPreserveNewlines(text) {
    return text.replace(/^\s+|\s+$/g, '');
}

// Fonction pour sauvegarder les modifications des champs
function sauvegarderModifications() {
    const textInputs = document.querySelectorAll('.full-width-input');
    textInputs.forEach(input => {
        input.addEventListener('input', () => {
            input.setAttribute('value', input.value);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadData(); // Chargement des données de la polyclinique et du docteur
    loadPatientData(); // Chargement des données du patient
    loadTargetUrl(); // Chargement de l'URL cible
    storeActiveTabId(); // Stockage de l'ID de l'onglet actif

    // Initialiser le format au chargement
    const format = localStorage.getItem('certificatFormat');
    if (format === 'sansEntete') {
        document.getElementById('formatSansEntete').classList.add('selected-format');
    } else {
        // Par défaut, on utilise avec en-tête
        document.getElementById('formatAvecEntete').classList.add('selected-format');
    }


    // Écouteurs pour les boutons
    setupButtonListeners();
    document.getElementById("brucellose").addEventListener("click", () => {

        // Ouvre ord.html dans un nouvel onglet
        chrome.tabs.create({ url: chrome.runtime.getURL('brucellose.html') });

    });

    // Écouteur pour le bouton Certificat Prénuptial
    document.getElementById("prenuptial").addEventListener("click", () => {
        // Ouvre prenuptial.html dans un nouvel onglet
        chrome.tabs.create({ url: chrome.runtime.getURL('prenuptial.html') });
    });

    // Configuration des écouteurs spécifiques
    document.getElementById("inaptSport").addEventListener("click", () => {
        ouvrirCertificatInaptitudeSport();
    });


    // Écouteur pour le bouton Catégorie Anti-Rabique
    document.getElementById('catAntiRabique').addEventListener('click', function () {
        const classe02 = document.getElementById('classe02');
        const classe03 = document.getElementById('classe03');
        classe02.classList.toggle('hidden');
        classe03.classList.toggle('hidden');
        // Écouteur pour le bouton requisitionInapte
        document.querySelector('#requisitionInapte').addEventListener('click', () => {
            requisitionInapte(); // Appelle la fonction Tissulairesanssar
        });

        // Ajouter un écouteur de clic pour fermer la modale
        modal.addEventListener('click', function (event) {
            // Si l'utilisateur clique en dehors du contenu de la modale
            if (event.target === modal) {
                modal.remove();
                // Rafraîchir la page
                window.location.reload();
            }
        });

        // Ajouter le style pour la popup
        const style = document.createElement('style');
        style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .button-group {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
        }
        .modal-button {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .modal-button:first-child {
            background-color: #4CAF50;
            color: white;
            z-index: 1000;
        }
        .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 400px;
            width: 90%;
            text-align: center;
        }
        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        .button-group button {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        .button-group button:hover {
            background-color: #f0f0f0;
        }
    `;
        document.head.appendChild(style);
    });

    // Fonction pour ouvrir la modale pour Classe 03
    function ouvrirModalClasse03() {
        const modalContent = `
<div>
<h3 style="color: green;">Choisissez un vaccin :</h3>
<button id="vaccinC">Vaccin C</button>
<button id="vaccinT">Vaccin T</button>
</div>
`;
        openModal(modalContent);
        // Écouteur pour le bouton Vaccin C
        document.querySelector('#vaccinC').addEventListener('click', () => {
            demanderPoids(); // Demande le poids du patient
        });

        // Écouteur pour le bouton Vaccin T
        document.querySelector('#vaccinT').addEventListener('click', () => {
            demanderPoidsT(); // Appelle la fonction Tissulaireavecsar
        });
    }

    // Écouteurs pour les classes
    document.getElementById('classe02').addEventListener('click', function () {
        ouvrirModalClasse02();
    });

    document.getElementById('classe03').addEventListener('click', function () {
        ouvrirModalClasse03();
    });
});
