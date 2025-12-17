// Fonction pour charger la bibliothèque XLSX avec fallback
function loadXLSX() {
    const script = document.createElement('script');
    script.src = 'xlsx.full.min.js';  // Changed from remote CDN to local file
    script.onload = function () {
        console.log('Bibliothèque XLSX chargée avec succès');
    };
    script.onerror = function () {
        console.warn('Impossible de charger la bibliothèque XLSX, fallback vers CSV');
    };
    document.head.appendChild(script);
}

// Charger la bibliothèque XLSX au chargement de la page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadXLSX);
} else {
    loadXLSX();
}