<?php
require_once 'db.php';
header('Content-Type: application/json');

// Fonction pour gérer l'upload
function uploadImage($file) {
    $target_dir = "uploads/";
    // Créer le dossier s'il n'existe pas
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    
    $filename = uniqid() . "_" . basename($file["name"]);
    $target_file = $target_dir . $filename;
    
    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        // Retourne l'URL complète de l'image
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
        $host = $_SERVER['HTTP_HOST'];
        // Ajuster le chemin selon votre structure XAMPP
        // Si le script est dans devmob/backend/add_product.php, l'image est dans devmob/backend/uploads/
        $path = dirname($_SERVER['PHP_SELF']);
        return "$protocol://$host$path/$target_file";
    }
    return null;
}

// Récupération des données (POST normal + FILES)
// Attention: Avec FormData, les données texte sont dans $_POST
$title = $_POST['title'] ?? '';
$price = $_POST['price'] ?? 0;
$description = $_POST['description'] ?? '';
$category_id = $_POST['category_id'] ?? null;
$in_stock = $_POST['in_stock'] ?? 1;

// Récupération des tableaux (sizes, images) qui peuvent être envoyés comme chaînes JSON
$sizes = isset($_POST['sizes']) ? json_decode($_POST['sizes'], true) : [];

// Gestion de l'image principale
$image_url = '';
if (isset($_FILES['image_file'])) {
    $uploaded_url = uploadImage($_FILES['image_file']);
    if ($uploaded_url) {
        $image_url = $uploaded_url;
    }
} elseif (isset($_POST['image_url'])) {
    // Fallback si on envoie juste une URL
    $image_url = $_POST['image_url'];
}

if (!$title || !$price || !$category_id) {
    echo json_encode(['success' => false, 'message' => 'Données manquantes (title, price, category_id)']);
    exit;
}

try {
    $conn->beginTransaction();

    // 1. Insérer le produit
    $stmt = $conn->prepare("INSERT INTO products (category_id, title, price, description, in_stock) VALUES (:category_id, :title, :price, :description, :in_stock)");
    $stmt->execute([
        ':category_id' => $category_id,
        ':title' => $title,
        ':price' => $price,
        ':description' => $description,
        ':in_stock' => $in_stock
    ]);
    
    $product_id = $conn->lastInsertId();

    // 2. Insérer les tailles
    if (!empty($sizes)) {
        $stmt_size = $conn->prepare("INSERT INTO product_sizes (product_id, size) VALUES (:product_id, :size)");
        foreach ($sizes as $size) {
            $stmt_size->execute([':product_id' => $product_id, ':size' => $size]);
        }
    }

    // 3. Insérer l'image (pour l'instant on gère une seule image principale dans product_images)
    if ($image_url) {
        $stmt_image = $conn->prepare("INSERT INTO product_images (product_id, image_url) VALUES (:product_id, :image_url)");
        $stmt_image->execute([':product_id' => $product_id, ':image_url' => $image_url]);
    }

    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Produit ajouté avec succès', 'id' => $product_id, 'image' => $image_url]);

} catch(PDOException $e) {
    $conn->rollBack();
    echo json_encode(['success' => false, 'message' => 'Erreur SQL: ' . $e->getMessage()]);
}
?>