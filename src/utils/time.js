export const isHHMM = (value) => {
    if (typeof value !== "string") return false;

    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
  };
  
  export const toMinutes = (hhmm) => {
    if (!isHHMM(hhmm)) return NaN;
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };
  
  export const minutesToHHMM = (minutes) => {
    const m = Number(minutes);
    if (!Number.isFinite(m) || m < 0) return "";
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  };
  
  export const overlaps = (startA, endA, startB, endB) => {
    const a1 = toMinutes(startA);
    const a2 = toMinutes(endA);
    const b1 = toMinutes(startB);
    const b2 = toMinutes(endB);
  
    if (![a1, a2, b1, b2].every(Number.isFinite)) return false;
    return a1 < b2 && a2 > b1;
  };