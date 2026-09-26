import { useEffect, useMemo, useState, type ReactNode } from "react";
import * as Crypto from "expo-crypto";
import { speakGuidance, stopGuidance } from "../src/audioGuidance";
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { FamilyIllustration, NammaKycLogo, ServiceIcon } from "../src/brand";
import { apiRequest, getKycStatus } from "../src/api/client";
import type { Household, KycResponse, KycStatus } from "../src/api/types";
import { getStrings } from "../src/i18n";
import type { Language } from "../src/i18n/translations";
import { theme } from "../src/theme";

type Step = "splash" | "language" | "welcome" | "ration" | "member" | "consent" | "auth" | "aadhaarOtp" | "instructions" | "faceCapture" | "authenticating" | "authResult" | "pdsProcessing" | "processing" | "status" | "success";
const stepNumber: Record<string, number> = { ration: 1, member: 2, consent: 3, auth: 3, aadhaarOtp: 3, instructions: 3, faceCapture: 3, authenticating: 3, authResult: 3, pdsProcessing: 4, processing: 4, status: 4, success: 4 };

export default function HomeScreen() {
  const [language, setLanguage] = useState<Language>("en");
  const [step, setStep] = useState<Step>("splash");
  const [rationCard, setRationCard] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [household, setHousehold] = useState<Household | null>(null);
  const [selected, setSelected] = useState("");
  const [consentRead, setConsentRead] = useState(false);
  const [consentProceed, setConsentProceed] = useState(false);
  const [consentReference, setConsentReference] = useState("");
  const [reference, setReference] = useState("");
  const [requestId, setRequestId] = useState("");
  const [requestStatus, setRequestStatus] = useState<KycStatus>("received");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const s = useMemo(() => getStrings(language), [language]);
  useEffect(() => () => { void stopGuidance(); }, []);

  async function speakInstructions() {
    const ok = await speakGuidance(language === "kn" ? "kn" : "en");
    if (!ok) {
      setVoiceEnabled(false);
      setError(s.voiceUnavailable);
    } else {
      setError("");
    }
  }

  async function lookup() {
    setError(""); setLoading(true);
    try { const h = await apiRequest<Household>("/v1/households/" + encodeURIComponent(rationCard.trim())); setHousehold(h); setStep("member"); }
    catch { setError(s.error); } finally { setLoading(false); }
  }

  function start() {
    if (!consentRead || !consentProceed || !household || !selected) return;
    setError(""); setConsentReference(Crypto.randomUUID()); setStep("auth");
  }

  async function authenticate() {
    if (!household || !selected || !consentReference) return;
    setError(""); setLoading(true);
    let submittedRequestId = "";
    try {
      const response = await apiRequest<KycResponse>("/v1/kyc", {
        method: "POST",
        headers: { "Idempotency-Key": Crypto.randomUUID() },
        body: JSON.stringify({ householdReference: household.householdReference, memberReference: selected, consentReference, consentPolicyVersion: "2026-09", consentLanguage: language, authenticationMethod: "otp_face" }),
      });
      submittedRequestId = response.requestId; setRequestId(response.requestId); setRequestStatus(response.status); if (response.status === "aadhaar_authenticating" || response.status === "aadhaar_pending") setStep("authenticating");
      if (response.status === "aadhaar_authenticated") setStep("authResult");
      if (response.status === "pds_processing") setStep("pdsProcessing");
      let status = response;
      for (let attempt = 0; attempt < 20; attempt++) {
        if (status.status === "success" || status.status === "failed") break;
        if (status.status === "aadhaar_authenticating" || status.status === "aadhaar_pending") setStep("authenticating");
        else if (status.status === "aadhaar_authenticated") setStep("authResult");
        else if (status.status === "pds_processing") setStep("pdsProcessing");
        await new Promise(resolve => setTimeout(resolve, 750));
        status = await getKycStatus<KycResponse>(response.requestId); setRequestStatus(status.status); if (status.status === "aadhaar_authenticating" || status.status === "aadhaar_pending") setStep("authenticating"); else if (status.status === "aadhaar_authenticated") setStep("authResult"); else if (status.status === "pds_processing") setStep("pdsProcessing");
      }
      if (status.status === "success") { setReference(status.reference ?? status.requestId); setStep("success"); }
      else setStep("status");
    } catch { setStep(submittedRequestId ? "status" : "auth"); setError(s.error); }
    finally { setLoading(false); }
  }

  async function refreshStatus() {
    if (!requestId || loading) return;
    setError(""); setLoading(true);
    try {
      const result = await getKycStatus<KycResponse>(requestId); setRequestStatus(result.status);
      if (result.status === "success") { setReference(result.reference ?? result.requestId); setStep("success"); }
      else if (result.status === "failed") setError(s.error);
    } catch { setError(s.error); } finally { setLoading(false); }
  }

  function resetJourney() {
    setStep("splash"); setRationCard(""); setHousehold(null); setSelected(""); setConsentRead(false); setConsentProceed(false);
    setConsentReference(""); setRequestId(""); setRequestStatus("received"); setReference(""); setAadhaarNumber(""); setOtp(""); setError("");
  }

  const current = stepNumber[step] ?? 1;
  const statusLabel = ({ received: s.requestReceived, validating: s.statusValidating, aadhaar_pending: s.statusAadhaarPending, aadhaar_authenticating: s.statusAuthenticating, aadhaar_authenticated: s.statusAadhaarAuthenticated, pds_processing: s.statusPdsProcessing, retrying: s.statusRetrying, success: s.statusSuccess, failed: s.statusFailed } as Record<string, string>)[requestStatus] ?? requestStatus;

  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
    {step !== "splash" && <Header s={s} language={language} onLanguageChange={() => setLanguage(language === "en" ? "kn" : "en")} />}
    {step !== "splash" && step !== "language" && step !== "welcome" && step !== "success" && step !== "processing" && step !== "authenticating" && step !== "authResult" && step !== "pdsProcessing" && <Progress s={s} current={current} />}

    {step === "splash" && <Splash s={s} language={language} onStart={() => setStep("welcome")} onLanguageChange={() => setLanguage(language === "en" ? "kn" : "en")} />}

    {step === "language" && <Card>
      <LanguageHero s={s} /><Badge text={s.trust} /><Text style={styles.eyebrow}>{s.appName}</Text>
      <Text accessibilityRole="header" style={styles.heading}>{s.chooseLanguage}</Text><Text style={styles.muted}>{s.languageHint}</Text>
      <LanguageButton label={s.english} selected={language === "en"} onPress={() => setLanguage("en")} />
      <LanguageButton label={s.kannada} selected={language === "kn"} onPress={() => setLanguage("kn")} />
      <Primary label={s.continue} onPress={() => setStep("welcome")} />
    </Card>}

    {step === "welcome" && <Card>
      <View style={styles.welcomeHeader}><View style={styles.welcomeBrand}><NammaKycLogo size={44}/><View><Text style={styles.welcomeBrandName}>{s.appName}</Text><Text style={styles.welcomeBrandTag}>{s.tagline}</Text></View></View><View style={styles.welcomeProgress}><View style={styles.welcomeProgressActive}/><View style={styles.welcomeProgressDot}/><View style={styles.welcomeProgressDot}/></View></View>
      <Text accessibilityRole="header" style={styles.welcomeHeading}>{s.welcomeTitle}</Text><Text style={styles.welcomeIntro}>{s.welcomeText}</Text>
      <FeatureRow icon="card" title={s.featureRation} text={s.featureRationText} tone="orange"/><FeatureRow icon="shield" title={s.featureSecure} text={s.featureSecureText} tone="green"/><FeatureRow icon="privacy" title={s.featurePrivacy} text={s.featurePrivacyText} tone="gold"/><FeatureRow icon="bolt" title={s.featureFast} text={s.featureFastText} tone="blue"/>
      <View style={styles.familyArtwork}><FamilyIllustration width={330}/></View><Primary label={s.continue} onPress={() => setStep("ration")} />
    </Card>}

    {step === "ration" && <Card>
      <StepLabel s={s} current={1}/><Text accessibilityRole="header" style={styles.heading}>{s.rationCard}</Text><Text style={styles.muted}>{s.rationCardHint}</Text>
      <TextInput accessibilityLabel={s.rationCard} accessibilityHint={s.rationCardHint} value={rationCard} onChangeText={setRationCard} autoCapitalize="characters" placeholder={s.rationCard} placeholderTextColor={theme.colors.muted} style={styles.input} />
      <Primary label={loading ? s.processing : s.findHousehold} onPress={lookup} disabled={!rationCard.trim() || loading} />
    </Card>}

    {step === "member" && household && <Card>
      <StepLabel s={s} current={2}/><Text accessibilityRole="header" style={styles.heading}>{s.household}</Text><Text style={styles.muted}>{s.selectMember}</Text>
      {household.members.map(m => <Pressable key={m.memberReference} accessibilityRole="button" accessibilityState={{disabled: !m.kycRequired}} onPress={() => {if(m.kycRequired){setSelected(m.memberReference);setStep("consent");}}} style={({pressed}) => [styles.member,m.kycRequired&&pressed&&styles.pressed,!m.kycRequired&&styles.memberCompleted]}>
        <View style={[styles.avatar,!m.kycRequired&&styles.avatarCompleted]}><Text style={styles.avatarText}>{m.kycRequired?m.displayName.slice(0,1):"✓"}</Text></View><View style={styles.memberCopy}><Text style={styles.memberName}>{m.displayName}</Text><Text style={[styles.muted,!m.kycRequired&&styles.completedText]}>{m.kycRequired?s.kycRequired:s.kycRecentlyVerified}</Text></View><Text style={styles.arrow}>{m.kycRequired?"›":"✓"}</Text>
      </Pressable>)}
    </Card>}

    {step === "consent" && <Card>
      <StepLabel s={s} current={3}/><Text accessibilityRole="header" style={styles.heading}>{s.consent}</Text><Text style={styles.muted}>{s.consentIntro}</Text>
      <ConsentItem icon="⌁" text={s.consentAadhaar}/><ConsentItem icon="◉" text={s.consentBiometric}/><ConsentItem icon="⊘" text={s.consentNoStorage}/><ConsentItem icon="▣" text={s.consentMinimum}/><ConsentItem icon="□" text={s.consentTerms}/>
      <CheckRow label={s.consentRead} checked={consentRead} onPress={() => setConsentRead(!consentRead)}/><CheckRow label={s.consentProceed} checked={consentProceed} onPress={() => setConsentProceed(!consentProceed)}/>
      <Primary label={s.startVerification} onPress={start} disabled={!selected||!consentRead||!consentProceed||loading}/>
    </Card>}

    {step === "auth" && <Card>
      <StepLabel s={s} current={3}/><Text accessibilityRole="header" style={styles.heading}>{s.aadhaarTitle}</Text><Text style={styles.muted}>{s.aadhaarText}</Text>
      <View style={styles.providerCard}><View style={styles.providerIcon}><Text style={styles.providerIconText}>✓</Text></View><View style={styles.providerCopy}><Text style={styles.providerTitle}>{s.aadhaarProvider}</Text><Text style={styles.muted}>{s.mockMode}</Text></View><View style={styles.providerCheck}><Text style={styles.providerCheckText}>✓</Text></View></View>
      <InfoCard title={s.aadhaarProvider} text={s.aadhaarBoundary}/><TextInput accessibilityLabel={s.aadhaarNumber} keyboardType="number-pad" maxLength={12} value={aadhaarNumber} onChangeText={setAadhaarNumber} placeholder={s.aadhaarNumberHint} placeholderTextColor={theme.colors.muted} style={styles.input}/><Primary label={s.continue} onPress={() => setStep("aadhaarOtp")} disabled={aadhaarNumber.replace(/\\D/g,"").length !== 12 || loading}/>
    </Card>}

    {step === "aadhaarOtp" && <Card>
      <StepLabel s={s} current={3}/><Text accessibilityRole="header" style={styles.heading}>{s.otpTitle}</Text><Text style={styles.muted}>{s.otpHint}</Text>
      <View style={styles.otpInfo}><Text style={styles.otpCheck}>✓</Text><Text style={styles.otpInfoText}>{s.otpTitle}</Text></View>
      <TextInput accessibilityLabel={s.otpPlaceholder} keyboardType="number-pad" maxLength={6} value={otp} onChangeText={setOtp} placeholder={s.otpPlaceholder} placeholderTextColor={theme.colors.muted} style={styles.input}/>
      <Primary label={s.verifyOtp} onPress={() => setStep("instructions")} disabled={otp.replace(/\D/g,"").length < 4}/>
    </Card>}

    {step === "instructions" && <Card>
      <StepLabel s={s} current={3}/><Text accessibilityRole="header" style={styles.heading}>{s.faceReady}</Text><Text style={styles.muted}>{s.faceReadyText}</Text>
      <View style={styles.facePreparationCard}><View style={styles.faceGuide}><View style={styles.faceFrame}/></View><View style={styles.faceChecklist}><Text>✓ {s.voiceSteps[0]}</Text><Text>✓ {s.voiceSteps[1]}</Text><Text>✓ {s.voiceSteps[2]}</Text><Text>✓ {s.voiceSteps[3]}</Text></View></View>
      <Primary label={s.ready} onPress={() => setStep("faceCapture")} />
    </Card>}

    {step === "faceCapture" && <Card>
      <StepLabel s={s} current={3}/><Text accessibilityRole="header" style={styles.headingCenter}>{s.faceTitle}</Text>
      <View style={styles.faceCaptureCard}><View style={styles.faceFrameLarge}/><View style={styles.capturePill}><Text style={styles.capturePillText}>{s.faceCapture}</Text></View></View>
      <Primary label={s.openAadhaar} onPress={authenticate} disabled={loading}/>
    </Card>}

    {(step === "authenticating" || step === "authResult" || step === "pdsProcessing" || step === "processing") && <Card>
      <ProcessingHero s={s}/><Text accessibilityRole="header" style={styles.heading}>{step === "authResult" ? s.authResultTitle : step === "pdsProcessing" || step === "processing" ? s.pdsProcessingTitle : s.processing}</Text>
      <Text style={styles.muted}>{step === "authResult" ? s.authResultText : step === "pdsProcessing" || step === "processing" ? s.pdsProcessingText : s.processingText}</Text>
      <ProcessingTimeline s={s} status={requestStatus}/><InfoCard title={step === "authResult" ? s.aadhaarProvider : s.pdsProcessingTitle} text={step === "authResult" ? s.authResultBoundary : s.processingNote}/>
    </Card>}

    {step === "status" && <Card>
      <Text accessibilityRole="header" style={styles.heading}>{s.statusTitle}</Text><Text style={styles.muted}>{s.statusUpdated}</Text>
      <View style={styles.referenceCard}><View style={styles.referenceTop}><Text style={styles.referenceLabel}>{s.reference}</Text><StatusPill text={statusLabel}/></View><Text selectable style={styles.reference}>{requestId}</Text></View>
      <StatusTimeline s={s} status={requestStatus}/><Primary label={loading?s.processing:s.checkStatus} onPress={refreshStatus} disabled={loading}/><Secondary label={s.newRequest} onPress={resetJourney} disabled={loading}/>
    </Card>}

    {step === "success" && <Card>
      <SuccessHero/><Text accessibilityRole="header" style={styles.headingCenter}>{s.success}</Text><Text style={styles.centerBody}>{s.successText}</Text>
      <View style={styles.detailsCard}><DetailRow label={s.reference} value={reference}/><DetailRow label={s.service} value={s.serviceValue}/><DetailRow label={s.currentStatus} value={s.completedStatus} success/></View>
      <Primary label={s.viewDetails} onPress={() => {}}/><Secondary label={s.goHome} onPress={resetJourney}/>
      
    </Card>}

    {error ? <View accessibilityRole="alert" style={styles.errorCard}><Text style={styles.error}>{error}</Text></View> : null}
    {step !== "splash"&&step !== "language"&&step !== "welcome"&&step !== "success"&&step !== "processing"&&step !== "authenticating"&&step !== "authResult"&&step !== "pdsProcessing"&&step !== "status"&&<Pressable onPress={() => setStep(step==="ration"?"welcome":step==="member"?"ration":step==="consent"?"member":step==="auth"?"consent":step==="aadhaarOtp"?"auth":step==="instructions"?"aadhaarOtp":"instructions")}><Text style={styles.back}>{s.back}</Text></Pressable>}
    
  </ScrollView></SafeAreaView>;
}
function Splash({s,language,onStart,onLanguageChange}:{s:ReturnType<typeof getStrings>;language:Language;onStart:()=>void;onLanguageChange:()=>void}){return <View style={styles.splash}>
  <View style={styles.splashTop}><View style={styles.splashTopSpacer}/><Image accessibilityLabel={s.government} source={{uri:"https://upload.wikimedia.org/wikipedia/commons/d/d3/Seal_of_Karnataka.png"}} style={styles.splashEmblem}/><Pressable accessibilityRole="button" accessibilityLabel={language==="en"?"ಕನ್ನಡ":"English"} onPress={onLanguageChange} style={styles.splashLanguage}><Text style={styles.splashLanguageText}>{language==="en"?"EN":"ಕನ್ನಡ"}</Text></Pressable></View>
  <Text style={styles.splashGovernment}>{s.government}</Text>
  <Text style={styles.splashBrand}>{s.appName}</Text>
  <Text style={styles.splashTag}>{language==="en"?"Secure Identity. Better Services. A Stronger Karnataka.":"ಸುರಕ್ಷಿತ ಗುರುತು. ಉತ್ತಮ ಸೇವೆಗಳು. ಸದೃಢ ಕರ್ನಾಟಕ."}</Text>
  <Image accessibilityLabel="Vidhana Soudha" source={{uri:"https://upload.wikimedia.org/wikipedia/commons/b/ba/Government_Karnataka_8352.jpg"}} style={styles.splashBuilding}/>
  <View style={styles.splashValues}><ValueItem icon="♧" text={s.peopleFirst}/><ValueItem icon="✋" text={s.simpleAccess}/><ValueItem icon="♡" text={s.digitalKarnataka}/></View>
  <Primary label={s.getStarted} onPress={onStart}/>
  <Text style={styles.splashIndependent}>{language==="en"?"Independent open-source citizen initiative":"ಸ್ವತಂತ್ರ ಮುಕ್ತ-ಮೂಲ ನಾಗರಿಕ ಉಪಕ್ರಮ"}</Text>
</View>}

