//Register screen
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Image, Animated } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../src/firebase.config';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from './navigationTypes';
import ErrorMessage from '../src/ErrorMessage';

export default function RegisterScreen() {
  const [userMail, setUserMail] = useState('');
  const [userPass, setUserPass] = useState('');
  const [userRePass, setUserRePass] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const animation = useRef(new Animated.Value(1)).current;

  function NewUser() {
    setErrorMessage('');
    if (userMail === '' || userPass === '' || userRePass === '') {
      setErrorMessage('Preencha todos os campos corretamente');
      return;
    }
    if (userPass.length < 6) {
      setErrorMessage('A senha deve conter no mínimo 6 dígitos');
      return;
    }
    if (userPass !== userRePass) {
      setErrorMessage('A senha está diferente da senha repetida');
      return;
    } else {
      createUserWithEmailAndPassword(auth, userMail, userPass)
        .then((userCredential) => {
          const user = userCredential.user;
          sendEmailVerification(user)
            .then(() => {
              alert(`Recebemos o seu email ${userMail}. Verifique sua caixa de entrada para ativar sua conta.`);
              navigation.navigate('Login');
            })
            .catch((error) => {
              setErrorMessage('Não foi possível enviar o e-mail de verificação. Tente novamente.');
            });
        })
        .catch((error) => {
          setErrorMessage('Verifique se o email é válido ou se as senhas estão corretas');
        });
    }
  }
  

  function goBack() {
    navigation.navigate('Login');
  }

  const handlePressIn = () => {
    Animated.spring(animation, {
      toValue: 0.80,
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

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={goBack}>
        <MaterialCommunityIcons name="arrow-left" size={30} color="black" />
      </Pressable>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image source={require('../assets/images/iconinit.png')} />
        <Text style={styles.formTitle}>Cadastre-se</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Email"
          inputMode="email"
          autoCapitalize="none"
          autoComplete="email"
          value={userMail}
          onChangeText={setUserMail}
        />
        <TextInput
          style={styles.formInput}
          placeholder="Criar senha"
          autoCapitalize="none"
          secureTextEntry
          value={userPass}
          onChangeText={setUserPass}
        />
        <TextInput
          style={styles.formInput}
          placeholder="Repetir senha"
          autoCapitalize="none"
          secureTextEntry
          value={userRePass}
          onChangeText={setUserRePass}
        />
        {errorMessage ? (
          <ErrorMessage message={errorMessage} />
        ) : null}
        <Animated.View style={[styles.animatedButton, animatedStyle]}>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={NewUser}
            style={styles.formButton}
          >
            <Text style={styles.textButton}>Cadastrar</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  backButton: {
    padding: 10,
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
  animatedButton: {
    width: '60%',
    alignItems: 'center',
    margin: 10,
  },
  formButton: {
    backgroundColor: '#5E17EB',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  textButton: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
