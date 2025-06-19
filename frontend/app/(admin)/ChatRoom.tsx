import React, { useState, useEffect, useRef } from 'react'
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
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from 'firebase/firestore'
import { db } from '../../lib/firebaseConfig'
import { RouteProp, useRoute } from '@react-navigation/native'

interface Message {
  id: string
  text: string
  sender: 'user' | 'admin'
  image?: string
  createdAt: any
  userId: string
}

type RootStackParamList = {
  ChatRoom: { userId: string; userName: string }
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const flatListRef = useRef<FlatList>(null)
  const route = useRoute<RouteProp<RootStackParamList, 'ChatRoom'>>()
  const { userId, userName } = route.params

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      where('userId', '==', userId),
      orderBy('createdAt', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Message, 'id'>
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate?.() || new Date(),
        }
      })

      setMessages(newMessages)

      // deteksi typing
      const userTyping = newMessages.some(
        (msg) => msg.sender === 'user' && msg.text === '...typing'
      )
      setIsTyping(userTyping)
    })

    return () => unsubscribe()
  }, [userId, inputText])

  const sendMessage = async () => {
    if (inputText.trim() === '') return

    await addDoc(collection(db, 'messages'), {
      text: inputText,
      sender: 'admin',
      userId,
      createdAt: Timestamp.now(),
    })

    setInputText('')
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      alert('Izin akses galeri diperlukan.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      await addDoc(collection(db, 'messages'), {
        text: '',
        image: result.assets[0].uri,
        sender: 'admin',
        userId,
        createdAt: Timestamp.now(),
      })
    }
  }

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user'
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
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.chatTitle}>Chat dengan {userName}</Text>

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
        <Text style={styles.typingIndicator}>User sedang mengetik...</Text>
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
          placeholder="Ketik pesan untuk user..."
          value={inputText}
          onChangeText={setInputText}
        />

        <TouchableOpacity onPress={sendMessage}>
          <Ionicons
            name="send"
            size={24}
            color="#28a745"
            style={{ marginHorizontal: 6 }}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', paddingTop: 20 },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
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
    alignSelf: 'flex-start',
  },
  adminMessage: {
    backgroundColor: '#d1ecf1',
    alignSelf: 'flex-end',
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
})
