// ========================================================
// Nepali Unicode <-> Preeti Font Bidirectional Converter
// By Dear Er / Office Docs Manager
// ========================================================

// 1. Direct character mappings
const UNICODE_TO_PREETI_CHARS: Record<string, string> = {
  // Numbers
  "०": ")", "१": "!", "२": "@", "३": "#", "४": "$",
  "५": "%", "६": "^", "७": "&", "८": "*", "९": "(",

  // Punctuation & symbols
  "।": "|", "–": "–", "—": "—", "/": "÷", "÷": "÷",

  // Independent Vowels
  "अ": "c", "आ": "cf", "इ": "O{", "ई": "O{", "उ": "p", "ऊ": "pm",
  "ऋ": "C", "ए": "P", "ऐ": "P]", "ओ": "cf]", "औ": "cf}",

  // Consonants
  "क": "s", "ख": "v", "ग": "u", "घ": "3", "ङ": "ª",
  "च": "r", "छ": "5", "ज": "h", "झ": "H", "ञ": "`",
  "ट": "6", "ठ": "7", "ड": "8", "ढ": "9", "ण": "0",
  "त": "t", "थ": "y", "द": "b", "ध": "w", "न": "g",
  "प": "k", "फ": "km", "ब": "a", "भ": "e", "म": "d",
  "य": "o", "र": "/", "ल": "n", "व": "j", "श": "z",
  "ष": "i", "स": ";", "ह": "x",

  // Dependent Vowel Signs (Matras)
  "ा": "f",
  "ी": "L",
  "ु": "'",
  "ू": "\"",
  "ृ": "[",
  "े": "]",
  "ै": "}",
  "ो": "f]",
  "ौ": "f}",
  "ं": "F",
  "ँ": "F",
  "ः": ":",
  "्": "\\",
};

// Common composite conjuncts in Preeti
const SPECIAL_CONJUNCTS: [RegExp, string][] = [
  [/त्र/g, "q"],
  [/ज्ञ/g, "1"],
  [/क्ष/g, "5"],
  [/श्र/g, ">"],
  [/द्ध/g, "4"],
  [/द्य/g, "B"],
  [/त्त/g, "Q"],
  [/क्त/g, "Qm"],
  [/द्द/g, "2"],
  [/ट्ट/g, "6"],
  [/ठ्ठ/g, "7"],
  [/ड्ड/g, "8"],
  [/ड्ढ/g, "9"],
  [/ह्र/g, "x|"],
  [/ह्न/g, "X"],
  [/हृ/g, "x["],
  [/द्व/g, "å"],
  [/ष्ट/g, "i6"],
  [/ष्ठ/g, "i7"],
  [/ङ्क/g, "ª\\u006B"],
  [/ङ्ख/g, "ª\\u004B"],
  [/ङ्ग/g, "ª\\u0067"],
  [/ॐ/g, "ç"],
];

/**
 * Converts Devanagari Unicode text to Preeti font ASCII characters
 */
export function unicodeToPreeti(input: string): string {
  if (!input) return "";

  let str = input.normalize("NFC");

  // Numbers
  const numMap: Record<string, string> = {
    "०": ")", "१": "!", "२": "@", "३": "#", "४": "$",
    "५": "%", "६": "^", "७": "&", "८": "*", "९": "(",
  };
  for (const [u, p] of Object.entries(numMap)) {
    str = str.split(u).join(p);
  }

  // Pre-process known conjuncts
  for (const [re, rep] of SPECIAL_CONJUNCTS) {
    str = str.replace(re, rep);
  }

  // Handle Reph: र् (र + ्) before a consonant
  // In Unicode: र् + Consonant (+ Matras)
  // In Preeti: Consonant (+ Matras) + '{'
  str = str.replace(/र्([क-हq15>4BQ26789Xå][ािीुूेैोौूंँ]*)/g, "$1{");

  // Handle Chhoti I (ि):
  // In Unicode: Consonant + ि
  // In Preeti: 'l' comes BEFORE the consonant (e.g. कि -> ls)
  str = str.replace(/([क-हq15>4BQ26789Xå](?:्[क-हq15>4BQ26789Xå])*)ि/g, "l$1");

  // Handle Rakar: Consonant + ् + र -> Consonant + '|'
  str = str.replace(/([क-ह])्\s*र/g, "$1|");

  // Character-by-character replacement
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    result += UNICODE_TO_PREETI_CHARS[ch] !== undefined ? UNICODE_TO_PREETI_CHARS[ch] : ch;
  }

  return result;
}

