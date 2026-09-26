import { SvgXml } from "react-native-svg";

const MARK = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <rect x="8" y="8" width="240" height="240" rx="58" fill="#176B45"/>
  <path d="M58 184V72h24l46 67V72h28v112h-24L86 117v67H58Z" fill="#FFF9EA"/>
  <path d="M154 184h24l20-31 20 31h-30l-10-15-10 15h-14Z" fill="#C8942E"/>
  <circle cx="205" cy="70" r="16" fill="#C8942E"/>
  <path d="M198 70l5 5 10-12" fill="none" stroke="#176B45" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export function NammaKycLogo({ size = 56 }: { size?: number }) {
  return <SvgXml xml={MARK} width={size} height={size} />;
}
