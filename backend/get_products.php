<?php
require_once 'db.php';

header('Content-Type: application/json');

try {
    $query = "SELECT * FROM products";
    
    // Filtrage par catégorie si demandé
    if (isset($_GET['category_id'])) {
        $query .= " WHERE category_id = :category_id";
    }

    $stmt = $conn->prepare($query);

    if (isset($_GET['category_id'])) {
        $stmt->bindParam(':category_id', $_GET['category_id']);
    }

    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $formatted_products = [];

    foreach ($products as $product) {
        $product_id = $product['id'];

        // Récupérer les tailles
        $stmt_sizes = $conn->prepare("SELECT size FROM product_sizes WHERE product_id = :product_id");
        $stmt_sizes->bindParam(':product_id', $product_id);
        $stmt_sizes->execute();
        $sizes = $stmt_sizes->fetchAll(PDO::FETCH_COLUMN);

        // Récupérer les images
        $stmt_images = $conn->prepare("SELECT image_url FROM product_images WHERE product_id = :product_id");
        $stmt_images->bindParam(':product_id', $product_id);
        $stmt_images->execute();
        $images = $stmt_images->fetchAll(PDO::FETCH_COLUMN);

        // Formater le produit
        $formatted_product = [
            'id' => (string)$product['id'],
            'title' => $product['title'],
            'category' => (string)$product['category_id'],
            'price' => (float)$product['price'],
            'description' => $product['description'],
            'inStock' => (bool)$product['in_stock'],
            'sizes' => $sizes,
            'images' => $images
        ];

        $formatted_products[] = $formatted_product;
    }

    echo json_encode($formatted_products);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
