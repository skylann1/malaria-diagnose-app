import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const faqs = [
  {
    question: "Apa itu prediksi malaria?",
    answer:
      "Prediksi malaria adalah fitur yang membantu memperkirakan kemungkinan seseorang terkena malaria berdasarkan gejala.",
  },
  {
    question: "Apakah hasilnya akurat?",
    answer:
      "Model ini dilatih menggunakan data nyata, namun hasilnya bukan diagnosis medis. Tetap konsultasi ke dokter.",
  },
  {
    question: "Bagaimana cara menggunakan fitur diagnosa?",
    answer:
      "Masuk ke menu Diagnosa, isi data yang diminta, lalu tekan tombol Prediksi.",
  },
];

export default function Bantuan() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
        Bantuan & FAQ
      </Text>

      {faqs.map((item, index) => (
        <View
          key={index}
          style={{
            backgroundColor: "#f2f2f2",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
            {item.question}
          </Text>
          <Text style={{ color: "#444" }}>{item.answer}</Text>
        </View>
      ))}

      <View
        style={{
          marginTop: 24,
          padding: 16,
          backgroundColor: "#e6f7f5",
          borderRadius: 12,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
          Hubungi Kami
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="mail-outline" size={20} color="#00aa93" />
          <Text style={{ marginLeft: 8 }}>support@malariacare.id</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
          <Ionicons name="call-outline" size={20} color="#00aa93" />
          <Text style={{ marginLeft: 8 }}>+62 812-3456-7890</Text>
        </View>
      </View>
    </ScrollView>
  );
}
