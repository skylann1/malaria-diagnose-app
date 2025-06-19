import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { View, ActivityIndicator } from "react-native";

type TokenPayload = {
  user_id: string;
  email: string;
  role: string;
  exp?: number;
};

export default function AdminLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminAuth() {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const decoded: TokenPayload = jwtDecode(token);
        console.log("Decoded Token:", decoded);

        // Validasi role (LEBIH DISARANKAN)
        if (decoded.user_id !== "admin001") {
          console.log("Bukan admin");
          router.replace("/(main)/Home");
          return;
        }

        // Atau validasi user_id kalau role belum tersedia
        // if (decoded.user_id !== "admin001") {
        //   router.replace("/(main)/Home");
        //   return;
        // }

      } catch (error) {
        console.error("Gagal decode token:", error);
        router.replace("/login");
        return;
      } finally {
        setLoading(false);
      }
    }

    checkAdminAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00aa93" />
      </View>
    );
  }

  return <Stack />;
}