function Header({s,language,onLanguageChange}:{s:ReturnType<typeof getStrings>;language:Language;onLanguageChange:()=>void}){return <View style={styles.header}><View style={styles.logo}><NammaKycLogo size={38} /></View><View style={styles.headerCopy}><Text style={styles.title}>{s.appName}</Text><Text style={styles.subtitle}>{s.tagline}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={language==="en"?"ಕನ್ನಡ":"English"} onPress={onLanguageChange} style={styles.languageSwitch}><Text style={styles.languageSwitchText}>{language==="en"?"ಕನ್ನಡ":"English"}</Text></Pressable><View style={styles.securePill}><Text style={styles.securePillText}>✓</Text></View></View>}
function Progress({s,current}:{s:ReturnType<typeof getStrings>;current:number}){return <View style={styles.progressWrap}><View style={styles.progressTop}><Text style={styles.progressText}>{s.step} {current} {s.of} 4</Text><Text style={styles.progressText}>{current===1?s.householdStep:current===2?s.verifyStep:s.doneStep}</Text></View><View style={styles.progressTrack}><View style={[styles.progressFill,{width:`${(current/4)*100}%` as `${number}%`}]}/></View></View>}
function StepLabel({s,current}:{s:ReturnType<typeof getStrings>;current:number}){return <Text style={styles.stepLabel}>{s.step} {current} {s.of} 4</Text>}

