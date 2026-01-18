-- Base de données : devmob

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `icon` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `name`, `icon`) VALUES
(1, 'Homme', '👔'),
(2, 'Femme', '👗'),
(3, 'Enfants', '👶'),
(4, 'Accessoires', '🕶️');

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text NOT NULL,
  `in_stock` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `category_id`, `title`, `price`, `description`, `in_stock`) VALUES
(1, 1, 'T-Shirt Premium', 29.99, 'T-shirt en coton bio de qualité supérieure, confortable et durable. Parfait pour toutes les occasions.', 1),
(2, 1, 'Jean Slim Noir', 79.99, 'Jean slim noir élégant, coupe moderne et confortable. Idéal pour un look décontracté et stylé.', 1),
(3, 1, 'Veste en Cuir', 199.99, 'Veste en cuir véritable, intemporelle et élégante. Un classique de la garde-robe masculine.', 1),
(4, 1, 'Sweat à Capuche', 49.99, 'Sweat à capuche doux et chaud, parfait pour les journées fraîches. Style décontracté et confortable.', 1),
(5, 2, 'Robe d\'Été', 59.99, 'Robe légère et fluide, parfaite pour l\'été. Coupe élégante et confortable.', 1),
(6, 2, 'Blouse Blanche', 39.99, 'Blouse blanche classique, élégante et polyvalente. Se porte facilement au bureau ou en soirée.', 1),
(7, 2, 'Jupe Midi', 45.99, 'Jupe midi moderne et féminine, confortable et stylée. Parfaite pour toutes les occasions.', 1),
(8, 2, 'Manteau d\'Hiver', 149.99, 'Manteau d\'hiver chaud et élégant, parfait pour affronter les températures froides avec style.', 1),
(9, 3, 'T-Shirt Enfant', 19.99, 'T-shirt coloré et amusant pour enfants, en coton doux et résistant.', 1),
(10, 3, 'Robe Enfant', 34.99, 'Robe adorable pour petites filles, confortable et facile à porter.', 1),
(11, 3, 'Pantalon Enfant', 24.99, 'Pantalon résistant et confortable pour enfants, parfait pour jouer.', 1),
(12, 3, 'Veste Enfant', 39.99, 'Veste chaude et colorée pour enfants, idéale pour les journées fraîches.', 1),
(13, 4, 'Montre Classique', 129.99, 'Montre analogique élégante avec bracelet en cuir. Un accessoire intemporel pour compléter votre tenue.', 1),
(14, 4, 'Lunettes de Soleil', 89.99, 'Lunettes de soleil polarisées au design moderne. Protection UV400 optimale.', 1),
(15, 4, 'Sac à Dos Urbain', 59.99, 'Sac à dos pratique et stylé, idéal pour la ville ou le travail. Nombreux compartiments.', 1),
(16, 4, 'Casquette Baseball', 24.99, 'Casquette classique en coton, ajustable à l\'arrière. Parfaite pour un look décontracté.', 1);

-- --------------------------------------------------------

--
-- Structure de la table `product_sizes`
--

CREATE TABLE `product_sizes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `size` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `product_sizes`
--

INSERT INTO `product_sizes` (`product_id`, `size`) VALUES
(1, 'S'), (1, 'M'), (1, 'L'), (1, 'XL'),
(2, 'S'), (2, 'M'), (2, 'L'), (2, 'XL'),
(3, 'M'), (3, 'L'), (3, 'XL'),
(4, 'S'), (4, 'M'), (4, 'L'), (4, 'XL'),
(5, 'XS'), (5, 'S'), (5, 'M'), (5, 'L'),
(6, 'XS'), (6, 'S'), (6, 'M'), (6, 'L'),
(7, 'XS'), (7, 'S'), (7, 'M'), (7, 'L'),
(8, 'S'), (8, 'M'), (8, 'L'), (8, 'XL'),
(9, '4 ans'), (9, '6 ans'), (9, '8 ans'), (9, '10 ans'),
(10, '4 ans'), (10, '6 ans'), (10, '8 ans'),
(11, '4 ans'), (11, '6 ans'), (11, '8 ans'), (11, '10 ans'),
(12, '4 ans'), (12, '6 ans'), (12, '8 ans'), (12, '10 ans'),
(13, 'Unique'),
(14, 'Unique'),
(15, 'Unique'),
(16, 'Unique');

-- --------------------------------------------------------

--
-- Structure de la table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `product_images`
--

INSERT INTO `product_images` (`product_id`, `image_url`) VALUES
(1, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'),
(2, 'https://images.unsplash.com/photo-1542272604-787c133553f2?w=500'),
(3, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'),
(4, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'),
(5, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'),
(6, 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500'),
(7, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500'),
(8, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500'),
(9, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500'),
(10, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500'),
(11, 'https://images.unsplash.com/photo-1506629905607-0c0a2c0c0a0a?w=500'),
(12, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500'),
(13, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500'),
(14, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'),
(15, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'),
(16, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `role` enum('admin','client') NOT NULL DEFAULT 'client',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Insertion de l'admin par défaut
--

INSERT INTO `users` (`email`, `role`) VALUES
('admin@devmob.com', 'admin');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(255) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','cancelled') NOT NULL DEFAULT 'pending',
  `shipping_address` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_email`) REFERENCES `users`(`email`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `size` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
