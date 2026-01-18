MISE À JOUR BASE DE DONNÉES - COMMANDES
=======================================

Pour activer la fonctionnalité de suivi des commandes, vous devez mettre à jour votre base de données MySQL.

1. Ouvrez phpMyAdmin (http://localhost/phpmyadmin).
2. Sélectionnez votre base de données `devmob`.
3. Cliquez sur l'onglet "Importer".
4. Choisissez le fichier `backend/create_orders_table.sql` qui se trouve dans votre projet.
   (Chemin: c:\Users\moham\devmob\backend\create_orders_table.sql)
5. Cliquez sur "Exécuter".

Cela va créer les tables `orders` et `order_items` nécessaires pour stocker l'historique des commandes.

Une fois fait, assurez-vous que les nouveaux fichiers PHP sont bien dans votre dossier XAMPP :
- Copiez le contenu du dossier `backend` vers `C:\xampp\htdocs\devmob\backend`.
