/**
 * Creates a UTC date at noon. Uses setUTCFullYear to handle years 0-99 and negative years.
 * With no args: current date at noon UTC.
 * With year only: current month/day but given year.
 * With year+month+day: specific date at noon UTC.
 * Month is 0-based (0 = January).
 */
export function createUTCDate(year?: number, month?: number, day?: number): Date {
  const now = new Date();
  const y = year !== undefined ? year : now.getUTCFullYear();
  const m = month !== undefined ? month : now.getUTCMonth();
  const d = day !== undefined ? day : now.getUTCDate();
  const date = new Date(Date.UTC(2000, m, d, 12, 0, 0, 0));
  date.setUTCFullYear(y);
  return date;
}

export function currentYear(): number {
  return new Date().getUTCFullYear();
}

export function diffYears(d1: Date, d2: Date): number {
  return Math.abs(d1.getUTCFullYear() - d2.getUTCFullYear());
}

export function diffDays(d1: Date, d2: Date): number {
  const msPerDay = 86400000;
  return Math.round(Math.abs(d1.getTime() - d2.getTime()) / msPerDay);
}

export function isBefore(d1: Date, d2: Date): boolean {
  return d1.getTime() < d2.getTime();
}

export function daysInMonth(year: number, month: number): number {
  const d = new Date(Date.UTC(2000, 0, 1));
  d.setUTCFullYear(year);
  d.setUTCMonth(month + 1, 0);
  return d.getUTCDate();
}

/**
 * Reimplementation of moment-precise-range logic.
 * Returns a human-readable string like "2 years, 3 months and 5 days".
 */
export function preciseDiff(d1: Date, d2: Date): string {
  let m1 = new Date(d1.getTime());
  let m2 = new Date(d2.getTime());

  if (m1 > m2) {
    [m1, m2] = [m2, m1];
  }

  let yDiff = m2.getUTCFullYear() - m1.getUTCFullYear();
  let mDiff = m2.getUTCMonth() - m1.getUTCMonth();
  let dDiff = m2.getUTCDate() - m1.getUTCDate();
  let hourDiff = m2.getUTCHours() - m1.getUTCHours();
  let minDiff = m2.getUTCMinutes() - m1.getUTCMinutes();
  let secDiff = m2.getUTCSeconds() - m1.getUTCSeconds();

  if (secDiff < 0) { secDiff += 60; minDiff--; }
  if (minDiff < 0) { minDiff += 60; hourDiff--; }
  if (hourDiff < 0) { hourDiff += 24; dDiff--; }
  if (dDiff < 0) {
    const prevMonth = new Date(Date.UTC(m2.getUTCFullYear(), m2.getUTCMonth(), 0));
    const daysInLastMonth = prevMonth.getUTCDate();
    if (daysInLastMonth < m1.getUTCDate()) {
      dDiff = daysInLastMonth + dDiff + (m1.getUTCDate() - daysInLastMonth);
    } else {
      dDiff = daysInLastMonth + dDiff;
    }
    mDiff--;
  }
  if (mDiff < 0) { mDiff += 12; yDiff--; }

  const parts: string[] = [];
  if (yDiff) parts.push(yDiff + (yDiff === 1 ? " year" : " years"));
  if (mDiff) parts.push(mDiff + (mDiff === 1 ? " month" : " months"));
  if (dDiff) parts.push(dDiff + (dDiff === 1 ? " day" : " days"));

  if (parts.length === 0) return "0 days";
  if (parts.length === 1) return parts[0];
  return parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1];
}

export function formatMonthDay(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
}

export function formatMonthDayYear(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export function formatYear(year: number): string {
  if (year < 0) return Math.abs(year) + " B.C.";
  return String(year);
}

export function formatEventDate(event: { year: number; month: number | null; day: number | null }): string {
  if (event.month && event.day) {
    const d = createUTCDate(event.year, event.month - 1, event.day);
    const year = formatYear(event.year);
    return formatMonthDay(d) + ", " + year;
  }
  return formatYear(event.year);
}

function plural(n: number, unit: string): string {
  return n + " " + unit + (n !== 1 ? "s" : "");
}

export function formatSpan(
  d1: Date,
  d2: Date,
  yearsOnly: boolean,
  timespanFormat: number
): string {
  if (yearsOnly || timespanFormat === 1) {
    const years = diffYears(d1, d2);
    return plural(years, "year");
  }
  if (timespanFormat === 2) {
    return preciseDiff(d1, d2);
  }
  // timespanFormat === 0: days
  const days = diffDays(d1, d2);
  return plural(days, "day");
}
