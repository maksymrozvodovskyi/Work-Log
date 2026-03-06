export function countUsedByYear(workLogs: { date: string }[]) {
  const usedByYear: Record<number, number> = {};

  for (const log of workLogs) {
    const year = new Date(log.date).getFullYear();

    if (usedByYear[year] === undefined) {
      usedByYear[year] = 1;
    } else {
      usedByYear[year] += 1;
    }
  }

  return usedByYear;
}
