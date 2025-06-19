import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { useRouter } from "expo-router";

type UserChat = {
  userId: string;
  name: string;
};

export default function ChatUserList() {
  const [userChats, setUserChats] = useState<UserChat[]>([]);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "messages"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const userMap = new Map<string, string>(); // userId => name

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const userId = data.userId;

        if (userId && !userMap.has(userId)) {
          try {
            const userDoc = await getDoc(doc(db, "users", userId));
            const name = userDoc.exists()
              ? userDoc.data().nama || "User"
              : "User";
            userMap.set(userId, name);
          } catch (err) {
            console.error("Gagal ambil nama user:", err);
          }
        }
      }

      const userList: UserChat[] = Array.from(userMap.entries()).map(
        ([userId, name]) => ({
          userId,
          name,
        })
      );

      setUserChats(userList);
    });

    return unsubscribe;
  }, []);

  const renderItem = ({ item }: { item: UserChat }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/(admin)/ChatRoom", // sesuai nama file ChatRoom.tsx
          params: {
            userId: item.userId,
            userName: item.name,
          },
        })
      }
    >
      <View style={styles.avatarWrapper}>
        <Ionicons name="person-circle-outline" size={36} color="#666" />
      </View>
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Pengguna</Text>
      <FlatList
        data={userChats}
        renderItem={renderItem}
        keyExtractor={(item) => item.userId}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4" },
  title: { fontSize: 22, fontWeight: "bold", margin: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarWrapper: {
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
