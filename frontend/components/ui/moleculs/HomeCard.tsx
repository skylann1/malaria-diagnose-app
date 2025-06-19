import React, { use } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";


export default function HomeCard({
  icon,
  label,
  color,
  linkedPage,
}: {
  icon: any;
  label: string;
  color: string;
  linkedPage: string;
}) {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.push(linkedPage as any)}
      style={{
        backgroundColor: "#f1f1f1",
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 12,
        alignItems: "center",
        width: "30%",
      }}
    >
      <Ionicons name={icon} size={35} color={color} />
      <Text
        style={{
          fontSize: 11,
          marginTop: 8,
          textAlign: "center",
          fontFamily: "inter-SemiBold",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
