import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();

  const menus = [
    {
      label: "Pengajuan Berobat",
      icon: "medkit-outline",
      to: "/PengajuanBerobat", // nanti kamu bikin halaman ini
    },
    {
      label: "List User",
      icon: "people-outline",
      to: "/ListUser", // nanti kamu bikin halaman ini
    },
    {
      label: "Chat User",
      icon: "chatbubbles-outline",
      to: "/ChatUserList", // sudah ada
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard Admin</Text>

      {menus.map((menu, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => router.push(menu.to)}
        >
          <Ionicons name={menu.icon as any} size={28} color="#00aa93" />
          <Text style={styles.label}>{menu.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#f0fdfa",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    marginLeft: 16,
    fontWeight: "500",
    color: "#333",
  },
});
