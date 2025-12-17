const fs = require('fs');
const path = 'c:/Users/HP/Desktop/79/certificat.js';

// Lire le fichier avec l'encodage UTF-8
let content = fs.readFileSync(path, 'utf8');

// Remplacer le texte problématique avec la nouvelle version modifiable
const searchText = 'nÃ©(e) le <strong><input type="text" value="${dob}" style="width: 120px;"></strong>';
const replacement = '<span class="editable-field" contenteditable="true" style="min-width: 100px; display: inline-block;">né(e) le ${dob}</span>';

// Effectuer le remplacement
const newContent = content.split(searchText).join(replacement);

// Écrire le contenu mis à jour dans le fichier
fs.writeFileSync(path, newContent, 'utf8');

console.log('Les modifications ont été appliquées avec succès.');
