# Medical Extension Web

Version web de l'extension médicale Chrome, conçue pour être déployée sur Vercel.

## Fonctionnalités

- Génération de divers types de certificats médicaux
- Gestion des données entre deux dates
- Exportation vers Excel
- Impression des documents
- Sauvegarde locale des certificats générés

## Structure du projet

```
.
├── index.html          # Page principale de l'application
├── app.js              # Logique principale de l'application
├── certificates.js      # Génération des certificats
├── data-manager.js     # Gestion des données
├── vercel.json         # Configuration pour le déploiement Vercel
└── README.md           # Documentation du projet
```

## Types de certificats

1. Arrêt de travail
2. Prolongation
3. Certificat de bonne santé (CBV)
4. Certificat antirabique
5. Certificat de brucellose

## Déploiement sur Vercel

1. Créez un compte sur [vercel.com](https://vercel.com)
2. Connectez votre dépôt Git contenant ce code
3. Vercel détectera automatiquement le projet et le déploiera
4. L'application sera accessible via une URL fournie par Vercel

## Utilisation

1. Ouvrez `index.html` dans un navigateur web
2. Sélectionnez un type de certificat
3. Entrez les informations du patient
4. Générez le certificat
5. Sauvegardez, imprimez ou exportez selon vos besoins

## Stockage

Les données sont stockées localement dans le navigateur via `localStorage`. Elles persistent tant que l'utilisateur ne vide pas son cache.

## Technologies utilisées

- HTML5
- CSS3 (avec Flexbox et Grid)
- JavaScript (ES6+)
- localStorage pour le stockage côté client

## Améliorations possibles

- Intégration avec une base de données backend
- Authentification utilisateur
- Exportation vers PDF
- Partage des certificats par email
- Support multilingue