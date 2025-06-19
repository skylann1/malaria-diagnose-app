import { Text, TextInput, View, KeyboardTypeOptions } from "react-native";

export default function InputText({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  style,
  onBlur,
  error,
  keyboardType = "default",
  autoCapitalize = "sentences", 
}: {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  style?: object;
  onBlur?: () => void;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters"; 
}) {
  return (
    <View style={{ width: "100%", marginBottom: 16 }}>
      {label && (
        <Text style={{ marginBottom: 5, fontWeight: "600", color: "#333" }}>
          {label}
        </Text>
      )}
      <TextInput
        style={{
          width: "100%",
          height: 50,
          borderRadius: 10,
          backgroundColor: "#F5F5F5",
          paddingHorizontal: 20,
          borderColor: error ? "#f87171" : "rgba(0,0,0,0.1)",
          borderWidth: 1,
          ...style,
        }}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {error && (
        <Text style={{ color: "#f87171", marginTop: 5, marginLeft: 5 }}>
          {error}
        </Text>
      )}
    </View>
  );
}