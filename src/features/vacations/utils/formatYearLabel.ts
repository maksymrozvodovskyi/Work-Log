export function formatYearLabel(startYear: number) {
  const endYear = startYear + 1;
  const endYearShort = endYear.toString().slice(-2);
  return `${startYear}–${endYearShort}`;
}
