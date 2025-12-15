# Sistema de Temas - Venda Mais App

## 📋 Visão Geral

O aplicativo agora possui um sistema completo de temas com suporte a:
- 🌞 **Tema Claro** - Interface clara para ambientes bem iluminados
- 🌙 **Tema Escuro** - Interface escura para reduzir fadiga visual
- ⚡ **Alto Contraste** - Máximo contraste para melhor acessibilidade

## 🚀 Como Usar o Tema nas Telas

### 1. Importar o Hook useTheme

```tsx
import { useTheme } from '../../contexts/ThemeContext';
```

### 2. Usar o Hook no Componente

```tsx
export default function MinhaScreen() {
  const { theme, themeMode } = useTheme();
  
  // ... resto do código
}
```

### 3. Criar Estilos Dinâmicos

**IMPORTANTE:** Mova a criação de estilos para DENTRO do componente, após o hook useTheme:

```tsx
export default function MinhaScreen() {
  const { theme, themeMode } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background, // ✅ Usa a cor do tema
    },
    card: {
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 12,
      padding: 16,
    },
    text: {
      color: theme.text,
      fontSize: 16,
    },
    textSecondary: {
      color: theme.textSecondary,
      fontSize: 14,
    },
  });
  
  return (
    // ... JSX
  );
}
```

### 4. Ajustar StatusBar

```tsx
<StatusBar 
  barStyle={themeMode === 'dark' || themeMode === 'contrast' ? 'light-content' : 'dark-content'}
  backgroundColor={theme.primary}
/>
```

## 🎨 Cores Disponíveis no Tema

### Cores Principais
- `theme.primary` - Cor principal do app
- `theme.primaryDark` - Variante escura da cor principal
- `theme.primaryLight` - Variante clara da cor principal
- `theme.secondary` - Cor secundária
- `theme.accent` - Cor de destaque

### Cores de Fundo
- `theme.background` - Fundo principal
- `theme.surface` - Fundo de superfícies (cards, modais)
- `theme.card` - Fundo de cards

### Cores de Texto
- `theme.text` - Texto principal
- `theme.textSecondary` - Texto secundário
- `theme.textDisabled` - Texto desabilitado

### Cores de Status
- `theme.success` - Verde para sucesso
- `theme.warning` - Amarelo para avisos
- `theme.error` - Vermelho para erros
- `theme.info` - Azul para informações

### Cores de UI
- `theme.border` - Bordas
- `theme.divider` - Divisores
- `theme.icon` - Ícones
- `theme.iconActive` - Ícones ativos

### Cores de Input
- `theme.inputBackground` - Fundo de inputs
- `theme.inputBorder` - Borda de inputs
- `theme.inputPlaceholder` - Placeholder de inputs

### Cores de Botões
- `theme.buttonPrimary` - Botão primário
- `theme.buttonSecondary` - Botão secundário
- `theme.buttonText` - Texto de botões

### Cores de Tab
- `theme.tabBackground` - Fundo da tab bar
- `theme.tabIconDefault` - Ícone não selecionado
- `theme.tabIconSelected` - Ícone selecionado

## 📝 Exemplo Completo de Tela

```tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function ExemploScreen() {
  const { theme, themeMode } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      padding: 16,
      backgroundColor: theme.primary,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.buttonText,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    cardText: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    button: {
      backgroundColor: theme.buttonPrimary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: theme.buttonText,
      fontWeight: 'bold',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={themeMode === 'dark' || themeMode === 'contrast' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.primary}
      />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Exemplo de Tela</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Card de Exemplo</Text>
          <Text style={styles.cardText}>Este é um exemplo de card usando o tema.</Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Botão de Exemplo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
```

## ⚙️ Configurações

Os usuários podem alterar o tema na tela de **Configurações**, acessível pela aba "Configurações" no menu inferior.

## 🔧 Funções do ThemeContext

```tsx
const { theme, themeMode, setThemeMode, toggleTheme } = useTheme();

// theme - objeto com todas as cores do tema atual
// themeMode - 'light' | 'dark' | 'contrast'
// setThemeMode - função para definir o tema
// toggleTheme - função para alternar entre os temas
```

## 📱 Persistência

O tema selecionado é salvo automaticamente usando AsyncStorage e será restaurado quando o app for reaberto.

## ✅ Checklist para Adaptar uma Tela

- [ ] Importar `useTheme` do contexto
- [ ] Chamar o hook no início do componente
- [ ] Mover `StyleSheet.create()` para DENTRO do componente (após useTheme)
- [ ] Substituir cores fixas por `theme.nomeDaCor`
- [ ] Ajustar StatusBar conforme o tema
- [ ] Testar nos 3 temas (claro, escuro, contraste)

## 🎯 Próximos Passos

Para adaptar todas as telas existentes ao sistema de temas:
1. Clientes ✅ (já está usando serviço)
2. Produtos - Adaptar estilos
3. Pedidos - Adaptar estilos
4. Histórico - Adaptar estilos
5. Index - Adaptar estilos
