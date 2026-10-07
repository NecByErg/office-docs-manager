"use client";

import { useState, useEffect, useMemo } from "react";
import { unicodeToPreeti } from "@/lib/preeti";

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
  documents?: CompanyDoc[];
  taxClearances?: CompanyTax[];
};

export type CompanyConfig = {
  nameEnglish: string;
  regNo: string;
  vatNo: string;
  namePreeti: string;
  addrPreeti: string;
  contactPreeti: string;
  mobilePreeti: string;
  mobile: string;
  logoUrl: string;
  stampUrl: string;
  signUrl: string;
  footerText: string;
  filePrefix: string;
  date: string;
  datePreeti: string;
};

const DEFAULT_COMPANIES_CONFIG: Record<string, Partial<CompanyConfig>> = {
  // 1. BI Engineering
  cmsrcze8c0000jv0443e2o5aa: {
    nameEnglish: "B.I. ENGINEERING CONSULTANCY PVT.LTD.",
    regNo: "220300/076/077",
    vatNo: "609586655",
    namePreeti: "la= cfO{= O{lGhlgol/Ë sG;N6]G;L k|f =ln",
    addrPreeti: "sf7df08f}",
    contactPreeti: "lagf]b Zffx",
    mobilePreeti: "(*$*^^)#(#",
    mobile: "9848660393",
    logoUrl: "/suchidarta/extracted/bi_image1.jpeg",
    stampUrl: "/suchidarta/extracted/bi_image2.png",
    signUrl: "/suchidarta/extracted/bi_image2.png",
    footerText: "Tokha Municipality-07, Kathmandu, Nepal | E-mail:- biconsultancy2076@gmail.com | Ph.:- +977-9860133281",
    filePrefix: "BI Suchidarta For",
    date: "२०८१।०४।०१",
    datePreeti: "@)*!÷)$÷)!",
  },
  // 2. Netreshwori
  cmsrcjmk10001l10424k4dtiv: {
    nameEnglish: "NETRESHWORI ENGINEERING CONSULTANCY [P] Ltd.",
    regNo: "148054/72/073",
    vatNo: "609571234",
    namePreeti: "g]q]Zj/L O{lGhlgol/Ë sG;N6]G;L k|f =ln",
    addrPreeti: "sf7df08f}",
    contactPreeti: "eQm /fh hf]zL",
    mobilePreeti: "(*%!@!&!%@",
    mobile: "9851217152",
    logoUrl: "/suchidarta/extracted/netreshwori_image4.jpeg",
    stampUrl: "/suchidarta/extracted/netreshwori_image2.png",
    signUrl: "/suchidarta/extracted/netreshwori_image3.png",
    footerText: "Tokha Municipality-12, Kathmandu, Nepal | E-mail:- netreshworiconsultancy@gmail.com | Ph.:- +977-9851217152",
    filePrefix: "Suchidarta of Netreshwori for",
    date: "२०८१।०४।०२",
    datePreeti: "@)*!÷)$÷)@",
  },
  // 3. Diligent
  cmu2bv64v0000la04vx9ei2x3: {
    nameEnglish: "DILIGENT ENGINEERING Solution(p) ltd.",
    regNo: "307731/079/080",
    vatNo: "610452840",
    namePreeti: "l8lnh]G6 O{lGhlgol/Ë ;n';g k|f= ln=",
    addrPreeti: "sf7df08f}",
    contactPreeti: "pd]z hf]zL",
    mobilePreeti: "(*%!#$$$^)",
    mobile: "9851344460",
    logoUrl: "/suchidarta/extracted/diligent_image1.jpeg",
    stampUrl: "/suchidarta/extracted/diligent_image3.png",
    signUrl: "/suchidarta/extracted/diligent_image4.png",
    footerText: "Anamnagar, Kathamandu, Nepal | Email : - dengineeringsolution@gmail.com | Mob: - +977-9851344460",
    filePrefix: "Diligent Suchidarta For",
    date: "२०८१।०४।०३",
    datePreeti: "@)*!÷)$÷)#",
  },
  // 4. Mastamandali
  cmsrd0y4d0001jv04qlh0pa52: {
    nameEnglish: "MASTAMANDALI ENGINEERING CONSULTANCY (P) Ltd.",
    regNo: "151887/072/073",
    vatNo: "609598712",
    namePreeti: "df:tfdf08nL O{lGhlgol/Ë sG;N6]G;L k|f= ln=",
    addrPreeti: "sf7df08f}",
    contactPreeti: ";'hg l;Dv8f",
    mobilePreeti: "(*%!@!&!()",
    mobile: "9851217190",
    logoUrl: "/suchidarta/extracted/mastamandali_image4.jpeg",
    stampUrl: "/suchidarta/extracted/mastamandali_image2.png",
    signUrl: "/suchidarta/extracted/mastamandali_image3.png",
    footerText: "Nagarjun Municipality-4, Bafal, Kathamandu, Nepal | E-Mail:- Simkhadasujan30@gmail.com | Mob: - +977-9851217190",
    filePrefix: "Mastamandali Suchidarta For",
    date: "२०८१।०४।०४",
    datePreeti: "@)*!÷)$÷)$",
  },
  // 5. Midas
  cmsyc4dd80000jx04khgkqvz6: {
    nameEnglish: "MIDAS ENGINEERING CONSULTANT",
    regNo: "195373/075/076",
    vatNo: "606636461",
    namePreeti: "dfO{8; O{lGhlgol/Ë sG;N6]G;L k|f= ln=",
    addrPreeti: "sf7df08f}",
    contactPreeti: ";'/]z a+;L 7s'/L",
    mobilePreeti: "(*$!%$!)*(",
    mobile: "9841541049",
    logoUrl: "/suchidarta/extracted/midas_image1.png",
    stampUrl: "/suchidarta/extracted/midas_image1.png",
    signUrl: "/suchidarta/extracted/midas_image2.png",
    footerText: "Adress :- Bafal, Kathmandu | Email :- sbthakuri2015@gmail.com",
    filePrefix: "Midas Suchidarta For",
    date: "२०८१।०४।०५",
    datePreeti: "@)*!÷)$÷)%",
  },
  // 6. Hints
  cmuxm3q2r0000kz04wznn2nwb: {
    nameEnglish: "HINTS CONSULT PVT. LTD.",
    regNo: "225600/076/077",
    vatNo: "609689012",
    namePreeti: "lxG6\; sG;N6 k|f= ln=",
    addrPreeti: "sf7df08f}",
    contactPreeti: "O{= ks+h Gof}kfg]",
    mobilePreeti: "(*%!&&**((",
    mobile: "9851778899",
    logoUrl: "/suchidarta/extracted/hints_image1.png",
    stampUrl: "/suchidarta/extracted/hints_image1.png",
    signUrl: "/suchidarta/extracted/hints_image2.png",
    footerText: "Kathmandu, Nepal | Email: hintsconsult@gmail.com",
    filePrefix: "Hints Suchidarta For",
    date: "२०८१।०४।०६",
    datePreeti: "@)*!÷)$÷)^",
  },
};

