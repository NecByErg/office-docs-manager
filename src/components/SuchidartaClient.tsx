"use client";

import { useState, useEffect, useMemo } from "react";
import {
  unicodeToPreeti,
  PREETI_SUCHIDARTA,
  UNICODE_SUCHIDARTA,
  ENGLISH_SUCHIDARTA,
} from "@/lib/preeti";

type CompanyDoc = {
  id: string;
  sectionType: { key: string; label: string };
  fileName: string;
  fileUrl: string;
};

type CompanyTax = {
  id: string;
  fiscalYear: string;
  fileUrl: string;
  isLatest: boolean;
};

type Company = {
  id: string;
  name: string;
  logoUrl: string | null;
  establishmentYearBS: string;
  letterheadUrl?: string | null;
  documents?: CompanyDoc[];
  taxClearances?: CompanyTax[];
};

export type CompanyProfile = {
  namePreeti: string;
  nameUnicode: string;
  nameEnglish: string;
  regNo: string;
  vatNo: string;
  addrPreeti: string;
  addrUnicode: string;
  addrEnglish: string;
  contactPreeti: string;
  contactUnicode: string;
  contactEnglish: string;
  mobile: string;
  servicePreeti: string;
  serviceUnicode: string;
  serviceEnglish: string;
  email: string;
  phone: string;
  customDate?: string;
  customDatePreeti?: string;
};

const DEFAULT_COMPANY_PROFILES: Record<string, Partial<CompanyProfile>> = {
  // BI Engineering
  cmsrcze8c0000jv0443e2o5aa: {
    nameEnglish: "B.I. ENGINEERING CONSULTANCY PVT. LTD.",
    namePreeti: "la= cfO{= O{lGhlgol/Ë sG;N6]G;L k|f =ln",
    nameUnicode: "वि. आई. इन्जिनियरिङ्ग कन्सल्टेन्सी प्रा. लि.",
    regNo: "220300/076/077",
    vatNo: "609586655",
    addrPreeti: "sf7df08f}",
    addrUnicode: "टोखा नगरपालिका-०७, काठमाडौँ",
    addrEnglish: "Tokha Municipality-07, Kathmandu, Nepal",
    contactPreeti: "lagf]b Zffx",
    contactUnicode: "विनोद शाह",
    contactEnglish: "Binod Shah",
    mobile: "9848660393",
    phone: "+977-9860133281",
    email: "biconsultancy2076@gmail.com",
    servicePreeti: "tflnd / k/fdz{ ;]jf ;DaGwL",
    serviceUnicode: "तालिम र परामर्श सेवा सम्बन्धी",
    serviceEnglish: "Training and Consulting Services",
  },
  // Tripur
  cmu2bvxae0001la041v46xkyn: {
    nameEnglish: "TRIPUR ENGINEERING PVT. LTD.",
    namePreeti: "lqk'/ O{lGhlgol/Ë k|f= ln=",
    nameUnicode: "त्रिपुर इन्जिनियरिङ्ग प्रा. लि.",
    regNo: "242749/077/078",
    vatNo: "609804868",
    addrPreeti: "sf7df08f}",
    addrUnicode: "काठमाडौँ",
    addrEnglish: "Kathmandu, Nepal",
    contactPreeti: "k|d'v",
    contactUnicode: "प्रबन्ध निर्देशक",
    contactEnglish: "Managing Director",
    mobile: "9851000000",
    phone: "",
    email: "tripurengineering@gmail.com",
    servicePreeti: "tflnd / k/fdz{ ;]jf ;DaGwL",
    serviceUnicode: "परामर्श सेवा सम्बन्धी",
    serviceEnglish: "Consulting Services",
  },
  // Diligent
  cmu2bv64v0000la04vx9ei2x3: {
    nameEnglish: "DILIGENT ENGINEERING SOLUTION PVT. LTD.",
    namePreeti: "l8lnh]G6 O{lGhlgol/Ë ;n';g k|f= ln=",
    nameUnicode: "डिलिजेन्ट इन्जिनियरिङ्ग सोलुसन प्रा. लि.",
    regNo: "241852/077/078",
    vatNo: "609795123",
    addrPreeti: "sf7df08f}",
    addrUnicode: "काठमाडौँ",
    addrEnglish: "Kathmandu, Nepal",
    contactPreeti: "k|d'v",
    contactUnicode: "प्रबन्ध निर्देशक",
    contactEnglish: "Managing Director",
    mobile: "9841000000",
    phone: "",
    email: "diligentengineering@gmail.com",
    servicePreeti: "tflnd / k/fdz{ ;]jf ;DaGwL",
    serviceUnicode: "परामर्श सेवा सम्बन्धी",
    serviceEnglish: "Consulting Services",
  },
  // Matamandali
  cmsrd0y4d0001jv04qlh0pa52: {
    nameEnglish: "MATAMANDALI ENGINEERING CONSULTANCY PVT. LTD.",
    namePreeti: "df:tfdf08nL O{lGhlgol/Ë sG;N6]G;L k|f= ln=",
    nameUnicode: "मास्तामाण्डली इन्जिनियरिङ्ग कन्सल्टेन्सी प्रा. लि.",
    regNo: "221450/076/077",
    vatNo: "609598712",
    addrPreeti: "sf7df08f}",
    addrUnicode: "काठमाडौँ",
    addrEnglish: "Kathmandu, Nepal",
    contactPreeti: "k|d'v",
    contactUnicode: "प्रबन्ध निर्देशक",
    contactEnglish: "Managing Director",
    mobile: "9849000000",
    phone: "",
    email: "matamandali@gmail.com",
    servicePreeti: "tflnd / k/fdz{ ;]jf ;DaGwL",
    serviceUnicode: "परामर्श सेवा सम्बन्धी",
    serviceEnglish: "Consulting Services",
  },
  // Netreshwori
  cmsrcjmk10001l10424k4dtiv: {
    nameEnglish: "NETRESHWORI ENGINEERING CONSULTANCY PVT. LTD.",
    namePreeti: "g]q]Zj/L O{lGhlgol/Ë sG;N6]G;L k|f= ln=",
    nameUnicode: "नेत्रेश्वरी इन्जिनियरिङ्ग कन्सल्टेन्सी प्रा. लि.",
    regNo: "220110/076/077",
    vatNo: "609571234",
    addrPreeti: "sf7df08f}",
    addrUnicode: "काठमाडौँ",
    addrEnglish: "Kathmandu, Nepal",
    contactPreeti: "k|d'v",
    contactUnicode: "प्रबन्ध निर्देशक",
    contactEnglish: "Managing Director",
    mobile: "9851122334",
    phone: "",
    email: "netreshwori@gmail.com",
    servicePreeti: "tflnd / k/fdz{ ;]jf ;DaGwL",
    serviceUnicode: "परामर्श सेवा सम्बन्धी",
    serviceEnglish: "Consulting Services",
  },
  // Midas
  cmsyc4dd80000jx04khgkqvz6: {
    nameEnglish: "MIDAS ENGINEERING CONSULTANCY PVT. LTD.",
    namePreeti: "dfO{8; O{lGhlgol/Ë sG;N6]G;L k|f= ln=",
    nameUnicode: "माइडस इन्जिनियरिङ्ग कन्सल्टेन्सी प्रा. लि.",
    regNo: "223400/076/077",
    vatNo: "609612345",
    addrPreeti: "sf7df08f}",
    addrUnicode: "काठमाडौँ",
    addrEnglish: "Kathmandu, Nepal",
    contactPreeti: "k|d'v",
    contactUnicode: "प्रबन्ध निर्देशक",
    contactEnglish: "Managing Director",
    mobile: "9841556677",
    phone: "",
    email: "midasengineering@gmail.com",
    servicePreeti: "tflnd / k/fdz{ ;]jf ;DaGwL",
    serviceUnicode: "परामर्श सेवा सम्बन्धी",
    serviceEnglish: "Consulting Services",
  },
  // Hints Consult
  cmuxm3q2r0000kz04wznn2nwb: {
    nameEnglish: "HINTS CONSULT PVT. LTD.",
    namePreeti: "lxG6\; sG;N6 k|f= ln=",
    nameUnicode: "हिन्ट्स कन्सल्ट प्रा. लि.",
    regNo: "225600/076/077",
    vatNo: "609689012",
    addrPreeti: "sf7df08f}",
    addrUnicode: "काठमाडौँ",
    addrEnglish: "Kathmandu, Nepal",
    contactPreeti: "k|d'v",
    contactUnicode: "प्रबन्ध निर्देशक",
    contactEnglish: "Managing Director",
    mobile: "9851778899",
    phone: "",
    email: "hintsconsult@gmail.com",
    servicePreeti: "tflnd / k/fdz{ ;]jf ;DaGwL",
    serviceUnicode: "परामर्श सेवा सम्बन्धी",
    serviceEnglish: "Consulting Services",
  },
};

