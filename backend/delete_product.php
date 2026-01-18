<?php
require_once 'db.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID manquant']);
    exit;
}

try {
    // Grâce aux contraintes ON DELETE CASCADE définies dans database.sql,
    // supprimer le produit supprimera automatiquement les tailles et images liées.
    $stmt = $conn->prepare("DELETE FROM products WHERE id = :id");
    $stmt->bindParam(':id', $data['id']);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Produit supprimé avec succès']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Produit non trouvé']);
    }

} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur SQL: ' . $e->getMessage()]);
}
?>
