import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Confirm from "@/assets/undraw/Confirm.svg";

export default function ResultCheckBoxDiagnosis() {
  const { result } = useLocalSearchParams<{ result: string }>();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Confirm width={180} height={180} fill="#00aa93" />
        <Text
          style={{
            fontSize: 28,
            fontFamily: "inter-SemiBold",
            marginTop: 10,
            color: "#171717",
          }}
        >
          Hasil Diagnosis
        </Text>
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "inter-SemiBold",
              color: "#171717",
            }}
          >
            {JSON.parse(result).status}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "inter-Medium",
              color: "#171717",
              textAlign: "center",
              marginTop: 4,
            }}
          >
            {JSON.parse(result).message}
          </Text>
        </View>
      </View>

      <Link
        href="/(main)/Home"
        style={{
          position: "absolute",
          bottom: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#00aa93",
          color: "#fff",
          paddingVertical: 10,
          width: "100%",
          borderRadius: 6,
          textAlign: "center",
          fontSize: 18,
          fontFamily: "inter-SemiBold",
        }}
      >
        Selesai
      </Link>
    </View>
  );
}
