import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [shippingDetails, setShippingDetails] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const total = getTotalPrice();
  const shippingCost = total > 50 ? 0 : 5.99;
  const finalTotal = total + shippingCost;

  const handleOrder = async () => {
    if (
      !shippingDetails.fullName ||
      !shippingDetails.address ||
      !shippingDetails.city ||
      !shippingDetails.postalCode ||
      !shippingDetails.phone
    ) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs de livraison');
      return;
    }

    setLoading(true);

    try {
      const orderItems = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        size: item.size
      }));

      const fullAddress = `${shippingDetails.address}, ${shippingDetails.postalCode} ${shippingDetails.city}, Tel: ${shippingDetails.phone}`;

      const orderData = {
        email: user.email,
        total_amount: finalTotal,
        shipping_address: fullAddress,
        items: orderItems
      };

      const result = await createOrder(orderData);

      if (result.success) {
        Alert.alert(
          'Commande confirmée !',
          'Votre commande a été enregistrée avec succès.',
          [
            {
              text: 'OK',
              onPress: () => {
                clearCart();
                navigation.navigate('Home');
              },
            },
          ]
        );
      } else {
        throw new Error(result.message || "Erreur inconnue");
      }
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'enregistrer la commande: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresse de livraison</Text>
          <View style={styles.form}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              style={styles.input}
              value={shippingDetails.fullName}
              onChangeText={(text) =>
                setShippingDetails({ ...shippingDetails, fullName: text })
              }
              placeholder="Jean Dupont"
            />

            <Text style={styles.label}>Adresse</Text>
            <TextInput
              style={styles.input}
              value={shippingDetails.address}
              onChangeText={(text) =>
                setShippingDetails({ ...shippingDetails, address: text })
              }
              placeholder="123 Rue de la Paix"
            />

            <View style={styles.row}>
              <View style={[styles.halfInput, { marginRight: 10 }]}>
                <Text style={styles.label}>Ville</Text>
                <TextInput
                  style={styles.input}
                  value={shippingDetails.city}
                  onChangeText={(text) =>
                    setShippingDetails({ ...shippingDetails, city: text })
                  }
                  placeholder="Paris"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Code Postal</Text>
                <TextInput
                  style={styles.input}
                  value={shippingDetails.postalCode}
                  onChangeText={(text) =>
                    setShippingDetails({ ...shippingDetails, postalCode: text })
                  }
                  placeholder="75000"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={styles.input}
              value={shippingDetails.phone}
              onChangeText={(text) =>
                setShippingDetails({ ...shippingDetails, phone: text })
              }
              placeholder="06 12 34 56 78"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mode de paiement</Text>
          
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <View style={styles.paymentInfo}>
              <Ionicons name="card-outline" size={24} color="#000" />
              <Text style={styles.paymentText}>Carte Bancaire</Text>
            </View>
            <View style={styles.radioButton}>
              {paymentMethod === 'card' && <View style={styles.radioButtonSelected} />}
            </View>
          </TouchableOpacity>

          {paymentMethod === 'card' && (
             <View style={styles.cardForm}>
                <TextInput style={styles.input} placeholder="Numéro de carte" keyboardType="numeric" />
                <View style={styles.row}>
                  <TextInput style={[styles.input, { flex: 1, marginRight: 10 }]} placeholder="MM/AA" />
                  <TextInput style={[styles.input, { flex: 1 }]} placeholder="CVC" keyboardType="numeric" maxLength={3} />
                </View>
             </View>
          )}

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'paypal' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('paypal')}
          >
            <View style={styles.paymentInfo}>
              <Ionicons name="logo-paypal" size={24} color="#003087" />
              <Text style={styles.paymentText}>PayPal</Text>
            </View>
            <View style={styles.radioButton}>
              {paymentMethod === 'paypal' && <View style={styles.radioButtonSelected} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'cash' && styles.paymentOptionSelected,
            ]}
            onPress={() => setPaymentMethod('cash')}
          >
            <View style={styles.paymentInfo}>
              <Ionicons name="cash-outline" size={24} color="#009000" />
              <Text style={styles.paymentText}>Paiement à la livraison</Text>
            </View>
            <View style={styles.radioButton}>
              {paymentMethod === 'cash' && <View style={styles.radioButtonSelected} />}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résumé</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sous-total</Text>
            <Text style={styles.summaryValue}>{total.toFixed(2)} €</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Livraison</Text>
            <Text style={styles.summaryValue}>
              {shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)} €`}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{finalTotal.toFixed(2)} €</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirmer la commande</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  form: {
    gap: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
  halfInput: {
    flex: 1,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 10,
  },
  paymentOptionSelected: {
    borderColor: '#000',
    backgroundColor: '#f9f9f9',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '500',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  cardForm: {
    marginTop: -5,
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  confirmButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
