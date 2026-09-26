import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { apiRequest } from "../src/api/client";
import type { Household } from "../src/api/types";

export default function HomeScreen() {
  const [rationCardReference, setRationCardReference] = useState("");
  const [household, setHousehold] = useState<Household | null>(null);
  const [error, setError] = useState("");

  async function lookup() {
    setError("");
    setHousehold(null);

    try {
      const result = await apiRequest<Household>(
        `/v1/households/${encodeURIComponent(rationCardReference.trim())}`
      );
      setHousehold(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to retrieve household");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Namma KYC</Text>
      <Text style={styles.subtitle}>Karnataka ration-card e-KYC</Text>

      <TextInput
        value={rationCardReference}
        onChangeText={setRationCardReference}
        placeholder="Ration card number"
        autoCapitalize="characters"
        style={styles.input}
      />

      <Pressable onPress={lookup} disabled={!rationCardReference.trim()} style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {household ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Household members</Text>
          {household.members.map((member) => (
            <Text key={member.memberReference} style={styles.member}>
              {member.displayName}{member.kycRequired ? " • KYC required" : ""}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 30, fontWeight: "700" },
  subtitle: { marginTop: 8, fontSize: 16 },
  input: { marginTop: 28, borderWidth: 1, borderRadius: 10, padding: 14, fontSize: 16 },
  button: { marginTop: 14, padding: 15, borderRadius: 10, backgroundColor: "#1B5E20", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  error: { marginTop: 16, color: "#B00020" },
  card: { marginTop: 24, padding: 16, borderRadius: 12, borderWidth: 1 },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  member: { marginTop: 12, fontSize: 16 }
});
