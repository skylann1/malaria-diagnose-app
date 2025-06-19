import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import AvatarFemale from "../../assets/undraw/AvatarFemale.svg";
import AvatarMale from "../../assets/undraw/AvatarMale.svg";

interface TokenPayload {
  user_id: string;
  email: string;
  exp?: number;
}

interface UserData {
  id: string;
  nama: string;
  jk: string;
  tanggal_lahir: number;
  alamat: string;
  jenis_kelamin: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const decoded: TokenPayload = jwtDecode(token);
        const userId = decoded.user_id;

        const res = await fetch(`http://192.168.163.187:5000/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data } = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#00aa93" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Halo, {user?.nama || "User"}!</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 12 }}>
            <Ionicons name="log-out-outline" size={24} color="black" />
          </TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </View>
      </View>

      {/* Profil Pengguna */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          {user?.jenis_kelamin === "Laki-laki" ? (
            <AvatarMale width={60} height={60} fill="#00aa93" />
          ) : (
            <AvatarFemale width={60} height={60} fill="#00aa93" />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{user?.nama}</Text>
            <Text style={styles.cardSub}>
              Tgl Lahir: {user?.tanggal_lahir} - {user?.jk}
            </Text>
            <Text style={styles.cardSub}>{user?.alamat}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("../(fitur)/ProfilePengguna")}
        >
          <Text style={styles.buttonText}>Lihat Detail</Text>
        </TouchableOpacity>
      </View>

      {/* Diagnosis */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Ionicons name="medkit-outline" size={32} color="#007bff" />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Diagnosis Penyakit</Text>
            <Text style={styles.cardSub}>
              Jawab beberapa pertanyaan untuk mengevaluasi gejala malaria.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push("../(fitur)/(diagnose)/MalariaImageDiagnosis")
          }
        >
          <Text style={styles.buttonText}>Mulai Diagnosis</Text>
        </TouchableOpacity>
      </View>

      {/* Rujukan */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Ionicons name="business-outline" size={32} color="#007bff" />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Ajukan Rujukan ke RS Terdekat</Text>
            <Text style={styles.cardSub}>
              Kirim permintaan rujukan berdasarkan hasil diagnosis Anda.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("../register")}
        >
          <Text style={styles.buttonText}>Ajukan Rujukan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafa",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardContent: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 14,
    color: "gray",
  },
  button: {
    backgroundColor: "#00aa93",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
