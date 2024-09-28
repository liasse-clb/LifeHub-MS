import React, { useContext } from 'react';
import { View, StyleSheet, Text, ScrollView, Pressable, Image } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeContext } from '../src/styles/ThemeProvider';
import Calculator from './Calculator';
import TemperatureConverter from './TemperatureConverter';

const CalculatorBase = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkTheme = theme === 'dark';
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: isDarkTheme ? '#1c1c1e' : '#f0f0f0' }]}>
      <ScrollView>
        <Text style={[styles.title, { color: isDarkTheme ? '#ffffff' : '#333333' }]}>
          Calculadora e afins :-D
        </Text>

        <Pressable
          style={[styles.pressable, {
            backgroundColor: isDarkTheme ? '#7777' : 'aliceblue',
            borderColor: isDarkTheme ? '#ffffff' : '#333333'
          }]}
          onPress={() => navigation.navigate('Calculator')}
        >

          <Image
            source={require('../src/assets/calculadora.jpg')}
            style={styles.image}
          />

          {/* View para organizar o título e a legenda um embaixo do outro */}
          <View style={styles.textContainer}>
            <Text style={[styles.buttonText, { color: isDarkTheme ? '#ffffff' : '#333333' }]}>
              Calculadora
            </Text>
            <Text style={[styles.buttonCaption, { color: isDarkTheme ? '#ffffff' : '#333333' }]}>
              Faça cálculos com precisão e eficiência
            </Text>
          </View>
        </Pressable>
        <Pressable
        style={[styles.pressable, {
          backgroundColor: isDarkTheme ? '#7777' : 'aliceblue',borderColor: isDarkTheme ? '#ffffff' : '#333333'
          }]}
          onPress={() => {
            navigation.navigate('TemperatureConverter')}}>
            <Image 
            source={require('../src/assets/termometro.jpg')}
            style={styles.image}/>
            <View style={styles.textContainer}>
              <Text style={[styles.buttonText, { color: isDarkTheme ? '#ffffff' :'#333333' }]}>
                Conversor de Temperatura 
              </Text>
              <Text style={[styles.buttonCaption, { color: isDarkTheme ? '#ffffff' :'#333333' }]} >
                Converta Celsius, Fahrenheit e Kelvin de forma rápida
              </Text>
            </View>
        </Pressable>
      </ScrollView>
    </View>
  );
};

// Configuração da navegação
const Stack = createNativeStackNavigator();

const CalculatorsNavigation = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="CalculatorBase">
        <Stack.Screen
          name="CalculatorBase"
          component={CalculatorBase}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Calculator"
          component={Calculator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TemperatureConverter"
          component={TemperatureConverter}
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonCaption: {
    fontSize: 12,
    fontWeight: '300',
    marginTop: 5, // Espaçamento entre o título e a legenda
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center', // Centraliza o conteúdo verticalmente
    borderRadius: 18,
    marginVertical: 10,
    height: 160,
    padding: 10,
    width: '98%',
    elevation: 8,
    margin: 'auto',
    borderWidth: 0.6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.30,
    shadowRadius: 3.84,
  },
  image: {
    width: 100,
    height: '100%',
    marginRight: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
  },
});

export default CalculatorsNavigation;
