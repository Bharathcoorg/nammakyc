const fs = require("fs");
const path = require("path");

const assetsDir = path.resolve(__dirname, "../android/assets");
const emblemPath = path.join(assetsDir, "karnataka-emblem.png");
const soudhaPath = path.join(assetsDir, "vidhana-soudha.jpg");
const outPath = path.resolve(__dirname, "../android/src/assetsData.ts");

const emblemB64 = fs.readFileSync(emblemPath).toString("base64");
const soudhaB64 = fs.readFileSync(soudhaPath).toString("base64");

const content = `// Embedded asset base64 data URIs for 100% reliable standalone Android rendering
export const KARNATAKA_EMBLEM_URI = "data:image/png;base64,${emblemB64}";
export const VIDHANA_SOUDHA_URI = "data:image/jpeg;base64,${soudhaB64}";
`;

fs.writeFileSync(outPath, content, "utf8");
console.log("Successfully generated android/src/assetsData.ts with embedded assets!");
