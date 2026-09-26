import { useMemo, useState } from "react";
import * as Crypto from "expo-crypto";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { apiRequest, getKycStatus } from "../src/api/client";
import type { Household, KycResponse } from "../src/api/types";
import { getStrings } from "../src/i18n";
import type { Language } from "../src/i18n/translations";
import { theme } from "../src/theme";

type Step = "language" | "welcome" | "ration" | "member" | "consent" | "auth" | "processing" | "success";
const stepNumber: Record<string, number> = { ration: 1, member: 2, consent: 3 };

export default function HomeScreen() {
  const [language, setLanguage] = useState<Language>("en");
  const [step, setStep] = useState<Step>("language");
  const [rationCard, setRationCard] = useState("");
  const [household, setHousehold] = useState<Household | null>(null);
  const [selected, setSelected] = useState("");
  const [consented, setConsented] = useState(false);
  const [consentReference, setConsentReference] = useState("");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const s = useMemo(() => getStrings(language), [language]);

  async function lookup() {
    setError(""); setLoading(true);
    try {
      const h = await apiRequest<Household>("/v1/households/" + encodeURIComponent(rationCard.trim()));
      setHousehold(h); setStep("member");
    } catch { setError(s.error); } finally { setLoading(false); }
  }

  async function start() {
    if (!consented || !household || !selected) return;
    setError(""); setConsentReference(Crypto.randomUUID()); setStep("auth");
  }

  async function authenticate() {
    if (!household || !selected || !consentReference) return;
    setError(""); setLoading(true); setStep("processing");
    try {
      const response = await apiRequest<KycResponse>("/v1/kyc", {
        method: "POST",
        headers: { "Idempotency-Key": Crypto.randomUUID() },
        body: JSON.stringify({ householdReference: household.householdReference, memberReference: selected, consentReference, consentPolicyVersion: "2026-09", consentLanguage: language }),
      });
      let status = response;
      for (let attempt = 0; attempt < 20; attempt++) {
        if (status.status === "success") break;
        if (status.status === "failed") throw new Error(s.error);
        await new Promise(resolve => setTimeout(resolve, 750));
        status = await getKycStatus<KycResponse>(response.requestId);
      }
      if (status.status !== "success") throw new Error(s.processingError);
      setReference(status.reference ?? status.requestId); setStep("success");
    } catch { setStep("auth"); setError(s.error); } finally { setLoading(false); }
  }

  const current = stepNumber[step] ?? 1;
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
    <Header s={s} />
    {step !== "language" && step !== "welcome" && step !== "success" && step !== "processing" && <Progress s={s} current={current} />}

    {step === "language" && <Card>
      <Badge text={s.trust} /><Text style={styles.eyebrow}>{s.appName}</Text>
      <Text style={styles.heading}>{s.chooseLanguage}</Text><Text style={styles.muted}>{s.languageHint}</Text>
      <LanguageButton label={s.english} selected={language === "en"} onPress={() => setLanguage("en")} />
      <LanguageButton label={s.kannada} selected={language === "kn"} onPress={() => setLanguage("kn")} />
      <Primary label={s.continue} onPress={() => setStep("welcome")} />
    </Card>}

    {step === "welcome" && <Card>
      <View style={styles.heroIcon}><Text style={styles.heroIconText}>✓</Text></View>
      <Text style={styles.heading}>{s.welcomeTitle}</Text><Text style={styles.muted}>{s.welcomeText}</Text>
      <InfoCard title={s.secureTitle} text={s.secureText} /><Primary label={s.continue} onPress={() => setStep("ration")} />
    </Card>}

    {step === "ration" && <Card>
      <StepLabel s={s} current={1}/><Text style={styles.heading}>{s.rationCard}</Text><Text style={styles.muted}>{s.rationCardHint}</Text>
      <TextInput accessibilityLabel={s.rationCard} accessibilityHint={s.rationCardHint} value={rationCard} onChangeText={setRationCard} autoCapitalize="characters" placeholder={s.rationCard} placeholderTextColor={theme.colors.muted} style={styles.input} />
      <Primary label={loading ? s.processing : s.findHousehold} onPress={lookup} disabled={!rationCard.trim() || loading} />
    </Card>}

    {step === "member" && household && <Card>
      <StepLabel s={s} current={2}/><Text style={styles.heading}>{s.household}</Text><Text style={styles.muted}>{s.selectMember}</Text>
      {household.members.map(m => <Pressable key={m.memberReference} onPress={() => {setSelected(m.memberReference);setStep("consent");}} style={({pressed}) => [styles.member, pressed && styles.pressed]}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{m.displayName.slice(0,1)}</Text></View>
        <View style={styles.memberCopy}><Text style={styles.memberName}>{m.displayName}</Text><Text style={styles.muted}>{m.kycRequired ? s.kycRequired : s.kycComplete}</Text></View>
        <Text style={styles.arrow}>›</Text>
      </Pressable>)}
    </Card>}

    {step === "consent" && <Card>
      <StepLabel s={s} current={3}/><Text style={styles.heading}>{s.consent}</Text>
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: consented }} accessibilityLabel={s.consentText} onPress={() => setConsented(!consented)} style={styles.consent}>
        <View style={[styles.checkbox, consented && styles.checkboxSelected]}><Text style={styles.check}>{consented ? "✓" : ""}</Text></View>
        <Text style={styles.body}>{s.consentText}</Text>
      </Pressable>
      <InfoCard title={s.secureTitle} text={s.privacyText}/><Primary label={s.startVerification} onPress={start} disabled={!selected || !consented || loading}/>
    </Card>}

    {step === "auth" && <Card>\n      <StepLabel s={s} current={3}/><Text style={styles.heading}>{s.aadhaarTitle}</Text><Text style={styles.muted}>{s.aadhaarText}</Text>\n      <InfoCard title={s.secureTitle} text={s.aadhaarBoundary}/>\n      <View style={styles.authBoundary}><Text style={styles.authBoundaryTitle}>{s.aadhaarProvider}</Text><Text style={styles.muted}>{s.mockMode}</Text></View>\n      <Primary label={loading ? s.processing : s.openAadhaar} onPress={authenticate} disabled={loading}/>\n    </Card>}\n\n    {step === "processing" && <Card>
      <View style={styles.processingIcon}><Text style={styles.processingDots}>•••</Text></View>
      <Text style={styles.heading}>{s.processing}</Text><Text style={styles.muted}>{s.processingText}</Text>
      <View style={styles.progressTrack}><View style={styles.progressIndeterminate}/></View>
    </Card>}

    {step === "success" && <Card>
      <View style={styles.successIcon}><Text style={styles.successIconText}>✓</Text></View>
      <Text style={styles.heading}>{s.success}</Text><Text style={styles.body}>{s.successText}</Text>
      <View style={styles.referenceCard}><Text style={styles.referenceLabel}>{s.reference}</Text><Text style={styles.reference}>{reference}</Text></View>
      <Text style={styles.muted}>{s.demoNote}</Text>
    </Card>}

    {error ? <View style={styles.errorCard}><Text style={styles.error}>{error}</Text></View> : null}
    {step !== "language" && step !== "welcome" && step !== "success" && step !== "processing" && <Pressable onPress={() => setStep(step === "ration" ? "welcome" : step === "member" ? "ration" : step === "consent" ? "member" : "consent")}><Text style={styles.back}>{s.back}</Text></Pressable>}
    <Text style={styles.footer}>{s.demoNote}</Text>
  </ScrollView></SafeAreaView>;
}

