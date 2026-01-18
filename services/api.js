import { Platform, NativeModules } from 'react-native';
import { getCategoryEmoji } from '../utils/categoryUtils';
import { categories as mockCategories, products as mockProducts } from '../data/mockData';

// URL de base de l'API
// Pour Android Emulator: 10.0.2.2
// Pour iOS Simulator: localhost
// Pour appareil physique: Votre adresse IP locale (ex: 192.168.1.15)
// IMPORTANT: Assurez-vous que votre dossier 'backend' est copié dans le dossier 'htdocs' de XAMPP
// et renommé 'devmob_api' (ou ajustez l'URL ci-dessous).

const getDevServerHost = () => {
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  if (!scriptURL) return null;
  const match = scriptURL.match(/^https?:\/\/([^:/]+)(?::\d+)?\//);
  return match ? match[1] : null;
};

export const API_URL = (() => {
  // IP détectée automatiquement par l'assistant : 172.20.10.9
  // Si vous changez de réseau, mettez à jour cette IP ou laissez getDevServerHost faire le travail
  const MANUAL_IP = '172.20.10.9'; 

  const host = getDevServerHost();
  // Sur Android physique via Expo, host est souvent l'IP du PC
  if (host && host !== 'localhost') return `http://${host}/devmob/backend`;
  
  // Fallback sur l'IP manuelle si disponible
  if (MANUAL_IP) return `http://${MANUAL_IP}/devmob/backend`;
  
  // Fallback émulateur Android
  if (Platform.OS === 'android') return 'http://10.0.2.2/devmob/backend';
  
  // Fallback iOS/Web
  return 'http://localhost/devmob/backend';
})();

export const checkConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/get_categories.php`);
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const initDatabase = async () => {
  try {
    const response = await fetch(`${API_URL}/install_db.php`);
    return await response.json();
  } catch (error) {
    console.error("Erreur init DB", error);
    return { success: false, error: error.message };
  }
};

export const getUserRole = async (email) => {
  try {
    console.log(`[API] Checking role for ${email} at ${API_URL}/user_role.php`);
    const response = await fetch(`${API_URL}/user_role.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur getUserRole:', error);
    return { success: false, error: error.message };
  }
};

export const fetchCategories = async () => {
  try {
    console.log(`[API] Fetching categories from ${API_URL}/get_categories.php`);
    const response = await fetch(`${API_URL}/get_categories.php`);
    if (!response.ok) {
      throw new Error('Erreur réseau lors de la récupération des catégories');
    }
    const data = await response.json();
    return data.map(cat => ({
      ...cat,
      icon: (cat.icon && !cat.icon.includes('?')) ? cat.icon : getCategoryEmoji(cat.name)
    }));
  } catch (error) {
    console.error('Erreur fetchCategories:', error);
    throw error;
  }
};

export const fetchProducts = async (categoryId = null) => {
  try {
    let url = `${API_URL}/get_products.php`;
    if (categoryId) {
      url += `?category_id=${categoryId}`;
    }
    console.log(`[API] Fetching products from ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erreur réseau lors de la récupération des produits');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur fetchProducts:', error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const formData = new FormData();
    formData.append('title', productData.title);
    formData.append('price', productData.price);
    formData.append('description', productData.description);
    formData.append('category_id', productData.category_id);
    formData.append('in_stock', productData.inStock ? 1 : 0);
    formData.append('sizes', JSON.stringify(productData.sizes));

    // Si on a une URI locale (image sélectionnée), on l'envoie comme fichier
    if (productData.images && productData.images.length > 0) {
       const imageUri = productData.images[0];
       // Vérifier si c'est une image locale (commence par file:// ou content://)
       if (imageUri.startsWith('file') || imageUri.startsWith('content')) {
           const filename = imageUri.split('/').pop();
           const match = /\.(\w+)$/.exec(filename);
           const type = match ? `image/${match[1]}` : `image`;
           
           formData.append('image_file', { uri: imageUri, name: filename, type });
       } else {
           // C'est déjà une URL distante
           formData.append('image_url', imageUri);
       }
    }

    const response = await fetch(`${API_URL}/add_product.php`, {
      method: 'POST',
      headers: {
        // Ne PAS mettre Content-Type: multipart/form-data, fetch le fait tout seul avec le boundary
        // 'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Erreur addProduct", error);
    return { success: false, message: error.message };
  }
};

export const updateProduct = async (productData) => {
  try {
    const formData = new FormData();
    formData.append('id', productData.id);
    formData.append('title', productData.title);
    formData.append('price', productData.price);
    formData.append('description', productData.description);
    formData.append('category_id', productData.category_id);
    formData.append('in_stock', productData.inStock ? 1 : 0);
    formData.append('sizes', JSON.stringify(productData.sizes));

    if (productData.images && productData.images.length > 0) {
       const imageUri = productData.images[0];
       if (imageUri.startsWith('file') || imageUri.startsWith('content')) {
           const filename = imageUri.split('/').pop();
           const match = /\.(\w+)$/.exec(filename);
           const type = match ? `image/${match[1]}` : `image`;
           formData.append('image_file', { uri: imageUri, name: filename, type });
       } else {
           formData.append('image_url', imageUri);
       }
    }

    const response = await fetch(`${API_URL}/update_product.php`, {
      method: 'POST', // On utilise POST pour le multipart
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Erreur updateProduct", error);
    return { success: false, message: error.message };
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/delete_product.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: productId }),
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur deleteProduct:', error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_URL}/create_order.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur createOrder:', error);
    return { success: false, message: error.message };
  }
};

export const getUserOrders = async (email) => {
  try {
    const response = await fetch(`${API_URL}/get_user_orders.php?email=${email}`);
    if (!response.ok) {
      throw new Error('Erreur réseau lors de la récupération des commandes');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur getUserOrders:', error);
    throw error;
  }
};
