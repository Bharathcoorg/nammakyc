import { Image, View } from "react-native";
import { SvgXml } from "react-native-svg";

const MARK = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <rect x="8" y="8" width="240" height="240" rx="58" fill="#176B45"/>
  <path d="M58 184V72h24l46 67V72h28v112h-24L86 117v67H58Z" fill="#FFF9EA"/>
  <path d="M154 184h24l20-31 20 31h-30l-10-15-10 15h-14Z" fill="#C8942E"/>
  <circle cx="205" cy="70" r="16" fill="#C8942E"/>
  <path d="M198 70l5 5 10-12" fill="none" stroke="#176B45" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const FAMILY_MINIMALIST = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 200" fill="none">
  <ellipse cx="190" cy="188" rx="150" ry="7" fill="#0d4a36" fill-opacity="0.08"/>
  <g id="father">
    <path d="M86 182v-48c0-22 15-36 34-36s34 14 34 36v48H86z" fill="#0d4a36"/>
    <path d="M114 98l6 14 6-14" stroke="#c8942e" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="120" y1="112" x2="120" y2="148" stroke="#c8942e" stroke-width="2" stroke-linecap="round"/>
    <circle cx="120" cy="62" r="23" fill="#fcf9f2"/>
    <path d="M98 60c0-14 10-24 22-24s22 10 22 24c0 4-1 8-3 11-4-9-11-15-22-15-9 0-16 5-19 14z" fill="#072e21"/>
    <path d="M112 72c3 2 6 2 8 0 2 2 5 2 8 0" stroke="#072e21" stroke-width="2.5" stroke-linecap="round"/>
  </g>
  <g id="mother">
    <circle cx="272" cy="62" r="13" fill="#072e21"/>
    <circle cx="272" cy="62" r="16" stroke="#c8942e" stroke-width="2" stroke-dasharray="3 3"/>
    <path d="M226 182v-42c0-20 15-34 34-34s34 14 34 34v42H226z" fill="#c8942e"/>
    <path d="M228 140c12-16 28-36 42-36 7 0 15 8 18 18l-38 60h-22z" fill="#b38020"/>
    <path d="M232 182l40-70" stroke="#166b4f" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="258" cy="66" r="21" fill="#fcf9f2"/>
    <path d="M238 64c0-13 9-22 20-22s20 9 20 22c0 3-1 7-2 9-4-8-10-13-19-13-8 0-15 4-18 12z" fill="#072e21"/>
    <circle cx="256" cy="62" r="2.5" fill="#c8942e"/>
  </g>
  <g id="son">
    <path d="M152 182v-34c0-16 12-26 26-26s26 10 26 26v34h-52z" fill="#166b4f"/>
    <line x1="178" y1="122" x2="178" y2="150" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    <circle cx="178" cy="94" r="17" fill="#fcf9f2"/>
    <path d="M162 90c2-9 8-14 16-14s14 5 16 12c-4-4-10-6-17-4-5 1-11 5-15 6z" fill="#072e21"/>
  </g>
  <g id="daughter">
    <path d="M206 134c-2 10-6 18-8 26M230 134c2 10 6 18 8 26" stroke="#072e21" stroke-width="3" stroke-linecap="round"/>
    <circle cx="198" cy="160" r="3" fill="#c8942e"/>
    <circle cx="238" cy="160" r="3" fill="#c8942e"/>
    <path d="M198 182v-24c0-12 9-20 20-20s20 8 20 20v24h-40z" fill="#d97706"/>
    <path d="M196 172h44v10h-44z" fill="#0d4a36"/>
    <circle cx="218" cy="116" r="14" fill="#fcf9f2"/>
    <path d="M205 112c2-7 7-10 13-10s12 3 14 9c-3-3-9-4-15-3-5 1-9 4-12 4z" fill="#072e21"/>
    <circle cx="218" cy="114" r="1.8" fill="#c8942e"/>
  </g>
  <circle cx="190" cy="32" r="18" fill="#c8942e" fill-opacity="0.12"/>
  <circle cx="190" cy="32" r="26" stroke="#c8942e" stroke-width="1" stroke-dasharray="4 4" opacity="0.3"/>
</svg>`;

const SERVICE_ICONS = {
  card: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="#176B45" stroke-width="1.8"/><path d="M7 9h5M7 13h3M15 12h3" fill="none" stroke="#176B45" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 4.5-2.8 8-7 10-4.2-2-7-5.5-7-10V6l7-3Z" fill="none" stroke="#176B45" stroke-width="1.8" stroke-linejoin="round"/><path d="m9 12 2 2 4-4" fill="none" stroke="#C8942E" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  privacy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="#176B45" stroke-width="1.8"/><path d="M8.5 12.5 11 15l4.8-5.5" fill="none" stroke="#176B45" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  bolt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.5 2.8 5.8 13h5.7l-1 8.2L18.2 11h-5.7l1-8.2Z" fill="none" stroke="#176B45" stroke-width="1.8" stroke-linejoin="round"/></svg>`
} as const;

export function ServiceIcon({ name, size = 28 }: { name: keyof typeof SERVICE_ICONS; size?: number }) {
  return <SvgXml xml={SERVICE_ICONS[name]} width={size} height={size} />;
}

export function NammaKycLogo({ size = 56 }: { size?: number }) {
  return <SvgXml xml={MARK} width={size} height={size} />;
}

export function FamilyIllustration({ width = 320 }: { width?: number | string }) {
  return (
    <View style={{ width: "100%", height: 170, alignItems: "center", justifyContent: "center", marginVertical: 4 }}>
      <SvgXml xml={FAMILY_MINIMALIST} width={typeof width === "number" ? width : 320} height={170} />
    </View>
  );
}
