# Récupérer les données entre deux dates

Cette fonctionnalité permet de récupérer les données des tables de la base de données `data.db` entre deux dates spécifiées.

## Tables disponibles

Les tables suivantes sont disponibles pour la récupération de données :

1. `arrets_travail` - Arrêts de travail
2. `prolongation` - Prolongations d'arrêts de travail
3. `cbv` - Certificats de bonne santé
4. `antirabique` - Certificats antirabiques

## Format des dates

Les dates doivent être au format `AAAA-MM-JJ` (ISO 8601), par exemple : `2023-01-15`

## Utilisation depuis JavaScript

### Fonction principale

```javascript
async function recupererDonneesEntreDates(table, dateDebut, dateFin)
```

**Paramètres :**
- `table` (string) : Nom de la table
- `dateDebut` (string) : Date de début au format AAAA-MM-JJ
- `dateFin` (string) : Date de fin au format AAAA-MM-JJ

**Retour :**
- Promise<Object> : Résultats de la requête

### Exemple d'utilisation

```javascript
try {
    const resultat = await recupererDonneesEntreDates('arrets_travail', '2023-01-01', '2023-12-31');
    
    if (resultat && resultat.ok) {
        console.log(`✅ ${resultat.returned} enregistrements trouvés sur ${resultat.total} au total`);
        console.table(resultat.data);
    } else {
        console.error('❌ Erreur:', resultat ? resultat.error : 'Réponse invalide');
    }
} catch (error) {
    console.error('❌ Erreur lors de la récupération des données:', error);
}
```

## Structure des données retournées

### Pour les tables `arrets_travail` et `prolongation` :
- `id` (INTEGER)
- `nom` (TEXT)
- `prenom` (TEXT)
- `medecin` (TEXT)
- `nombre_jours` (INTEGER)
- `date_certificat` (DATE)
- `date_naissance` (TEXT)
- `age` (INTEGER)
- `created_at` (TIMESTAMP)

### Pour la table `cbv` :
- `id` (INTEGER)
- `nom` (TEXT)
- `prenom` (TEXT)
- `medecin` (TEXT)
- `date_certificat` (DATE)
- `heure` (TEXT)
- `date_naissance` (TEXT)
- `titre` (TEXT)
- `examen` (TEXT)
- `created_at` (TIMESTAMP)

### Pour la table `antirabique` :
- `id` (INTEGER)
- `nom` (TEXT)
- `prenom` (TEXT)
- `medecin` (TEXT)
- `classe` (TEXT)
- `type_de_vaccin` (TEXT)
- `shema` (TEXT)
- `date_de_certificat` (DATE)
- `date_de_naissance` (TEXT)
- `animal` (TEXT)
- `created_at` (TIMESTAMP)

## Interface utilisateur

Une interface HTML/JavaScript est disponible dans le fichier `recuperer-donnees.html` qui permet d'utiliser cette fonctionnalité de manière interactive.

Pour y accéder, ouvrez le fichier dans votre navigateur ou intégrez-le dans l'extension.