import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { theme, themeMode } = useTheme();

  const menuItems = [
    {
      name: 'configuracoes',
      label: 'Configurações',
      icon: 'settings-outline' as const,
      route: 'configuracoes',
    },
    {
      name: 'sobre',
      label: 'Sobre',
      icon: 'information-circle-outline' as const,
      route: 'sobre',
    },
    {
      name: 'ajuda',
      label: 'Ajuda',
      icon: 'help-circle-outline' as const,
      route: 'ajuda',
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.primary,
      padding: 20,
      paddingTop: 50,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.buttonText,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: theme.buttonText,
      opacity: 0.9,
    },
    content: {
      flex: 1,
      paddingTop: 10,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginHorizontal: 10,
      marginVertical: 2,
      borderRadius: 8,
    },
    menuItemActive: {
      backgroundColor: theme.primaryLight,
    },
    menuItemIcon: {
      marginRight: 16,
      width: 24,
      alignItems: 'center',
    },
    menuItemText: {
      fontSize: 16,
      color: theme.text,
      fontWeight: '500',
    },
    menuItemTextActive: {
      color: theme.primary,
      fontWeight: 'bold',
    },
    divider: {
      height: 1,
      backgroundColor: theme.divider,
      marginVertical: 10,
      marginHorizontal: 16,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
    },
    footerText: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    closeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginHorizontal: 10,
      marginTop: 10,
      borderRadius: 8,
      backgroundColor: theme.surface,
    },
    closeButtonText: {
      fontSize: 16,
      color: theme.text,
      marginLeft: 16,
    },
  });

  const navigateTo = (route: string) => {
    props.navigation.navigate(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Venda Mais</Text>
        <Text style={styles.headerSubtitle}>Sistema de Vendas</Text>
      </View>

      <ScrollView style={styles.content}>
        {menuItems.map((item) => {
          const isActive = props.state.routeNames[props.state.index] === item.route;
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => navigateTo(item.route)}
            >
              <View style={styles.menuItemIcon}>
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={isActive ? theme.primary : theme.icon}
                />
              </View>
              <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => props.navigation.closeDrawer()}
        >
          <Ionicons name="close-outline" size={24} color={theme.icon} />
          <Text style={styles.closeButtonText}>Fechar Menu</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Venda Mais App v1.0.0</Text>
        <Text style={styles.footerText}>© 2025 Todos os direitos reservados</Text>
      </View>
    </SafeAreaView>
  );
}
