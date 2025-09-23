import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo ao Venda+</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionCard}>
          <Ionicons name="people" size={40} color="#2196F3" />
          <Text style={styles.optionTitle}>Clientes</Text>
          <Text style={styles.optionDescription}>Gerenciar clientes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard}>
          <Ionicons name="cube" size={40} color="#2196F3" />
          <Text style={styles.optionTitle}>Produtos</Text>
          <Text style={styles.optionDescription}>Gerenciar produtos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard}>
          <Ionicons name="add-circle" size={40} color="#2196F3" />
          <Text style={styles.optionTitle}>Nova Venda</Text>
          <Text style={styles.optionDescription}>Criar novo pedido</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  optionsContainer: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
