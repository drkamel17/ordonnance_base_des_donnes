
// Fonction pour modifier le script dans la fonction ouvrirCertificatArret()
function modifyArretTravailScript() {
    // Trouver la fonction ouvrirCertificatArret()
    const scriptContent = document.querySelector('script[src="justification-font-size.js"]');

    if (scriptContent && scriptContent.closest('html')) {
        // Créer un nouveau élément script avec le bon fichier
        const newScript = document.createElement('script');
        newScript.src = 'arretTravail-font-size.js';

        // Remplacer l'ancien script par le nouveau
        scriptContent.parentNode.replaceChild(newScript, scriptContent);
    }
}

// Exécuter la fonction lorsque le document est chargé
document.addEventListener('DOMContentLoaded', modifyArretTravailScript);
