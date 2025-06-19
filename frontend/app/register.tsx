import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  ScrollView,
  Pressable,
  StyleSheet, 
  Modal,
  TouchableOpacity, 
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ButtonPrimary from "@/components/ui/atoms/ButtonPrimary";
import InputText from "@/components/ui/atoms/InputText";
import Loading from "@/components/ui/templates/Loading";
import ToDoList from "../assets/undraw/ToDoList.svg";

// import { Picker } from "@react-native-picker/picker";

interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: string;
  birthday: string;
  gender: string;
  jk: string; 
}

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateDisplay, setSelectedDateDisplay] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isGenderPickerVisible, setGenderPickerVisible] = useState(false);
  const genderOptions = ["Laki-laki", "Wanita"];

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      address: "",
      birthday: "24-08-2005",
      gender: "", 
      jk: ""
    },
  });

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      const formattedDate = date.toISOString().split("T")[0];
      setSelectedDateDisplay(formattedDate);
      setValue("birthday", formattedDate, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (data.password !== data.confirmPassword) {
        setErrorMessage("Password dan Konfirmasi Password tidak cocok.");
        setIsLoading(false);
        return;
      }

      const payload = {
        nama: data.name,
        email: data.email,
        no_telp: data.phone,
        password: data.password,
        alamat: data.address,
        tanggal_lahir: data.birthday,
        jk: data.gender,
      };

      const API_REGISTER_URL = "http://192.168.163.187:5000/register";

      const response = await fetch(API_REGISTER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log(result);

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Registrasi gagal.");
      }

      router.push("/login");
    } catch (error: any) {
      setErrorMessage(error.message || "Terjadi kesalahan saat registrasi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {isLoading && <Loading />}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ width: 130, height: 130 }}>
            <ToDoList width={130} height={130} fill="#00aa93" />
          </View>

          <Text style={styles.title}>Daftar untuk melanjutkan</Text>
          <Text style={styles.subtitle}>
            Silahkan masukan data pribadi sesuai dengan yang tertera pada kartu
            tanda pengenal
          </Text>

          {errorMessage !== "" && (
            <Text style={styles.errorBanner}>{errorMessage}</Text>
          )}

          <View style={{ width: "100%", marginTop: 10 }}>
            {/* Nama */}
            <Controller
              control={control}
              name="name"
              rules={{ required: "Nama wajib diisi" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputText
                  label="Nama Lengkap"
                  placeholder="Masukan nama lengkap"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.name?.message}
                />
              )}
            />

            {/* Email */}
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email wajib diisi",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Format email tidak valid",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputText
                  label="Email"
                  placeholder="Masukan email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  error={errors.email?.message}
                />
              )}
            />

            {/* No Telp */}
            <Controller
              control={control}
              name="phone"
              rules={{
                required: "No telepon wajib diisi",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "No telepon hanya boleh angka",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputText
                  label="No Telepon"
                  placeholder="Masukan no telepon"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="phone-pad"
                  error={errors.phone?.message}
                />
              )}
            />

            {/* Address */}
            <Controller
              control={control}
              name="address"
              rules={{ required: "Alamat wajib diisi" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputText
                  label="Alamat"
                  placeholder="Masukan alamat"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.address?.message}
                />
              )}
            />
            
            {/* Birthday Input */}
            <Text style={styles.label}>Tanggal Lahir</Text>
            <Controller
              control={control}
              name="birthday"
              // rules={{ required: "Tanggal lahir wajib diisi" }}
              render={({ field: { value } }) => (
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={[
                    styles.customInput,
                    { borderColor: errors.birthday ? "red" : "#E8E8E8" },
                  ]}
                >
                  <Text
                    style={[
                      styles.customInputText,
                      { color: value ? "#000" : "#C7C7CD" },
                    ]}
                  >
                    {value || "Pilih tanggal lahir"}
                  </Text>
                </TouchableOpacity>
              )}
            />
            {errors.birthday && (
              <Text style={styles.errorText}>{errors.birthday.message}</Text>
            )}

            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )}

            {/* Gender Input */}
            <Text style={styles.label}>Jenis Kelamin</Text>
            <Controller
              control={control}
              name="gender"
              rules={{ required: "Jenis kelamin wajib diisi" }}
              render={({ field: { onChange, value } }) => (
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
                      {value || "Pilih jenis kelamin"}
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
                        <Text style={styles.modalTitle}>
                          Pilih Jenis Kelamin
                        </Text>
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
              )}
            />
            {errors.gender && (
              <Text style={styles.errorText}>{errors.gender.message}</Text>
            )}

            {/* Password */}
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password wajib diisi",
                minLength: {
                  value: 6,
                  message: "Password minimal 6 karakter",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputText
                  label="Password"
                  placeholder="Masukan password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                  error={errors.password?.message}
                />
              )}
            />

            {/* Confirm Password */}
            <Controller
              control={control}
              name="confirmPassword"
              rules={{ required: "Konfirmasi password wajib diisi" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <InputText
                  label="Konfirmasi Password"
                  placeholder="Masukan ulang password"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry
                  error={errors.confirmPassword?.message}
                />
              )}
            />

            <View style={{ marginTop: 16 }}>
              <ButtonPrimary
                title="Daftar"
                backgroundColor="#00aa93"
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>

          <Text style={styles.loginText}>
            Sudah punya akun?{" "}
            <Link href="/login" style={styles.loginLink}>
              Login
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// --- START PERUBAHAN: StyleSheet ---
const styles = StyleSheet.create({
  title: {
    fontFamily: "inter-ExtraBold",
    fontSize: 24,
    color: "#000",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "inter-Medium",
    fontSize: 12,
    color: "#000",
    opacity: 0.5,
    textAlign: "center",
    marginBottom: 10,
  },
  errorBanner: {
    backgroundColor: "#ffe6e6",
    color: "#cc0000",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: "100%",
    textAlign: "center",
  },
  label: {
    fontFamily: "inter-Medium",
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
    opacity: 0.8,
  },
  customInput: {
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 4,
    width: "100%",
  },
  customInputText: {
    fontFamily: "inter-Regular",
    fontSize: 14,
  },
  inputArrow: {
    fontSize: 10,
    color: "#888",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 16,
    fontFamily: "inter-Regular",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "inter-Bold",
    marginBottom: 10,
    marginTop: 10,
    color: "#333",
  },
  optionButton: {
    width: "100%",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  optionText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "inter-Medium",
    color: "#007AFF", // iOS blue
  },
  loginText: {
    fontFamily: "inter-Medium",
    opacity: 0.7,
    fontSize: 13,
    color: "#000",
    textAlign: "center",
    marginTop: 20,
  },
  loginLink: {
    fontFamily: "inter-Bold",
    textDecorationLine: "underline",
  },
});