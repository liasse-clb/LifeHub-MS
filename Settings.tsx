import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { ThemeContext } from '../src/styles/ThemeProvider';  // Importando o contexto corretamente

const Settings = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('ThemeContext must be used within a ThemeProvider');
  }

  const { theme, toggleTheme } = context;  // Consumindo o contexto com os tipos corretos
  const isDarkTheme = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDarkTheme ? '#000000' : '#ffffff' }]}>
      <Text style={[styles.text, { color: isDarkTheme ? '#ffffff' : '#000000' }]}>Configurações</Text>
      <View style={styles.switchContainer}>
        <Text style={[styles.text, { color: isDarkTheme ? '#ffffff' : '#000000' }]}>
          Modo {isDarkTheme ? 'Escuro' : 'Claro'}
        </Text>
        <Switch
          value={isDarkTheme}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkTheme ? '#f4f3f4' : '#f4f3f4'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default Settings;
