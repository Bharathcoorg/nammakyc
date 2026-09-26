import { SvgXml } from "react-native-svg";

const MARK = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <rect x="8" y="8" width="240" height="240" rx="58" fill="#176B45"/>
  <path d="M58 184V72h24l46 67V72h28v112h-24L86 117v67H58Z" fill="#FFF9EA"/>
  <path d="M154 184h24l20-31 20 31h-30l-10-15-10 15h-14Z" fill="#C8942E"/>
  <circle cx="205" cy="70" r="16" fill="#C8942E"/>
  <path d="M198 70l5 5 10-12" fill="none" stroke="#176B45" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const EMBLEM = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 190">
  <defs><linearGradient id="gold" x1="0" x2="1"><stop stop-color="#C58A22"/><stop offset=".5" stop-color="#E0B84A"/><stop offset="1" stop-color="#A96D16"/></linearGradient></defs>
  <g fill="url(#gold)" stroke="#8D5C15" stroke-width="2">
    <path d="M110 18c-12-11-30-9-38 3 4 11 15 18 29 18-4-8-2-16 9-21Z"/>
    <path d="M110 18c12-11 30-9 38 3-4 11-15 18-29 18 4-8 2-16-9-21Z"/>
    <circle cx="110" cy="39" r="14"/>
    <path d="M82 47c-20-8-35 3-37 17 11 7 25 5 37-5-2-4-2-8 0-12Zm56 0c20-8 35 3 37 17-11 7-25 5-37-5 2-4 2-8 0-12Z"/>
    <path d="M55 70c-15 7-19 23-9 34 11 2 21-5 26-17-8-3-13-8-17-17Zm110 0c15 7 19 23 9 34-11 2-21-5-26-17 8-3 13-8 17-17Z"/>
    <path d="M63 82c-17 10-20 30-8 41 13 1 24-8 28-23-9-2-16-8-20-18Zm94 0c17 10 20 30 8 41-13 1-24-8-28-23 9-2 16-8 20-18Z"/>
  </g>
  <path d="M76 65h68l-5 57H81Z" fill="#B52E32" stroke="#8D2529" stroke-width="3"/>
  <path d="M92 83c7-10 18-10 18 0 0-10 11-10 18 0-3 13-13 19-18 25-5-6-15-12-18-25Z" fill="#FFF9EA"/>
  <path d="M72 126h76l-12 24H84Z" fill="#176B45" stroke="#0E4C32" stroke-width="3"/>
  <path d="M94 151h32l-6 12H100Z" fill="#C8942E"/>
  <path d="M82 165h56" stroke="#C8942E" stroke-width="4" stroke-linecap="round"/>
</svg>`;

const SOUDHA = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 220">
  <defs><linearGradient id="sky" y1="0" y2="1"><stop stop-color="#F5F2E8"/><stop offset="1" stop-color="#E9F1EC"/></linearGradient></defs>
  <rect width="600" height="220" rx="28" fill="url(#sky)"/>
  <circle cx="82" cy="56" r="28" fill="#E4D9A7" opacity=".55"/>
  <path d="M0 188c100-42 182-31 276-5 107 29 201 24 324-15v52H0Z" fill="#C7DCC8"/>
  <path d="M76 173h448v17H76Z" fill="#D8CBA9"/>
  <g fill="#E6D9BA" stroke="#C4B48D" stroke-width="2">
    <path d="M112 166V99h46v67Z"/><path d="M180 166V80h48v86Z"/><path d="M245 166V58h110v108Z"/><path d="M372 166V80h48v86Z"/><path d="M438 166V99h46v67Z"/>
    <path d="M251 58h98l-49-35Z"/>
    <path d="M103 99h64l-32-25Z"/><path d="M171 80h66l-33-27Z"/><path d="M363 80h66l-33-27Z"/><path d="M433 99h64l-32-25Z"/>
  </g>
  <g fill="#BDAE83">
    <path d="M126 166v-49h8v49Zm18 0v-49h8v49Zm48 0v-69h9v69Zm20 0v-69h9v69Zm-1-92h15v7h-15Zm-6-9h27v6h-27Zm101 101V82h10v84Zm28 0V82h10v84Zm-2-92h14v7h-14Zm-5-9h24v6h-24Zm48 101v-49h8v49Zm18 0v-49h8v49Z"/>
  </g>
  <path d="M278 93h44v73h-44Z" fill="#D7C7A1"/>
  <path d="M283 93h34v73h-34Z" fill="#BFAF83"/>
  <path d="M296 126h8v40h-8Z" fill="#6B5A3D"/>
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

export function NammaKycLogo({ size = 56 }: { size?: number }) {
  return <SvgXml xml={MARK} width={size} height={size} />;
}

export function KarnatakaEmblem({ width = 78 }: { width?: number }) {
  return <SvgXml xml={EMBLEM} width={width} height={width * 0.864} />;
}

export function VidhanaSoudhaIllustration({ width = 340 }: { width?: number }) {
  return <SvgXml xml={SOUDHA} width={width} height={width * 0.367} />;
}

export function FamilyIllustration({ width = 340 }: { width?: number }) {
  return <SvgXml xml={FAMILY} width={width} height={width * 0.46} />;
}
