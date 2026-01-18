<?php
require_once 'db.php';

header('Content-Type: application/json');

try {
    $stmt = $conn->prepare("SELECT * FROM categories");
    $stmt->execute();
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Convertir les IDs en chaînes de caractères pour correspondre au format attendu par le frontend
    $formatted_categories = array_map(function($category) {
        $category['id'] = (string)$category['id'];
        return $category;
    }, $categories);

    echo json_encode($formatted_categories);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
