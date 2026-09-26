export function canonicalFingerprint(input: Record<string, string>): string {
  return JSON.stringify(Object.keys(input).sort().reduce<Record<string,string>>((out, key) => {
    out[key] = input[key].trim();
    return out;
  }, {}));
}
