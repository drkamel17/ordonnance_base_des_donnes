document.addEventListener('DOMContentLoaded', function () {

 document.getElementById("verordonnance").addEventListener("click", verordonnance);
 
   // Fonction pour ouvrir ordononcier
    function verordonnance() {
        browser.tabs.create({ url: chrome.runtime.getURL('ord.html') });
        window.close();
    }
    // Récupérer l'onglet actif
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        // Exécuter le script pour extraire les informations
        browser.tabs.executeScript(tabs[0].id, { code: '(' + extractAndStoreInfo.toString() + ')();' }).then((results) => {
            if (results && results[0]) {
                const data = results[0];
                
                // Mettre à jour les éléments dans popup2.html
                document.getElementById('nom').textContent = data.nom || 'Non trouvé';
                document.getElementById('prenom').textContent = data.prenom || 'Non trouvé';
                document.getElementById('dob').textContent = data.dob || 'Non trouvé';
                document.getElementById('numero').textContent = data.numero || 'Non trouvé';
                document.getElementById('etablissemntfr').textContent = data.etablissementFr || 'Non trouvé';
                document.getElementById('etablissemntar').textContent = data.etablissementAr || 'Non trouvé';
                
                // Stocker les données localement
                browser.storage.local.set(data).then(() => {
                    console.log("Données stockées localement avec succès.");
                    
                    // Stocker les noms d'établissement dans localStorage
                    localStorage.setItem('etablissementFr', data.etablissementFr);
                    localStorage.setItem('etablissementAr', data.etablissementAr);
                    console.log("Noms d'établissement stockés dans localStorage:", {
                        etablissementFr: data.etablissementFr,
                        etablissementAr: data.etablissementAr
                    });
                    
                    // Ouvrir ord.html
                    browser.tabs.create({ url: chrome.runtime.getURL('ord.html') });
                    // Fermer la popup
                    window.close();
                }).catch((error) => {
                    console.error("Erreur lors du stockage : ", error);
                    // Ouvrir ord.html
                    browser.tabs.create({ url: chrome.runtime.getURL('ord.html') });
                    // Fermer la popup
                    window.close();
                });
            } else {/*
                // Si aucune donnée n'est trouvée
                const modal = document.getElementById('modal');
                const modalMessage = document.getElementById('modal-message');
                const closeButton = document.querySelector('.close');
                const continueButton = document.getElementById('continueButton');

                modalMessage.innerHTML = `
                    <h2>Erreur</h2>
                    <p>Aucune donnée n'a été trouvée</p>
                `;

                modal.style.display = 'block';
                window.close = function() {};

                function closeModal() {
                    modal.style.display = 'none';
                    browser.tabs.create({ url: chrome.runtime.getURL('ord.html') });
                    setTimeout(() => {
                        window.close();
                    }, 1);
                }

                closeButton.onclick = closeModal;
                continueButton.onclick = closeModal;
                window.onclick = function(event) {
                    if (event.target == modal) {
                        closeModal();
                    }
                };*/
				// Ouvrir ord.html
                    browser.tabs.create({ url: chrome.runtime.getURL('ord.html') });
                    // Fermer la popup
                    window.close();
            }
        });
    });
});

// Fonction pour extraire et stocker les informations
function extractAndStoreInfo() {
    const nom = document.querySelector("c[type='nom']")?.innerText || "";
    const prenom = document.querySelector("c[type='prenom']")?.innerText || "";
    const dobElement = document.querySelector(".widget-user-desc");
    const dob = dobElement ? dobElement.innerText.replace("Date de naissance : ", "").trim() : "";

    const tdElements = document.querySelectorAll("td");
    let numero = "";
    tdElements.forEach(td => {
        if (td.textContent.includes("Numero :")) {
            numero = td.nextElementSibling ? td.nextElementSibling.innerText : "";
        }
    });

    // Extraire les noms d'établissement
    let etablissementFr = 'Nom français non trouvé';
    let etablissementAr = 'Nom arabe non trouvé';
    
    const scriptTags = document.getElementsByTagName('script');
    for (let i = 0; i < scriptTags.length; i++) {
        const script = scriptTags[i];
        if (script.textContent) {
            const pattern = '<tr>.*?<td[^>]*colspan="2"[^>]*>(.*?)</td>.*?<td[^>]*colspan="2"[^>]*rowspan="3"[^>]*>(.*?)</td>.*?</tr>';
            const regex = new RegExp(pattern, 'is');
            const match = script.textContent.match(regex);
            
            if (match) {
                etablissementFr = match[1].trim();
                etablissementAr = match[2].trim();
                break;
            }
        }
    }

    return { 
        nom, 
        prenom, 
        dob, 
        numero,
        etablissementFr,
        etablissementAr 
    };
}

