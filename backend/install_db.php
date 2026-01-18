<?php
require_once 'db.php';

header('Content-Type: application/json');

try {
    // Création de la table users si elle n'existe pas
    $sql = "
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        role ENUM('admin', 'client') DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ";

    $conn->exec($sql);

    // Vérifier si l'admin existe déjà
    $stmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE email = 'admin@devmob.com'");
    $stmt->execute();
    
    if ($stmt->fetchColumn() == 0) {
        // Insérer l'admin par défaut
        $sqlAdmin = "INSERT INTO users (email, role) VALUES ('admin@devmob.com', 'admin')";
        $conn->exec($sqlAdmin);
        $message = "Table 'users' créée et admin par défaut (admin@devmob.com) ajouté.";
    } else {
        $message = "Table 'users' existe déjà et l'admin est présent.";
    }

    echo json_encode(['success' => true, 'message' => $message]);

} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
}
?>