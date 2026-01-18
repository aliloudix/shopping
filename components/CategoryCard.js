import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getCategoryEmoji } from '../utils/categoryUtils';

const CategoryCard = ({ category, onPress }) => {
  const emoji = (category.icon && !category.icon.includes('?')) ? category.icon : getCategoryEmoji(category.name);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.icon}>{emoji}</Text>
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

export default CategoryCard;

