export function splitBySemicolon(str: string): string[] {
  const match = str.match(/(".*?"|[^";\s]+)(?=\s*;|\s*$)/g);
  return (match || []).map(x => chomp(chompStart(x, '"'), '"'));
}

export function chompStart(s: string, symbol: string): string {
  return s.startsWith(symbol) ? s.substr(symbol.length) : s;
}

export function chomp(s: string, symbol: string): string {
  return s.endsWith(symbol) ? s.substr(0, s.length - symbol.length) : s;
}
