import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image, ScrollView, Animated, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth } from '../src/firebase.config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import * as yup from 'yup';
import { RootStackParamList } from './navigationTypes';
import ErrorMessage from '../src/ErrorMessage';

const loginSchema = yup.object().shape({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
});

export default function LoginScreen() {
  const [loading, setLoading] = useState(true);
  const [credentialsChecked, setCredentialsChecked] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [userMail, setUserMail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const animation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedUserMail = await SecureStore.getItemAsync('userMail');
        const savedUserPass = await SecureStore.getItemAsync('userPass');
        if (savedUserMail && savedUserPass) {
          await userLogin(savedUserMail, savedUserPass);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to load credentials from secure storage', error);
      } finally {
        setCredentialsChecked(true);
      }
    };

    loadCredentials();
  }, []);

  const userLogin = async (email = userMail, password = userPass) => {
    try {
      await loginSchema.validate({ email, password }); // Validação com yup
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await SecureStore.setItemAsync('userMail', email);
      await SecureStore.setItemAsync('userPass', password);
      navigation.navigate('Home');
    } catch (error) {
      let message = 'Erro ao fazer login.';
      if (error.name === 'ValidationError') {
        message = error.message;
      } else if (error.code) {
        switch (error.code) {
          case 'auth/wrong-password':
            message = 'Senha incorreta.';
            break;
          case 'auth/user-not-found':
            message = 'Usuário não encontrado.';
            break;
          case 'auth/invalid-email':
            message = 'Email inválido.';
            break;
          default:
            message = 'Erro inesperado ao fazer login.';
        }
      }
      setErrorMessage(message);
      Alert.alert('Erro de Login', message);
      setLoading(false);
    }
  };

  const handlePressIn = () => {
    Animated.spring(animation, {
      toValue: 0.8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: animation }],
  };

  if (loading && !credentialsChecked) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5E17EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image source={require('../assets/images/iconinit.png')} />
        <Text style={styles.formTitle}>Faça o Login</Text>
        <TextInput
          style={styles.formInput}
          placeholder="email"
          inputMode="email"
          autoCapitalize="none"
          autoComplete="email"
          value={userMail}
          onChangeText={setUserMail}
        />
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.formInput}
            placeholder="senha"
            autoCapitalize="none"
            value={userPass}
            onChangeText={setUserPass}
            secureTextEntry={!passwordVisible}
          />
          <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
            <MaterialCommunityIcons
              name={passwordVisible ? 'eye-off' : 'eye'}
              size={24}
              color="#fff"
            />
          </Pressable>
        </View>
        {errorMessage ? (
          <ErrorMessage message={errorMessage} />
        ) : null}
        <Animated.View style={[styles.animatedButton, animatedStyle]}>
          <Pressable
            style={styles.formButton}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => userLogin()}
          >
            <Text style={styles.textButton}>Login</Text>
          </Pressable>
        </Animated.View>
        <View style={styles.subContainer}>
          <Pressable style={styles.subButton} onPress={() => navigation.navigate('RecoverPassword')}>
            <Text style={styles.subTextButton}>Esqueci a senha</Text>
          </Pressable>
          <Pressable style={styles.subButton} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.subTextButton}>Novo usuário</Text>
          </Pressable>
        </View>
        <StatusBar style="auto" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  animatedButton: {
    width: '60%',
    alignItems: 'center',
    margin: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formTitle: {
    padding: 20,
    fontSize: 36,
    fontWeight: 'bold',
    color: '#5E17EB',
    margin: 10,
  },
  formInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 18,
    width: '80%',
    padding: 15,
    margin: 10,
    backgroundColor: 'white',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    borderRadius: 10,
    borderWidth: 0,
    padding: 15,
    margin: 10,
    backgroundColor: '#5E17EB',
  },
  formButton: {
    backgroundColor: '#5E17EB',
    padding: 10,
    borderRadius: 10,
    width: '65%',
    alignItems: 'center',
    margin: 10,
  },
  textButton: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
  },
  subButton: {
    padding: 10,
  },
  subTextButton: {
    fontSize: 15,
    color: '#8871f7',
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    margin: 10,
    fontSize: 16,
  },
});
