<?php
require_once 'db.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'])) {
    echo json_encode(['success' => false, 'message' => 'Email manquant']);
    exit;
}

$email = $data['email'];

try {
    // Vérifier si l'utilisateur existe
    $stmt = $conn->prepare("SELECT role FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        // Utilisateur existant, renvoyer son rôle
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'role' => $user['role']]);
    } else {
        // Nouvel utilisateur, le créer comme 'client' par défaut
        $stmt = $conn->prepare("INSERT INTO users (email, role) VALUES (:email, 'client')");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $newId = $conn->lastInsertId();
        
        echo json_encode(['success' => true, 'role' => 'client', 'new_id' => $newId, 'db_name' => $db_name]);
    }

} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur SQL: ' . $e->getMessage()]);
}
?>
