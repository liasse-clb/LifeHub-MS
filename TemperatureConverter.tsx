import React, { useContext, useState } from "react";
import { View, Text, TextInput, StyleSheet, Modal, FlatList, Pressable } from "react-native";
import { LinearGradient } from 'expo-linear-gradient'; // Para gradientes de fundo
import { ThemeContext } from "../src/styles/ThemeProvider"; // Importação do tema

const TemperatureConverter = () => {
    const { theme } = useContext(ThemeContext); // Acesso ao tema
    const isDarkTheme = theme === 'dark'; // Verificação do tema

    const [temperature, setTemperature] = useState('');
    const [fromUnit, setFromUnit] = useState('C'); // Unidade de origem
    const [toUnit, setToUnit] = useState('F'); // Unidade de destino
    const [convertedTemp, setConvertedTemp] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isFromUnitSelection, setIsFromUnitSelection] = useState(true); // Controle para saber se é a seleção da unidade de origem ou destino

    const units = ['C', 'F', 'K']; // Unidades disponíveis

    const convertTemperature = (value, fromUnit, toUnit) => {
        if (fromUnit === toUnit) return value;

        if (fromUnit === 'C') {
            if (toUnit === 'F') return (value * 9 / 5) + 32;
            if (toUnit === 'K') return value + 273.15;
        }

        if (fromUnit === 'F') {
            if (toUnit === 'C') return (value - 32) * 5 / 9;
            if (toUnit === 'K') return ((value - 32) * 5 / 9) + 273.15;
        }

        if (fromUnit === 'K') {
            if (toUnit === 'C') return value - 273.15;
            if (toUnit === 'F') return ((value - 273.15) * 9 / 5) + 32;
        }

        return value;
    };

    const handleConversion = () => {
        if (!temperature) return;
        const result = convertTemperature(parseFloat(temperature), fromUnit, toUnit);
        setConvertedTemp(result);
    };

    return (
        <LinearGradient
            colors={isDarkTheme ? ['#0f0f0f', '#1c1c1e'] : ['#e0e0e0', '#f5f5f5']}
            style={styles.container}
        >
            <Text style={[styles.title, { color: isDarkTheme ? '#ffffff' : '#333333' }]}>Temperature Converter</Text>

            <TextInput
                style={[styles.textInput, { borderColor: isDarkTheme ? '#ffffff' : '#333333', color: isDarkTheme ? '#ffffff' : '#333333' }]}
                value={temperature}
                onChangeText={(text) => setTemperature(text)}
                keyboardType="numeric"
                placeholder="Enter temperature"
                placeholderTextColor={isDarkTheme ? '#777' : '#aaa'}
            />

            <View style={styles.buttonContainer}>
                <Pressable
                    style={[styles.selectButton, { backgroundColor: isDarkTheme ? '#444' : '#007AFF' }]}
                    onPress={() => {
                        setIsFromUnitSelection(true);
                        setModalVisible(true);
                    }}
                >
                    <Text style={styles.buttonText}>{`From Unit: ${fromUnit}`}</Text>
                </Pressable>
                <Pressable
                    style={[styles.selectButton, { backgroundColor: isDarkTheme ? '#444' : '#007AFF' }]}
                    onPress={() => {
                        setIsFromUnitSelection(false);
                        setModalVisible(true);
                    }}
                >
                    <Text style={styles.buttonText}>{`To Unit: ${toUnit}`}</Text>
                </Pressable>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: isDarkTheme ? '#333' : '#fff' }]}>
                        <Text style={[styles.modalTitle, { color: isDarkTheme ? '#fff' : '#000' }]}>Select Temperature Unit</Text>
                        <FlatList
                            data={units}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={[styles.unitButton, { backgroundColor: isDarkTheme ? '#444' : '#ddd' }]}
                                    onPress={() => {
                                        if (isFromUnitSelection) {
                                            setFromUnit(item);
                                        } else {
                                            setToUnit(item);
                                        }
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={[styles.unitText, { color: isDarkTheme ? '#fff' : '#000' }]}>{item}</Text>
                                </Pressable>
                            )}
                        />
                        <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Pressable style={[styles.convertButton, { backgroundColor: isDarkTheme ? '#777' : '#007AFF' }]} onPress={handleConversion}>
                <Text style={styles.buttonText}>Convert</Text>
            </Pressable>

            {convertedTemp !== null && (
                <Text style={[styles.result, { color: isDarkTheme ? '#ffffff' : '#333333' }]}>
                    Converted Temperature: {convertedTemp.toFixed(2)} {toUnit}
                </Text>
            )}

            <Pressable style={[styles.resetButton, { backgroundColor: isDarkTheme ? '#777' : '#FF3B30' }]} onPress={() => setTemperature('')}>
                <Text style={styles.buttonText}>Reset</Text>
            </Pressable>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    textInput: {
        height: 50,
        width: '80%',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 15,
        fontSize: 18,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 20,
    },
    selectButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    convertButton: {
        width: '80%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    resetButton: {
        width: '80%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    result: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: 300,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    unitButton: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    unitText: {
        fontSize: 18,
    },
    closeButton: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#FF3B30',
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TemperatureConverter;
