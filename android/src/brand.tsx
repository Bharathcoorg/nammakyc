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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 230">
  <defs><linearGradient id="bg" y1="0" y2="1"><stop stop-color="#EEF6F0"/><stop offset="1" stop-color="#FFF9EA"/></linearGradient></defs>
  <rect width="500" height="230" rx="32" fill="url(#bg)"/>
  <path d="M0 203c72-42 126-39 203-18 92 25 183 25 297-12v57H0Z" fill="#D7E9D9"/>
  <g stroke="#17342A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="165" cy="78" r="31" fill="#C98C62"/><path d="M132 75c4-36 64-46 76 1-17-13-34-19-76-1Z" fill="#3A2C28" stroke="none"/>
    <path d="M126 116c16-23 62-23 79 0l15 70H111Z" fill="#176B45"/>
    <circle cx="250" cy="72" r="27" fill="#C98C62"/><path d="M224 69c3-29 48-39 61 1-12-12-29-16-61-1Z" fill="#3A2C28" stroke="none"/>
    <path d="M215 106c14-19 47-19 61 0l13 78h-88Z" fill="#C8942E"/>
    <circle cx="330" cy="112" r="23" fill="#C98C62"/><path d="M309 109c2-25 39-32 50 1-11-9-24-12-50-1Z" fill="#3A2C28" stroke="none"/>
    <path d="M299 143c12-17 43-17 55 0l8 49h-71Z" fill="#2C73D2"/>
  </g>
  <g fill="#FFF9EA" stroke="#17342A" stroke-width="3">
    <circle cx="154" cy="79" r="3"/><circle cx="176" cy="79" r="3"/>
    <circle cx="241" cy="73" r="3"/><circle cx="258" cy="73" r="3"/>
    <circle cx="323" cy="112" r="3"/><circle cx="337" cy="112" r="3"/>
  </g>
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