const OFFICE_PRESETS = [
  {
    name: "पूर्वाधार विकास कार्यालय, पाँचथर",
    key: "Panchthar",
    addressPreeti: `>Ldfg\\sfo{no k|d'v Ho",\nk'jf{wf/ ljsf; sfof{no, kfFry/`,
    addressUnicode: `श्रीमान् कार्यालय प्रमुख ज्यू,\nपूर्वाधार विकास कार्यालय, पाँचथर`,
    addressEnglish: `The Office Chief,\nInfrastructure Development Office, Panchthar`,
  },
  {
    name: "आन्तरिक मामिला तथा कानून मन्त्रालय, विराटनगर",
    key: "Biratnagar",
    addressPreeti: `>L ;lrjHo",\ncfGtl/s dfldnf tyf sfg"g dGqfno,\nsf]zL k|b]z, lj/f6gu/`,
    addressUnicode: `श्री सचिव ज्यू,\nआन्तरिक मामिला तथा कानून मन्त्रालय,\nकोशी प्रदेश, विराटनगर`,
    addressEnglish: `The Secretary,\nMinistry of Internal Affairs and Law,\nKoshi Province, Biratnagar`,
  },
  {
    name: "सडक डिभिजन कार्यालय, ईलाम",
    key: "Ilam",
    addressPreeti: `>Ldfg\\sfo{no k|d'v Ho",\ns8s l8lehg sfof{no, O{nfd`,
    addressUnicode: `श्रीमान् कार्यालय प्रमुख ज्यू,\nसडक डिभिजन कार्यालय, ईलाम`,
    addressEnglish: `The Division Chief,\nRoad Division Office, Ilam`,
  },
];

type FontMode = "preeti" | "unicode" | "english";

