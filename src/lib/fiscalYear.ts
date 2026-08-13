// ==============================================
// Fiscal Year Utility
// ==============================================
// KINA YO CHAHINXA:
// Nepal ko fiscal year "2080-81" jasto format ma huन्छ (Shrawan bata Ashad samma).
// Company establishment year (BS) thaha vaye pachi, teो year bata aaile ko
// current BS year samma ko sabai fiscal year list auto-generate garna yo function chahinxa.
//
// Example: company 2070 ma sthapना vayeko vaye ->
// ["2070-71", "2071-72", "2072-73", ..., "2082-83"] auto-generate huन्छ

// Aaile (2082-83 BS chalira है - 2026 AD lagvag). Yo value lai future ma update
// garna sakinxa, ya chaheko bela aaru precise BS-AD conversion library use garna sakinxa.
const CURRENT_BS_YEAR = 2083;

export function generateFiscalYears(establishmentYearBS: string): string[] {
  const startYear = parseInt(establishmentYearBS, 10);

  if (isNaN(startYear) || startYear < 1990 || startYear > CURRENT_BS_YEAR) {
    return [];
  }

  const fiscalYears: string[] = [];
  for (let year = startYear; year <= CURRENT_BS_YEAR; year++) {
    const nextYearShort = (year + 1).toString().slice(-2); // e.g. 2071 -> "71"
    fiscalYears.push(`${year}-${nextYearShort}`);
  }

  // Sabai bhanda naya year pahila dekhaune (latest first)
  return fiscalYears.reverse();
}

export function getCurrentFiscalYear(): string {
  const nextYearShort = (CURRENT_BS_YEAR + 1).toString().slice(-2);
  return `${CURRENT_BS_YEAR}-${nextYearShort}`;
}
