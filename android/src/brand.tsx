import { SvgXml } from "react-native-svg";

const MARK = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <rect x="8" y="8" width="240" height="240" rx="58" fill="#176B45"/>
  <path d="M58 184V72h24l46 67V72h28v112h-24L86 117v67H58Z" fill="#FFF9EA"/>
  <path d="M154 184h24l20-31 20 31h-30l-10-15-10 15h-14Z" fill="#C8942E"/>
  <circle cx="205" cy="70" r="16" fill="#C8942E"/>
  <path d="M198 70l5 5 10-12" fill="none" stroke="#176B45" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const FAMILY = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 300">
<defs><linearGradient id="bg" y1="0" y2="1"><stop stop-color="#F0F7F2"/><stop offset="1" stop-color="#FFF9EA"/></linearGradient></defs>
<rect width="640" height="300" rx="36" fill="url(#bg)"/><ellipse cx="320" cy="270" rx="275" ry="40" fill="#DCECDF"/>
<g stroke="#17342A" stroke-width="3.5" stroke-linejoin="round"><circle cx="235" cy="105" r="43" fill="#C98C62"/><path d="M190 103c3-49 86-57 92 4-18-17-48-24-92-4Z" fill="#342A27" stroke="none"/><path d="M183 165c17-30 88-30 105 0l18 91H165Z" fill="#176B45"/><circle cx="219" cy="108" r="4" fill="#FFF9EA"/><circle cx="251" cy="108" r="4" fill="#FFF9EA"/><path d="M224 128q11 9 22 0" fill="none" stroke="#8D5844"/></g>
<g stroke="#17342A" stroke-width="3.5" stroke-linejoin="round"><circle cx="350" cy="98" r="39" fill="#C98C62"/><path d="M309 96c2-45 78-51 84 4-18-14-43-20-84-4Z" fill="#342A27" stroke="none"/><path d="M301 153c15-27 78-27 94 0l17 103H284Z" fill="#C8942E"/><circle cx="335" cy="101" r="3.5" fill="#FFF9EA"/><circle cx="365" cy="101" r="3.5" fill="#FFF9EA"/><path d="M339 120q10 8 20 0" fill="none" stroke="#8D5844"/></g>
<g stroke="#17342A" stroke-width="3.2" stroke-linejoin="round"><circle cx="455" cy="145" r="31" fill="#C98C62"/><path d="M423 143c2-34 59-40 64 3-13-11-30-15-64-3Z" fill="#342A27" stroke="none"/><path d="M415 187c11-20 52-20 63 0l11 68h-86Z" fill="#2C73D2"/><circle cx="444" cy="147" r="3" fill="#FFF9EA"/><circle cx="466" cy="147" r="3" fill="#FFF9EA"/><path d="M447 162q8 6 15 0" fill="none" stroke="#8D5844"/></g>
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

export function FamilyIllustration({ width = 340 }: { width?: number }) {
  return <SvgXml xml={FAMILY} width={width} height={width * 0.46} />;
}
