import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MedicalCare from "../../../assets/undraw/MedicalCare.svg";

const { width, height } = Dimensions.get("window");
const slideWidth = width * 0.9;
const slideMargin = (width - slideWidth) / 2;

const carouselItems = [
  {
    title: "Apa itu Malaria?",
    desc: "Malaria adalah penyakit yang disebabkan oleh parasit dan ditularkan melalui gigitan nyamuk Anopheles betina.",
    image:
      "https://images.unsplash.com/photo-1486825586573-7131f7991bdd?q=80&w=1974&auto=format&fit=crop",
  },
  {
    title: "Gejala Awal",
    desc: "Demam, menggigil, mual, muntah, dan sakit kepala adalah beberapa gejala awal malaria.",
    image:
      "https://images.unsplash.com/photo-1659353887804-fc7f9313021a?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Pentingnya Deteksi Dini",
    desc: "Deteksi dini malaria membantu pengobatan lebih cepat dan mengurangi risiko komplikasi.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function MalariaPredictor() {
  const [image, setImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [carouselFinished, setCarouselFinished] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / slideWidth
    );
    setActiveSlide(slideIndex);
  };

  const pickImage = async () => {
    console.log("picking image...");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 ?? null);
      setResult(null);
    }

    console.log("Image picked:", result);
  };

  const predictImage = async () => {
    if (!imageBase64) return;
    setLoading(true);

    try {
      const res = await fetch("http://192.168.163.187:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageBase64,
          
        }),
      });

      const data = await res.json();
      console.log(data);
      setResult(data);
    } catch (err) {
      alert("Prediction failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setImageBase64(null);
    setResult(null);
  };

  return (
    <View style={styles.container}>
      {!carouselFinished ? (
        <>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingHorizontal: slideMargin }}
            style={{ flexGrow: 0 }}
          >
            {carouselItems.map((item, index) => (
              <ImageBackground
                key={index}
                source={{ uri: item.image }}
                style={styles.slide}
                imageStyle={{ borderRadius: 20 }}
              >
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.8)"]}
                  style={styles.gradientOverlay}
                >
                  <View style={styles.textContainer}>
                    <Text style={styles.slideTitle}>{item.title}</Text>
                    <Text style={styles.slideDesc}>{item.desc}</Text>
                  </View>
                </LinearGradient>
              </ImageBackground>
            ))}
          </ScrollView>

          <View style={styles.indicatorContainer}>
            {carouselItems.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.indicator,
                  activeSlide === i && styles.activeIndicator,
                ]}
              />
            ))}
          </View>

          <View style={styles.bottomButtonWrapper}>
            <TouchableOpacity
              onPress={() => {
                if (activeSlide === carouselItems.length - 1) {
                  setCarouselFinished(true);
                }
              }}
              style={[
                styles.doneButton,
                activeSlide !== carouselItems.length - 1 &&
                  styles.disabledButton,
              ]}
              disabled={activeSlide !== carouselItems.length - 1}
            >
              <View style={styles.gradientButton}>
                <Text style={styles.buttonText}>Mulai Sekarang</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>🧪 Malaria Cell Predictor</Text>

          {!result && (
            <>
              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>Pilih Gambar</Text>
              </TouchableOpacity>

              {image && (
                <Image
                  source={{ uri: image }}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}

              {image && (
                <TouchableOpacity
                  style={styles.predictBtn}
                  onPress={predictImage}
                >
                  <Text style={styles.buttonText}>Prediksi Gambar</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {loading && (
            <ActivityIndicator
              size="large"
              color="#4c6ef5"
              style={{ marginTop: 20 }}
            />
          )}

          {result && (
            <>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <MedicalCare width={300} height={300} fill="#00aa93" />
              </View>
              <View style={styles.resultBox}>
                <Text style={styles.resultText}>
                  Status:{" "}
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: result.predicted_label === 1 ? "red" : "green",
                    }}
                  >
                    {result.predicted_label === 1 ? "Infected" : "Uninfected"}
                  </Text>
                </Text>
                <Text style={styles.resultText}>
                  Probability: {(result.probability * 100).toFixed(2)}%
                </Text>
                <Text style={styles.resultText}>
                  Time: {result.elapsed_time}s
                </Text>

                {result.predicted_label === 1 && (
                  <Text style={styles.warningText}>
                    ⚠️ Segera ajukan pengobatan ke rumah sakit untuk penanganan
                    lebih lanjut.
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={[styles.predictBtn, { backgroundColor: "#4c6ef5" }]}
                onPress={handleReset}
              >
                <Text style={styles.buttonText}>Selesai</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "flex-end",
  },
  slide: {
    width: slideWidth,
    height: height - 150,
    marginRight: 39,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 24,
  },
  textContainer: {
    paddingBottom: 30,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  slideDesc: {
    fontSize: 16,
    color: "#f1f1f1",
    lineHeight: 22,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: "#bbb",
    marginHorizontal: 6,
  },
  activeIndicator: {
    backgroundColor: "#4c6ef5",
  },
  bottomButtonWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  doneButton: {
    borderRadius: 40,
    overflow: "hidden",
  },
  disabledButton: {
    opacity: 0.3,
  },
  gradientButton: {
    backgroundColor: "#4c6ef5",
    paddingVertical: 16,
    borderRadius: 40,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
    textTransform: "uppercase",
    textAlign: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4c6ef5",
    borderRadius: 12,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  predictBtn: {
    backgroundColor: "#15aabf",
    borderRadius: 12,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginTop: 12,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginHorizontal: "auto",
    borderRadius: 20,
    alignSelf: "center",
  },
  resultBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 10,
  },
  warningText: {
    marginTop: 10,
    color: "red",
    fontWeight: "bold",
  },
});
