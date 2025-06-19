import React, { useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Controller, Control } from "react-hook-form";

type GenderInputProps = {
  control: Control<any>;
  errors: any;
  genderOptions: string[];
};

export default function GenderPicker({
  control,
  errors,
  genderOptions,
}: GenderInputProps) {
  const [isGenderPickerVisible, setGenderPickerVisible] = useState(false);

  return (
    <>
      <Text style={styles.label}>Jenis Kelamin</Text>
      <Controller
        control={control}
        name="gender"
        rules={{ required: "Jenis kelamin wajib diisi" }}
        render={({ field: { onChange, value } }) => {
          const displayValue = value || "Pilih jenis kelamin";

          return (
            <>
              <TouchableOpacity
                style={[
                  styles.customInput,
                  { borderColor: errors.gender ? "red" : "#E8E8E8" },
                ]}
                onPress={() => setGenderPickerVisible(true)}
              >
                <Text
                  style={[
                    styles.customInputText,
                    { color: value ? "#000" : "#C7C7CD" },
                  ]}
                >
                  {displayValue}
                </Text>
                <Text style={styles.inputArrow}>▼</Text>
              </TouchableOpacity>

              <Modal
                transparent={true}
                visible={isGenderPickerVisible}
                animationType="fade"
                onRequestClose={() => setGenderPickerVisible(false)}
              >
                <SafeAreaView
                  style={styles.modalBackdrop}
                  onTouchEnd={() => setGenderPickerVisible(false)}
                >
                  <Pressable style={styles.modalView}>
                    <Text style={styles.modalTitle}>Pilih Jenis Kelamin</Text>
                    {genderOptions.map((option) => (
                      <Pressable
                        key={option}
                        style={styles.optionButton}
                        onPress={() => {
                          onChange(option);
                          setGenderPickerVisible(false);
                        }}
                      >
                        <Text style={styles.optionText}>{option}</Text>
                      </Pressable>
                    ))}
                  </Pressable>
                </SafeAreaView>
              </Modal>
            </>
          );
        }}
      />
      {errors.gender && (
        <Text style={styles.errorText}>{errors.gender.message}</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
  },
  customInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customInputText: {
    fontSize: 14,
  },
  inputArrow: {
    fontSize: 14,
    color: "#888",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  optionButton: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 14,
  },
});
