import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { MaterialIcons } from "@expo/vector-icons";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { CHARSETS, createPassword, getStrength, type OptionKey } from "@/lib/password-generator";

export default function HomeScreen() {
  const colors = useColors("dark");
  const [length, setLength] = useState(12);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<Record<OptionKey, boolean>>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const strength = useMemo(() => getStrength(password, options), [password, options]);

  const generate = () => {
    const nextPassword = createPassword(length, options);
    if (!nextPassword) return;
    setPassword(nextPassword);
    setCopied(false);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const copyPassword = async () => {
    if (!password) return;
    await Clipboard.setStringAsync(password);
    setCopied(true);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setCopied(false), 2200);
  };

  const toggleOption = (key: OptionKey) => {
    const activeCount = Object.values(options).filter(Boolean).length;
    if (options[key] && activeCount === 1) return;
    setOptions((current) => ({ ...current, [key]: !current[key] }));
    setCopied(false);
  };

  return (
    <ScreenContainer containerClassName="bg-[#0B1220]" safeAreaClassName="bg-[#0B1220]" className="px-5" edges={["top", "left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <MaterialIcons name="lock-outline" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.headerCopy}>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>MATHEUZ</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>Entropia</Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>Aleatoriedade de verdade, no seu bolso.</Text>
          </View>
        </View>

        <View style={[styles.passwordCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.cardTopRow}>
            <Text style={[styles.cardLabel, { color: colors.muted }]}>SUA SENHA</Text>
            <View style={[styles.strengthPill, { backgroundColor: `${strength.color}20` }]}>
              <View style={[styles.strengthDot, { backgroundColor: strength.color }]} />
              <Text style={[styles.strengthText, { color: strength.color }]}>{strength.label}</Text>
            </View>
          </View>
          <Text selectable style={[styles.password, { color: colors.foreground }]} numberOfLines={1} adjustsFontSizeToFit>
            {password || "Toque em gerar"}
          </Text>
          <View style={styles.strengthTrack}>
            <View style={[styles.strengthFill, { width: `${strength.percent}%`, backgroundColor: strength.color }]} />
          </View>
          <Pressable onPress={copyPassword} disabled={!password} style={({ pressed }) => [styles.copyButton, { borderColor: colors.border, opacity: pressed ? 0.72 : password ? 1 : 0.45 }]}>
            <MaterialIcons name={copied ? "check" : "content-copy"} size={18} color={colors.foreground} />
            <Text style={[styles.copyText, { color: colors.foreground }]}>{copied ? "Senha copiada" : "Copiar senha"}</Text>
          </Pressable>
        </View>





        <Pressable onPress={generate} style={({ pressed }) => [styles.generateButton, { backgroundColor: colors.primary, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
          <MaterialIcons name="refresh" size={22} color="#FFFFFF" />
          <Text style={styles.generateText}>{password ? "Gerar nova senha" : "Gerar senha"}</Text>
        </Pressable>

        <Text style={[styles.footerNote, { color: colors.muted }]}>Sua senha é criada localmente no dispositivo.</Text>





        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Personalize sua senha</Text>
          <Text style={[styles.sectionHint, { color: colors.muted }]}>Ajuste como preferir</Text>
        </View>

        <View style={[styles.lengthCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.lengthHeader}>
            <Text style={[styles.optionTitle, { color: colors.foreground }]}>Tamanho</Text>
            <Text style={[styles.lengthValue, { color: colors.primary }]}>{length} caracteres</Text>
          </View>
          <View style={styles.stepper}>
            <Pressable onPress={() => setLength((value) => Math.max(6, value - 1))} style={({ pressed }) => [styles.stepperButton, { backgroundColor: colors.surface, opacity: pressed ? 0.65 : 1 }]}>
              <MaterialIcons name="remove" size={20} color={colors.foreground} />
            </Pressable>
            <View style={[styles.lengthBar, { backgroundColor: colors.border }]}>
              <View style={[styles.lengthProgress, { backgroundColor: colors.primary, width: `${((length - 6) / 26) * 100}%` }]} />
            </View>
            <Pressable onPress={() => setLength((value) => Math.min(32, value + 1))} style={({ pressed }) => [styles.stepperButton, { backgroundColor: colors.surface, opacity: pressed ? 0.65 : 1 }]}>
              <MaterialIcons name="add" size={20} color={colors.foreground} />
            </Pressable>
          </View>
        </View>

        <View style={[styles.optionsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {(Object.keys(CHARSETS) as OptionKey[]).map((key) => {
            const labels: Record<OptionKey, string> = {
              uppercase: "Letras maiúsculas",
              lowercase: "Letras minúsculas",
              numbers: "Números",
              symbols: "Símbolos",
            };
            return (
              <View key={key} style={styles.optionRow}>
                <View style={styles.optionCopy}>
                  <Text style={[styles.optionTitle, { color: colors.foreground }]}>{labels[key]}</Text>
                  <Text style={[styles.optionSubtitle, { color: colors.muted }]}>{CHARSETS[key].slice(0, 12)}{CHARSETS[key].length > 12 ? "…" : ""}</Text>
                </View>
                <Switch value={options[key]} onValueChange={() => toggleOption(key)} trackColor={{ false: colors.border, true: `${colors.primary}99` }} thumbColor={options[key] ? colors.primary : "#CBD5E1"} />
              </View>
            );
          })}
        </View>

        
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 18, paddingBottom: 32, gap: 18 },
  header: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 4 },
  logo: { width: 52, height: 52, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  headerCopy: { flex: 1 },
  eyebrow: { fontSize: 10, fontWeight: "800", letterSpacing: 1.3, marginBottom: 3 },
  title: { fontSize: 25, lineHeight: 30, fontWeight: "800", letterSpacing: -0.5 },
  subtitle: { fontSize: 13, lineHeight: 19, marginTop: 3 },
  passwordCard: { borderRadius: 24, borderWidth: 1, padding: 20, gap: 14 },
  cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1.1 },
  strengthPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, flexDirection: "row", alignItems: "center", gap: 6 },
  strengthDot: { width: 7, height: 7, borderRadius: 4 },
  strengthText: { fontSize: 11, fontWeight: "700" },
  password: { fontFamily: "monospace", fontSize: 24, fontWeight: "700", letterSpacing: 0.6, minHeight: 34 },
  strengthTrack: { height: 5, borderRadius: 99, backgroundColor: "#334155", overflow: "hidden" },
  strengthFill: { height: "100%", borderRadius: 99 },
  copyButton: { borderWidth: 1, borderRadius: 14, minHeight: 44, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  copyText: { fontSize: 14, fontWeight: "700" },
  sectionHeader: { marginTop: 4, gap: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "800" },
  sectionHint: { fontSize: 13 },
  lengthCard: { borderRadius: 20, borderWidth: 1, padding: 17, gap: 16 },
  lengthHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  optionTitle: { fontSize: 15, fontWeight: "700" },
  lengthValue: { fontSize: 13, fontWeight: "800" },
  stepper: { flexDirection: "row", alignItems: "center", gap: 12 },
  stepperButton: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  lengthBar: { flex: 1, height: 7, borderRadius: 99, overflow: "hidden" },
  lengthProgress: { height: "100%", borderRadius: 99 },
  optionsCard: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 17 },
  optionRow: { minHeight: 62, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#263653" },
  optionCopy: { gap: 3 },
  optionSubtitle: { fontFamily: "monospace", fontSize: 11 },
  generateButton: { minHeight: 54, borderRadius: 17, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 9, shadowColor: "#6D5EF7", shadowOpacity: 0.28, shadowRadius: 14, shadowOffset: { width: 0, height: 7 }, elevation: 5 },
  generateText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  footerNote: { textAlign: "center", fontSize: 11, marginTop: -3 },
});