function Header({s}:{s:ReturnType<typeof getStrings>}){return <View style={styles.header}><View style={styles.logo}><Text style={styles.logoText}>N</Text></View><View style={styles.headerCopy}><Text style={styles.title}>{s.appName}</Text><Text style={styles.subtitle}>{s.tagline}</Text></View><View style={styles.securePill}><Text style={styles.securePillText}>✓</Text></View></View>}
function Progress({s,current}:{s:ReturnType<typeof getStrings>;current:number}){return <View style={styles.progressWrap}><View style={styles.progressTop}><Text style={styles.progressText}>{s.step} {current} {s.of} 3</Text><Text style={styles.progressText}>{current===1?s.householdStep:current===2?s.verifyStep:s.doneStep}</Text></View><View style={styles.progressTrack}><View style={[styles.progressFill,{width:(current/3)*100+"%"}]}/></View></View>}
function StepLabel({s,current}:{s:ReturnType<typeof getStrings>;current:number}){return <Text style={styles.stepLabel}>{s.step} {current} {s.of} 3</Text>}
function Card({children}:{children:React.ReactNode}){return <View style={styles.card}>{children}</View>}
function Badge({text}:{text:string}){return <View style={styles.badge}><Text style={styles.badgeText}>✓  {text}</Text></View>}
function InfoCard({title,text}:{title:string;text:string}){return <View style={styles.infoCard}><View style={styles.infoIcon}><Text style={styles.infoIconText}>i</Text></View><View style={{flex:1}}><Text style={styles.infoTitle}>{title}</Text><Text style={styles.infoText}>{text}</Text></View></View>}
function Primary({label,onPress,disabled}:{label:string;onPress:()=>void;disabled?:boolean}){return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled} onPress={onPress} style={({pressed})=>[styles.primary,disabled&&styles.disabled,pressed&&!disabled&&styles.primaryPressed]}><Text style={styles.primaryText}>{label}</Text><Text style={styles.primaryArrow}>→</Text></Pressable>}
function LanguageButton({label,selected,onPress}:{label:string;selected:boolean;onPress:()=>void}){return <Pressable accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={label} onPress={onPress} style={({pressed})=>[styles.language,selected&&styles.languageSelected,pressed&&styles.pressed]}><Text style={styles.languageText}>{label}</Text>{selected&&<Text style={styles.tick}>✓</Text>}</Pressable>}

