import React, { useState, useRef } from "react";
import { View, StyleSheet, Text, TextInput, Pressable, Image, Animated } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { ScrollView } from "react-native";
import { RootStackParamList } from './navigationTypes';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../src/firebase.config";
import ErrorMessage from '../src/ErrorMessage';

export default function RecoverPassword() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [userMail, setUserMail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);


  function goBack() {
    console.log('goBack function called');
    navigation.goBack();
  }

  function recoverPass() {
    setError(null);
    if (userMail !== '') {
      sendPasswordResetEmail(auth, userMail)
        .then(() => {
          alert('Foi enviado um email para: ' + userMail + ' Verifique a caixa de email');
          navigation.navigate("Login");
        })
        .catch((error) => {
          setError('Parece que algo deu errado. Tente novamente');
        });
    } else {
      setError('Informe um email válido.');
    }
  }

  const animation = useRef(new Animated.Value(1)).current;

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
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={goBack}>
          <MaterialCommunityIcons name="arrow-left" size={30} color="black" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image source={require('../assets/images/iconinit.png')} />
        <Text style={styles.formTitle}>Redefinir Senha</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={userMail}
          onChangeText={setUserMail}
        />
        {error && <ErrorMessage message={error} />}
        <Animated.View style={[styles.animatedButton, animatedStyle]}>
          <Pressable
            style={styles.formButton}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={recoverPass}
          >
            <Text style={styles.textButton}>Enviar</Text>
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
  animatedButton: {
    width: '60%',
    alignItems: 'center',
    margin: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formTitle: {
    padding: 20,
    fontSize: 32,
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
  formButton: {
    backgroundColor: '#5E17EB',
    padding: 10,
    borderRadius: 10,
    width: '60%',
    alignItems: 'center',
    margin: 10,
  },
  textButton: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  }
});


