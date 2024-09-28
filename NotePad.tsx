import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';


const NotePad = () => {
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [showActions, setShowActions] = useState(null);
  const richText = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Desculpe, precisamos da permissão para acessar a galeria!');
      }

      const savedNotes = await loadNotes();
      if (savedNotes) {
        setNotes(savedNotes);
      }
    })();
  }, []);

  const addNote = async () => {
    if (noteTitle.trim() && noteContent.trim()) {
      const newNote = {
        id: Date.now().toString(),
        title: noteTitle,
        content: noteContent,
        date: new Date().toLocaleDateString(),
        image: imageUri,
      };
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      await saveNotes(updatedNotes);
      setNoteTitle('');
      setNoteContent('');
      setImageUri(null);
      setShowNoteEditor(false);
    }
  };

  const selectNote = (selectedNote) => {
    setEditingNote(selectedNote);
    setNoteTitle(selectedNote.title);
    setNoteContent(selectedNote.content);
    setImageUri(selectedNote.image);
    setShowNoteEditor(true);
  };

  const deleteNote = async (id) => {
    Alert.alert(
      "Confirmação de Exclusão",
      "Tem certeza que deseja excluir esta nota?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: async () => {
          const updatedNotes = notes.filter((note) => note.id !== id);
          setNotes(updatedNotes);
          await saveNotes(updatedNotes);
        }},
      ],
      { cancelable: true }
    );
  };

  const updateNote = async () => {
    if (editingNote) {
      const updatedNote = { ...editingNote, title: noteTitle, content: noteContent, image: imageUri };
      const updatedNotes = notes.map((note) => (note.id === editingNote.id ? updatedNote : note));
      setNotes(updatedNotes);
      await saveNotes(updatedNotes);
      setEditingNote(null);
      setNoteTitle('');
      setNoteContent('');
      setImageUri(null);
      setShowNoteEditor(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const imageUri = result.assets[0].uri;
      setImageUri(imageUri);
      saveImageUri(imageUri);
    }
  };

  const saveImageUri = async (uri) => {
    try {
      if (uri) {
        await AsyncStorage.setItem('savedImage', uri);
      }
    } catch (error) {
      console.error('Erro ao salvar imagem no AsyncStorage:', error);
    }
  };

  const handleCancel = () => {
    if (noteTitle.trim() || noteContent.trim()) {
      Alert.alert(
        "Cancelar Edição",
        "Tem certeza que deseja cancelar esta edição? Todas as alterações serão perdidas.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Confirmar", onPress: () => cancelEditing() },
        ],
        { cancelable: true }
      );
    } else {
      setShowNoteEditor(false);
    }
  };

  const cancelEditing = () => {
    setNoteTitle('');
    setNoteContent('');
    setImageUri(null);
    setShowNoteEditor(false);
  };

  const handleImagePress = () => {
    Alert.alert(
      "Imagem",
      "Deseja trocar ou excluir a imagem?",
      [
        { text: "Trocar", onPress: pickImage },
        { text: "Excluir", onPress: () => setImageUri(null) },
        { text: "Cancelar", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const saveNotes = async (notes) => {
    try {
      const jsonValue = JSON.stringify(notes);
      await AsyncStorage.setItem('notes', jsonValue);
    } catch (error) {
      console.error('Erro ao salvar notas no AsyncStorage:', error);
    }
  };

  const loadNotes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('notes');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Erro ao carregar notas do AsyncStorage:', error);
      return null;
    }
  };

  const renderNoteEditor = () => (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.noteEditor}>
          <TextInput
            style={styles.input}
            placeholder="Título da nota"
            value={noteTitle}
            onChangeText={setNoteTitle}
            multiline
          />
          {imageUri && (
            <TouchableOpacity onPress={handleImagePress}>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </TouchableOpacity>
          )}
          {!imageUri && (
            <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
              <MaterialCommunityIcons name="camera" size={30} color="#fff" />
              <Text style={styles.actionText}>Adicionar Imagem</Text>
            </TouchableOpacity>
          )}
          <RichToolbar
            style={styles.richToolbar}
            editor={richText}
            actions={[
              actions.alignCenter,
              actions.setBold,
              actions.insertOrderedList,
              actions.insertBulletsList,
              actions.setItalic,
              actions.setUnderline,
              actions.setSuperscript,
              actions.setSubscript,
              actions.removeFormat,
              actions.blockquote,
              actions.code,
              actions.undo,
              actions.redo,
              actions.indent,
              actions.outdent,
            ]}
            iconTint="#fff"
            selectedIconTint="#873ff4"
            selectedButtonStyle={{ backgroundColor: '#5cf2ff' }}
            iconSize={24}
          />
          <View style={styles.editorContainer}>
            <RichEditor
              ref={richText}
              style={styles.richEditor}
              placeholder="Arraste a barra de ferramentas para ver todas as ferramentas"
              initialContentHTML={noteContent}
              onChange={setNoteContent}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.editorActions}>
        <TouchableOpacity onPress={editingNote ? updateNote : addNote} style={styles.actionButton1}>
          <MaterialCommunityIcons name="content-save" size={30} color="#fff" />
          <Text style={styles.actionText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCancel} style={styles.actionButton2}>
          <MaterialCommunityIcons name="delete" size={30} color="#fff" />
          <Text style={styles.actionText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderActionsMenu = (note) => (
    <View style={styles.actionsMenu}>
      <TouchableOpacity onPress={() => selectNote(note)} style={styles.actionMenuItem}>
        <Text style={styles.actionText}><MaterialCommunityIcons name='pen'></MaterialCommunityIcons>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteNote(note.id)} style={styles.actionMenuItem}>
        <Text style={styles.actionText}><MaterialCommunityIcons name='delete'></MaterialCommunityIcons>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={() => setShowActions(null)}>
      <View style={styles.container}>
        {!showNoteEditor ? (
          <>
            <FlatList
              data={notes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => selectNote(item)} style={styles.noteItem}>
                  <Text style={styles.noteTitle}>{item.title}</Text>
                  <Text style={styles.noteDate}>{item.date}</Text>
                  <View style={styles.noteActions}>
                    <TouchableOpacity onPress={() => setShowActions(item.id)}>
                      <MaterialCommunityIcons name="dots-vertical" size={30} color="#fff" />
                    </TouchableOpacity>
                    {showActions === item.id && renderActionsMenu(item)}
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowNoteEditor(true)} style={styles.addButton}>
              <MaterialCommunityIcons name="plus" size={30} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          renderNoteEditor()
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 6,
    paddingBottom: 0,
    backgroundColor:'#181818',
  },
  textarea: {
    fontSize: 30,
  },
  input: {
    fontWeight: 'bold',
    marginTop: 22,
    height: 45,
    margin: 'auto',
    width: '96%',
    borderColor: '#5E17EB',
    borderWidth: 4,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderLeftWidth:0,
    borderRightWidth:0,
    borderTopWidth:0,
    fontSize: 20,
    padding: 4,
    color:'#777'
  },
  image: {
    width: '96%',
    height: 200,
    marginBottom: 10,
    alignSelf: 'center',
    borderRadius: 4,
  },
  imageButton: {
    margin: 'auto',
    width: '96%',
    backgroundColor: '#4CAF50',
    padding: 4,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  editorContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    paddingBottom: 80,
  },
  richEditor: {
    width: '98%',
    flex: 1,
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    minHeight: 200,
    zIndex: 1,
  },
  toolbarContainer: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  richToolbar: {
    margin: 'auto',
    shadowColor: 'black',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 13,
    borderRadius: 16,
    backgroundColor: '#2483ff',
    width: '96%',
    marginBottom: 10,
    justifyContent: 'space-between',
    height: 38,
  },
  noteItem: {
    zIndex:1,
    padding: 2,
    backgroundColor: '#333232',
    borderRadius: 8,
    marginBottom: 8,
    marginTop: 8,
    elevation: 6,
    width: '95%',
    margin: 'auto',
    borderLeftWidth: 8,
    borderLeftColor: '#1dbfb4',
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  noteContent: {
    color: '#333',
    fontSize: 20,
  },
  noteDate: {
    color: '#D3D3D3',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 12,
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 0,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3737',
    padding: 8,
    borderRadius: 10,
    bottom: 35,
    marginRight: 12,
  },
  addButton: {
    backgroundColor: '#1dbfb4',
    position: 'absolute',
    bottom: 40,
    right: 30,
    padding: 15,
    borderRadius: 30,
  },
  noteEditor: {
    flex: 1,
    justifyContent: 'center',
  },
  editorActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 70,
    zIndex: 2,
    position: 'absolute',
    bottom: 8,
    width: '50%',
    left: '25%',
  },
  actionButton1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 6,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButton2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3737',
    padding: 6,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginLeft: 30,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  actionsMenu: {
    position: 'absolute',
    right: 22,
    backgroundColor: '#7777',
    borderRadius: 10,
    padding: 8,
    elevation: 10,
    bottom:6 ,
  },
  actionMenuItem: {
    flexDirection:'column',   
  },
});

export default NotePad;