const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:theme.colors.background},container:{paddingHorizontal:20,paddingTop:26,paddingBottom:30,gap:16},
 header:{flexDirection:"row",alignItems:"center",gap:12},logo:{width:48,height:48,borderRadius:16,backgroundColor:theme.colors.primary,alignItems:"center",justifyContent:"center"},logoText:{color:theme.colors.white,fontSize:25,fontWeight:"800"},
 headerCopy:{flex:1},title:{fontSize:24,fontWeight:"800",color:theme.colors.text},subtitle:{fontSize:13,color:theme.colors.muted,marginTop:2},
 securePill:{width:34,height:34,borderRadius:17,backgroundColor:theme.colors.surfaceMuted,alignItems:"center",justifyContent:"center"},securePillText:{color:theme.colors.primary,fontSize:17,fontWeight:"800"},
 progressWrap:{gap:7},progressTop:{flexDirection:"row",justifyContent:"space-between"},progressText:{fontSize:12,fontWeight:"700",color:theme.colors.muted},progressTrack:{height:6,borderRadius:6,backgroundColor:theme.colors.border,overflow:"hidden"},progressFill:{height:"100%",backgroundColor:theme.colors.primary,borderRadius:6},
 card:{backgroundColor:theme.colors.surface,borderRadius:theme.radius.card,padding:theme.spacing.lg,borderWidth:1,borderColor:theme.colors.border,gap:16},badge:{alignSelf:"flex-start",paddingHorizontal:12,paddingVertical:7,borderRadius:theme.radius.pill,backgroundColor:theme.colors.surfaceMuted},badgeText:{fontSize:12,fontWeight:"800",color:theme.colors.primary},
 eyebrow:{fontSize:13,fontWeight:"800",color:theme.colors.primary,textTransform:"uppercase",letterSpacing:1},heading:{fontSize:24,fontWeight:"800",lineHeight:31,color:theme.colors.text},muted:{fontSize:14,color:theme.colors.muted,lineHeight:21},body:{fontSize:16,color:theme.colors.text,lineHeight:24},
 heroIcon:{width:62,height:62,borderRadius:20,backgroundColor:theme.colors.surfaceMuted,alignItems:"center",justifyContent:"center"},heroIconText:{fontSize:30,fontWeight:"800",color:theme.colors.primary},
 infoCard:{flexDirection:"row",gap:12,padding:15,borderRadius:16,backgroundColor:theme.colors.surfaceMuted,borderWidth:1,borderColor:"#DCE8E0"},infoIcon:{width:28,height:28,borderRadius:14,backgroundColor:theme.colors.primary,alignItems:"center",justifyContent:"center"},infoIconText:{color:theme.colors.white,fontWeight:"800"},infoTitle:{fontSize:14,fontWeight:"800",color:theme.colors.text,marginBottom:3},infoText:{fontSize:13,color:theme.colors.muted,lineHeight:19},
 language:{minHeight:58,paddingHorizontal:18,borderRadius:theme.radius.input,borderWidth:1,borderColor:theme.colors.border,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},languageSelected:{borderColor:theme.colors.primary,backgroundColor:"#EEF7F1",borderWidth:2},languageText:{fontSize:17,fontWeight:"700",color:theme.colors.text},tick:{fontSize:20,color:theme.colors.primary},
 primary:{minHeight:54,paddingHorizontal:18,borderRadius:theme.radius.button,backgroundColor:theme.colors.primary,alignItems:"center",justifyContent:"center",flexDirection:"row"},primaryPressed:{backgroundColor:theme.colors.primaryPressed},primaryText:{color:theme.colors.white,fontSize:16,fontWeight:"800",flex:1,textAlign:"center",paddingLeft:24},primaryArrow:{color:theme.colors.white,fontSize:20,fontWeight:"700"},disabled:{opacity:.45},
 input:{minHeight:56,paddingHorizontal:16,borderRadius:theme.radius.input,borderWidth:1,borderColor:theme.colors.border,fontSize:17,color:theme.colors.text,backgroundColor:theme.colors.white},stepLabel:{fontSize:12,fontWeight:"800",color:theme.colors.primary,textTransform:"uppercase",letterSpacing:.8},
 member:{minHeight:76,padding:14,borderRadius:16,borderWidth:1,borderColor:theme.colors.border,flexDirection:"row",alignItems:"center",gap:12},avatar:{width:44,height:44,borderRadius:14,backgroundColor:theme.colors.surfaceMuted,alignItems:"center",justifyContent:"center"},avatarText:{fontSize:18,fontWeight:"800",color:theme.colors.primary},memberCopy:{flex:1},memberName:{fontSize:17,fontWeight:"700",color:theme.colors.text,marginBottom:3},arrow:{fontSize:30,color:theme.colors.primary},
 consent:{flexDirection:"row",gap:12,alignItems:"flex-start"},checkbox:{width:28,height:28,borderRadius:8,borderWidth:2,borderColor:theme.colors.border,alignItems:"center",justifyContent:"center"},checkboxSelected:{backgroundColor:theme.colors.primary,borderColor:theme.colors.primary},check:{fontSize:18,color:theme.colors.white,fontWeight:"800"},
 processingIcon:{width:62,height:62,borderRadius:20,backgroundColor:theme.colors.surfaceMuted,alignItems:"center",justifyContent:"center"},processingDots:{fontSize:24,color:theme.colors.primary,fontWeight:"800",letterSpacing:3},progressIndeterminate:{height:"100%",width:"42%",backgroundColor:theme.colors.primary},
 successIcon:{width:70,height:70,borderRadius:35,backgroundColor:"#E5F3E9",alignItems:"center",justifyContent:"center"},successIconText:{fontSize:38,fontWeight:"800",color:theme.colors.success},referenceCard:{padding:16,borderRadius:16,backgroundColor:theme.colors.surfaceMuted,borderWidth:1,borderColor:"#DCE8E0"},referenceLabel:{fontSize:12,fontWeight:"800",color:theme.colors.muted,textTransform:"uppercase",letterSpacing:.8,marginBottom:5},reference:{fontSize:17,fontWeight:"800",color:theme.colors.text},
 errorCard:{padding:14,borderRadius:14,backgroundColor:"#FFF0EF",borderWidth:1,borderColor:"#F1C8C4"},error:{color:theme.colors.error,fontSize:14,lineHeight:20,fontWeight:"600"},back:{textAlign:"center",fontSize:15,fontWeight:"700",color:theme.colors.primary,paddingVertical:2},footer:{textAlign:"center",fontSize:12,color:theme.colors.muted,paddingTop:4},pressed:{opacity:.72},
});
