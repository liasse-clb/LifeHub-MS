import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NotePad from './NotePad';
import Settings from './Settings';
import Casa from './Casa';
import CalculatorBase from './CalculatorBase';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeContext, ThemeProvider } from '../src/styles/ThemeProvider';  // Importar o provedor de tema

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// TabNavigator utilizando o contexto de tema
const TabNavigator = () => {
  const { theme } = useContext(ThemeContext);  // Obtém o tema diretamente do contexto

  return (
    <Tab.Navigator
      initialRouteName='Casa'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Casa':
              iconName = 'home-variant';
              break;
            case 'NotePad':
              iconName = 'notebook';
              break;
            case 'CalculatorBase':
              iconName = 'calculator';
              break;
            case 'Settings':
              iconName = 'cog-outline';
              break;
            default:
              iconName = 'cog';
          }

          return <MaterialCommunityIcons name={iconName} color={color} size={size} />;
        },
        tabBarActiveTintColor: theme === 'dark' ? '#1dbfb4' : '#5E17EB',
        tabBarInactiveTintColor: '#929396',
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#000312' : '#ffffff',
          height: 50,
          alignItems: 'center',
          justifyContent: 'center'
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="NotePad" component={NotePad} options={{ title: 'Notas' }} />
      <Tab.Screen name="Casa" component={Casa} options={{ title: 'Home' }} />
      <Tab.Screen name="CalculatorBase" options={{ title: 'Calculadora' }}>
        {props => <CalculatorBase {...props} theme={theme} />}
      </Tab.Screen>
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

// DrawerNavigator utilizando o contexto de tema
const DrawerNavigator = () => {
  const { theme } = useContext(ThemeContext);  // Obtém o tema diretamente do contexto

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerInactiveTintColor: '#929396',
        drawerActiveTintColor: theme === 'dark' ? '#1dbfb4' : '#5E17EB',
        headerStyle: {
          backgroundColor: theme === 'dark' ? '#000312' : '#ffffff',
          height: 70,
        },
        headerTintColor: theme === 'dark' ? '#ffffff' : '#000000',
        headerTitle: '',
        drawerStyle: {
          backgroundColor: theme === 'dark' ? '#000312' : '#ffffff',
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
        component={TabNavigator}
      />
      <Drawer.Screen
        name="Settings"
        options={{
          drawerLabel: 'Settings',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}
        component={Settings}
      />
    </Drawer.Navigator>
  );
};

// Componente Home agora utiliza o ThemeProvider
const Home = () => {
  return (
    <ThemeProvider>
      <NavigationContainer independent={true}>
        <DrawerNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default Home;
