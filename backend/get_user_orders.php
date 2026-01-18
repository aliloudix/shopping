<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Gestion des erreurs pour éviter l'affichage HTML
error_reporting(E_ALL);
ini_set('display_errors', 0);

try {
    require_once 'db.php';

    if (!isset($conn)) {
        throw new Exception("Erreur de connexion à la base de données.");
    }

    if (!isset($_GET['email'])) {
        http_response_code(400);
        echo json_encode(array("message" => "Email requis."));
        exit();
    }

    $email = $_GET['email'];

    // Utilisation directe de $conn au lieu de new Database()
    $query = "SELECT * FROM orders WHERE user_email = ? ORDER BY created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(1, $email);
    
    if (!$stmt->execute()) {
        throw new Exception("Erreur lors de l'exécution de la requête commandes.");
    }

    $orders_arr = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        $order_item = array(
            "id" => $row['id'],
            "total_amount" => $row['total_amount'],
            "status" => $row['status'],
            "ordered_products" => isset($row['ordered_products']) ? $row['ordered_products'] : '',
            "created_at" => $row['created_at'],
            "items" => array()
        );

        // Une requête plus propre pour récupérer l'image principale
        $query_items = "SELECT oi.*, p.title, 
                        (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image_url
                        FROM order_items oi
                        JOIN products p ON oi.product_id = p.id
                        WHERE oi.order_id = ?";

        $stmt_items = $conn->prepare($query_items);
        $stmt_items->bindParam(1, $row['id']);
        
        if ($stmt_items->execute()) {
            while($row_item = $stmt_items->fetch(PDO::FETCH_ASSOC)){
                array_push($order_item['items'], $row_item);
            }
        }

        array_push($orders_arr, $order_item);
    }

    http_response_code(200);
    echo json_encode($orders_arr);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Erreur serveur: " . $e->getMessage()));
}
?>