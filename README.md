# Application de Shopping de Vêtements

Application mobile React Native + Expo pour une boutique de vêtements en ligne.

## 🚀 Technologies utilisées

- **React Native** avec **Expo**
- **React Navigation** (Stack + Bottom Tabs)
- **Context API** pour la gestion d'état
- **Expo Vector Icons** pour les icônes

## 📱 Fonctionnalités

### Page d'accueil (Home)
- Liste de catégories (Homme, Femme, Enfants)
- Liste de produits populaires avec images, titres et prix
- Barre de recherche fonctionnelle (filtre local)
- Badge du panier avec nombre d'articles

### Page Catégorie
- Grille de produits filtrés par catégorie
- Recherche dans la catégorie sélectionnée

### Page Détails Produit
- Affichage des images
- Description complète
- Prix
- Sélecteur de taille
- Bouton "Ajouter au panier" (stockage local)

### Page Panier (Cart)
- Liste des articles ajoutés
- Modification des quantités
- Suppression d'articles
- Calcul du total
- Bouton "Procéder au paiement" (écran placeholder)

### Page Profil (Profile)
- Informations utilisateur (mock data)
- Bouton "Se connecter" / "Se déconnecter" (sans backend)
- Menu de navigation

## 📦 Installation

1. Installer les dépendances :
```bash
npm install
```

2. Démarrer l'application :
```bash
npx expo start
```

3. Scanner le QR code avec l'application Expo Go sur votre téléphone, ou appuyer sur :
   - `a` pour Android
   - `i` pour iOS
   - `w` pour Web

## 📁 Structure du projet

```
├── App.js                 # Point d'entrée de l'application
├── navigation/
│   └── AppNavigator.js    # Configuration de la navigation
├── screens/
│   ├── HomeScreen.js      # Page d'accueil
│   ├── CategoryScreen.js  # Page catégorie
│   ├── ProductDetailsScreen.js  # Détails produit
│   ├── CartScreen.js      # Panier
│   └── ProfileScreen.js   # Profil
├── components/
│   ├── ProductCard.js     # Carte produit
│   ├── CategoryCard.js    # Carte catégorie
│   └── SearchBar.js       # Barre de recherche
├── context/
│   ├── CartContext.js     # Contexte du panier
│   └── AuthContext.js    # Contexte d'authentification
└── data/
    └── mockData.js        # Données mock des produits
```

## 🎨 Design

L'application suit un design moderne et épuré, inspiré des grandes marques de mode (Zara, H&M) :
- Interface minimaliste
- Typographie claire
- Espacements généreux
- Palette de couleurs noir et blanc avec accents

## 📝 Notes

- **Pas de backend** : Toutes les données sont mockées localement
- **Stockage local** : Le panier est géré en mémoire (Context API)
- **Images** : Utilisation d'images Unsplash pour les produits
- **Navigation** : Navigation par onglets en bas + navigation par pile pour les détails

## 🔄 Prochaines étapes

- Intégration d'un backend
- Persistance du panier (AsyncStorage)
- Authentification réelle
- Système de favoris
- Notifications push
- Paiement en ligne