function LanguageHero({s}:{s:ReturnType<typeof getStrings>}){return <View style={styles.languageHero}><View style={styles.emblem}><NammaKycLogo size={64}/></View><Text style={styles.government}>{s.karnataka}</Text><Text style={styles.heroBrand}>{s.appName}</Text><Text style={styles.heroTagline}>{s.peopleFirst} · {s.simpleAccess}</Text><KarnatakaIllustration/></View>}
function WelcomeHero({s}:{s:ReturnType<typeof getStrings>}){return <View style={styles.welcomeHero}><View style={styles.welcomeOrb}><Text style={styles.welcomeOrbText}>N</Text></View><View style={styles.welcomeDots}><View style={styles.welcomeDotActive}/><View style={styles.welcomeDot}/><View style={styles.welcomeDot}/></View><Text style={styles.welcomeKicker}>{s.karnataka}</Text></View>}
function KarnatakaIllustration(){return <View style={styles.illustration}><View style={styles.sun}/><View style={styles.building}><View style={styles.dome}/><View style={styles.buildingRoof}/><View style={styles.buildingBody}><View style={styles.columnRow}>{Array.from({length:7}).map((_,i)=><View key={i} style={styles.column}/>)}</View><View style={styles.door}/></View></View><View style={styles.landscape}><View style={styles.landLeft}/><View style={styles.landRight}/></View></View>}

