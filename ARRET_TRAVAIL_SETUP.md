# Configuration Sauvegarde Arrêts de Travail

## 🎯 Fonctionnalité Ajoutée

La sauvegarde des certificats d'arrêt de travail a été ajoutée à l'extension 86, utilisant la même base de données que l'extension cert (`D:\certnat\native_app\data.db`).

## 📁 Fichiers Créés/Modifiés

### Extension 86
- ✅ `86/manifest.json` - Ajout permission `nativeMessaging` et CSP mise à jour
- ✅ `86/arret-save-handler.js` - Script de sauvegarde des arrêts de travail
- ✅ `86/certificat.html` - Ajout du script de sauvegarde
- ✅ `86/test-arret-save.js` - Script de test pour la messagerie native

### Application Native
- ✅ `native_app/native.py` - Ajout table `arrets_travail` et fonctions de gestion
- ✅ `native_app/view_arrets_travail.py` - Visualiseur des arrêts de travail sauvegardés

## 🔧 Configuration Requise

### 1. Base de Données
La table `arrets_travail` sera créée automatiquement au premier lancement avec les champs :
- `nom`, `prenom`, `medecin`, `nombre_jours`, `date_certificat`, `date_naissance`, `age`

### 2. Application Native
L'application native doit être enregistrée pour Firefox (déjà fait si l'extension cert fonctionne).

## 🚀 Utilisation

### 1. Dans l'Extension 86
1. Ouvrir l'extension 86 dans Firefox
2. Remplir les informations patient (nom, prénom, date de naissance)
3. Configurer le médecin dans les options si pas déjà fait
4. Cliquer sur le bouton **"Arrêt Travail"**
5. Un nouveau bouton **"Sauvegarder Arrêt"** apparaîtra à côté
6. Cliquer sur **"Sauvegarder Arrêt"**
7. Entrer le nombre de jours d'arrêt dans le prompt
8. Confirmer la sauvegarde

### 2. Données Sauvegardées
- **Nom/Prénom** : Récupérés depuis les informations patient
- **Médecin** : Récupéré depuis localStorage ('docteur')
- **Nombre de jours** : Saisi par l'utilisateur via prompt
- **Date certificat** : Date du jour automatiquement
- **Date naissance** : Récupérée depuis les informations patient

## 🧪 Tests

### Test Manuel dans la Console
```javascript
// Dans la console de l'extension 86
testerSauvegardeArret()
```

### Visualiser les Arrêts Sauvegardés
```cmd
cd native_app
python view_arrets_travail.py
```

## 🔍 Vérification

### 1. Vérifier l'Enregistrement Native App
```cmd
reg query "HKEY_CURRENT_USER\SOFTWARE\Mozilla\NativeMessagingHosts\com.daoudi.certificat"
```

### 2. Tester l'Application Native
```cmd
cd native_app
native.bat
```

### 3. Vérifier la Base de Données
```cmd
cd native_app
python view_database.py
python view_arrets_travail.py
```

## 🛠️ Dépannage

### Erreur "An unexpected error occurred"
1. Vérifier que Firefox est complètement fermé et relancé
2. Recharger l'extension dans `about:debugging`
3. Vérifier que l'application native est enregistrée
4. Tester manuellement l'application native

### Bouton de Sauvegarde Non Visible
1. Vérifier que le script `arret-save-handler.js` est chargé
2. Ouvrir la console pour voir les logs
3. Vérifier que le bouton "Arrêt Travail" existe

### Données Non Sauvegardées
1. Vérifier les informations patient (nom/prénom requis)
2. Vérifier la configuration médecin dans les options
3. Vérifier les logs dans la console

## 📊 Fonctionnalités

### Actions Disponibles
- `ajouter_arret_travail` - Ajouter un nouvel arrêt de travail
- `lister_arrets_travail` - Lister les arrêts de travail existants

### Validation
- Empêche les doublons identiques (tous les champs identiques)
- Permet plusieurs arrêts pour la même personne si au moins un champ diffère
- Validation du nombre de jours (> 0)
- Validation des formats de date

## 🎉 Résultat

Maintenant vous pouvez sauvegarder les certificats d'arrêt de travail depuis l'extension 86 dans la même base de données que les certificats médicaux, avec une gestion séparée et des statistiques dédiées.