const DEFAULT_OFFICE_PREETI = `>Ldfg l8lehg k|d'v Ho"",\nvfg]kfgL tyf ;/;kmfO{ l8lehg\nvf]6fË`;
const DEFAULT_OFFICE_UNICODE = `श्रीमान् डिभिजन प्रमुख ज्यू,\nखानेपानी तथा सरसफाई डिभिजन\nखोटाङ`;

export default function SuchidartaClient({
  companies,
}: {
  companies: Company[];
}) {
  // Only the 6 target companies
  const targetCompanies = useMemo(() => {
    return companies.filter((c) => DEFAULT_COMPANIES_CONFIG[c.id]);
  }, [companies]);

  const [sel, setSel] = useState<Set<string>>(
    new Set(targetCompanies.map((c) => c.id))
  );

  const [configs, setConfigs] = useState<Record<string, CompanyConfig>>({});

  // 1. Common Office Address (Same for all 6 companies)
  const [officeName, setOfficeName] = useState("Khotang");
  const [officePreeti, setOfficePreeti] = useState(DEFAULT_OFFICE_PREETI);
  const [officeUnicode, setOfficeUnicode] = useState(DEFAULT_OFFICE_UNICODE);

  // 2. Fiscal Year (Same for all 6 companies)
  const [fiscalYear, setFiscalYear] = useState("२०८१/०८२");
  const [fiscalYearPreeti, setFiscalYearPreeti] = useState("@)*!÷)*@");

  // Document attachment toggles
  const [attachReg, setAttachReg] = useState(true);
  const [attachVat, setAttachVat] = useState(true);
  const [attachTax, setAttachTax] = useState(true);

  // Preview state
  const [previewCompany, setPreviewCompany] = useState<Company | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string>("");

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");

  // Initialize company configs
  useEffect(() => {
    // Inject Preeti font if needed
    if (!document.getElementById("preeti-font")) {
      const s = document.createElement("style");
      s.id = "preeti-font";
      s.textContent = `@font-face{font-family:'Preeti';src:url('/fonts/Preeti.ttf') format('truetype');font-display:swap;}`;
      document.head.appendChild(s);
    }

    const initial: Record<string, CompanyConfig> = {};
    let saved: Record<string, Partial<CompanyConfig>> = {};
    try {
      const s = localStorage.getItem("suchi-meta-v4");
      if (s) saved = JSON.parse(s);
    } catch {}

    targetCompanies.forEach((c) => {
      const def = DEFAULT_COMPANIES_CONFIG[c.id] || {};
      const s = saved[c.id] || {};

      initial[c.id] = {
        nameEnglish: def.nameEnglish || c.name,
        regNo: def.regNo || "",
        vatNo: def.vatNo || "",
        namePreeti: def.namePreeti || unicodeToPreeti(c.name),
        addrPreeti: def.addrPreeti || "sf7df08f}",
        contactPreeti: def.contactPreeti || "k|d'v",
        mobilePreeti: def.mobilePreeti || "(*%!@!&!%@",
        mobile: def.mobile || "9851217152",
        logoUrl: def.logoUrl || c.logoUrl || "",
        stampUrl: def.stampUrl || c.logoUrl || "",
        signUrl: def.signUrl || "",
        footerText: def.footerText || "Kathmandu, Nepal",
        filePrefix: def.filePrefix || `${c.name} Suchidarta For`,
        date: s.date || def.date || "२०८१।०४।०१",
        datePreeti: s.datePreeti || def.datePreeti || "@)*!÷)$÷)!",
      };
    });

    setConfigs(initial);
  }, [targetCompanies]);

  const updateCompanyDate = (companyId: string, newDate: string) => {
    const pDate = unicodeToPreeti(newDate);
    setConfigs((prev) => {
      const current = prev[companyId];
      if (!current) return prev;
      const next = {
        ...prev,
        [companyId]: { ...current, date: newDate, datePreeti: pDate },
      };
      try {
        localStorage.setItem("suchi-meta-v4", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleOfficeUnicodeChange = (val: string) => {
    setOfficeUnicode(val);
    setOfficePreeti(unicodeToPreeti(val));
  };

  const handleFiscalYearChange = (val: string) => {
    setFiscalYear(val);
    setFiscalYearPreeti(unicodeToPreeti(val));
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
    () => targetCompanies.filter((c) => sel.has(c.id)),
    [targetCompanies, sel]
  );

  // Generate exact Page 1 HTML matching user's Image 2
  const buildPage1HTML = (company: Company): string => {
    const cfg = configs[company.id] || DEFAULT_COMPANIES_CONFIG[company.id] || {};
    const officeLines = officePreeti.split("\n").join("<br/>");

    return `
<div style="font-family:'Preeti',serif;font-size:11pt;padding:12mm 18mm 14mm 18mm;width:794px;min-height:1120px;background:#fff;box-sizing:border-box;color:#000;line-height:1.6;">
  <!-- Letterhead Header -->
  <div style="border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:10px;">
    <table style="width:100%;border-collapse:collapse;border:none;">
      <tr>
        ${
          cfg.logoUrl
            ? `<td style="width:85px;vertical-align:middle;text-align:left;border:none;padding:0;">
                <img src="${cfg.logoUrl}" style="width:75px;height:75px;object-fit:contain;" crossorigin="anonymous"/>
               </td>`
            : ""
        }
        <td style="text-align:center;vertical-align:middle;border:none;padding:0;">
          <div style="font-family:'Times New Roman',Arial,sans-serif;font-size:16pt;font-weight:bold;color:#000;letter-spacing:0.5px;">
            ${cfg.nameEnglish}
          </div>
          <div style="font-family:'Times New Roman',Arial,sans-serif;font-size:10pt;font-weight:600;margin-top:2px;">
            Reg. No. : - ${cfg.regNo} ${cfg.vatNo ? `&nbsp;&nbsp;&nbsp;&nbsp; Vat. No. :- ${cfg.vatNo}` : ""}
          </div>
        </td>
      </tr>
    </table>
    <div style="margin-top:4px;font-family:'Times New Roman',Arial,sans-serif;font-size:9.5pt;font-weight:bold;">
      Ref No: -
    </div>
  </div>

  <!-- Heading -->
  <div style="text-align:center;margin-bottom:8px;line-height:1.7;">
    <div style="font-size:12pt;font-weight:600;">cg';'rL– @(s)=</div>
    <div style="font-size:10pt;">-lgod !* sf] pklgod -!_ ;Fu ;DalGwt_</div>
    <div style="font-size:12pt;font-weight:bold;margin-top:2px;">Dff}h'bf ;"rLdf btf{ x'gsf nflu lbOg] lgj]bgsf] 9fFrf</div>
  </div>

  <!-- Date Right -->
  <div style="text-align:right;font-size:11pt;margin-bottom:6px;font-weight:bold;">
    ldlt M ${cfg.datePreeti}
  </div>

  <!-- Office Address -->
  <div style="margin-bottom:8px;line-height:1.7;font-size:11pt;">
    ${officeLines}
  </div>

  <!-- Subject -->
  <div style="font-weight:bold;font-size:11.5pt;margin-bottom:6px;">
    ljifoM df}h'bf ;"rLdf btf{ u/L kfpF .
  </div>

  <!-- Body -->
  <div style="margin-bottom:8px;text-align:justify;line-height:1.8;font-size:10pt;">
    ;fj{hlgs vl/b lgodfjnL, @)^$ sf] lgod !* sf] pklgod -!_ adf]lhd tklzndf plNnlvt ljj/0fcg';f/sf] k'i6\\ofOF ug]{ sfuhft ;+nUg u/L df}h'bf ;'rLdf btf{ x'g of] lgj]bg k]; u/]sf] 5' .
  </div>

  <!-- Tapsil -->
  <div style="font-weight:bold;font-size:11.5pt;text-align:center;margin-bottom:4px;text-decoration:underline;">
    tfkl;n
  </div>

  <!-- Table -->
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;font-size:10pt;line-height:1.5;">
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:3px 5px;font-weight:bold;background:#fafafa;">
        != df}h'bf ;'rLsf] nflu lgj]bg lbg] JolQm, ;+:yf, cfk"lt{stf{, lgdf{0f Joj;foL, k/fdz{bftf jf ;]jf k|bfossf] ljj/0f M
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:3px 5px;width:23%;">-s_ gfd M</td>
      <td style="border:1px solid #000;padding:3px 5px;width:32%;">${cfg.namePreeti}</td>
      <td style="border:1px solid #000;padding:3px 5px;width:22%;">-v_ 7]ufgf M</td>
      <td style="border:1px solid #000;padding:3px 5px;width:23%;">${cfg.addrPreeti}</td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:3px 5px;">-u_ kqfrf/ ug]{ 7]ufgf M</td>
      <td style="border:1px solid #000;padding:3px 5px;">${cfg.addrPreeti}</td>
      <td style="border:1px solid #000;padding:3px 5px;">-3_ d'Vo JolQmsf] gfd M</td>
      <td style="border:1px solid #000;padding:3px 5px;">${cfg.contactPreeti}</td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:3px 5px;">-ª_ 6]lnkmf]g g+=M</td>
      <td style="border:1px solid #000;padding:3px 5px;"></td>
      <td style="border:1px solid #000;padding:3px 5px;">-r_ df]afOn g+= M</td>
      <td style="border:1px solid #000;padding:3px 5px;">${cfg.mobilePreeti}</td>
    </tr>
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:3px 5px;font-weight:bold;background:#fafafa;">
        @= df}h'bf ;"rLdf btf{ x'gsf] nflu lgDgadf]lhdsf] k|df0fkq ;+nUg ug'{xf]nf .
      </td>
    </tr>
    <tr>
      <td colspan="2" style="border:1px solid #000;padding:3px 5px;">-s_ ;+:yf jf kmd{ btf{sf] k|df0fkq 5 &nbsp;&nbsp;&nbsp; <b>[ √ ]</b></td>
      <td colspan="2" style="border:1px solid #000;padding:3px 5px;">-v_ gjLs/0f ul/Psf] 5 &nbsp;&nbsp;&nbsp; <b>[ √ ]</b></td>
    </tr>
    <tr>
      <td colspan="2" style="border:1px solid #000;padding:3px 5px;">-u_ d"No clej[l4 s/ jf :yfoL n]vf gDa/ btf{sf] k|df0fkq 5 &nbsp;&nbsp;&nbsp; <b>[ √ ]</b></td>
      <td colspan="2" style="border:1px solid #000;padding:3px 5px;">-3_ s/ r'Qmfsf] k|df0fkq 5 &nbsp;&nbsp;&nbsp; <b>[ √ ]</b></td>
    </tr>
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:3px 5px;">-ª_ s'g vl/bsf] nflu df}h'bf ;'rLdf btf{ x'g lgj]bg lbg] xf], ;f] sfdsf] nflu Ohfht kq cfjZos kg]{ ePdf ;f]sf] k|ltlnlk 5 &nbsp;&nbsp;&nbsp; <b>[ √ ]</b></td>
    </tr>
    <tr>
      <td colspan="4" style="border:1px solid #000;padding:3px 5px;font-weight:bold;background:#fafafa;">
        #=;fj{hlgs lgsfoaf6 x'g] vl/bsf] nflu btf{ x'g rfx]sf] k|s[ltsf] ljj/0f M
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:3px 5px;">-s_ dfn;fdfg cfk"lt{ M</td>
      <td style="border:1px solid #000;padding:3px 5px;"></td>
      <td style="border:1px solid #000;padding:3px 5px;">-v_ lgdf{0f sfo{</td>
      <td style="border:1px solid #000;padding:3px 5px;"></td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:3px 5px;">-u_ k/fdz{ ;]jf M</td>
      <td style="border:1px solid #000;padding:3px 5px;">tflnd / k/fdz{ ;]jf ;DaGwL</td>
      <td style="border:1px solid #000;padding:3px 5px;">-3_ cgo ;]jf M</td>
      <td style="border:1px solid #000;padding:3px 5px;"></td>
    </tr>
    <tr style="height:55px;">
      <td colspan="2" style="border:1px solid #000;padding:3px 5px;vertical-align:top;">
        <div>lgj]bg lbPsf] ldlt M ${cfg.datePreeti}</div>
        <div style="margin-top:6px;">cf=j= M ${fiscalYearPreeti}</div>
      </td>
      <td style="border:1px solid #000;padding:3px 5px;vertical-align:top;text-align:center;">
        <div>Kfmd{sf] 5fk M</div>
        ${
          cfg.stampUrl
            ? `<div style="margin-top:2px;"><img src="${cfg.stampUrl}" style="height:50px;width:50px;object-fit:contain;display:inline-block;" crossorigin="anonymous"/></div>`
            : `<div style="height:40px;"></div>`
        }
      </td>
      <td style="border:1px solid #000;padding:3px 5px;vertical-align:top;">
        <div>lgj]bssf] gfd M ${cfg.contactPreeti}</div>
        <div style="margin-top:4px;display:flex;align-items:center;gap:4px;">
          <span>x:tfIf/ M</span>
          ${
            cfg.signUrl
              ? `<img src="${cfg.signUrl}" style="height:35px;object-fit:contain;" crossorigin="anonymous"/>`
              : ""
          }
        </div>
      </td>
    </tr>
  </table>

  <!-- Footer -->
  <div style="border-top:1px solid #000;margin-top:12px;padding-top:4px;text-align:center;font-family:'Times New Roman',Arial,sans-serif;font-size:9.5pt;color:#111;">
    ${cfg.footerText}
  </div>
</div>
`;
  };

  // Convert HTML to Page 1 PDF Base64
  const renderPage1Base64 = async (company: Company): Promise<string> => {
    const { default: html2canvas } = await import("html2canvas");
    const { default: jsPDF } = await import("jspdf");

    try {
      await document.fonts.load("12px Preeti");
    } catch {}

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

  // Build target filename
  const getOutputFilename = (company: Company): string => {
    const cfg = configs[company.id] || DEFAULT_COMPANIES_CONFIG[company.id] || {};
    return `${cfg.filePrefix} ${officeName}.pdf`;
  };

  // Generate full 4-page PDF for single company
  const generateSinglePDF = async (company: Company): Promise<Blob> => {
    const page1Base64 = await renderPage1Base64(company);
    const filename = getOutputFilename(company);

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
      saveAs(blob, getOutputFilename(company));
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
        zip.file(getOutputFilename(c), pdfBlob);
      }

      setProgressMsg("Packing ZIP archive...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `Suchidarta For ${officeName}.zip`);
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
      {/* Top Banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>📋</span> Suchidarta Generator — {officeName}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              ६ वटा कम्पनीहरूका लागि १ पृष्ठ निवेदन + ३ पृष्ठ संलग्न प्रमाण-पत्र (कुल ४ पृष्ठ) एकै क्लिकमा तयार गर्नुहोस्।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1.5">
              <span>✓</span> 6 Company Templates Ready
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: 6 Companies List with Per-Company Date inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">
              कम्पनीहरू ({selectedList.length}/{targetCompanies.length} Selected)
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSel(new Set(targetCompanies.map((c) => c.id)))}
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
            {targetCompanies.map((company) => {
              const isSelected = sel.has(company.id);
              const cfg = configs[company.id] || {};
              const outName = getOutputFilename(company);

              return (
                <div
                  key={company.id}
                  className={`border rounded-xl p-4 transition duration-150 ${
                    isSelected
                      ? "border-blue-400 bg-white shadow-sm ring-1 ring-blue-100"
                      : "border-gray-200 bg-gray-50/60 opacity-80"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <label className="flex items-start gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(company.id)}
                        className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                          {cfg.nameEnglish || company.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Output: <span className="font-mono text-blue-700 font-semibold">{outName}</span>
                        </div>
                        <div className="text-xs text-emerald-700 mt-1 flex items-center gap-2">
                          <span>✓ 1 Page Nivedan</span>
                          <span>+</span>
                          <span>✓ 3 Pages Attached (Reg + VAT + Tax)</span>
                        </div>
                      </div>
                    </label>

                    {/* Per-Company Specific Date Input */}
                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      <div className="text-right">
                        <label className="block text-[11px] font-bold text-yellow-900">
                          मिति (Date):
                        </label>
                        <span className="text-[10px] text-gray-500 font-serif">
                          {cfg.datePreeti}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={cfg.date || ""}
                        onChange={(e) => updateCompanyDate(company.id, e.target.value)}
                        placeholder="२०८१।०४।०१"
                        className="w-28 bg-white border border-yellow-300 rounded px-2 py-1 text-xs font-semibold text-gray-900 focus:ring-1 focus:ring-yellow-500"
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenPreview(company)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-medium transition"
                    >
                      👁️ Preview Letter
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(company)}
                      disabled={isGenerating}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-semibold shadow-xs transition"
                    >
                      📥 Download 4-Page PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Common Office Block, Fiscal Year & ZIP Action (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Common Office Address Block (Yellow highlighted) */}
          <div className="bg-white border-2 border-yellow-300 rounded-xl p-5 shadow-sm space-y-4 bg-yellow-50/20">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <span>🏛️</span> कार्यालयको ठेगाना (सबै ६ कम्पनीलाई एउटै)
              </h3>
              <span className="text-[11px] bg-yellow-100 text-yellow-800 font-semibold px-2 py-0.5 rounded border border-yellow-200">
                Dynamic
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Office Keyword (फाइलको नाममा आउने):
              </label>
              <input
                type="text"
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
                placeholder="Khotang"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold bg-white text-gray-900"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                उदा: <span className="font-mono text-blue-600 font-semibold">BI Suchidarta For {officeName}.pdf</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                कार्यालय र शाखा (Office Address Block):
              </label>
              <textarea
                rows={3}
                value={officeUnicode}
                onChange={(e) => handleOfficeUnicodeChange(e.target.value)}
                placeholder="श्रीमान् डिभिजन प्रमुख ज्यू,\nखानेपानी तथा सरसफाई डिभिजन\nखोटाङ"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 focus:ring-1 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-500 mt-1 bg-white p-2 rounded border border-gray-200">
                Preeti Representation:{" "}
                <div style={{ fontFamily: "Preeti, serif" }} className="text-blue-800 font-semibold text-sm mt-0.5 whitespace-pre-line">
                  {officePreeti}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                आर्थिक वर्ष (Fiscal Year):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={fiscalYear}
                  onChange={(e) => handleFiscalYearChange(e.target.value)}
                  placeholder="२०८१/०८२"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold bg-white text-gray-900"
                />
                <span style={{ fontFamily: "Preeti, serif" }} className="text-sm font-semibold text-gray-600 whitespace-nowrap bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
                  {fiscalYearPreeti}
                </span>
              </div>
            </div>
          </div>

          {/* Attached documents info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <span>📎</span> जोडिने कागजातहरू (Website Data)
            </h3>
            <p className="text-xs text-gray-500">
              हस्ताक्षर र छापसहितको १-पेज निवेदन पछाडि यी ३ वटा प्रमाण-पत्रहरू स्वतः जोडिनेछन्:
            </p>

            <div className="space-y-2 text-xs text-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attachReg}
                  onChange={(e) => setAttachReg(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Page 2: Company Registration (कम्पनी रजिष्ट्रार दर्ता)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attachVat}
                  onChange={(e) => setAttachVat(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Page 3: VAT/PAN Registration (स्थायी लेखा नम्बर दर्ता)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attachTax}
                  onChange={(e) => setAttachTax(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Page 4: Latest Tax Clearance (कर चुक्ता प्रमाण-पत्र)</span>
              </label>
            </div>

            <div className="bg-emerald-50 text-emerald-800 text-xs rounded-lg p-2.5 font-semibold border border-emerald-200 text-center">
              📄 Total Output = Exactly 4 Pages per Company!
            </div>
          </div>

          {/* ZIP Download Action */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={isGenerating || selectedList.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
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
                    Download All as ZIP ({selectedList.length} Files — {officeName})
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
                <p className="text-xs text-gray-500 font-mono">
                  File: {getOutputFilename(previewCompany)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadSingle(previewCompany)}
                  disabled={isGenerating}
                  className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                >
                  📥 Download 4-Page PDF
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