/**
 * Common Preeti text snippets for Suchidarta
 */
export const PREETI_SUCHIDARTA = {
  h1:       `cg';'rL– @(s)=`,
  h2:       `-lgod !* sf] pklgod -!_ ;Fu ;DalGwt_`,
  h3:       `Dff}h'bf ;"rLdf btf{ x'gsf nflu lbOg] lgj]bgsf] 9fFrf`,
  subj:     `ljifoM df}h'bf ;"rLdf btf{ u/L kfpF .`,
  body:     `;fj{hlgs vl/b lgodfjnL, @)^$ sf] lgod !* sf] pklgod -!_ adf]lhd tklzndf plNnlvt ljj/0fcg';f/sf] k'i6\\ofOF ug]{ sfuhft ;+nUg u/L df}h'bf ;'rLdf btf{ x'g of] lgj]bg k]; u/]sf] 5' .`,
  tapsil:   `tfkl;n`,
  s1:       `!= df}h'bf ;'rLsf] nflu lgj]bg lbg] JolQm, ;+:yf, cfk"lt{stf{, lgdf{0f Joj;foL, k/fdz{bftf jf ;]jf k|bfossf] ljj/0f M`,
  nameLbl:  `-s_ gfd M`,
  addrLbl:  `-v_ 7]ufgf M`,
  corrLbl:  `-u_ kqfrf/ ug]{ 7]ufgf M`,
  contLbl:  `-3_ d'Vo JolQmsf] gfd M`,
  phoneLbl: `-ª_ 6]lnkmf]g g+=M`,
  mobLbl:   `-r_ df]afOn g+= M`,
  s2:       `@= df}h'bf ;"rLdf btf{ x'gsf] nflu lgDgadf]lhdsf] k|df0fkq ;+nUg ug'{xf]nf .`,
  c1:       `-s_ ;+:yf jf kmd{ btf{sf] k|df0fkq 5`,
  c2:       `-v_ gjLs/0f ul/Psf] 5`,
  c3:       `-u_ d"No clej[l4 s/ jf :yfoL n]vf gDa/ btf{sf] k|df0fkq 5`,
  c4:       `-3_ s/ r'Qmfsf] k|df0fkq 5`,
  c5:       `-ª_ s'g vl/bsf] nflu df}h'bf ;"rLdf btf{ x'g lgj]bg lbg] xf], ;f] sfdsf] nflu Ohfht kq cfjZos kg]{ ePdf ;f]sf] k|ltlnlk 5`,
  s3:       `#=;fj{hlgs lgsfoaf6 x'g] vl/bsf] nflu btf{ x'g rfx]sf] k|s[ltsf] ljj/0f M`,
  goods:    `-s_ dfn;fdfg cfk"lt{ M`,
  const_:   `-v_ lgdf{0f sfo{`,
  consult:  `-u_ k/fdz{ ;]jf M - k/fdz{ ;]jfsf] k|s[lt;d]t pnn]v ug]{_`,
  other:    `-3_ cgo ;]jf M - cgo ;]jfsf] k|s[lt pNn]v ug]{_`,
  dateL:    `lgj]bg lbPsf] ldlt M`,
  fyL:      `cf=j= M`,
  stamp:    `Kfmd{sf] 5fk M`,
  appName:  `lgj]bssf] gfd M`,
  sign:     `x:tfIf/ M`,
  tick:     `√`,
};

/**
 * Standard Unicode Devanagari text for Suchidarta
 */
