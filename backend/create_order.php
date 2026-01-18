<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->email) &&
    !empty($data->total_amount) &&
    !empty($data->shipping_address) &&
    !empty($data->items) &&
    is_array($data->items)
){
    try {
        // Utilisation directe de $conn définie dans db.php
        
        // --- AUTO-CREATION DES TABLES SI ELLES N'EXISTENT PAS ---
        // Note: Si la table existe déjà avec l'ancienne structure, il faudra peut-être la supprimer manuellement ou ajouter la colonne.
        
        $create_orders_sql = "
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_email VARCHAR(255) NOT NULL,
                total_amount DECIMAL(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'completed',
                ordered_products TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ";
        $conn->exec($create_orders_sql);

        // --- MIGRATION AUTOMATIQUE : AJOUT DE LA COLONNE 'ordered_products' SI MANQUANTE ---
        try {
            $check_col = $conn->query("SHOW COLUMNS FROM orders LIKE 'ordered_products'");
            if ($check_col->rowCount() == 0) {
                // La colonne n'existe pas, on l'ajoute
                $conn->exec("ALTER TABLE orders ADD COLUMN ordered_products TEXT NOT NULL AFTER status");
            }
        } catch (Exception $e) {
            // Ignorer l'erreur si la colonne existe déjà ou autre problème mineur
        }
        // -----------------------------------------------------------------------------------

        $create_items_sql = "
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                size VARCHAR(50) DEFAULT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ";
        $conn->exec($create_items_sql);
        // -------------------------------------------------------
        
        $conn->beginTransaction();

        // Préparer le résumé des produits
        $product_summary = [];
        foreach($data->items as $item) {
            // Si le titre n'est pas envoyé par le front, on met juste l'ID, mais idéalement le front devrait envoyer le titre.
            // On suppose ici que le front envoie peut-être 'title' ou on utilise juste l'ID pour l'instant si pas dispo.
            $name = isset($item->title) ? $item->title : "Produit #" . $item->product_id;
            $size = isset($item->size) ? " (" . $item->size . ")" : "";
            $product_summary[] = $name . $size . " x" . $item->quantity;
        }
        $ordered_products_str = implode(", ", $product_summary);

        // 1. Créer la commande
        $query = "INSERT INTO orders SET user_email=:email, total_amount=:total_amount, ordered_products=:ordered_products, status='completed'";
        $stmt = $conn->prepare($query);

        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":total_amount", $data->total_amount);
        $stmt->bindParam(":ordered_products", $ordered_products_str);

        if($stmt->execute()){
            $order_id = $conn->lastInsertId();

            // 2. Ajouter les articles
            $query_items = "INSERT INTO order_items SET order_id=:order_id, product_id=:product_id, quantity=:quantity, price=:price, size=:size";
            $stmt_items = $conn->prepare($query_items);

            foreach($data->items as $item){
                $stmt_items->bindParam(":order_id", $order_id);
                $stmt_items->bindParam(":product_id", $item->product_id); 
                $stmt_items->bindParam(":quantity", $item->quantity);
                $stmt_items->bindParam(":price", $item->price);
                $stmt_items->bindParam(":size", $item->size);
                
                if(!$stmt_items->execute()){
                    throw new Exception("Erreur lors de l'ajout d'un article.");
                }
            }

            $conn->commit();
            http_response_code(201);
            echo json_encode(array("success" => true, "message" => "Commande créée.", "order_id" => $order_id));
        } else {
            throw new Exception("Impossible de créer la commande.");
        }

    } catch (Exception $e) {
        if(isset($conn)) $conn->rollBack();
        http_response_code(503);
        echo json_encode(array("success" => false, "message" => "Erreur: " . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Données incomplètes."));
}
?>