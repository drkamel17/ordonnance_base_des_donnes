
// Fonction pour modifier dynamiquement le contenu du certificat Radiox
function modifyRadioxCertificat() {
    // Trouver la div du bouton d'impression
    const printButtonDiv = document.querySelector('.certificat').nextElementSibling;

    if (printButtonDiv && printButtonDiv.classList.contains('print-button')) {
        // Modifier le contenu du bouton d'impression
        printButtonDiv.style.display = 'flex';
        printButtonDiv.style.alignItems = 'center';
        printButtonDiv.style.justifyContent = 'center';
        printButtonDiv.style.gap = '15px';

        // Créer la div pour la taille de police
        const fontSizeDiv = document.createElement('div');
        fontSizeDiv.style.display = 'flex';
        fontSizeDiv.style.alignItems = 'center';
        fontSizeDiv.style.gap = '8px';

        // Créer le label pour la taille de police
        const fontSizeLabel = document.createElement('label');
        fontSizeLabel.setAttribute('for', 'fontSize');
        fontSizeLabel.style.fontSize = '14px';
        fontSizeLabel.style.margin = '0';
        fontSizeLabel.textContent = 'Taille du texte:';

        // Créer l'input pour la taille de police
        const fontSizeInput = document.createElement('input');
        fontSizeInput.setAttribute('type', 'number');
        fontSizeInput.setAttribute('id', 'fontSize');
        fontSizeInput.setAttribute('min', '8');
        fontSizeInput.setAttribute('max', '20');
        fontSizeInput.setAttribute('value', '14');
        fontSizeInput.style.width = '60px';
        fontSizeInput.style.padding = '5px';
        fontSizeInput.style.border = '1px solid #bdbdbd';
        fontSizeInput.style.borderRadius = '4px';

        // Ajouter le label et l'input à la div de taille de police
        fontSizeDiv.appendChild(fontSizeLabel);
        fontSizeDiv.appendChild(fontSizeInput);

        // Ajouter la div de taille de police et le bouton d'impression à la div principale
        printButtonDiv.innerHTML = '';
        printButtonDiv.appendChild(fontSizeDiv);

        // Créer le bouton d'impression
        const printButton = document.createElement('button');
        printButton.setAttribute('id', 'printButton');
        printButton.textContent = 'Imprimer la lettre';
        printButtonDiv.appendChild(printButton);

        // Ajouter le script pour gérer la taille de police
        const script = document.createElement('script');
        script.src = 'radiox-font-size.js';
        document.head.appendChild(script);
    }
}

// Exécuter la fonction lorsque le document est chargé
document.addEventListener('DOMContentLoaded', modifyRadioxCertificat);
