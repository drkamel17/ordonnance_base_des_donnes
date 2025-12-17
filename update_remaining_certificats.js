const fs = require('fs');
const path = 'c:/Users/HP/Desktop/79/certificat.js';

// Lire le fichier avec l'encodage UTF-8
let content = fs.readFileSync(path, 'utf8');

// Fonction pour effectuer le remplacement dans le contenu
function updateContent(content, searchText, replacement) {
    return content.split(searchText).join(replacement);
}

// Définir les remplacements pour chaque type de certificat
const replacements = [
    // Justification
    {
        search: 'nÃ©(e) le <strong><input type="text" value="${dob}" style="width: 100px;"></strong>',
        replace: '<span class="editable-field" contenteditable="true" style="min-width: 100px; display: inline-block;">nÃ©(e) le ${dob}</span>'
    },
    // Prolongation d'arrêt de travail
    {
        search: 'nÃ©(e) le <strong><input type="text" value="${dob}" style="width: 120px;"></strong>',
        replace: '<span class="editable-field" contenteditable="true" style="min-width: 100px; display: inline-block;">nÃ©(e) le ${dob}</span>'
    },
    // Autres formats similaires
    {
        search: 'nÃ©\(e\) le <strong><input type="text" value="\$\{dob\}" style="width: 100px;"></strong>',
        replace: '<span class="editable-field" contenteditable="true" style="min-width: 100px; display: inline-block;">nÃ©(e) le ${dob}</span>'
    }
];

// Appliquer tous les remplacements
let newContent = content;
replacements.forEach(({search, replace}) => {
    newContent = updateContent(newContent, search, replace);
});

// Écrire le contenu mis à jour dans le fichier
fs.writeFileSync(path, newContent, 'utf8');

console.log('Toutes les modifications ont été appliquées avec succès.');
