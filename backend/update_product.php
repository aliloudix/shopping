<?php
require_once 'db.php';
header('Content-Type: application/json');

function uploadImage($file) {
    $target_dir = "uploads/";
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    
    $filename = uniqid() . "_" . basename($file["name"]);
    $target_file = $target_dir . $filename;
    
    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
        $host = $_SERVER['HTTP_HOST'];
        $path = dirname($_SERVER['PHP_SELF']);
        return "$protocol://$host$path/$target_file";
    }
    return null;
}

// Pour UPDATE, on utilise POST car PUT ne gère pas bien multipart/form-data en PHP standard
$id = $_POST['id'] ?? null;
$title = $_POST['title'] ?? null;
$price = $_POST['price'] ?? null;
$description = $_POST['description'] ?? null;
$category_id = $_POST['category_id'] ?? null;
$in_stock = $_POST['in_stock'] ?? null;

$sizes = isset($_POST['sizes']) ? json_decode($_POST['sizes'], true) : null;

// Gestion image
$new_image_url = null;
if (isset($_FILES['image_file'])) {
    $uploaded_url = uploadImage($_FILES['image_file']);
    if ($uploaded_url) {
        $new_image_url = $uploaded_url;
    }
} elseif (isset($_POST['image_url']) && !empty($_POST['image_url'])) {
    // Si on a changé l'URL manuellement (moins probable avec upload, mais possible)
    $new_image_url = $_POST['image_url'];
}

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID produit manquant']);
    exit;
}

try {
    $conn->beginTransaction();

    // 1. Mise à jour produit
    $sql = "UPDATE products SET ";
    $params = [];
    $updates = [];

    if ($title) { $updates[] = "title = :title"; $params[':title'] = $title; }
    if ($price) { $updates[] = "price = :price"; $params[':price'] = $price; }
    if ($description) { $updates[] = "description = :description"; $params[':description'] = $description; }
    if ($category_id) { $updates[] = "category_id = :category_id"; $params[':category_id'] = $category_id; }
    if ($in_stock !== null) { $updates[] = "in_stock = :in_stock"; $params[':in_stock'] = $in_stock; }

    if (!empty($updates)) {
        $sql .= implode(", ", $updates) . " WHERE id = :id";
        $params[':id'] = $id;
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
    }

    // 2. Mise à jour tailles (On supprime tout et on recrée, plus simple)
    if ($sizes !== null) {
        $conn->prepare("DELETE FROM product_sizes WHERE product_id = :id")->execute([':id' => $id]);
        
        if (!empty($sizes)) {
            $stmt_size = $conn->prepare("INSERT INTO product_sizes (product_id, size) VALUES (:product_id, :size)");
            foreach ($sizes as $size) {
                $stmt_size->execute([':product_id' => $id, ':size' => $size]);
            }
        }
    }

    // 3. Mise à jour image (Si nouvelle image fournie)
    if ($new_image_url) {
        // On supprime l'ancienne image principale (optionnel, on pourrait garder l'historique)
        $conn->prepare("DELETE FROM product_images WHERE product_id = :id")->execute([':id' => $id]);
        
        $stmt_image = $conn->prepare("INSERT INTO product_images (product_id, image_url) VALUES (:product_id, :image_url)");
        $stmt_image->execute([':product_id' => $id, ':image_url' => $new_image_url]);
    }

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Produit mis à jour', 'image' => $new_image_url]);

} catch(PDOException $e) {
    $conn->rollBack();
    echo json_encode(['success' => false, 'message' => 'Erreur SQL: ' . $e->getMessage()]);
}
?>