export default function SuchidartaClient({
  companies,
}: {
  companies: Company[];
}) {
  const [fontMode, setFontMode] = useState<FontMode>("preeti");
  const [sel, setSel] = useState<Set<string>>(new Set(companies.map((c) => c.id)));
  const [profiles, setProfiles] = useState<Record<string, CompanyProfile>>({});

  // Common Office Settings
  const [selectedPreset, setSelectedPreset] = useState("Panchthar");
  const [officeKey, setOfficeKey] = useState("Panchthar");
  const [addrText, setAddrText] = useState(
    `श्रीमान् कार्यालय प्रमुख ज्यू,\nपूर्वाधार विकास कार्यालय, पाँचथर`
  );
  const [addrPreetiText, setAddrPreetiText] = useState(
    `>Ldfg\\sfo{no k|d'v Ho",\nk'jf{wf/ ljsf; sfof{no, kfFry/`
  );
  const [addrEnglishText, setAddrEnglishText] = useState(
    `The Office Chief,\nInfrastructure Development Office, Panchthar`
  );

  // Common Dates
  const [masterDate, setMasterDate] = useState("२०८३/०४/०५");
  const [masterDatePreeti, setMasterDatePreeti] = useState("@)*#÷)$÷)%");
  const [masterDateEnglish, setMasterDateEnglish] = useState("2026/07/20");

  const [fiscalYear, setFiscalYear] = useState("२०८३/०८४");
  const [fiscalYearPreeti, setFiscalYearPreeti] = useState("@)*#÷)*$");
  const [fiscalYearEnglish, setFiscalYearEnglish] = useState("2083/084");

  // Document attachment toggles
  const [attachReg, setAttachReg] = useState(true);
  const [attachVat, setAttachVat] = useState(true);
  const [attachTax, setAttachTax] = useState(true);

  // Per-company expanded state
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Preview state
  const [previewCompany, setPreviewCompany] = useState<Company | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>("");

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");

  // Initialize profiles
  useEffect(() => {
    // Inject Preeti font if needed
    if (!document.getElementById("preeti-font")) {
      const s = document.createElement("style");
      s.id = "preeti-font";
      s.textContent = `@font-face{font-family:'Preeti';src:url('/fonts/Preeti.ttf') format('truetype');font-display:swap;}`;
      document.head.appendChild(s);
    }

    // Load saved profiles from localStorage or defaults
    const initialProfiles: Record<string, CompanyProfile> = {};
    let saved: Record<string, Partial<CompanyProfile>> = {};
    try {
      const s = localStorage.getItem("suchi-meta-v3");
      if (s) saved = JSON.parse(s);
    } catch {}

    companies.forEach((c) => {
      const def = DEFAULT_COMPANY_PROFILES[c.id] || {};
      const s = saved[c.id] || {};

      initialProfiles[c.id] = {
        nameEnglish: s.nameEnglish || def.nameEnglish || c.name,
        namePreeti: s.namePreeti || def.namePreeti || unicodeToPreeti(c.name),
        nameUnicode: s.nameUnicode || def.nameUnicode || c.name,
        regNo: s.regNo || def.regNo || "",
        vatNo: s.vatNo || def.vatNo || "",
        addrEnglish: s.addrEnglish || def.addrEnglish || "Kathmandu, Nepal",
        addrPreeti: s.addrPreeti || def.addrPreeti || "sf7df08f}",
        addrUnicode: s.addrUnicode || def.addrUnicode || "काठमाडौँ",
        contactEnglish: s.contactEnglish || def.contactEnglish || "Managing Director",
        contactPreeti: s.contactPreeti || def.contactPreeti || "k|d'v",
        contactUnicode: s.contactUnicode || def.contactUnicode || "प्रबन्ध निर्देशक",
        mobile: s.mobile || def.mobile || "",
        phone: s.phone || def.phone || "",
        email: s.email || def.email || "",
        serviceEnglish: s.serviceEnglish || def.serviceEnglish || "Consulting Services",
        servicePreeti: s.servicePreeti || def.servicePreeti || "tflnd / k/fdz{ ;]jf ;DaGwL",
        serviceUnicode: s.serviceUnicode || def.serviceUnicode || "परामर्श सेवा सम्बन्धी",
        customDate: s.customDate || "",
        customDatePreeti: s.customDatePreeti || "",
      };
    });

    setProfiles(initialProfiles);
  }, [companies]);

  // Handle preset change
  const handlePresetSelect = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const found = OFFICE_PRESETS.find((p) => p.key === presetKey);
    if (found) {
      setOfficeKey(found.key);
      setAddrPreetiText(found.addressPreeti);
      setAddrText(found.addressUnicode);
      setAddrEnglishText(found.addressEnglish);
    }
  };

  // Sync date changes across representations
  const handleMasterDateChange = (val: string) => {
    setMasterDate(val);
    const converted = unicodeToPreeti(val);
    setMasterDatePreeti(converted);
  };

  const handleFiscalYearChange = (val: string) => {
    setFiscalYear(val);
    const converted = unicodeToPreeti(val);
    setFiscalYearPreeti(converted);
  };

  // Update company profile
  const updateProfile = (id: string, field: keyof CompanyProfile, val: string) => {
    setProfiles((prev) => {
      const current = prev[id] || {};
      const next = { ...prev, [id]: { ...current, [field]: val } };

      // Auto-convert if editing Unicode name/address/date
      if (field === "nameUnicode") {
        next[id].namePreeti = unicodeToPreeti(val);
      } else if (field === "addrUnicode") {
        next[id].addrPreeti = unicodeToPreeti(val);
      } else if (field === "contactUnicode") {
        next[id].contactPreeti = unicodeToPreeti(val);
      } else if (field === "customDate") {
        next[id].customDatePreeti = unicodeToPreeti(val);
      }

      try {
        localStorage.setItem("suchi-meta-v3", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSel((prev) => {
      const n = new Set(prev);
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }
      return n;
    });
  };

  const selectedList = useMemo(
    () => companies.filter((c) => sel.has(c.id)),
    [companies, sel]
  );

  // Build the HTML for Page 1 of Suchidarta
  const buildPage1HTML = (company: Company): string => {
    const prof = profiles[company.id] || DEFAULT_COMPANY_PROFILES[company.id] || {};

    const activeDate =
      prof.customDate && prof.customDate.trim() !== ""
        ? prof.customDate
        : masterDate;

    const activeDatePreeti =
      prof.customDatePreeti && prof.customDatePreeti.trim() !== ""
        ? prof.customDatePreeti
        : masterDatePreeti;

    if (fontMode === "preeti") {
      const d = PREETI_SUCHIDARTA;
      const addrLines = (addrPreetiText || unicodeToPreeti(addrText)).split("\n").join("<br/>");
      const companyPreeti = prof.namePreeti || unicodeToPreeti(prof.nameUnicode || company.name);
      const contactPreeti = prof.contactPreeti || unicodeToPreeti(prof.contactUnicode || "");
      const servicePreeti = prof.servicePreeti || unicodeToPreeti(prof.serviceUnicode || "परामर्श सेवा सम्बन्धी");
      const addrP = prof.addrPreeti || "sf7df08f}";
      const mobP = unicodeToPreeti(prof.mobile || "");

      return `
<div style="font-family:'Preeti',serif;font-size:11pt;padding:12mm 18mm 14mm 18mm;width:794px;min-height:1120px;background:#fff;box-sizing:border-box;color:#000;line-height:1.6;">
  <!-- Letterhead Header -->
  <div style="border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:12px;position:relative;">
    <table style="width:100%;border-collapse:collapse;border:none;">
      <tr>
        ${
          company.logoUrl
            ? `<td style="width:85px;vertical-align:middle;text-align:left;border:none;padding:0;">
                <img src="${company.logoUrl}" style="width:75px;height:75px;object-fit:contain;" crossorigin="anonymous"/>
               </td>`
            : ""
        }
        <td style="text-align:center;vertical-align:middle;border:none;padding:0;">
          <div style="font-family:'Times New Roman',Arial,sans-serif;font-size:16pt;font-weight:bold;letter-spacing:0.5px;color:#111827;">
            ${prof.nameEnglish || company.name}
          </div>
          <div style="font-family:'Times New Roman',Arial,sans-serif;font-size:10pt;font-weight:600;margin-top:2px;">
            ${prof.regNo ? `Reg. No. : - ${prof.regNo}` : ""} &nbsp;&nbsp;&nbsp;&nbsp; ${prof.vatNo ? `Vat. No. :- ${prof.vatNo}` : ""}
          </div>
          <div style="font-family:'Times New Roman',Arial,sans-serif;font-size:9.5pt;margin-top:2px;color:#374151;">
            ${prof.addrEnglish || "Kathmandu, Nepal"} ${prof.email ? ` | E-mail:- ${prof.email}` : ""} ${prof.phone || prof.mobile ? ` | Ph.:- ${prof.phone || prof.mobile}` : ""}
          </div>
        </td>
      </tr>
    </table>
    <div style="margin-top:6px;display:flex;justify-content:space-between;font-family:'Times New Roman',Arial,sans-serif;font-size:9.5pt;font-weight:bold;">
      <div>Ref No: - </div>
      <div></div>
    </div>
  </div>

  <!-- Heading -->
  <div style="text-align:center;margin-bottom:10px;line-height:1.7;">
    <div style="font-size:12pt;font-weight:600;">${d.h1}</div>
    <div style="font-size:10pt;">${d.h2}</div>
    <div style="font-size:12pt;font-weight:bold;margin-top:2px;">${d.h3}</div>
  </div>

  <!-- Date Right -->
  <div style="text-align:right;font-size:11pt;margin-bottom:8px;font-weight:bold;">
    ${d.dateL} ${activeDatePreeti}
  </div>

  <!-- Office Address -->
  <div style="margin-bottom:10px;line-height:1.8;font-size:11pt;">
    ${addrLines}
  </div>

  <!-- Subject -->
  <div style="font-weight:bold;font-size:11.5pt;margin-bottom:8px;">
    ${d.subj}
  </div>

  <!-- Body -->
  <div style="margin-bottom:10px;text-align:justify;line-height:1.8;font-size:10.5pt;">
    ${d.body}
  </div>

  <!-- Tapsil -->
  <div style="font-weight:bold;font-size:11.5pt;text-align:center;margin-bottom:6px;text-decoration:underline;">
    ${d.tapsil}
  </div>

  <!-- Table -->
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;font-size:10pt;line-height:1.5;">
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:4px 6px;font-weight:bold;background:#fafafa;">
        ${d.s1}
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;width:23%;">${d.nameLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;width:32%;">${companyPreeti}</td>
      <td style="border:1px solid #000;padding:4px 6px;width:22%;">${d.addrLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;width:23%;">${addrP}</td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;">${d.corrLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${addrP}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${d.contLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${contactPreeti}</td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;">${d.phoneLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;"></td>
      <td style="border:1px solid #000;padding:4px 6px;">${d.mobLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${mobP || prof.mobile}</td>
    </tr>
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:4px 6px;font-weight:bold;background:#fafafa;">
        ${d.s2}
      </td>
    </tr>
    <tr>
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;">${d.c1} &nbsp;&nbsp;&nbsp; <b>[ √ ]</b></td>
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;">${d.c2} &nbsp;&nbsp;&nbsp; <b>[ √ ]</b></td>
    </tr>
    <tr>
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;">${d.c3} &nbsp;&nbsp;&nbsp; <b>[ √ ]</b></td>
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;">${d.c4} &nbsp;&nbsp;&nbsp; <b>[ √ ]</b></td>
    </tr>
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:4px 6px;">${d.c5} &nbsp;&nbsp;&nbsp; <b>[ √ ]</b></td>
    </tr>
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:4px 6px;font-weight:bold;background:#fafafa;">
        ${d.s3}
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;">${d.goods}</td>
      <td style="border:1px solid #000;padding:4px 6px;"></td>
      <td style="border:1px solid #000;padding:4px 6px;">${d.const_}</td>
      <td style="border:1px solid #000;padding:4px 6px;"></td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;">${d.consult}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${servicePreeti}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${d.other}</td>
      <td style="border:1px solid #000;padding:4px 6px;"></td>
    </tr>
    <tr style="height:55px;">
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;vertical-align:top;">
        <div>${d.dateL} ${activeDatePreeti}</div>
        <div style="margin-top:6px;">${d.fyL} ${fiscalYearPreeti}</div>
      </td>
      <td style="border:1px solid #000;padding:4px 6px;vertical-align:top;text-align:center;">
        <div>${d.stamp}</div>
        ${
          company.logoUrl
            ? `<div style="margin-top:2px;"><img src="${company.logoUrl}" style="height:48px;width:48px;object-fit:contain;display:inline-block;" crossorigin="anonymous"/></div>`
            : `<div style="height:40px;"></div>`
        }
      </td>
      <td style="border:1px solid #000;padding:4px 6px;vertical-align:top;">
        <div>${d.appName} ${contactPreeti}</div>
        <div style="margin-top:6px;">${d.sign}</div>
      </td>
    </tr>
  </table>

  <!-- Footer Address -->
  <div style="border-top:1px solid #333;margin-top:14px;padding-top:4px;text-align:center;font-family:'Times New Roman',Arial,sans-serif;font-size:9.5pt;color:#374151;">
    ${prof.addrEnglish || "Kathmandu, Nepal"} ${prof.email ? ` | E-mail:- ${prof.email}` : ""} ${prof.phone || prof.mobile ? ` | Ph.:- ${prof.phone || prof.mobile}` : ""}
  </div>
</div>
`;
    }

    if (fontMode === "unicode") {
      const d = UNICODE_SUCHIDARTA;
      const addrLines = addrText.split("\n").join("<br/>");
      const companyUni = prof.nameUnicode || company.name;
      const contactUni = prof.contactUnicode || "";
      const serviceUni = prof.serviceUnicode || "तालिम र परामर्श सेवा सम्बन्धी";
      const addrU = prof.addrUnicode || "काठमाडौँ";

      return `
<div style="font-family:'Segoe UI','Noto Sans Devanagari',Arial,sans-serif;font-size:10.5pt;padding:12mm 18mm 14mm 18mm;width:794px;min-height:1120px;background:#fff;box-sizing:border-box;color:#000;line-height:1.6;">
  <!-- Letterhead Header -->
  <div style="border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:12px;">
    <table style="width:100%;border-collapse:collapse;border:none;">
      <tr>
        ${
          company.logoUrl
            ? `<td style="width:85px;vertical-align:middle;text-align:left;border:none;padding:0;">
                <img src="${company.logoUrl}" style="width:75px;height:75px;object-fit:contain;" crossorigin="anonymous"/>
               </td>`
            : ""
        }
        <td style="text-align:center;vertical-align:middle;border:none;padding:0;">
          <div style="font-size:16pt;font-weight:bold;color:#111827;">${prof.nameEnglish || company.name}</div>
          <div style="font-size:10pt;font-weight:600;margin-top:2px;">
            ${prof.regNo ? `Reg. No. : - ${prof.regNo}` : ""} &nbsp;&nbsp;&nbsp;&nbsp; ${prof.vatNo ? `Vat. No. :- ${prof.vatNo}` : ""}
          </div>
          <div style="font-size:9.5pt;margin-top:2px;color:#374151;">
            ${prof.addrEnglish || "Kathmandu, Nepal"} ${prof.email ? ` | E-mail:- ${prof.email}` : ""} ${prof.phone || prof.mobile ? ` | Ph.:- ${prof.phone || prof.mobile}` : ""}
          </div>
        </td>
      </tr>
    </table>
    <div style="margin-top:6px;display:flex;justify-content:space-between;font-size:9.5pt;font-weight:bold;">
      <div>Ref No: - </div>
      <div></div>
    </div>
  </div>

  <!-- Heading -->
  <div style="text-align:center;margin-bottom:10px;line-height:1.7;">
    <div style="font-size:12pt;font-weight:600;">${d.h1}</div>
    <div style="font-size:10pt;">${d.h2}</div>
    <div style="font-size:12pt;font-weight:bold;margin-top:2px;">${d.h3}</div>
  </div>

  <!-- Date Right -->
  <div style="text-align:right;font-size:11pt;margin-bottom:8px;font-weight:bold;">
    ${d.dateL} ${activeDate}
  </div>

  <!-- Office Address -->
  <div style="margin-bottom:10px;line-height:1.8;font-size:11pt;">
    ${addrLines}
  </div>

  <!-- Subject -->
  <div style="font-weight:bold;font-size:11.5pt;margin-bottom:8px;">
    ${d.subj}
  </div>

  <!-- Body -->
  <div style="margin-bottom:10px;text-align:justify;line-height:1.8;font-size:10.5pt;">
    ${d.body}
  </div>

  <!-- Tapsil -->
  <div style="font-weight:bold;font-size:11.5pt;text-align:center;margin-bottom:6px;text-decoration:underline;">
    ${d.tapsil}
  </div>

  <!-- Table -->
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;font-size:10pt;line-height:1.5;">
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:4px 6px;font-weight:bold;background:#fafafa;">
        ${d.s1}
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;width:23%;">${d.nameLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;width:32%;">${companyUni}</td>
      <td style="border:1px solid #000;padding:4px 6px;width:22%;">${d.addrLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;width:23%;">${addrU}</td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;">${d.corrLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${addrU}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${d.contLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${contactUni}</td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;">${d.phoneLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${prof.phone}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${d.mobLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${prof.mobile}</td>
    </tr>
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:4px 6px;font-weight:bold;background:#fafafa;">
        ${d.s2}
      </td>
    </tr>
    <tr>
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;">${d.c1} &nbsp;&nbsp;&nbsp; <b>[ ✓ ]</b></td>
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;">${d.c2} &nbsp;&nbsp;&nbsp; <b>[ ✓ ]</b></td>
    </tr>
    <tr>
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;">${d.c3} &nbsp;&nbsp;&nbsp; <b>[ ✓ ]</b></td>
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;">${d.c4} &nbsp;&nbsp;&nbsp; <b>[ ✓ ]</b></td>
    </tr>
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:4px 6px;">${d.c5} &nbsp;&nbsp;&nbsp; <b>[ ✓ ]</b></td>
    </tr>
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:4px 6px;font-weight:bold;background:#fafafa;">
        ${d.s3}
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;">${d.goods}</td>
      <td style="border:1px solid #000;padding:4px 6px;"></td>
      <td style="border:1px solid #000;padding:4px 6px;">${d.const_}</td>
      <td style="border:1px solid #000;padding:4px 6px;"></td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;">${d.consult}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${serviceUni}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${d.other}</td>
      <td style="border:1px solid #000;padding:4px 6px;"></td>
    </tr>
    <tr style="height:55px;">
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;vertical-align:top;">
        <div>${d.dateL} ${activeDate}</div>
        <div style="margin-top:6px;">${d.fyL} ${fiscalYear}</div>
      </td>
      <td style="border:1px solid #000;padding:4px 6px;vertical-align:top;text-align:center;">
        <div>${d.stamp}</div>
        ${
          company.logoUrl
            ? `<div style="margin-top:2px;"><img src="${company.logoUrl}" style="height:48px;width:48px;object-fit:contain;display:inline-block;" crossorigin="anonymous"/></div>`
            : `<div style="height:40px;"></div>`
        }
      </td>
      <td style="border:1px solid #000;padding:4px 6px;vertical-align:top;">
        <div>${d.appName} ${contactUni}</div>
        <div style="margin-top:6px;">${d.sign}</div>
      </td>
    </tr>
  </table>

  <!-- Footer -->
  <div style="border-top:1px solid #333;margin-top:14px;padding-top:4px;text-align:center;font-size:9.5pt;color:#374151;">
    ${prof.addrEnglish || "Kathmandu, Nepal"} ${prof.email ? ` | E-mail:- ${prof.email}` : ""} ${prof.phone || prof.mobile ? ` | Ph.:- ${prof.phone || prof.mobile}` : ""}
  </div>
</div>
`;
    }

    // English (Times New Roman)
    const d = ENGLISH_SUCHIDARTA;
    const addrLines = (addrEnglishText || addrText).split("\n").join("<br/>");
    const activeDateEng = prof.customDate || masterDateEnglish;

    return `
<div style="font-family:'Times New Roman',serif;font-size:11pt;padding:12mm 18mm 14mm 18mm;width:794px;min-height:1120px;background:#fff;box-sizing:border-box;color:#000;line-height:1.6;">
  <!-- Letterhead Header -->
  <div style="border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:12px;">
    <table style="width:100%;border-collapse:collapse;border:none;">
      <tr>
        ${
          company.logoUrl
            ? `<td style="width:85px;vertical-align:middle;text-align:left;border:none;padding:0;">
                <img src="${company.logoUrl}" style="width:75px;height:75px;object-fit:contain;" crossorigin="anonymous"/>
               </td>`
            : ""
        }
        <td style="text-align:center;vertical-align:middle;border:none;padding:0;">
          <div style="font-size:16pt;font-weight:bold;color:#111827;">${prof.nameEnglish || company.name}</div>
          <div style="font-size:10pt;font-weight:600;margin-top:2px;">
            ${prof.regNo ? `Reg. No. : - ${prof.regNo}` : ""} &nbsp;&nbsp;&nbsp;&nbsp; ${prof.vatNo ? `Vat. No. :- ${prof.vatNo}` : ""}
          </div>
          <div style="font-size:9.5pt;margin-top:2px;color:#374151;">
            ${prof.addrEnglish || "Kathmandu, Nepal"} ${prof.email ? ` | E-mail:- ${prof.email}` : ""} ${prof.phone || prof.mobile ? ` | Ph.:- ${prof.phone || prof.mobile}` : ""}
          </div>
        </td>
      </tr>
    </table>
    <div style="margin-top:6px;display:flex;justify-content:space-between;font-size:9.5pt;font-weight:bold;">
      <div>Ref No: - </div>
      <div></div>
    </div>
  </div>

  <!-- Heading -->
  <div style="text-align:center;margin-bottom:10px;line-height:1.7;">
    <div style="font-size:12pt;font-weight:bold;">${d.h1}</div>
    <div style="font-size:10pt;">${d.h2}</div>
    <div style="font-size:12pt;font-weight:bold;margin-top:2px;">${d.h3}</div>
  </div>

  <!-- Date Right -->
  <div style="text-align:right;font-size:11pt;margin-bottom:8px;font-weight:bold;">
    ${d.dateL} ${activeDateEng}
  </div>

  <!-- Office Address -->
  <div style="margin-bottom:10px;line-height:1.8;font-size:11pt;">
    ${addrLines}
  </div>

  <!-- Subject -->
  <div style="font-weight:bold;font-size:11.5pt;margin-bottom:8px;">
    ${d.subj}
  </div>

  <!-- Body -->
  <div style="margin-bottom:10px;text-align:justify;line-height:1.8;font-size:10.5pt;">
    ${d.body}
  </div>

  <!-- Tapsil -->
  <div style="font-weight:bold;font-size:11.5pt;text-align:center;margin-bottom:6px;text-decoration:underline;">
    ${d.tapsil}
  </div>

  <!-- Table -->
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;font-size:10pt;line-height:1.5;">
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:4px 6px;font-weight:bold;background:#fafafa;">
        ${d.s1}
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;width:23%;">${d.nameLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;width:32%;">${prof.nameEnglish || company.name}</td>
      <td style="border:1px solid #000;padding:4px 6px;width:22%;">${d.addrLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;width:23%;">${prof.addrEnglish || "Kathmandu, Nepal"}</td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;">${d.corrLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${prof.addrEnglish || "Kathmandu, Nepal"}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${d.contLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${prof.contactEnglish || "Authorized Signatory"}</td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;">${d.phoneLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${prof.phone}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${d.mobLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${prof.mobile}</td>
    </tr>
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:4px 6px;font-weight:bold;background:#fafafa;">
        ${d.s2}
      </td>
    </tr>
    <tr>
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;">${d.c1} &nbsp;&nbsp;&nbsp; <b>[ ✓ ]</b></td>
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;">${d.c2} &nbsp;&nbsp;&nbsp; <b>[ ✓ ]</b></td>
    </tr>
    <tr>
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;">${d.c3} &nbsp;&nbsp;&nbsp; <b>[ ✓ ]</b></td>
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;">${d.c4} &nbsp;&nbsp;&nbsp; <b>[ ✓ ]</b></td>
    </tr>
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:4px 6px;">${d.c5} &nbsp;&nbsp;&nbsp; <b>[ ✓ ]</b></td>
    </tr>
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:4px 6px;font-weight:bold;background:#fafafa;">
        ${d.s3}
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;">${d.goods}</td>
      <td style="border:1px solid #000;padding:4px 6px;"></td>
      <td style="border:1px solid #000;padding:4px 6px;">${d.const_}</td>
      <td style="border:1px solid #000;padding:4px 6px;"></td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;">${d.consult}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${prof.serviceEnglish || "Consulting Services"}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${d.other}</td>
      <td style="border:1px solid #000;padding:4px 6px;"></td>
    </tr>
    <tr style="height:55px;">
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;vertical-align:top;">
        <div>${d.dateL} ${activeDateEng}</div>
        <div style="margin-top:6px;">${d.fyL} ${fiscalYearEnglish}</div>
      </td>
      <td style="border:1px solid #000;padding:4px 6px;vertical-align:top;text-align:center;">
        <div>${d.stamp}</div>
        ${
          company.logoUrl
            ? `<div style="margin-top:2px;"><img src="${company.logoUrl}" style="height:48px;width:48px;object-fit:contain;display:inline-block;" crossorigin="anonymous"/></div>`
            : `<div style="height:40px;"></div>`
        }
      </td>
      <td style="border:1px solid #000;padding:4px 6px;vertical-align:top;">
        <div>${d.appName} ${prof.contactEnglish || "Authorized Signatory"}</div>
        <div style="margin-top:6px;">${d.sign}</div>
      </td>
    </tr>
  </table>

  <!-- Footer -->
  <div style="border-top:1px solid #333;margin-top:14px;padding-top:4px;text-align:center;font-size:9.5pt;color:#374151;">
    ${prof.addrEnglish || "Kathmandu, Nepal"} ${prof.email ? ` | E-mail:- ${prof.email}` : ""} ${prof.phone || prof.mobile ? ` | Ph.:- ${prof.phone || prof.mobile}` : ""}
  </div>
</div>
`;
  };

  // Convert HTML to Page 1 PDF Base64
  const renderPage1Base64 = async (company: Company): Promise<string> => {
    const { default: html2canvas } = await import("html2canvas");
    const { default: jsPDF } = await import("jspdf");

    if (fontMode === "preeti") {
      try {
        await document.fonts.load("12px Preeti");
      } catch {}
    }

    const formDiv = document.createElement("div");
    formDiv.style.cssText =
      "position:fixed;top:0;left:0;z-index:99999;pointer-events:none;background:#ffffff;";
    formDiv.innerHTML = buildPage1HTML(company);
    document.body.appendChild(formDiv);

    // Wait for images
    const imgs = formDiv.querySelectorAll("img");
    await Promise.all(
      Array.from(imgs).map(
        (img) =>
          new Promise((r) => {
            img.onload = r;
            img.onerror = r;
            if (img.complete) r(null);
          })
      )
    );

    await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 600));

    const el = formDiv.firstElementChild as HTMLElement;
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: 794,
      height: 1120,
      windowWidth: 794,
      logging: false,
    });

    document.body.removeChild(formDiv);

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error("Failed to render Page 1 canvas");
    }

    const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);

    const pdfDataUri = pdf.output("datauristring");
    return pdfDataUri.split(",")[1];
  };

  // Generate full PDF for single company (Page 1 + attached certificates)
  const generateSinglePDF = async (company: Company): Promise<Blob> => {
    const page1Base64 = await renderPage1Base64(company);

    const filename = `${company.name} Suchidarta ${officeKey}.pdf`;

    const res = await fetch("/api/suchidarta/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyId: company.id,
        page1PdfBase64: page1Base64,
        includeRegistration: attachReg,
        includeVat: attachVat,
        includeTaxClearance: attachTax,
        filename,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server returned error ${res.status}`);
    }

    return await res.blob();
  };

  // Download Single Company PDF
  const handleDownloadSingle = async (company: Company) => {
    setIsGenerating(true);
    setProgressMsg(`Generating complete packet for ${company.name}...`);
    try {
      const { saveAs } = await import("file-saver");
      const blob = await generateSinglePDF(company);
      saveAs(blob, `${company.name} Suchidarta ${officeKey}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Error generating PDF: " + String(err));
    } finally {
      setIsGenerating(false);
      setProgressMsg("");
    }
  };

  // Download All Selected Companies as ZIP
  const handleDownloadZip = async () => {
    if (selectedList.length === 0) return;
    setIsGenerating(true);
    try {
      const { default: JSZip } = await import("jszip");
      const { saveAs } = await import("file-saver");
      const zip = new JSZip();

      for (let i = 0; i < selectedList.length; i++) {
        const c = selectedList[i];
        setProgressMsg(
          `Generating ${i + 1}/${selectedList.length}: ${c.name}...`
        );
        const pdfBlob = await generateSinglePDF(c);
        zip.file(`${c.name} Suchidarta ${officeKey}.pdf`, pdfBlob);
      }

      setProgressMsg("Packing ZIP archive...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `Suchidarta ${officeKey}.zip`);
    } catch (err) {
      console.error(err);
      alert("Error creating ZIP: " + String(err));
    } finally {
      setIsGenerating(false);
      setProgressMsg("");
    }
  };

  // Open Preview Modal
  const handleOpenPreview = (company: Company) => {
    setPreviewCompany(company);
    setPreviewHtml(buildPage1HTML(company));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Selector */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>📋</span> Suchidarta Generator (अनुसूची २(क))
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select companies, customize office & dates, and generate complete 4-page submission packets.
            </p>
          </div>

          {/* Language & Font Selector */}
          <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-lg border border-gray-200">
            <span className="text-xs font-semibold text-gray-500 px-2">Font:</span>
            <button
              type="button"
              onClick={() => setFontMode("preeti")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                fontMode === "preeti"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              नेपाली (Preeti Font)
            </button>
            <button
              type="button"
              onClick={() => setFontMode("unicode")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                fontMode === "unicode"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              नेपाली (Unicode)
            </button>
            <button
              type="button"
              onClick={() => setFontMode("english")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                fontMode === "english"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              English (Times New Roman)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Company Selection (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-semibold text-gray-900">
                कम्पनीहरू ({selectedList.length}/{companies.length} Selected)
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSel(new Set(companies.map((c) => c.id)))}
                className="text-blue-600 hover:underline font-medium"
              >
                Select All
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={() => setSel(new Set())}
                className="text-gray-500 hover:underline font-medium"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {companies.map((company) => {
              const isSelected = sel.has(company.id);
              const isExp = expandedId === company.id;
              const prof = profiles[company.id] || {};
              const hasReg = company.documents?.some(
                (d) => d.sectionType.key === "registration"
              );
              const hasVat = company.documents?.some(
                (d) => d.sectionType.key === "vat"
              );
              const latestTax = company.taxClearances?.find((t) => t.isLatest) || company.taxClearances?.[0];

              return (
                <div
                  key={company.id}
                  className={`border rounded-xl transition duration-150 ${
                    isSelected
                      ? "border-blue-400 bg-white shadow-sm ring-1 ring-blue-100"
                      : "border-gray-200 bg-gray-50/60 opacity-80"
                  }`}
                >
                  <div className="p-4 flex items-start justify-between gap-3">
                    <label className="flex items-start gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(company.id)}
                        className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                          {company.name}
                          {company.logoUrl && (
                            <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              Logo/Stamp ✓
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2 items-center">
                          <span className={hasReg ? "text-emerald-700" : "text-amber-700"}>
                            Reg: {hasReg ? "✓ Attached" : "None"}
                          </span>
                          <span>•</span>
                          <span className={hasVat ? "text-emerald-700" : "text-amber-700"}>
                            VAT: {hasVat ? "✓ Attached" : "None"}
                          </span>
                          <span>•</span>
                          <span className={latestTax ? "text-emerald-700" : "text-amber-700"}>
                            Tax: {latestTax ? `✓ ${latestTax.fiscalYear}` : "None"}
                          </span>
                        </div>
                        {prof.customDate && (
                          <div className="text-xs text-purple-700 font-medium mt-1">
                            📅 Custom Date: {prof.customDate}
                          </div>
                        )}
                      </div>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenPreview(company)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded font-medium transition"
                      >
                        👁️ Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadSingle(company)}
                        disabled={isGenerating}
                        className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1.5 rounded font-medium transition"
                      >
                        📥 PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExp ? null : company.id)}
                        className="text-xs text-gray-500 hover:text-gray-900 px-2 py-1.5 rounded border border-gray-200"
                      >
                        {isExp ? "Hide ▲" : "Edit ▼"}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Company Details Editor */}
                  {isExp && (
                    <div className="border-t border-gray-100 bg-gray-50/80 p-4 rounded-b-xl space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Company Name (English)
                          </label>
                          <input
                            type="text"
                            value={prof.nameEnglish}
                            onChange={(e) => updateProfile(company.id, "nameEnglish", e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Company Name (Nepali Unicode)
                          </label>
                          <input
                            type="text"
                            value={prof.nameUnicode}
                            onChange={(e) => updateProfile(company.id, "nameUnicode", e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Reg. No.
                          </label>
                          <input
                            type="text"
                            value={prof.regNo}
                            onChange={(e) => updateProfile(company.id, "regNo", e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            VAT/PAN No.
                          </label>
                          <input
                            type="text"
                            value={prof.vatNo}
                            onChange={(e) => updateProfile(company.id, "vatNo", e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Contact Person (विनोद शाह / Name)
                          </label>
                          <input
                            type="text"
                            value={prof.contactUnicode}
                            onChange={(e) => updateProfile(company.id, "contactUnicode", e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">
                            Mobile No.
                          </label>
                          <input
                            type="text"
                            value={prof.mobile}
                            onChange={(e) => updateProfile(company.id, "mobile", e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-xs"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-purple-700 mb-1 flex items-center justify-between">
                            <span>📌 Custom Date for this Company (&quot;Farak Miti&quot;):</span>
                            <span className="text-gray-400 font-normal">Leave blank to use master date</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. २०८३/०४/०६ or 2026/07/21"
                            value={prof.customDate || ""}
                            onChange={(e) => updateProfile(company.id, "customDate", e.target.value)}
                            className="w-full bg-white border border-purple-300 focus:ring-1 focus:ring-purple-400 rounded px-2.5 py-1.5 text-xs text-purple-900"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Office, Dates & Document Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Office Preset and Address */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <span>🏛️</span> लक्षित कार्यालय (Target Office)
            </h3>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                छिटो छान्नुहोस् (Office Preset):
              </label>
              <select
                value={selectedPreset}
                onChange={(e) => handlePresetSelect(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {OFFICE_PRESETS.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Office Identifier (ZIP / Filename):
              </label>
              <input
                type="text"
                value={officeKey}
                onChange={(e) => setOfficeKey(e.target.value)}
                placeholder="e.g. Panchthar, Biratnagar"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                कार्यालयको ठेगाना (Address Block):
              </label>
              {fontMode === "preeti" ? (
                <div>
                  <textarea
                    rows={3}
                    value={addrText}
                    onChange={(e) => {
                      setAddrText(e.target.value);
                      setAddrPreetiText(unicodeToPreeti(e.target.value));
                    }}
                    placeholder="श्रीमान् कार्यालय प्रमुख ज्यू, पूर्वाधार विकास कार्यालय, पाँचथर"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Preeti Preview:{" "}
                    <span style={{ fontFamily: "Preeti, serif" }} className="text-blue-700 font-semibold">
                      {addrPreetiText || unicodeToPreeti(addrText)}
                    </span>
                  </div>
                </div>
              ) : fontMode === "unicode" ? (
                <textarea
                  rows={3}
                  value={addrText}
                  onChange={(e) => setAddrText(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              ) : (
                <textarea
                  rows={3}
                  value={addrEnglishText}
                  onChange={(e) => setAddrEnglishText(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-serif"
                />
              )}
            </div>
          </div>

          {/* Master Dates & Fiscal Year */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <span>📅</span> मिति र आर्थिक वर्ष (Dates & Fiscal Year)
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {fontMode === "english" ? "Master Date:" : "Master Miti (Date):"}
                </label>
                <input
                  type="text"
                  value={fontMode === "english" ? masterDateEnglish : masterDate}
                  onChange={(e) =>
                    fontMode === "english"
                      ? setMasterDateEnglish(e.target.value)
                      : handleMasterDateChange(e.target.value)
                  }
                  placeholder={fontMode === "english" ? "2026/07/20" : "२०८३/०४/०५"}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {fontMode === "english" ? "Fiscal Year:" : "आर्थिक वर्ष (Fiscal Year):"}
                </label>
                <input
                  type="text"
                  value={fontMode === "english" ? fiscalYearEnglish : fiscalYear}
                  onChange={(e) =>
                    fontMode === "english"
                      ? setFiscalYearEnglish(e.target.value)
                      : handleFiscalYearChange(e.target.value)
                  }
                  placeholder={fontMode === "english" ? "2083/084" : "२०८३/०८४"}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <p className="text-xs text-gray-400">
              💡 Harek company ko farak date chahiyo vane, left side ko company card maa &quot;Edit&quot; click garera &quot;Custom Date&quot; halna saknu hunchha!
            </p>
          </div>

          {/* Supporting Documents to Attach */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <span>📎</span> संलग्न कागजातहरू (Supporting Documents to Attach)
            </h3>
            <p className="text-xs text-gray-500">
              Select which certificates to automatically append after the Suchidarta application form:
            </p>

            <div className="space-y-2 text-sm text-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attachReg}
                  onChange={(e) => setAttachReg(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Page 2: Company Registration Certificate (दर्ता प्रमाणपत्र)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attachVat}
                  onChange={(e) => setAttachVat(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Page 3: VAT / PAN Certificate (स्थायी लेखा नम्बर दर्ता)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attachTax}
                  onChange={(e) => setAttachTax(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Page 4: Latest Tax Clearance Certificate (कर चुक्ता प्रमाणपत्र)</span>
              </label>
            </div>

            <div className="bg-blue-50 text-blue-800 text-xs rounded-lg p-2.5 font-medium border border-blue-100">
              📄 Total Output: 1 Page Form + {Number(attachReg) + Number(attachVat) + Number(attachTax)} Attachment Pages ={" "}
              {1 + Number(attachReg) + Number(attachVat) + Number(attachTax)} Pages per company!
            </div>
          </div>

          {/* Download Action Area */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isGenerating || selectedList.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  <span>{progressMsg || "Generating packets..."}</span>
                </>
              ) : (
                <>
                  <span>📦</span>
                  <span>
                    Download All as ZIP ({selectedList.length} Companies — {officeKey})
                  </span>
                </>
              )}
            </button>

            {selectedList.length === 0 && (
              <p className="text-xs text-amber-600 text-center bg-amber-50 rounded-lg py-2">
                ⚠️ कृपया सूचीबाट कम्तिमा १ वटा कम्पनी छान्नुहोस्
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      {previewCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  Suchidarta Form Preview (Page 1) — {previewCompany.name}
                </h3>
                <p className="text-xs text-gray-500">
                  Target Office: {officeKey} | Mode: {fontMode}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadSingle(previewCompany)}
                  disabled={isGenerating}
                  className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                >
                  📥 Download Complete PDF
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewCompany(null)}
                  className="text-gray-400 hover:text-gray-700 text-lg px-2"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-gray-100 flex justify-center">
              <div
                className="shadow-xl rounded bg-white"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
