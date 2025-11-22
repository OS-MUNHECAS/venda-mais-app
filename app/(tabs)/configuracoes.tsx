import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ThemeMode } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

export default function ConfiguracoesScreen() {
  const { theme, themeMode, setThemeMode } = useTheme();

  const themes: { mode: ThemeMode; label: string; description: string }[] = [
    {
      mode: 'light',
      label: 'Tema Claro',
      description: 'Interface clara, ideal para ambientes bem iluminados',
    },
    {
      mode: 'dark',
      label: 'Tema Escuro',
      description: 'Interface escura, ideal para reduzir fadiga visual',
    },
    {
      mode: 'contrast',
      label: 'Alto Contraste',
      description: 'Máximo contraste para melhor acessibilidade',
    },
  ];

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
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 12,
    },
    themeOption: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: theme.border,
    },
    themeOptionSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.primary,
    },
    themeLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 4,
    },
    themeLabelSelected: {
      color: theme.buttonText,
    },
    themeDescription: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    themeDescriptionSelected: {
      color: theme.buttonText,
      opacity: 0.9,
    },
    preview: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      marginTop: 8,
    },
    previewTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
    },
    colorRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 8,
    },
    colorBox: {
      width: 60,
      height: 40,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    colorLabel: {
      fontSize: 10,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 4,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={themeMode === 'dark' || themeMode === 'contrast' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.primary}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aparência</Text>
          {themes.map((t) => (
            <TouchableOpacity
              key={t.mode}
              style={[
                styles.themeOption,
                themeMode === t.mode && styles.themeOptionSelected,
              ]}
              onPress={() => setThemeMode(t.mode)}
            >
              <Text style={[styles.themeLabel, themeMode === t.mode && styles.themeLabelSelected]}>{t.label}</Text>
              <Text style={[styles.themeDescription, themeMode === t.mode && styles.themeDescriptionSelected]}>{t.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pré-visualização de Cores</Text>
          <View style={styles.preview}>
            <Text style={styles.previewTitle}>Principais</Text>
            <View style={styles.colorRow}>
              <View>
                <View style={[styles.colorBox, { backgroundColor: theme.primary }]} />
                <Text style={styles.colorLabel}>Primary</Text>
              </View>
              <View>
                <View style={[styles.colorBox, { backgroundColor: theme.secondary }]} />
                <Text style={styles.colorLabel}>Secondary</Text>
              </View>
              <View>
                <View style={[styles.colorBox, { backgroundColor: theme.accent }]} />
                <Text style={styles.colorLabel}>Accent</Text>
              </View>
            </View>

            <Text style={styles.previewTitle}>Status</Text>
            <View style={styles.colorRow}>
              <View>
                <View style={[styles.colorBox, { backgroundColor: theme.success }]} />
                <Text style={styles.colorLabel}>Success</Text>
              </View>
              <View>
                <View style={[styles.colorBox, { backgroundColor: theme.warning }]} />
                <Text style={styles.colorLabel}>Warning</Text>
              </View>
              <View>
                <View style={[styles.colorBox, { backgroundColor: theme.error }]} />
                <Text style={styles.colorLabel}>Error</Text>
              </View>
              <View>
                <View style={[styles.colorBox, { backgroundColor: theme.info }]} />
                <Text style={styles.colorLabel}>Info</Text>
              </View>
            </View>

            <Text style={styles.previewTitle}>Fundos</Text>
            <View style={styles.colorRow}>
              <View>
                <View style={[styles.colorBox, { backgroundColor: theme.background }]} />
                <Text style={styles.colorLabel}>Background</Text>
              </View>
              <View>
                <View style={[styles.colorBox, { backgroundColor: theme.surface }]} />
                <Text style={styles.colorLabel}>Surface</Text>
              </View>
              <View>
                <View style={[styles.colorBox, { backgroundColor: theme.card }]} />
                <Text style={styles.colorLabel}>Card</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
