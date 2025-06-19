import React from "react";
import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const historyData = [
  {
    id: "1",
    category: "Prediksi",
    title: "Prediksi Malaria",
    date: "2025-05-18",
    result: "Negative",
  },
  {
    id: "2",
    category: "Konsultasi",
    title: "Konsultasi dengan dr. Fitri",
    date: "2025-05-17",
    status: "Selesai",
  },
  {
    id: "3",
    category: "Login",
    title: "Login dari Android",
    date: "2025-05-16 14:32",
  },
];

export default function Riwayat() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
        Riwayat
      </Text>

      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryCard item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

function HistoryCard({ item }: { item: any }) {
  let icon = "time-outline";
  let badgeText = "";
  let badgeColor = "#ccc";

  if (item.category === "Prediksi") {
    icon = "bug-outline";
    badgeText = item.result;
    badgeColor = item.result === "Positive" ? "#ff6b6b" : "#00aa93";
  } else if (item.category === "Konsultasi") {
    icon = "chatbubble-ellipses-outline";
    badgeText = item.status;
    badgeColor = "#007aff";
  } else if (item.category === "Login") {
    icon = "log-in-outline";
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8f8f8",
        padding: 16,
        borderRadius: 12,
      }}
    >
      <Ionicons
        name={icon as any}
        size={30}
        color="#666"
        style={{ marginRight: 16 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.title}</Text>
        <Text style={{ color: "#888", marginTop: 4 }}>{item.date}</Text>
      </View>
      {badgeText !== "" && (
        <View
          style={{
            backgroundColor: badgeColor,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
            {badgeText}
          </Text>
        </View>
      )}
    </View>
  );
}
