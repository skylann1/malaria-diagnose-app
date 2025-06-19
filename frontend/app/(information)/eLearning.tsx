import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Data for all sections lengkap: Apa Itu, Penyebab, Faktor Risiko, Gejala, Jenis, Pengobatan, Pencegahan
const ARTICLES = [
  {
    id: "apa-itu",
    title: "Apa Itu Malaria?",
    image:
      "https://media.istockphoto.com/id/482803431/id/foto/gadis-afrika-memegang-tanda-dengan-malaria-kills-tertulis-di-atasnya.jpg?s=1024x1024&w=is&k=20&c=CPqnZq7ks5JRIHdvyiOrFOhvUAAzjWSkLOMnpDUhVEY=",
    date: "14 Januari 2025",
    author: "Tim Medis Siloam Hospitals",
    content: [
      "Malaria adalah infeksi akibat Plasmodium yang dibawa oleh nyamuk Anopheles betina. Malaria termasuk penyakit menular yang dapat ditularkan melalui gigitan nyamuk, tidak dari kontak fisik manusia ke manusia. Hingga kini, penyakit malaria masih menjadi ancaman di sejumlah daerah di Indonesia.",
      "Menurut data Kemenkes, pada tahun 2021 terdapat lebih dari 90 ribu kasus malaria. Meski begitu, angka tersebut telah mengalami penurunan secara signifikan dari tahun 2020 yang mencapai lebih dari 200 ribu kasus. Malaria adalah kondisi yang bisa disembuhkan dengan pengobatan yang tepat. Apabila tidak ditangani dengan baik, penyakit ini berisiko menyebabkan sejumlah komplikasi bahkan kematian.",
      "Malaria adalah penyakit infeksi menular yang dapat menyebar melalui gigitan nyamuk Anopheles betina. Hampir sama dengan gejala demam berdarah, malaria umumnya ditandai dengan demam dan menggigil selama beberapa hari. Penularan malaria terjadi ketika nyamuk Anopheles betina yang telah terinfeksi Plasmodium menggigit manusia.",
      "Plasmodium tersebut akan dilepaskan ke dalam aliran darah dan menyebabkan parasit berkembang di dalam hati, kemudian menyerang sel darah merah dan menimbulkan munculnya gejala klinis. Apabila tidak segera mendapat penanganan, malaria dapat menyebabkan komplikasi, seperti anemia dan hipoglikemia (gula darah rendah). Pada kondisi lebih serius, malaria bisa berkembang menjadi malaria serebral pemicu penyumbatan pembuluh darah otak dan perdarahan di area otak.",
    ],
  },
  {
    id: "penyebab",
    title: "Penyebab Malaria",
    image:
      "https://mysiloam-api.siloamhospitals.com/storage-down/file-web-cms/17326226599733793.webp",
    date: "14 Januari 2025",
    author: "Tim Medis Siloam Hospitals",
    content: [
      "Malaria disebabkan oleh infeksi parasit Plasmodium yang terbawa nyamuk Anopheles betina. Parasit akan masuk ke aliran darah dan berkembang biak dalam hati sebelum menyerang sel darah merah.",
      "Selain gigitan nyamuk, malaria juga dapat menular melalui penularan dari ibu kepada bayi saat melahirkan (malaria kongenital), transfusi darah, dan penggunaan jarum suntik secara bersama.",
      "Terdapat lima jenis spesies Plasmodium yang menginfeksi manusia: Plasmodium vivax (malaria tertiana, muncul setiap 3 hari, bisa menetap di hati hingga 3 tahun), Plasmodium malariae (quartana, muncul setiap 4 hari), Plasmodium ovale (mirip quartana, banyak di Afrika dan Pasifik Barat), Plasmodium falciparum (tropika, muncul setiap 48 jam, paling berbahaya), dan Plasmodium knowlesi (ditemukan di Asia Tenggara).",
    ],
  },
  {
    id: "faktor-risiko",
    title: "Faktor Risiko Malaria",
    image:
      "https://plus.unsplash.com/premium_photo-1661504995516-b37eb4f07f77?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "14 Januari 2025",
    author: "Tim Medis Siloam Hospitals",
    content: [
      "Anak di bawah 5 tahun memiliki risiko lebih tinggi mengalami malaria.",
      "Tinggal di lingkungan dengan iklim tropis, termasuk Indonesia.",
      "Minimnya fasilitas kesehatan yang menghambat penanganan cepat dapat memperburuk kondisi.",
    ],
  },
  {
    id: "gejala",
    title: "Gejala Malaria",
    image:
      "https://images.unsplash.com/photo-1626697556342-2310dbc55428?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "14 Januari 2025",
    author: "Tim Medis Siloam Hospitals",
    content: [
      "Demam tinggi yang berulang dengan interval 10 hari hingga 4 minggu setelah gigitan pertama, sering muncul dalam 7 hari.",
      "Menggigil hebat dan diikuti demam panas.",
      "Mual, muntah, dan diare.",
      "Nyeri kepala, nyeri otot, dan kelelahan.",
      "Berkeringat banyak dan nyeri perut.",
      "Kehilangan selera makan dan kesulitan bernapas.",
      "Detak jantung meningkat.",
    ],
  },
  {
    id: "jenis",
    title: "Jenis Malaria berdasarkan Tingkat Keparahan",
    image:
      "https://images.unsplash.com/photo-1585902740943-3493b01ae80e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "14 Januari 2025",
    author: "Tim Medis Siloam Hospitals",
    content: [
      "Malaria Biasa: Gejala utama bertahan 6–10 jam dan berulang setiap dua hari sekali tanpa komplikasi serius.",
      "Malaria Berat: Terjadi sekuestrasi yang menyumbat pembuluh darah otak, menyebabkan stroke, kejang, asidosis, anemia berat, penurunan kesadaran, dan anemia serebral.",
    ],
  },
  {
    id: "pengobatan",
    title: "Pengobatan Malaria",
    image:
      "https://images.unsplash.com/photo-1624031000106-79254a8faa19?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "14 Januari 2025",
    author: "Tim Medis Siloam Hospitals",
    content: [
      "Terapi kombinasi berbasis artemisinin (ACT) adalah pengobatan yang direkomendasikan oleh Kemenkes RI dan WHO, misalnya artemether-lumefantrine (Coartem) dan artesunate-mefloquine.",
      "Obat alternatif seperti meflokuin atau atovaquone-proguanil dapat digunakan jika diperlukan.",
      "Perawatan suportif dilakukan untuk menurunkan demam dan mencegah dehidrasi.",
    ],
  },
  {
    id: "pencegahan",
    title: "Pencegahan Malaria",
    image:
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "14 Januari 2025",
    author: "Tim Medis Siloam Hospitals",
    content: [
      "Membersihkan lingkungan dengan air mengalir dan rutin membersihkan peralatan rumah tangga.",
      "Menebarkan ikan pemakan jentik di penampungan air dan menutupnya saat tidak digunakan.",
      "Menggunakan obat antinyamuk dan kelambu saat tidur.",
      "Menghindari aktivitas dekat perairan pada malam hari.",
      "Konsultasi dengan Dokter Spesialis Penyakit Dalam di Siloam Hospitals untuk diagnosis akurat.",
    ],
  },
];

