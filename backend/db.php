<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$host = 'localhost';
$db_name = 'devmob';
$username = 'root';
$password = ''; // Mot de passe par défaut de XAMPP est vide

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // Renvoie du JSON au lieu de texte brut pour ne pas casser l'app
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(array("error" => "Connection error: " . $e->getMessage()));
    exit();
}
?>