function FeatureRow({icon,title,text,tone}:{icon:"card"|"shield"|"privacy"|"bolt";title:string;text:string;tone:"orange"|"green"|"gold"|"blue"}){return <View style={styles.featureRow}><View style={[styles.featureIcon,tone==="orange"?styles.featureorange:tone==="green"?styles.featuregreen:tone==="gold"?styles.featuregold:styles.featureblue]}><ServiceIcon name={icon} size={28}/></View><View style={styles.featureCopy}><Text style={styles.featureTitle}>{title}</Text><Text style={styles.featureText}>{text}</Text></View></View>}
function DashboardTile({icon,label,onPress}:{icon:string;label:string;onPress?:()=>void}){return <Pressable accessibilityRole="button" onPress={onPress} style={({pressed})=>[styles.dashboardTile,pressed&&styles.pressed]}><View style={styles.dashboardTileIcon}><Text style={styles.dashboardTileIconText}>{icon}</Text></View><Text style={styles.dashboardTileText}>{label}</Text></Pressable>}
function DashboardNav({icon,label,active}:{icon:string;label:string;active?:boolean}){return <View style={styles.dashboardNavItem}><Text style={[styles.dashboardNavIcon,active&&styles.dashboardNavActive]}>{icon}</Text><Text style={[styles.dashboardNavText,active&&styles.dashboardNavActive]}>{label}</Text></View>}
function ValueItem({icon,text}:{icon:string;text:string}){return <View style={styles.valueItem}><Text style={styles.valueIcon}>{icon}</Text><Text style={styles.valueText}>{text}</Text></View>}
function ConsentItem({icon,text}:{icon:string;text:string}){return <View style={styles.consentItem}><View style={styles.consentIcon}><Text style={styles.consentIconText}>{icon}</Text></View><Text style={styles.consentItemText}>{text}</Text></View>}
function CheckRow({label,checked,onPress}:{label:string;checked:boolean;onPress:()=>void}){return <Pressable accessibilityRole="checkbox" accessibilityState={{checked}} accessibilityLabel={label} onPress={onPress} style={({pressed})=>[styles.checkRow,pressed&&styles.pressed]}><View style={[styles.checkbox,checked&&styles.checkboxSelected]}><Text style={styles.check}>{checked?"✓":""}</Text></View><Text style={styles.checkLabel}>{label}</Text></Pressable>}