export default function ELearning() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Hero Header */}
        <ImageBackground
          source={{ uri: "https://images.unsplash.com/photo-1585421514738-01798e348b17?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}}
          style={styles.hero}
          imageStyle={styles.heroRadius}
        >
          <View style={styles.overlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Belajar Seputar Malaria</Text>
            <Text style={styles.heroSubtitle}>
              Kenali penyebab, gejala, dan pencegahannya
            </Text>
          </View>
        </ImageBackground>

        {/* Shortcut Cards */}
        <View style={styles.cardRow}>
          <ShortcutCard
            icon={<Ionicons name="bug-outline" size={24} color="#fff" />}
            label="Apa Itu"
          />
          <ShortcutCard
            icon={
              <MaterialCommunityIcons
                name="stethoscope"
                size={24}
                color="#fff"
              />
            }
            label="Penyebab"
          />
        </View>
        <View style={styles.cardRow}>
          <ShortcutCard
            icon={<Ionicons name="pulse-outline" size={24} color="#fff" />}
            label="Gejala"
          />
          <ShortcutCard
            icon={<Ionicons name="medkit-outline" size={24} color="#fff" />}
            label="Pengobatan"
          />
        </View>

        {/* Render All Sections */}
        {ARTICLES.map((article) => (
          <View style={styles.articleContainer} key={article.id}>
            <Image
              source={{ uri: article.image }}
              style={styles.articleBanner}
              resizeMode="cover"
            />
            <Text style={styles.articleTitle}>{article.title}</Text>
            <View style={styles.metaContainer}>
              <Text style={styles.metaText}>{article.author}</Text>
              <Text style={styles.metaText}>•</Text>
              <Text style={styles.metaText}>{article.date}</Text>
            </View>
            <View style={styles.divider} />
            {article.content.map((para, i) => (
              <Text key={i} style={styles.paragraph}>
                {para}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function ShortcutCard({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <TouchableOpacity style={styles.shortcutCard}>
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.cardLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f8" },
  scrollContainer: { paddingBottom: 20 },
  hero: { height: 200, justifyContent: "flex-end", padding: 20 },
  heroRadius: { borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroContent: { zIndex: 1 },
  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  heroSubtitle: { color: "#e0e0e0", fontSize: 14 },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 20,
  },
  shortcutCard: {
    flex: 1,
    backgroundColor: "#00796b",
    marginHorizontal: 6,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 3,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardLabel: { flex: 1, color: "#fff", fontSize: 14, fontWeight: "600" },
  articleContainer: { marginTop: 24, paddingHorizontal: 16 },
  articleBanner: {
    width: width - 32,
    height: (width - 32) * 0.5,
    borderRadius: 12,
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    lineHeight: 28,
  },
  metaContainer: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  metaText: { fontSize: 12, color: "#666", marginRight: 4 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 16 },
  paragraph: { fontSize: 14, color: "#333", lineHeight: 22, marginBottom: 12 },
});
