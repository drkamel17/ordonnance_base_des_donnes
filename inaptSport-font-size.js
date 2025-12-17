
// Fonction pour mettre à jour la taille de police dans le certificat d'inapte sportif
function updateFontSizeInInaptSport(fontSize) {
    // Mettre à jour la taille de police dans le style CSS du certificat
    const styleElement = document.createElement('style');
    // Ne modifier que la version à imprimer, laisser la version HTML inchangée
    styleElement.textContent = "@media print { body { font-size: " + fontSize + "pt !important; } " +
                               ".certificat { font-size: " + fontSize + "pt !important; } " +
                               "h1 { font-size: " + (parseInt(fontSize) + 4) + "pt !important; } " +
                               "p { font-size: " + fontSize + "pt !important; } " +
                               "input[type=text], input[type=date], textarea { font-size: " + fontSize + "pt !important; } " +
                               ".print-button { display: none !important; } }";

    // Supprimer l'ancien style s'il existe
    const oldStyle = document.getElementById('inaptSportFontSizeStyle');
    if (oldStyle) {
        oldStyle.remove();
    }

    // Ajouter le nouveau style
    styleElement.id = 'inaptSportFontSizeStyle';
    document.head.appendChild(styleElement);

    // Stocker la taille de police dans localStorage
    localStorage.setItem('inaptSportFontSize', fontSize);
}

// Attendre que le document soit chargé
document.addEventListener('DOMContentLoaded', () => {
    // Charger la taille de police sauvegardée
    const savedFontSize = localStorage.getItem('inaptSportFontSize') || '14';
    const fontSizeInput = document.getElementById('fontSize');

    if (fontSizeInput) {
        fontSizeInput.value = savedFontSize;

        // Ajouter un écouteur pour sauvegarder la taille de police quand elle change
        fontSizeInput.addEventListener('input', () => {
            const fontSize = fontSizeInput.value;
            updateFontSizeInInaptSport(fontSize);
        });

        // Appliquer la taille de police initiale
        updateFontSizeInInaptSport(savedFontSize);
    }
});

// Appliquer la taille de police quand la page est chargée
window.addEventListener('load', () => {
    const savedFontSize = localStorage.getItem('inaptSportFontSize') || '14';
    updateFontSizeInInaptSport(savedFontSize);
});