export const UNICODE_SUCHIDARTA = {
  h1:       `अनुसूची– २(क)`,
  h2:       `(नियम १८ को उपनियम (१) सँग सम्बन्धित)`,
  h3:       `मौजुदा सूचीमा दर्ता हुनका लागि दिइने निवेदनको ढाँचा`,
  subj:     `विषय: मौजुदा सूचीमा दर्ता गरी पाउँ।`,
  body:     `सार्वजनिक खरिद नियमावली, २०६४ को नियम १८ को उपनियम (१) बमोजिम तपसिलमा उल्लिखित विवरणअनुसारको पुष्ट्याईं गर्ने कागजात संलग्न गरी मौजुदा सूचीमा दर्ता हुन यो निवेदन पेस गरेको छु।`,
  tapsil:   `तपसिल`,
  s1:       `१. मौजुदा सूचीको लागि निवेदन दिने व्यक्ति, संस्था, आपूर्तिकर्ता, निर्माण व्यवसायी, परामर्शदाता वा सेवा प्रदायकको विवरण :`,
  nameLbl:  `(क) नाम :`,
  addrLbl:  `(ख) ठेगाना :`,
  corrLbl:  `(ग) पत्राचार गर्ने ठेगाना :`,
  contLbl:  `(घ) मुख्य व्यक्तिको नाम :`,
  phoneLbl: `(ङ) टेलिफोन नं. :`,
  mobLbl:   `(च) मोबाइल नं. :`,
  s2:       `२. मौजुदा सूचीमा दर्ता हुनको लागि निम्नबमोजिमको प्रमाणपत्र संलग्न गर्नुहोस्।`,
  c1:       `(क) संस्था वा फर्म दर्ताको प्रमाणपत्र छ`,
  c2:       `(ख) नवीकरण गरिएको छ`,
  c3:       `(ग) मूल्य अभिवृद्धि कर वा स्थायी लेखा नम्बर दर्ताको प्रमाणपत्र छ`,
  c4:       `(घ) कर चुक्ताको प्रमाणपत्र छ`,
  c5:       `(ङ) कुनै खरिदको लागि मौजुदा सूचीमा दर्ता हुन निवेदन दिने हो, सो कामको लागि इजाजत पत्र आवश्यक पर्ने भएमा सोको प्रतिलिपि छ`,
  s3:       `३. सार्वजनिक निकायबाट हुने खरिदको लागि दर्ता हुन चाहेको प्रकृतिको विवरण :`,
  goods:    `(क) मालसामान आपूर्ति : (मालसामानको प्रकृतिसमेत उल्लेख गर्ने)`,
  const_:   `(ख) निर्माण कार्य`,
  consult:  `(ग) परामर्श सेवा : (परामर्श सेवाको प्रकृतिसमेत उल्लेख गर्ने)`,
  other:    `(घ) अन्य सेवा : (अन्य सेवाको प्रकृति उल्लेख गर्ने)`,
  dateL:    `निवेदन दिएको मिति :`,
  fyL:      `आ.व. :`,
  stamp:    `फर्मको छाप :`,
  appName:  `निवेदकको नाम :`,
  sign:     `हस्ताक्षर :`,
  tick:     `✓`,
};

/**
 * Standard English (Times New Roman) text for Suchidarta
 */
export const ENGLISH_SUCHIDARTA = {
  h1:       `SCHEDULE – 2 (A)`,
  h2:       `(Related to Sub-Rule (1) of Rule 18)`,
  h3:       `APPLICATION FORMAT FOR LISTING IN STANDING LIST (VENDOR LISTING)`,
  subj:     `Subject: Application for Registration in Standing List / Vendor Listing.`,
  body:     `Pursuant to Sub-Rule (1) of Rule 18 of Public Procurement Regulations, 2064, I/we hereby submit this application along with required supporting documents for registration in the Standing List as per details provided below.`,
  tapsil:   `Details`,
  s1:       `1. Details of Applicant Person, Firm, Supplier, Contractor, Consultant or Service Provider:`,
  nameLbl:  `(a) Name:`,
  addrLbl:  `(b) Address:`,
  corrLbl:  `(c) Postal Address:`,
  contLbl:  `(d) Key Person Name:`,
  phoneLbl: `(e) Telephone No.:`,
  mobLbl:   `(f) Mobile No.:`,
  s2:       `2. Please enclose the following certificates for registration:`,
  c1:       `(a) Firm/Company Registration Certificate Attached`,
  c2:       `(b) Renewal Certificate Attached`,
  c3:       `(c) VAT/PAN Registration Certificate Attached`,
  c4:       `(d) Tax Clearance Certificate Attached`,
  c5:       `(e) License/Permission Certificate (if required for specific procurement) Attached`,
  s3:       `3. Nature of Procurement interested in:`,
  goods:    `(a) Goods Supply: (including nature of goods)`,
  const_:   `(b) Works/Construction`,
  consult:  `(c) Consulting Services: (including nature of services)`,
  other:    `(d) Other Services: (including nature of services)`,
  dateL:    `Date of Submission:`,
  fyL:      `Fiscal Year:`,
  stamp:    `Firm/Company Stamp:`,
  appName:  `Applicant Name:`,
  sign:     `Signature:`,
  tick:     `✓`,
};
