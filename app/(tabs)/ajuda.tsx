import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Linking,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function AjudaScreen() {
  const { theme, themeMode } = useTheme();

  const faqs = [
    {
      question: 'Como adicionar um novo cliente?',
      answer: 'Vá para a aba "Clientes" e toque no botão "+" no canto inferior direito. Preencha os dados do cliente e salve.',
    },
    {
      question: 'Como fazer um pedido?',
      answer: 'Na aba "Fazer Pedido", selecione o cliente, adicione os produtos desejados, configure frete e pagamento, e finalize o pedido.',
    },
    {
      question: 'Como alterar o tema do aplicativo?',
      answer: 'Acesse o menu lateral e selecione "Configurações". Escolha entre os temas: Claro, Escuro ou Alto Contraste.',
    },
    {
      question: 'Como visualizar o histórico de pedidos?',
      answer: 'Acesse a aba "Histórico" na barra inferior para ver todos os pedidos realizados.',
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 20,
    },
    faqItem: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    question: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    answer: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    contactSection: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 20,
      marginTop: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    contactTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
    },
    contactButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: theme.primary,
      borderRadius: 8,
      marginTop: 8,
    },
    contactButtonText: {
      fontSize: 16,
      color: theme.buttonText,
      marginLeft: 12,
      fontWeight: '500',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={themeMode === 'dark' || themeMode === 'contrast' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.primary}
      />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Perguntas Frequentes</Text>

        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.question}>{faq.question}</Text>
            <Text style={styles.answer}>{faq.answer}</Text>
          </View>
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Precisa de mais ajuda?</Text>
          <Text style={styles.answer}>
            Entre em contato com nossa equipe de suporte. Estamos prontos para ajudar!
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL('mailto:suporte@vendamais.com')}
          >
            <Ionicons name="mail" size={20} color={theme.buttonText} />
            <Text style={styles.contactButtonText}>Enviar Email</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
