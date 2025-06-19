import { Text, View, Image, ActivityIndicator } from "react-native";

export default function Loading() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00aa93",
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: 150,
        }}
      >
        <View style={{ width: 75, height: 75 }}>
          <Image
            source={require("../../../assets/images/logo.png")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>
        <Text
          style={{
            fontSize: 11,
            fontFamily: "inter-Bold",
            opacity: 0.7,
            color: "#fff",
            width: 80,
          }}
        >
          MAHASISWA UNIVERSITAS BINA SARANA INFORMATIKA
        </Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontSize: 50,
            fontFamily: "oswald-Bold",
            marginBottom: 0,
            marginTop: 0,
            padding: 0,
            opacity: 0.75,
            color: "#fff",
            lineHeight: 50,
            letterSpacing: -1,
          }}
        >
          MalariaCare
        </Text>
        <Text
          style={{
            color: "#fff",
            fontSize: 14,
            marginTop: 5,
            padding: 0,
            lineHeight: 16,
            opacity: 0.7,
            fontFamily: "inter-Medium",
          }}
        >
          Pencegahan & Pengendalian Penyakit Malaria
        </Text>
      </View>

      {/* 🔽 Spinner di bawah layar, tidak menggeser isi */}
      <View
        style={{
          position: "absolute",
          bottom: 40,
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </View>
  );
}
