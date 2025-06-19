import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  image?: string;
  createdAt: any;
  userId: string;
}

type TokenPayload = {
  user_id: string;
};

export default function Teleconsultation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasReplied, setHasReplied] = useState(false); // 👉 auto-reply flag
  const [userId, setUserId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const fetchUserIdAndMessages = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const decoded: TokenPayload = jwtDecode(token);
      const id = decoded.user_id;
      setUserId(id);

      const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newMessages = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Message, 'id'>),
          }))
          .filter((msg) => msg.userId === id);

        setMessages(newMessages);

        // check jika admin sudah pernah balas
        const adminReplyExists = newMessages.some(
          (msg) => msg.sender === 'admin' && msg.text.includes('Admin akan membalas')
        );
        setHasReplied(adminReplyExists);
      });

      return unsubscribe;
    };

    fetchUserIdAndMessages();
  }, []);

  const sendMessage = async () => {
    if (inputText.trim() === '' || !userId) return;

    await addDoc(collection(db, 'messages'), {
      text: inputText,
      sender: 'user',
      userId,
      createdAt: Timestamp.now(),
    });

    setInputText('');

    // 👉 auto-reply hanya dikirim jika belum pernah
    if (!hasReplied) {
      setIsTyping(true);
      setTimeout(async () => {
        await addDoc(collection(db, 'messages'), {
          text: 'Admin akan membalas chat anda segera😉',
          sender: 'admin',
          userId,
          createdAt: Timestamp.now(),
        });
        setIsTyping(false);
        setHasReplied(true);
      }, 1500);
    }
  };

  const pickImage = async () => {
    if (!userId) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Izin akses galeri diperlukan.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      await addDoc(collection(db, 'messages'), {
        text: '',
        image: result.assets[0].uri,
        sender: 'user',
        userId,
        createdAt: Timestamp.now(),
      });
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.adminMessage,
        ]}
      >
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} />
        ) : (
          <Text style={styles.messageText}>{item.text}</Text>
        )}
      </View>
    );
  };

  if (!userId) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#00aa93" />
        <Text style={{ marginTop: 10 }}>Memuat data pengguna...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {isTyping && (
        <Text style={styles.typingIndicator}>Admin sedang mengetik...</Text>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Ionicons
            name="image-outline"
            size={24}
            color="gray"
            style={{ marginHorizontal: 6 }}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Tulis pesan..."
          value={inputText}
          onChangeText={setInputText}
        />

        <TouchableOpacity onPress={sendMessage}>
          <Ionicons
            name="send"
            size={24}
            color="#007bff"
            style={{ marginHorizontal: 6 }}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', paddingTop: 20 },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 20,
    fontSize: 16,
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 10,
    marginVertical: 4,
    borderRadius: 12,
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  adminMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  messageText: { fontSize: 15, color: '#333' },
  image: {
    width: 180,
    height: 180,
    borderRadius: 8,
  },
  typingIndicator: {
    marginHorizontal: 10,
    marginBottom: 4,
    fontStyle: 'italic',
    color: 'gray',
  },
});
