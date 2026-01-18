import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </CartProvider>
    </AuthProvider>
  );
}