function ProcessingHero({s}:{s:ReturnType<typeof getStrings>}){return <View style={styles.processingHero}><View style={styles.processingRing}><View style={styles.processingFace}><Text style={styles.processingFaceText}>◎</Text></View></View><Text style={styles.processingCaption}>{s.aadhaarProvider}</Text></View>}
function ProcessingTimeline({s,status}:{s:ReturnType<typeof getStrings>;status:string}){const current=status==="aadhaar_pending"?1:status==="aadhaar_authenticating"||status==="authenticating"?2:status==="aadhaar_authenticated"?3:status==="pds_processing"||status==="processing"||status==="retrying"?4:1;const items=[s.processingImage,s.processingAuth,s.processingResponse,s.processingFinal];return <View style={styles.timeline}>{items.map((label,index)=>{const done=index<current-1;const active=index===current-1;return <TimelineRow key={label} label={label} done={done} active={active} last={index===items.length-1}/>})}</View>}
function StatusTimeline({s,status}:{s:ReturnType<typeof getStrings>;status:string}){const stages=[s.requestReceived,s.statusAadhaarAuthenticated,s.statusPdsProcessing];const active=status==="aadhaar_authenticated"?1:2;return <View style={styles.timeline}>{stages.map((label,index)=><TimelineRow key={label+index} label={label} done={status==="success"||index<active} active={status!=="success"&&status!=="failed"&&index===active} last={index===2}/>)}</View>}
function TimelineRow({label,done,active,last}:{label:string;done:boolean;active:boolean;last:boolean}){return <View style={styles.timelineRow}><View style={styles.timelineRail}><View style={[styles.timelineDot,done&&styles.timelineDone,active&&styles.timelineActive]}><Text style={styles.timelineDotText}>{done?"✓":active?"•":""}</Text></View>{!last&&<View style={[styles.timelineLine,done&&styles.timelineLineDone]}/>}</View><Text style={[styles.timelineText,active&&styles.timelineTextActive]}>{label}</Text></View>}
function StatusPill({text}:{text:string}){return <View style={styles.statusPill}><View style={styles.statusDot}/><Text style={styles.statusPillText}>{text}</Text></View>}
function SuccessHero(){return <View style={styles.successHero}><Text style={styles.confetti}>·  ·  ✦  ·  ·</Text><View style={styles.successIcon}><Text style={styles.successIconText}>✓</Text></View></View>}
function DetailRow({label,value,success}:{label:string;value:string;success?:boolean}){return <View style={styles.detailRow}><Text style={styles.detailLabel}>{label}</Text><Text style={[styles.detailValue,success&&styles.detailSuccess]} selectable>{value}</Text></View>}

function Card({children}:{children:ReactNode}){return <View style={styles.card}>{children}</View>}
function Badge({text}:{text:string}){return <View style={styles.badge}><Text style={styles.badgeText}>✓  {text}</Text></View>}
function InfoCard({title,text}:{title:string;text:string}){return <View style={styles.infoCard}><View style={styles.infoIcon}><Text style={styles.infoIconText}>i</Text></View><View style={{flex:1}}><Text style={styles.infoTitle}>{title}</Text><Text style={styles.infoText}>{text}</Text></View></View>}
function Primary({label,onPress,disabled}:{label:string;onPress:()=>void;disabled?:boolean}){return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{disabled:!!disabled,busy:!!disabled}} disabled={disabled} onPress={onPress} style={({pressed})=>[styles.primary,disabled&&styles.disabled,pressed&&!disabled&&styles.primaryPressed]}><Text style={styles.primaryText}>{label}</Text><Text style={styles.primaryArrow}>→</Text></Pressable>}
function Secondary({label,onPress,disabled}:{label:string;onPress:()=>void;disabled?:boolean}){return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{disabled:!!disabled}} disabled={disabled} onPress={onPress} style={({pressed})=>[styles.secondary,disabled&&styles.disabled,pressed&&!disabled&&styles.pressed]}><Text style={styles.secondaryText}>{label}</Text></Pressable>}
function LanguageButton({label,selected,onPress}:{label:string;selected:boolean;onPress:()=>void}){return <Pressable accessibilityRole="radio" accessibilityState={{selected}} accessibilityLabel={label} onPress={onPress} style={({pressed})=>[styles.language,selected&&styles.languageSelected,pressed&&styles.pressed]}><Text style={styles.languageText}>{label}</Text>{selected&&<Text style={styles.tick}>✓</Text>}</Pressable>}

