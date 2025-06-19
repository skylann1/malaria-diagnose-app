import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AvatarFemale from "../../assets/undraw/AvatarFemale.svg";
import AvatarMale from "../../assets/undraw/AvatarMale.svg"; // Tambahkan ini

type TokenPayload = {
  user_id: string;
};

type User = {
  name: string;
  // tanggal_lahir: string;
  alamat: string;
  no_telp: string;
  jk: string; // Tambah jk
};

export default function ProfileDetail() {
  const [user, setUser] = useState<User>({
    name: "",
    // tanggal_lahir: "",
    alamat: "",
    no_telp: "",
    jk: "",
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingGet, setLoadingGet] = useState(true);
  const [loadingPut, setLoadingPut] = useState(false);

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
        setUserId(userId);

        const res = await fetch(`http://192.168.163.187:5000/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Gagal fetch user");

        const { data } = await res.json();
        console.log("Response:", data);
        setUser({
          name: data.nama || "",
          // tanggal_lahir: data.tanggal_lahir || "",
          alamat: data.alamat || "",
          no_telp: data.no_telp || "",
          jk: data.jk || "Laki-laki",
        });
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
        Alert.alert("Gagal mengambil data user");
      } finally {
        setLoadingGet(false);
      }
    }

    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      setLoadingPut(true);
      const token = await AsyncStorage.getItem("token");
      if (!token || !userId) return;

      const res = await fetch(`http://192.168.163.187:5000/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama: user.name,
          // tanggal_lahir: parseInt(user.tanggal_lahir),
          no_telp: user.no_telp,
          alamat: user.alamat,
          jk: user.jk,
        }),
      });

      if (!res.ok) throw new Error("Gagal update data");

      Alert.alert("Berhasil", "Profil berhasil diperbarui");
    } catch (error) {
      console.error("Gagal update profil:", error);
      Alert.alert("Gagal update profil");
    } finally {
      setLoadingPut(false);
    }
  };

  if (loadingGet) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#00aa93" />
        <Text style={{ marginTop: 10 }}>Memuat data pengguna...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Link href={"/(main)/Akun"}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Link>
        <Text style={styles.title}>Detail Profil</Text>
      </View>

      <View style={styles.avatarContainer}>
        {user.jk.toLowerCase() === "laki-laki" ? (
          <AvatarMale width={120} height={120} fill="#00aa93" />
        ) : (
          <AvatarFemale width={120} height={120} fill="#00aa93" />
        )}
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          style={styles.input}
          value={user.name}
          onChangeText={(text) => setUser((prev) => ({ ...prev, name: text }))}
        />

        {/* <Text style={styles.label}>Tanggal lahir</Text>
        <TextInput
          style={styles.input}
          value={user.tanggal_lahir}
          onChangeText={(text) =>
            setUser((prev) => ({ ...prev, tanggal_lahir: text }))
          }
          keyboardType="numeric"
        /> */}

        <Text style={styles.label}>Nomor Telepon</Text>
        <TextInput
          style={styles.input}
          value={user.no_telp}
          onChangeText={(text) =>
            setUser((prev) => ({ ...prev, no_telp: text }))
          }
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Domisili</Text>
        <TextInput
          style={styles.input}
          value={user.alamat}
          onChangeText={(text) =>
            setUser((prev) => ({ ...prev, alamat: text }))
          }
        />

        <TouchableOpacity
          style={[styles.button, loadingPut && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={loadingPut}
        >
          {loadingPut ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Simpan Perubahan</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafa",
    paddingHorizontal: 20,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  form: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#00aa93",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
