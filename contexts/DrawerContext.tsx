import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import {
    Animated,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface DrawerContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  const slideAnim = React.useRef(new Animated.Value(300)).current;

  const openDrawer = () => {
    setIsOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
  };

  const toggleDrawer = () => {
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  };

  const menuItems = [
    {
      name: 'configuracoes',
      label: 'Configurações',
      icon: 'settings-outline' as const,
      route: '/(tabs)/configuracoes',
    },
    {
      name: 'sobre',
      label: 'Sobre',
      icon: 'information-circle-outline' as const,
      route: '/(tabs)/sobre',
    },
    {
      name: 'ajuda',
      label: 'Ajuda',
      icon: 'help-circle-outline' as const,
      route: '/(tabs)/ajuda',
    },
  ];

  const navigateTo = (route: string) => {
    closeDrawer();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    drawer: {
      width: 280,
      height: '100%',
      backgroundColor: theme.background,
      shadowColor: '#000',
      shadowOffset: { width: -2, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
    header: {
      backgroundColor: theme.primary,
      padding: 20,
      paddingTop: 60,
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
    divider: {
      height: 1,
      backgroundColor: theme.divider,
      marginVertical: 10,
      marginHorizontal: 16,
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
  });

  return (
    <DrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer, toggleDrawer }}>
      {children}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={closeDrawer}
      >
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.drawer,
                  {
                    transform: [{ translateX: slideAnim }],
                  },
                ]}
              >
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Venda Mais</Text>
                  <Text style={styles.headerSubtitle}>Sistema de Vendas</Text>
                </View>

                <ScrollView style={styles.content}>
                  {menuItems.map((item) => (
                    <TouchableOpacity
                      key={item.name}
                      style={styles.menuItem}
                      onPress={() => navigateTo(item.route)}
                    >
                      <View style={styles.menuItemIcon}>
                        <Ionicons name={item.icon} size={24} color={theme.icon} />
                      </View>
                      <Text style={styles.menuItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}

                  <View style={styles.divider} />

                  <TouchableOpacity style={styles.closeButton} onPress={closeDrawer}>
                    <Ionicons name="close-outline" size={24} color={theme.icon} />
                    <Text style={styles.closeButtonText}>Fechar Menu</Text>
                  </TouchableOpacity>
                </ScrollView>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Venda Mais App v1.0.0</Text>
                  <Text style={styles.footerText}>© 2025 Todos os direitos reservados</Text>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer deve ser usado dentro de um DrawerProvider');
  }
  return context;
};