const styles=StyleSheet.create({
safe:{flex:1,backgroundColor:theme.colors.background},container:{paddingHorizontal:20,paddingTop:20,paddingBottom:30,gap:16},
splash:{flex:1,minHeight:680,alignItems:"center",paddingHorizontal:18,paddingTop:8,paddingBottom:4,backgroundColor:"#FFFCF4"},splashTop:{width:"100%",height:72,flexDirection:"row",alignItems:"flex-start",justifyContent:"center",position:"relative"},splashTopSpacer:{width:72},splashEmblem:{width:76,height:68,resizeMode:"contain"},splashGovernment:{fontSize:14,fontWeight:"800",color:theme.colors.text,textAlign:"center",marginTop:2},splashBrand:{fontSize:39,lineHeight:43,fontWeight:"900",letterSpacing:-1.6,marginTop:9,color:"#164F72",textAlign:"center"},splashTag:{fontSize:12.5,lineHeight:18,fontWeight:"600",color:"#315448",textAlign:"center",marginTop:4,marginBottom:12,maxWidth:280},splashBuilding:{width:"100%",height:220,marginTop:0,borderRadius:22,resizeMode:"cover",backgroundColor:"#EEF5F0"},splashValues:{width:"100%",flexDirection:"row",justifyContent:"space-around",paddingVertical:15},splashIndependent:{fontSize:9.5,lineHeight:13,color:theme.colors.muted,textAlign:"center",marginTop:7,maxWidth:260},splashLanguage:{position:"absolute",right:0,top:3,minHeight:theme.minTouchTarget,paddingHorizontal:11,borderRadius:18,backgroundColor:"#FFFFFF",borderWidth:1,borderColor:theme.colors.borderStrong,justifyContent:"center"},splashLanguageText:{fontSize:12,fontWeight:"800",color:theme.colors.text},header:{flexDirection:"row",alignItems:"center",gap:10},logo:{width:46,height:46,borderRadius:15,backgroundColor:theme.colors.white,alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:theme.colors.border},logoText:{color:theme.colors.white,fontSize:24,fontWeight:"800"},headerCopy:{flex:1},title:{fontSize:22,fontWeight:"800",color:theme.colors.text},subtitle:{fontSize:12,color:theme.colors.muted,marginTop:2},securePill:{width:theme.minTouchTarget,height:theme.minTouchTarget,borderRadius:17,backgroundColor:theme.colors.primarySoft,alignItems:"center",justifyContent:"center"},languageSwitch:{minHeight:theme.minTouchTarget,paddingHorizontal:10,borderRadius:17,backgroundColor:theme.colors.surfaceMuted,justifyContent:"center"},languageSwitchText:{fontSize:12,fontWeight:"800",color:theme.colors.primary},securePillText:{color:theme.colors.primary,fontSize:17,fontWeight:"800"},
progressWrap:{gap:7},progressTop:{flexDirection:"row",justifyContent:"space-between"},progressText:{fontSize:12,fontWeight:"700",color:theme.colors.muted},progressTrack:{height:6,borderRadius:6,backgroundColor:theme.colors.border,overflow:"hidden"},progressFill:{height:"100%",backgroundColor:theme.colors.primary,borderRadius:6},
card:{backgroundColor:theme.colors.surface,borderRadius:theme.radius.card,padding:20,borderWidth:1,borderColor:theme.colors.border,gap:14},
languageHero:{alignItems:"center",paddingTop:4,paddingBottom:2},emblem:{width:58,height:58,borderRadius:29,backgroundColor:"#FFF6DD",alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:"#E8D5A2"},emblemText:{fontSize:30,color:theme.colors.accent},government:{fontSize:11,fontWeight:"800",letterSpacing:1.1,color:theme.colors.text,marginTop:7},heroBrand:{fontSize:32,fontWeight:"900",color:theme.colors.text,marginTop:9},heroTagline:{fontSize:12,fontWeight:"700",color:theme.colors.primary,marginTop:3},
illustration:{width:"100%",height:126,marginTop:8,overflow:"hidden",position:"relative"},sun:{position:"absolute",width:92,height:92,borderRadius:46,backgroundColor:"#FFF1D4",left:"50%",top:12,marginLeft:-46},building:{position:"absolute",width:190,height:80,left:"50%",bottom:22,marginLeft:-95,alignItems:"center"},dome:{width:52,height:52,borderRadius:52,backgroundColor:"#E6C57A",borderWidth:3,borderColor:"#B98A34",marginBottom:-30},buildingRoof:{width:164,height:24,backgroundColor:"#D6AF63",borderRadius:50,borderWidth:2,borderColor:"#B98A34"},buildingBody:{width:176,height:44,backgroundColor:"#F0E3C8",borderWidth:2,borderColor:"#B98A34",alignItems:"center",justifyContent:"flex-end"},columnRow:{width:"88%",height:26,flexDirection:"row",justifyContent:"space-around",alignItems:"flex-end"},column:{width:7,height:23,borderRadius:3,backgroundColor:"#D0A65C"},door:{width:18,height:26,backgroundColor:"#9B7133"},landscape:{position:"absolute",bottom:0,left:-20,right:-20,height:28,backgroundColor:"#DCEBDD",borderRadius:50},landLeft:{position:"absolute",left:30,bottom:0,width:90,height:18,borderRadius:50,backgroundColor:"#BFD9C4"},landRight:{position:"absolute",right:25,bottom:0,width:110,height:20,borderRadius:50,backgroundColor:"#BFD9C4"},
badge:{alignSelf:"flex-start",paddingHorizontal:11,paddingVertical:7,borderRadius:theme.radius.pill,backgroundColor:theme.colors.primarySoft},badgeText:{fontSize:11,fontWeight:"800",color:theme.colors.primary},eyebrow:{fontSize:12,fontWeight:"800",color:theme.colors.primary,textTransform:"uppercase",letterSpacing:1},heading:{fontSize:25,fontWeight:"800",lineHeight:32,color:theme.colors.text},headingCenter:{fontSize:25,fontWeight:"800",lineHeight:32,color:theme.colors.text,textAlign:"center"},muted:{fontSize:14,color:theme.colors.muted,lineHeight:21},centerBody:{fontSize:14,color:theme.colors.muted,lineHeight:21,textAlign:"center"},
dashboardHeader:{flexDirection:"row",alignItems:"center",gap:8,paddingBottom:10,borderBottomWidth:1,borderBottomColor:theme.colors.border},dashboardGovernment:{flex:1},dashboardGov:{fontSize:9,fontWeight:"700",color:theme.colors.muted},dashboardWelcome:{fontSize:18,fontWeight:"900",color:theme.colors.text,marginTop:2},dashboardIcon:{fontSize:18,color:theme.colors.primary,marginLeft:5},dashboardLandscape:{height:128,borderRadius:15,overflow:"hidden",backgroundColor:"#EAF2EC",marginVertical:11},dashboardKyc:{flexDirection:"row",alignItems:"center",gap:10,padding:12,borderRadius:15,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.white},dashboardKycIcon:{width:40,height:40,borderRadius:12,backgroundColor:"#F7E0A9",alignItems:"center",justifyContent:"center"},dashboardKycIconText:{fontSize:19,color:"#9B6900",fontWeight:"900"},dashboardKycCopy:{flex:1},dashboardKycTitle:{fontSize:14,fontWeight:"900",color:theme.colors.text},dashboardKycText:{fontSize:11,color:theme.colors.muted,lineHeight:15,marginTop:2},dashboardChevron:{fontSize:28,color:theme.colors.primary},dashboardTiles:{flexDirection:"row",flexWrap:"wrap",gap:8,marginVertical:10},dashboardTile:{width:"48%",minHeight:70,padding:10,borderRadius:14,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.white,flexDirection:"row",alignItems:"center",gap:8},dashboardTileIcon:{width:34,height:34,borderRadius:10,backgroundColor:theme.colors.surfaceBlue,alignItems:"center",justifyContent:"center"},dashboardTileIconText:{fontSize:16,color:theme.colors.blue,fontWeight:"900"},dashboardTileText:{flex:1,fontSize:10,fontWeight:"800",color:theme.colors.text},dashboardNav:{flexDirection:"row",justifyContent:"space-around",borderTopWidth:1,borderTopColor:theme.colors.border,paddingTop:8,marginBottom:10},dashboardNavItem:{alignItems:"center",gap:2},dashboardNavIcon:{fontSize:18,color:theme.colors.muted},dashboardNavText:{fontSize:9,color:theme.colors.muted},dashboardNavActive:{color:theme.colors.primary,fontWeight:"900"},welcomeHero:{height:48,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderBottomWidth:1,borderBottomColor:theme.colors.border},welcomeOrb:{width:42,height:42,borderRadius:14,backgroundColor:theme.colors.primary,alignItems:"center",justifyContent:"center"},welcomeOrbText:{color:theme.colors.white,fontSize:21,fontWeight:"900"},welcomeDots:{flexDirection:"row",gap:8},welcomeDotActive:{width:16,height:4,borderRadius:2,backgroundColor:theme.colors.primary},welcomeDot:{width:16,height:4,borderRadius:2,backgroundColor:theme.colors.borderStrong},welcomeKicker:{fontSize:11,fontWeight:"800",letterSpacing:1,color:theme.colors.primary},
featureRow:{flexDirection:"row",alignItems:"center",gap:12,minHeight:62,padding:12,borderRadius:15,borderWidth:1,borderColor:theme.colors.border},welcomeHeader:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},welcomeBrand:{flexDirection:"row",alignItems:"center",gap:10},welcomeBrandName:{fontSize:17,fontWeight:"800",color:theme.colors.text},welcomeBrandTag:{fontSize:10,color:theme.colors.muted,marginTop:2},welcomeProgress:{flexDirection:"row",gap:5},welcomeProgressActive:{width:18,height:4,borderRadius:2,backgroundColor:theme.colors.primary},welcomeProgressDot:{width:7,height:4,borderRadius:2,backgroundColor:theme.colors.borderStrong},welcomeHeading:{fontSize:27,lineHeight:34,fontWeight:"800",color:theme.colors.text},welcomeIntro:{fontSize:15,lineHeight:22,color:theme.colors.muted},familyArtwork:{marginHorizontal:-4,overflow:"hidden",borderRadius:18,backgroundColor:"#EEF6F0"},memberCompleted:{backgroundColor:theme.colors.surfaceMuted,borderColor:"#CFE0D4"},avatarCompleted:{backgroundColor:"#DDEDE2"},completedText:{color:theme.colors.success},otpInfo:{flexDirection:"row",alignItems:"center",gap:10,padding:12,borderRadius:14,backgroundColor:theme.colors.primarySoft},otpCheck:{fontSize:18,fontWeight:"900",color:theme.colors.success},otpInfoText:{flex:1,fontSize:13,fontWeight:"700",color:theme.colors.text},facePreparationCard:{gap:14,padding:14,borderRadius:18,backgroundColor:"#F5F8F6",borderWidth:1,borderColor:theme.colors.border},faceGuide:{height:190,borderRadius:18,backgroundColor:"#EAF2EC",alignItems:"center",justifyContent:"center",overflow:"hidden"},faceFrame:{width:122,height:158,borderRadius:61,borderWidth:3,borderColor:theme.colors.primary},faceChecklist:{gap:8},faceCaptureCard:{height:330,borderRadius:22,backgroundColor:"#EAF2EC",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative"},faceFrameLarge:{width:205,height:255,borderRadius:103,borderWidth:4,borderColor:theme.colors.primary},capturePill:{position:"absolute",bottom:18,left:18,right:18,minHeight:44,paddingHorizontal:14,borderRadius:14,backgroundColor:"rgba(23,52,42,0.88)",alignItems:"center",justifyContent:"center"},capturePillText:{fontSize:13,fontWeight:"700",color:theme.colors.white,textAlign:"center"},language:{minHeight:theme.minTouchTarget,paddingHorizontal:16,borderRadius:14,borderWidth:1,borderColor:theme.colors.border,backgroundColor:theme.colors.white,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},languageSelected:{borderColor:theme.colors.primary,backgroundColor:theme.colors.primarySoft},languageText:{fontSize:15,fontWeight:"700",color:theme.colors.text},tick:{fontSize:18,fontWeight:"900",color:theme.colors.primary},featureIcon:{width:40,height:40,borderRadius:13,alignItems:"center",justifyContent:"center"},featureorange:{backgroundColor:"#FFF0DE"},featuregreen:{backgroundColor:"#E4F4E9"},featuregold:{backgroundColor:"#FFF4D7"},featureblue:{backgroundColor:"#E8F1FF"},featureIconText:{fontSize:19,fontWeight:"800",color:theme.colors.primary},featureCopy:{flex:1},featureTitle:{fontSize:14,fontWeight:"800",color:theme.colors.text},featureText:{fontSize:12,lineHeight:17,color:theme.colors.muted,marginTop:2},valueStrip:{flexDirection:"row",justifyContent:"space-between",paddingVertical:4},valueItem:{flex:1,alignItems:"center",gap:4},valueIcon:{fontSize:20,color:theme.colors.primary,fontWeight:"800"},valueText:{fontSize:10,fontWeight:"700",color:theme.colors.text,textAlign:"center"},
primary:{minHeight:54,paddingHorizontal:18,borderRadius:theme.radius.button,backgroundColor:theme.colors.primary,alignItems:"center",justifyContent:"center",flexDirection:"row"},primaryPressed:{backgroundColor:theme.colors.primaryPressed},primaryText:{color:theme.colors.white,fontSize:16,fontWeight:"800",flex:1,textAlign:"center",paddingLeft:24},primaryArrow:{color:theme.colors.white,fontSize:20,fontWeight:"700"},secondary:{minHeight:50,paddingHorizontal:18,borderRadius:theme.radius.button,backgroundColor:theme.colors.white,borderWidth:1.5,borderColor:theme.colors.primary,alignItems:"center",justifyContent:"center"},secondaryText:{color:theme.colors.primary,fontSize:15,fontWeight:"800"},disabled:{opacity:.45},
input:{minHeight:56,paddingHorizontal:16,borderRadius:theme.radius.input,borderWidth:1,borderColor:theme.colors.borderStrong,fontSize:17,color:theme.colors.text,backgroundColor:theme.colors.white},stepLabel:{fontSize:11,fontWeight:"800",color:theme.colors.primary,textTransform:"uppercase",letterSpacing:.8},member:{minHeight:76,padding:14,borderRadius:16,borderWidth:1,borderColor:theme.colors.border,flexDirection:"row",alignItems:"center",gap:12},avatar:{width:44,height:44,borderRadius:14,backgroundColor:theme.colors.primarySoft,alignItems:"center",justifyContent:"center"},avatarText:{fontSize:18,fontWeight:"800",color:theme.colors.primary},memberCopy:{flex:1},memberName:{fontSize:17,fontWeight:"700",color:theme.colors.text,marginBottom:3},arrow:{fontSize:30,color:theme.colors.primary},
consentItem:{flexDirection:"row",gap:11,alignItems:"flex-start"},consentIcon:{width:30,height:30,borderRadius:15,backgroundColor:theme.colors.primarySoft,alignItems:"center",justifyContent:"center"},consentIconText:{color:theme.colors.primary,fontWeight:"800"},consentItemText:{flex:1,fontSize:13,lineHeight:19,color:theme.colors.text},checkRow:{flexDirection:"row",gap:10,alignItems:"flex-start",paddingVertical:3},checkbox:{width:25,height:25,borderRadius:7,borderWidth:2,borderColor:theme.colors.borderStrong,alignItems:"center",justifyContent:"center"},checkboxSelected:{backgroundColor:theme.colors.primary,borderColor:theme.colors.primary},check:{fontSize:16,color:theme.colors.white,fontWeight:"800"},checkLabel:{flex:1,fontSize:13,lineHeight:19,color:theme.colors.text,paddingTop:2},
providerCard:{flexDirection:"row",alignItems:"center",gap:12,padding:14,borderRadius:17,borderWidth:1.5,borderColor:theme.colors.primary,backgroundColor:"#FAFFFC"},providerIcon:{width:48,height:48,borderRadius:16,backgroundColor:"#E9F3FF",alignItems:"center",justifyContent:"center"},providerIconText:{color:theme.colors.blue,fontSize:24,fontWeight:"900"},providerCopy:{flex:1},providerTitle:{fontSize:14,fontWeight:"800",color:theme.colors.text},providerCheck:{width:24,height:24,borderRadius:12,backgroundColor:theme.colors.primary,alignItems:"center",justifyContent:"center"},providerCheckText:{color:theme.colors.white,fontWeight:"900"},
infoCard:{flexDirection:"row",gap:12,padding:14,borderRadius:16,backgroundColor:theme.colors.surfaceBlue,borderWidth:1,borderColor:"#D7E7F8"},infoIcon:{width:28,height:28,borderRadius:14,backgroundColor:theme.colors.blue,alignItems:"center",justifyContent:"center"},infoIconText:{color:theme.colors.white,fontWeight:"800"},infoTitle:{fontSize:13,fontWeight:"800",color:theme.colors.text,marginBottom:3},infoText:{fontSize:12,color:theme.colors.muted,lineHeight:18},
processingHero:{alignItems:"center",paddingVertical:4},processingRing:{width:102,height:102,borderRadius:51,borderWidth:8,borderColor:"#DCEFE3",borderTopColor:theme.colors.blue,alignItems:"center",justifyContent:"center"},processingFace:{width:58,height:58,borderRadius:20,backgroundColor:"#EDF4FF",alignItems:"center",justifyContent:"center"},processingFaceText:{color:theme.colors.blue,fontSize:34,fontWeight:"800"},processingCaption:{fontSize:11,fontWeight:"800",color:theme.colors.primary,marginTop:8},timeline:{gap:0},timelineRow:{minHeight:42,flexDirection:"row",gap:12},timelineRail:{width:20,alignItems:"center"},timelineDot:{width:18,height:18,borderRadius:9,borderWidth:1.5,borderColor:theme.colors.borderStrong,backgroundColor:theme.colors.white,alignItems:"center",justifyContent:"center"},timelineDone:{backgroundColor:theme.colors.success,borderColor:theme.colors.success},timelineActive:{backgroundColor:theme.colors.blue,borderColor:theme.colors.blue},timelineDotText:{fontSize:11,color:theme.colors.white,fontWeight:"900"},timelineLine:{flex:1,width:2,backgroundColor:theme.colors.border,marginVertical:2},timelineLineDone:{backgroundColor:theme.colors.success},timelineText:{flex:1,fontSize:13,color:theme.colors.muted,paddingTop:1},timelineTextActive:{color:theme.colors.text,fontWeight:"800"},
referenceCard:{padding:16,borderRadius:16,backgroundColor:theme.colors.surfaceMuted,borderWidth:1,borderColor:"#DCE8E0"},referenceTop:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",gap:8},referenceLabel:{fontSize:11,fontWeight:"800",color:theme.colors.muted,textTransform:"uppercase",letterSpacing:.8,marginBottom:5},reference:{fontSize:16,fontWeight:"800",color:theme.colors.text},statusPill:{flexDirection:"row",alignItems:"center",gap:5,paddingHorizontal:8,paddingVertical:5,borderRadius:999,backgroundColor:theme.colors.primarySoft},statusDot:{width:7,height:7,borderRadius:4,backgroundColor:theme.colors.primary},statusPillText:{fontSize:10,fontWeight:"800",color:theme.colors.primary},
successHero:{alignItems:"center",height:105,justifyContent:"center"},confetti:{position:"absolute",top:0,fontSize:20,color:theme.colors.accent},successIcon:{width:76,height:76,borderRadius:38,backgroundColor:"#E2F2E7",alignItems:"center",justifyContent:"center"},successIconText:{fontSize:42,fontWeight:"900",color:theme.colors.success},detailsCard:{borderWidth:1,borderColor:theme.colors.border,borderRadius:16,overflow:"hidden",backgroundColor:theme.colors.white},detailRow:{minHeight:50,paddingHorizontal:14,flexDirection:"row",alignItems:"center",borderBottomWidth:1,borderBottomColor:theme.colors.border},detailLabel:{flex:1,fontSize:11,fontWeight:"700",color:theme.colors.muted},detailValue:{maxWidth:"62%",fontSize:12,fontWeight:"800",color:theme.colors.text,textAlign:"right"},detailSuccess:{color:theme.colors.success},successMeta:{flexDirection:"row",alignItems:"center",gap:8,padding:12,borderRadius:13,backgroundColor:theme.colors.primarySoft},successMetaMark:{color:theme.colors.primary,fontSize:17,fontWeight:"900"},successMetaText:{flex:1,fontSize:11,lineHeight:16,color:theme.colors.muted},
errorCard:{padding:14,borderRadius:14,backgroundColor:"#FFF0EF",borderWidth:1,borderColor:"#F1C8C4"},error:{color:theme.colors.error,fontSize:14,lineHeight:20,fontWeight:"600"},back:{textAlign:"center",fontSize:15,fontWeight:"700",color:theme.colors.primary,paddingVertical:14,minHeight:theme.minTouchTarget},footer:{textAlign:"center",fontSize:11,color:theme.colors.muted,paddingTop:2},pressed:{opacity:.72},
});
