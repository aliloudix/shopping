import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { fetchCategories, addProduct, updateProduct } from '../services/api';
import { getCategoryEmoji } from '../utils/categoryUtils';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Unique', '4 ans', '6 ans', '8 ans', '10 ans'];

const AdminEditProductScreen = ({ route, navigation }) => {
  const { product } = route.params || {};
  const isEditing = !!product;

  const [title, setTitle] = useState(product?.title || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [description, setDescription] = useState(product?.description || '');
  const [categoryId, setCategoryId] = useState(product?.category || '');
  const [image, setImage] = useState(product?.images?.[0] || '');
  const [selectedSizes, setSelectedSizes] = useState(product?.sizes || []);
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
        if (!categoryId && data.length > 0) {
          setCategoryId(data[0].id);
        }
      } catch (error) {
        console.error('Erreur chargement catégories', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const pickImage = async () => {
    // Demander la permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à vos photos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleSave = async () => {
    if (!title || !price || !description || !categoryId || !image || selectedSizes.length === 0) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      const productData = {
        title,
        price: parseFloat(price),
        description,
        category_id: categoryId,
        sizes: selectedSizes,
        images: [image], // On gère une seule image pour simplifier
        inStock,
      };

      let result;
      if (isEditing) {
        result = await updateProduct({ ...productData, id: product.id });
      } else {
        result = await addProduct(productData);
      }

      if (result.success) {
        Alert.alert('Succès', isEditing ? 'Produit mis à jour' : 'Produit ajouté', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Erreur', result.message || 'Une erreur est survenue');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder le produit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Modifier le produit' : 'Ajouter un produit'}
        </Text>
        <TouchableOpacity onPress={handleSave} disabled={loading} style={styles.saveButton}>
          {loading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Titre</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Nom du produit"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Prix (€)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="0.00"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Description du produit"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Catégorie</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {loadingCategories ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    categoryId === cat.id && styles.categoryChipSelected,
                  ]}
                  onPress={() => setCategoryId(cat.id)}
                >
                  <Text
                  style={[
                    styles.categoryChipText,
                    categoryId === cat.id && styles.categoryChipTextSelected,
                  ]}
                >
                  {(cat.icon && !cat.icon.includes('?')) ? cat.icon : getCategoryEmoji(cat.name)} {cat.name}
                </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Image du produit</Text>
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            <Text style={styles.imagePickerText}>
              {image ? 'Changer la photo' : 'Choisir une photo'}
            </Text>
            <Ionicons name="camera-outline" size={24} color="#666" />
          </TouchableOpacity>
          
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : null}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Tailles disponibles</Text>
          <View style={styles.sizesContainer}>
            {SIZES.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeChip,
                  selectedSizes.includes(size) && styles.sizeChipSelected,
                ]}
                onPress={() => toggleSize(size)}
              >
                <Text
                  style={[
                    styles.sizeChipText,
                    selectedSizes.includes(size) && styles.sizeChipTextSelected,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>En stock</Text>
          <Switch value={inStock} onValueChange={setInStock} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#333',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  categoryChipSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  categoryChipText: {
    color: '#333',
  },
  categoryChipTextSelected: {
    color: '#fff',
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizeChip: {
    width: 60,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  sizeChipSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  sizeChipText: {
    color: '#333',
  },
  sizeChipTextSelected: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default AdminEditProductScreen;
