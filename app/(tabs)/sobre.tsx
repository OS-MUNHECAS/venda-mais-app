import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function SobreScreen() {
  const { theme, themeMode } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    version: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
      marginTop: 10,
    },
    text: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 22,
      marginBottom: 8,
    },
    iconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
    },
    iconText: {
      fontSize: 14,
      color: theme.text,
      marginLeft: 12,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={themeMode === 'dark' || themeMode === 'contrast' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.primary}
      />
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Venda Mais App</Text>
          <Text style={styles.version}>Versão 1.0.0</Text>

          <Text style={styles.sectionTitle}>Sobre o Aplicativo</Text>
          <Text style={styles.text}>
            O Venda Mais é um sistema completo de gestão de vendas, desenvolvido para
            facilitar o controle de clientes, produtos e pedidos de forma simples e eficiente.
          </Text>

          <Text style={styles.sectionTitle}>Funcionalidades</Text>
          <View style={styles.iconRow}>
            <Ionicons name="people" size={20} color={theme.primary} />
            <Text style={styles.iconText}>Gestão completa de clientes</Text>
          </View>
          <View style={styles.iconRow}>
            <Ionicons name="cube" size={20} color={theme.primary} />
            <Text style={styles.iconText}>Catálogo de produtos</Text>
          </View>
          <View style={styles.iconRow}>
            <Ionicons name="add-circle" size={20} color={theme.primary} />
            <Text style={styles.iconText}>Emissão de pedidos</Text>
          </View>
          <View style={styles.iconRow}>
            <Ionicons name="time" size={20} color={theme.primary} />
            <Text style={styles.iconText}>Histórico de vendas</Text>
          </View>
          <View style={styles.iconRow}>
            <Ionicons name="settings" size={20} color={theme.primary} />
            <Text style={styles.iconText}>Configurações personalizáveis</Text>
          </View>

          <Text style={styles.sectionTitle}>Desenvolvido por</Text>
          <Text style={styles.text}>OS-MUNHECAS Team</Text>
          <Text style={styles.text}>© 2025 Todos os direitos reservados</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
