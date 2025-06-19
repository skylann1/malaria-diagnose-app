import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonPrimary from "@/components/ui/atoms/ButtonPrimary";
import InputText from "@/components/ui/atoms/InputText";
import Loading from "@/components/ui/templates/Loading";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  user_id: string;
  exp?: number;
}

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://192.168.163.187:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.status === "success" && result.token) {
        await AsyncStorage.setItem("token", result.token);

        const decoded: TokenPayload = jwtDecode(result.token);
        const userId = decoded.user_id;

        const userRes = await fetch(` http://192.168.163.187:5000/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${result.token}`,
          },
        });

        const { data: userData } = await userRes.json();

        if (userData.role === "admin") {
          router.replace("/Dashboard");
        } else {
          router.replace("/(main)/Home");
        }
      } else {
        setErrorMessage(result.message || "Login gagal, coba lagi.");
      }
    } catch (error) {
      setErrorMessage("Terjadi kesalahan pada server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", position: "relative" }}>
      {isLoading && <Loading />}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View style={{ width: 130, height: 130 }}>
            <Image
              source={require("../assets/images/logo-primary.png")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>

          <View style={{ marginTop: 20, marginBottom: 10 }}>
            <Text
              style={{
                fontFamily: "inter-ExtraBold",
                fontSize: 24,
                color: "#000",
                opacity: 0.8,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Hi! Selamat datang di aplikasi malariaCare
            </Text>
            <Text
              style={{
                fontFamily: "inter-Medium",
                fontSize: 12,
                color: "#000",
                opacity: 0.5,
                textAlign: "center",
              }}
            >
              Silahkan login untuk melanjutkan menggunakan aplikasi malariaCare
              ini, aplikasi membutuhkan tanda pengenal anda melalui email dan
              password
            </Text>
          </View>

          <View style={{ width: "100%", marginTop: 20, gap: 20 }}>
            <Controller
              control={control}
              name="email"
              rules={{ required: "Email atau No HP wajib diisi" }}
              render={({ field: { onChange, value } }) => (
                <InputText
                  placeholder="Email/No Handphone"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{ required: "Password wajib diisi" }}
              render={({ field: { onChange, value } }) => (
                <InputText
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                />
              )}
            />

            {errorMessage ? (
              <Text style={{ color: "#f87171", textAlign: "center" }}>
                {errorMessage}
              </Text>
            ) : null}

            <ButtonPrimary
              title="Masuk"
              backgroundColor="#00aa93"
              onPress={handleSubmit(onSubmit)}
            />
          </View>

          <View style={{ marginTop: 20, gap: 10 }}>
            <Text
              style={{
                fontFamily: "inter-Medium",
                opacity: 0.7,
                fontSize: 13,
                color: "#000",
                textAlign: "center",
              }}
            >
              Belum Punya akun?{" "}
              <Link
                href="/register"
                style={{
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                }}
              >
                Daftar
              </Link>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
