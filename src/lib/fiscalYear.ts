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
//
// AUTO-CALCULATION (manually update garnu naparos vanera):
// Nepali New Year (1 Baisakh) English calendar ma April 13 ya 14 tarikma parxa.
// Teो date pugisake, BS year 1 le badhxa. Yो formula le teही logic use garxa,
// harek varsha automatically sahi current BS year nikalxa - kunai manual
// update chahिदैन, code sadaiko lagi correct rahन्छ.

function getCurrentBSYear(): number {
  const today = new Date();
  const adYear = today.getFullYear();

  // Nepali New Year AD calendar ma April 14 tira parxa (kahilekahi April 13).
  // April 14 pachi (teही din samet) BS year ek year agadi badhisakeko huन्छ.
  const nepaliNewYear = new Date(adYear, 3, 14); // Month index 3 = April

  if (today >= nepaliNewYear) {
    return adYear + 57;
  }
  return adYear + 56;
}

const CURRENT_BS_YEAR = getCurrentBSYear();

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
