import HomeCard from "@/components/ui/moleculs/HomeCard";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  user_id: string;
  email: string;
  exp: number;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkToken() {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("/login");
          return;
        }

        const decoded: TokenPayload = jwtDecode(token);
        const userId = decoded.user_id;

        const res = await fetch(`http://192.168.163.187:5000/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data } = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error loading user data:", err);
      } finally {
        setLoading(false);
      }
    }

    checkToken();
  }, []);

  console.log('50', user);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#00aa93" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <View
        style={{
          backgroundColor: "#00aa93",
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Ionicons name="person-circle" size={48} color="#fff" />
          <View>
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontFamily: "inter-Bold",
              }}
            >
              Hi, {user?.nama || "Alan"}!
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 11,
                fontFamily: "inter-Medium",
              }}
            >
              How are you today?
            </Text>
          </View>
        </View>
        <Ionicons name="notifications-outline" size={24} color="#fff" />
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
        <HomeCard
          color="#f3c300"
          icon="folder-open"
          label="My Records"
          linkedPage="../(main)/Riwayat"
        />
        <HomeCard
          color="#00b1c9"
          icon="book"
          label="Log Book"
          linkedPage="../(main)/Riwayat"
        />
        <HomeCard
          color="#ea4d4d"
          icon="medkit"
          label="Smart Diagnosis"
          linkedPage="../(fitur)/(diagnose)/MalariaCheckBoxDiagnosis"
        />
      </View>

      {/* E-Malaria Services */}
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 16,
          marginTop: 30,
          marginBottom: 10,
        }}
      >
        E-Malaria Services
      </Text>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <ServiceBox
          label="Information & education"
          icon="school-outline"
          bgCardColor="#fddede"
          bgColor="#ea4d4d"
          linkedPage="../(information)/eLearning"
        />
        <ServiceBox
          label="Teleconsultation"
          icon="chatbubbles-outline"
          bgCardColor="#d8f2fc"
          bgColor="#51a5ea"
          linkedPage="../(fitur)/Teleconsultation"
        />
      </View>

      {/* Today's Activities */}
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 16,
          marginTop: 30,
          marginBottom: 10,
        }}
      >
        Today`s Activities
      </Text>

      <View
        style={{
          height: 120,
          backgroundColor: "#f1f1f1",
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="document-text-outline" size={40} color="#999" />
        <Text style={{ color: "#999", marginTop: 8 }}>
          Record your health activities today!
        </Text>
      </View>
    </ScrollView>
  );
}

function ServiceBox({
  label,
  icon,
  bgCardColor,
  bgColor,
  linkedPage,
}: {
  label: string;
  icon: any;
  bgColor: string;
  bgCardColor: string;
  linkedPage?: string;
}) {
  const router = useRouter();

  const handlePress = () => {
    if (linkedPage) {
      router.push(linkedPage as any);
    } else {
      console.warn("linkedPage tidak diberikan!");
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        flex: 1,
        backgroundColor: bgCardColor,
        borderRadius: 12,
        paddingVertical: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ padding: 12, borderRadius: 50, backgroundColor: bgColor }}>
        <Ionicons name={icon} size={32} color="#fff" />
      </View>
      <Text
        style={{ marginTop: 7, fontSize: 12, fontFamily: "inter-SemiBold" }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
