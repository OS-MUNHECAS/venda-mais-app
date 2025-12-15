import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useTheme } from '../../contexts/ThemeContext';

export default function HomeScreen() {
  const { theme } = useTheme();
  
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ backgroundColor: theme.primary, padding: 30, alignItems: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: theme.buttonText }}>
          Bem-vindo ao Venda+
        </Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
          <Link href="/clientes" asChild style={{ width: "48%" }}>
            <TouchableOpacity 
              style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                alignItems: "center",
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
              }}
            >
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: theme.primary + '20',
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}>
                <Ionicons name="people" size={28} color={theme.primary} />
              </View>
              <Text style={{ fontSize: 16, fontWeight: "700", color: theme.text, marginBottom: 4, textAlign: "center" }}>
                Clientes
              </Text>
              <Text style={{ fontSize: 12, color: theme.textSecondary, textAlign: "center" }}>
                Gerenciar clientes
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/produtos" asChild style={{ width: "48%" }}>
            <TouchableOpacity 
              style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                alignItems: "center",
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
              }}
            >
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: theme.primary + '20',
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}>
                <Ionicons name="cube" size={28} color={theme.primary} />
              </View>
              <Text style={{ fontSize: 16, fontWeight: "700", color: theme.text, marginBottom: 4, textAlign: "center" }}>
                Produtos
              </Text>
              <Text style={{ fontSize: 12, color: theme.textSecondary, textAlign: "center" }}>
                Gerenciar produtos
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/pedidos" asChild style={{ width: "48%" }}>
            <TouchableOpacity 
              style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                alignItems: "center",
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
              }}
            >
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: theme.primary + '20',
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}>
                <Ionicons name="add-circle" size={28} color={theme.primary} />
              </View>
              <Text style={{ fontSize: 16, fontWeight: "700", color: theme.text, marginBottom: 4, textAlign: "center" }}>
                Nova Venda
              </Text>
              <Text style={{ fontSize: 12, color: theme.textSecondary, textAlign: "center" }}>
                Criar novo pedido
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/historico" asChild style={{ width: "48%" }}>
            <TouchableOpacity 
              style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                alignItems: "center",
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
              }}
            >
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: theme.primary + '20',
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}>
                <Ionicons name="time-outline" size={28} color={theme.primary} />
              </View>
              <Text style={{ fontSize: 16, fontWeight: "700", color: theme.text, marginBottom: 4, textAlign: "center" }}>
                Histórico
              </Text>
              <Text style={{ fontSize: 12, color: theme.textSecondary, textAlign: "center" }}>
                Visualizar pedidos
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}

