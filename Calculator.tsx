import React, { useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  ToastAndroid,
  FlatList,
  Dimensions,
  Modal,
  Pressable
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../src/styles/ThemeProvider';  // Importando o ThemeContext

const { width } = Dimensions.get('window');

const Calculator = () => {
  const { theme } = useContext(ThemeContext);  // Utilizando o contexto para pegar o tema
  const [input, setInput] = React.useState('');
  const [result, setResult] = React.useState('');
  const [history, setHistory] = React.useState([]);
  const [slideAnim] = React.useState(new Animated.Value(0));
  const [showHistory, setShowHistory] = React.useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('calcHistory');
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.log('Erro ao carregar o histórico:', error);
      }
    };
    loadHistory();
  }, []);

  const handleInput = (value) => {
    setInput((prevInput) => prevInput + value);
  };

  const clearInput = () => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setInput('');
      setResult('');
      slideAnim.setValue(0);
    });
  };

  const deleteLastInput = () => {
    setInput((prevInput) => prevInput.slice(0, -1));
  };

  const saveToHistory = async (calculation) => {
    try {
      const updatedHistory = [calculation, ...history];
      setHistory(updatedHistory);
      await AsyncStorage.setItem('calcHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.log('Erro ao salvar no histórico:', error);
    }
  };

  const calculateResult = () => {
    try {
      const sanitizedInput = input
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/√/g, 'Math.sqrt')
        .replace(/\^/g, '**');
      const evaluatedResult = eval(sanitizedInput);

      if (!isNaN(evaluatedResult)) {
        setResult(evaluatedResult.toString());
        saveToHistory(`${input} = ${evaluatedResult}`);
      } else {
        throw new Error('Invalid formula');
      }
    } catch (error) {
      ToastAndroid.showWithGravity(
        'A fórmula está errada',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
  };

  const handleLongPressDelete = () => {
    clearInput();
  };

  const isDarkTheme = theme === 'dark';  // Verificando o tema a partir do contexto

  const specialButtons = ['=', '+', '-', '*', '/'];

  const renderHistoryItem = ({ item }) => (
    <Pressable
      onPress={() => {
        setInput(item.split(' = ')[0]);
        setShowHistory(false);
      }}
      style={styles.historyItemContainer}
    >
      <Text style={[styles.historyItemText, { color: isDarkTheme ? '#1dbfb4' : '#5E17EB' }]}>
        {item}
      </Text>
    </Pressable>
  );

  const renderButton = (button) => {
    const scaleAnim = new Animated.Value(1);

    const onPressIn = () => {
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }).start();
    };

    const onPressOut = () => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }} key={button}>
        <Pressable
          style={[
            styles.button,
            specialButtons.includes(button) && [
              styles.specialButton,
              {
                backgroundColor: isDarkTheme ? '#1dbfb4' : '#5E17EB',
              },
            ],
            button === '0' && styles.buttonZero,
            button === '=' && styles.buttonEqual,
            { backgroundColor: isDarkTheme ? '#444' : '#eee' },
          ]}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={() =>
            button === 'C'
              ? clearInput()
              : button === 'Del'
              ? deleteLastInput()
              : button === '='
              ? calculateResult()
              : handleInput(button)
          }
          onLongPress={button === 'Del' ? handleLongPressDelete : null}
          delayPressIn={0}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>{button}</Text>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkTheme ? '#282c34' : '#f5f5f5' }]}>
      <Animated.View
        style={[
          styles.display,
          {
            backgroundColor: isDarkTheme ? '#000' : '#ffffff',
            transform: [{ translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 30]
            }) }],
            opacity: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0]
            }),
          },
        ]}
      >
        <Text style={[styles.displayText, { color: isDarkTheme ? '#1dbfb4' : '#5E17EB' }]}>
          {input || '0'}
        </Text>
        <Text style={[styles.resultText, { color: isDarkTheme ? '#1dbfb4' : '#5E17EB' }]}>
          {result}
        </Text>

        <View style={styles.historyIconContainer}>
          <Pressable onPress={() => setShowHistory(true)}>
            <Ionicons name="time-outline" size={32} color={isDarkTheme ? '#1dbfb4' : '#5E17EB'} />
          </Pressable>
        </View>
      </Animated.View>

      <Modal
        visible={showHistory}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.historyModal, { backgroundColor: isDarkTheme ? '#333' : '#ddd' }]}>
            <Text style={[styles.historyTitle, { color: isDarkTheme ? '#fff' : '#000' }]}>
              Histórico
            </Text>
            <FlatList
              data={history}
              renderItem={renderHistoryItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.historyList}
            />
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowHistory(false)}
            >
              <Ionicons name="close-circle" size={30} color={isDarkTheme ? '#fff' : '#000'} />
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={[styles.buttonContainer, { backgroundColor: isDarkTheme ? '#333' : '#ddd' }]}>
        {[
          ['C', 'Del', 'sin', 'cos', 'tan'],
          ['7', '8', '9', '/', '%'],
          ['4', '5', '6', '*', '√'],
          ['1', '2', '3', '-', '^'],
          ['0', '.', '+', '='],
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.buttonRow}>
            {row.map(renderButton)}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  display: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  displayText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 32,
    marginTop: 10,
    color: '#888',
  },
  historyIconContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20, // Posição do botão no canto inferior esquerdo
  },
  buttonContainer: {
    padding: 10,
    borderRadius: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  button: {
    width: width / 5 - 20,
    height: width / 5 - 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 2,
    elevation: 3,
  },
  specialButton: {
    backgroundColor: '#5E17EB',
  },
  buttonZero: {
    width: width / 2 - 40,
  },
  buttonEqual: {
    backgroundColor: '#1dbfb4',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  historyModal: {
    marginTop: '50%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  historyItemContainer: {
    padding: 15,
  },
  historyItemText: {
    fontSize: 18,
  },
  historyList: {
    paddingBottom: 50,
  },
  closeButton: {
    marginTop: 20,
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
});

export default Calculator;
