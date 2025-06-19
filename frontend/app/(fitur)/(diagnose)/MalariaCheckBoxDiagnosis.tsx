import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router"; // ⬅️ pakai router
import Doctor from "@/assets/undraw/Doctor.svg";

const symptoms = [
  "Demam tinggi",
  "Menggigil",
  "Sakit kepala",
  "Mual dan muntah",
  "Kelelahan ekstrim",
  "Nyeri otot",
  "Keringat berlebih",
];

export default function MalariaCheckboxDiagnosis() {
  const [checkedSymptoms, setCheckedSymptoms] = useState<string[]>([]);
  const router = useRouter(); // ⬅️ init router

  const toggleSymptom = (symptom: string) => {
    if (checkedSymptoms.includes(symptom)) {
      setCheckedSymptoms(checkedSymptoms.filter((s) => s !== symptom));
    } else {
      setCheckedSymptoms([...checkedSymptoms, symptom]);
    }
  };

  const handleDiagnosis = () => {
    const result =
      checkedSymptoms.length >= 3
        ? {
          status: "Kemungkinan Besar",
          message: "Kemungkinan besar Anda mengalami malaria. Segera lakukan pemeriksaan lebih lanjut."
        }
        : {
          status: "Kemungkinan Kecil",
          message: "Kemungkinan kecil Anda mengalami malaria. Tetap waspada dan lakukan pemeriksaan lebih lanjut."
        };

    // ⬅️ navigasi ke halaman result dengan query param
    router.push({
      pathname: "/ResultCheckBoxDiagnosis",
      params: { result: JSON.stringify(result) },
    });
  };

  return (
    <View style={styles.container}>
      <Link href={"/(main)/Home"}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Link>
      <ScrollView style={{ marginVertical: 20, paddingHorizontal: 20 }}>
        <View>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "inter-SemiBold",
                fontSize: 26,
                color: "#010101",
              }}
            >
              Diagnosis Malaria
            </Text>
            <Doctor width={180} height={180} fill="#00aa93" />
            <Text
              style={{
                fontFamily: "inter-SemiBold",
                fontSize: 16,
                color: "#010101",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              Apakah anda mengalami gejala berikut?
            </Text>
          </View>
          {symptoms.map((symptom, idx) => {
            const isChecked = checkedSymptoms.includes(symptom);
            return (
              <TouchableOpacity
                key={idx}
                style={styles.checkboxContainer}
                onPress={() => toggleSymptom(symptom)}
              >
                <View style={[styles.checkbox, isChecked && styles.checked]}>
                  {isChecked && (
                    <Ionicons name="checkmark" size={20} color="white" />
                  )}
                </View>
                <Text style={styles.label}>{symptom}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleDiagnosis}>
        <Text style={styles.buttonText}>Diagnosa Sekarang</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderColor: "#00aa93",
    marginRight: 12,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#00aa93",
  },
  label: { fontSize: 16 },
  button: {
    backgroundColor: "#00aa93",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
