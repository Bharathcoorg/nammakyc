import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Namma KYC</Text>
      <Text style={styles.subtitle}>Open-source citizen-first reference implementation</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 30, fontWeight: "700" },
  subtitle: { marginTop: 12, textAlign: "center", fontSize: 16 }
});
