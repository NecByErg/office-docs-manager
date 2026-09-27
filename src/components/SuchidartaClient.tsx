"use client";

import { useState, useEffect } from "react";

type Company = {
  id: string;
  name: string;
  logoUrl: string | null;
  establishmentYearBS: string;
};

type CMeta = {
  nameP: string;
  regNo: string;
  vatNo: string;
  addrP: string;
  contactP: string;
  mobile: string;
  serviceP: string;
  letterheadUrl: string;
};

const DEFAULTS: CMeta = {
  nameP: "",
  regNo: "",
  vatNo: "",
  addrP: "sf7df08f}",
  contactP: "",
  mobile: "",
  serviceP: "tflnd / k/fdz{ ;]jf ;DaGwL",
  letterheadUrl: "",
};

const P = {
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
  c5:       `-ª_ Ohfht kq k|ltlnlk 5`,
  s3:       `#=;fj{hlgs lgsfoab6 x'g] vl/bsf] nflu btf{ x'g rfx]sf] k|s[ltsf] ljj/0f M`,
  goods:    `-s_ dfn;fdfg cfk"lt{ M`,
  const_:   `-v_ lgdf{0f sfo{`,
  consult:  `-u_ k/fdz{ ;]jf M`,
  other:    `-3_ cGo ;]jf M`,
  dateL:    `lgj]bg lbPsf] ldlt M`,
  fyL:      `cf=j= M`,
  stamp:    `kmd{sf] 5fk M`,
  appName:  `lgj]bssf] gfd M`,
  sign:     `x:tfIf/ M`,
  tick:     `√`,
};

// ── Inner HTML only (no full document wrapper) ────────────────────
function buildFormHTML(
  company: Company,
  meta: CMeta,
  opts: { addrBlock: string; topDate: string; botDate: string; fy: string }
): string {
  const addrHtml = opts.addrBlock.split("\n").join("<br/>");
  const lhUrl = meta.letterheadUrl || company.logoUrl || "";

  return `
<div style="font-family:'Preeti',serif;font-size:11pt;padding:14mm 20mm;width:794px;min-height:1123px;background:#fff;box-sizing:border-box;">

  <!-- Letterhead -->
  <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:12px;">
    ${lhUrl ? `<img src="${lhUrl}" style="height:70px;object-fit:contain;" crossorigin="anonymous"/>` : ""}
    <div style="font-family:Arial,sans-serif;font-size:15pt;font-weight:bold;margin-top:4px;">${company.name}</div>
    ${meta.regNo ? `<div style="font-family:Arial,sans-serif;font-size:9pt;">Reg. No.: ${meta.regNo}${meta.vatNo ? " | VAT/PAN: " + meta.vatNo : ""}</div>` : ""}
    <div style="font-size:9.5pt;">${meta.addrP}</div>
  </div>

  <!-- Form title -->
  <div style="text-align:center;line-height:1.8;margin-bottom:12px;">
    <div>${P.h1}</div>
    <div>${P.h2}</div>
    <div style="font-weight:bold;">${P.h3}</div>
  </div>

  <!-- Top date -->
  <div style="text-align:right;margin-bottom:10px;">ldlt M ${opts.topDate}</div>

  <!-- Address block -->
  <div style="margin-bottom:12px;line-height:2;">${addrHtml}</div>

  <!-- Subject -->
  <div style="font-weight:bold;margin-bottom:10px;">${P.subj}</div>

  <!-- Body -->
  <div style="margin-bottom:14px;text-align:justify;line-height:1.9;">${P.body}</div>

  <!-- Tapsil -->
  <div style="font-weight:bold;text-decoration:underline;margin-bottom:6px;">${P.tapsil}</div>

  <!-- Table -->
  <table style="width:100%;border-collapse:collapse;font-size:10.5pt;">
    <tr><td colspan="4" style="border:1px solid #000;padding:4px 6px;">${P.s1}</td></tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;width:22%;">${P.nameLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;width:28%;">${meta.nameP || company.name}</td>
      <td style="border:1px solid #000;padding:4px 6px;width:22%;">${P.addrLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${meta.addrP}</td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;">${P.corrLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${meta.addrP}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${P.contLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${meta.contactP}</td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;">${P.phoneLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;"></td>
      <td style="border:1px solid #000;padding:4px 6px;">${P.mobLbl}</td>
      <td style="border:1px solid #000;padding:4px 6px;font-family:Arial,sans-serif;">${meta.mobile}</td>
    </tr>
    <tr><td colspan="4" style="border:1px solid #000;padding:4px 6px;">${P.s2}</td></tr>
    <tr>
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;">${P.c1} &nbsp; ${P.tick}</td>
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;">${P.c2} &nbsp; ${P.tick}</td>
    </tr>
    <tr>
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;">${P.c3} &nbsp; ${P.tick}</td>
      <td colspan="2" style="border:1px solid #000;padding:4px 6px;">${P.c4} &nbsp; ${P.tick}</td>
    </tr>
    <tr><td colspan="4" style="border:1px solid #000;padding:4px 6px;">${P.c5} &nbsp; ${P.tick}</td></tr>
    <tr><td colspan="4" style="border:1px solid #000;padding:4px 6px;">${P.s3}</td></tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;">${P.goods}</td>
      <td style="border:1px solid #000;padding:4px 6px;"></td>
      <td style="border:1px solid #000;padding:4px 6px;">${P.const_}</td>
      <td style="border:1px solid #000;padding:4px 6px;"></td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:4px 6px;">${P.consult}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${meta.serviceP}</td>
      <td style="border:1px solid #000;padding:4px 6px;">${P.other}</td>
      <td style="border:1px solid #000;padding:4px 6px;"></td>
    </tr>
    <tr>
      <td colspan="2" style="border:1px solid #000;padding:5px 6px;">${P.dateL} ${opts.botDate} &nbsp;&nbsp; ${P.fyL} ${opts.fy}</td>
      <td style="border:1px solid #000;padding:5px 6px;">${P.stamp}</td>
      <td style="border:1px solid #000;padding:5px 6px;height:40px;"></td>
    </tr>
    <tr>
      <td colspan="2" style="border:1px solid #000;padding:5px 6px;">${P.appName} ${meta.contactP} &nbsp;&nbsp; ${P.sign}</td>
      <td colspan="2" style="border:1px solid #000;padding:5px 6px;height:40px;"></td>
    </tr>
  </table>

  <div style="text-align:center;font-size:9pt;margin-top:10px;">${meta.addrP}</div>
</div>`;
}

export default function SuchidartaClient({ companies }: { companies: Company[] }) {
  const [sel, setSel]               = useState<Set<string>>(new Set());
  const [meta, setMeta]             = useState<Record<string, CMeta>>({});
  const [addrBlock, setAddrBlock]   = useState(`>L ;lrjHo",\ncfGtl/s dfldnf tyf sfg"g dGqfno,\nsf]zL k|b]z, lj/f6gu/`);
  const [topDate, setTopDate]       = useState("@)*#÷)^÷)%");
  const [botDate, setBotDate]       = useState("@)*#÷)^÷)%");
  const [fy, setFy]                 = useState("@)*#÷)*$");
  const [officeName, setOfficeName] = useState("Biratnagar");
  const [expanded, setExpanded]     = useState<string | null>(null);
  const [gen, setGen]               = useState<"" | "zip">("");
  const [progress, setProgress]     = useState("");

  useEffect(() => {
    // Inject Preeti font into page
    if (!document.getElementById("preeti-font")) {
      const style = document.createElement("style");
      style.id = "preeti-font";
      style.textContent = `@font-face { font-family: 'Preeti'; src: url('/fonts/Preeti.ttf') format('truetype'); font-weight: normal; font-style: normal; }`;
      document.head.appendChild(style);
    }
    // Load saved meta
    try {
      const s = localStorage.getItem("suchi-meta-v2");
      if (s) setMeta(JSON.parse(s));
    } catch {}
  }, []);

  const getMeta = (id: string): CMeta => ({ ...DEFAULTS, ...meta[id] });

  const updateMeta = (id: string, field: keyof CMeta, val: string) => {
    const next = { ...meta, [id]: { ...getMeta(id), [field]: val } };
    setMeta(next);
    localStorage.setItem("suchi-meta-v2", JSON.stringify(next));
  };

  const toggle = (id: string) =>
    setSel(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const selectedList = companies.filter(c => sel.has(c.id));

  // ── PDF bytes for one company (div approach — reliable) ───────────
  const buildPDFBytes = async (company: Company): Promise<Uint8Array> => {
    const { default: html2canvas } = await import("html2canvas");
    const { default: jsPDF }       = await import("jspdf");

    // 1. Ensure Preeti font is loaded
    try { await document.fonts.load("12px Preeti"); } catch {}

    // 2. Create hidden div in current document
    const container = document.createElement("div");
    container.style.cssText = "position:fixed;top:0;left:-9999px;z-index:-1;background:#fff;";
    container.innerHTML = buildFormHTML(company, getMeta(company.id), { addrBlock, topDate, botDate, fy });
    document.body.appendChild(container);

    // 3. Wait for images + font
    const images = container.querySelectorAll("img");
    await Promise.all(Array.from(images).map(img =>
      new Promise(r => { img.onload = r; img.onerror = r; if (img.complete) r(null); })
    ));
    await new Promise(r => setTimeout(r, 800));

    // 4. Capture
    const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: 794,
      height: 1123,
      windowWidth: 794,
      logging: false,
    });

    document.body.removeChild(container);

    // 5. Build PDF
    const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const img = canvas.toDataURL("image/jpeg", 0.93);
    pdf.addImage(img, "JPEG", 0, 0, 210, 297);

    return pdf.output("uint8array");
  };

  // ── Generate ZIP ─────────────────────────────────────────────────
  const genZIP = async () => {
    if (!selectedList.length) return;
    setGen("zip");
    try {
      const { default: JSZip } = await import("jszip");
      const { saveAs }         = await import("file-saver");

      const zip = new JSZip();

      for (let i = 0; i < selectedList.length; i++) {
        const company = selectedList[i];
        setProgress(`Generating ${i + 1}/${selectedList.length}: ${company.name}...`);
        const pdfBytes = await buildPDFBytes(company);
        zip.file(`${company.name} Suchidarta ${officeName}.pdf`, pdfBytes);
      }

      setProgress("Creating ZIP...");
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `Suchidarta ${officeName}.zip`);
      setProgress("");
    } catch (e) {
      console.error(e);
      alert("Failed: " + String(e));
      setProgress("");
    } finally {
      setGen("");
    }
  };

  const FIELDS: [keyof CMeta, string][] = [
    ["nameP",         "Company naam (Preeti maa)"],
    ["regNo",         "Registration No."],
    ["vatNo",         "VAT/PAN No."],
    ["addrP",         "Address (Preeti maa)"],
    ["contactP",      "Contact Person (Preeti maa)"],
    ["mobile",        "Mobile No."],
    ["serviceP",      "Service type (Preeti maa)"],
    ["letterheadUrl", "Letterhead image URL (optional)"],
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Create Suchidarta</h2>
          <p className="text-sm text-gray-500 mt-0.5">Companies select → details fill → ZIP download</p>
        </div>
        <div className="flex gap-3 text-sm">
          <button onClick={() => setSel(new Set(companies.map(c => c.id)))} className="text-blue-600 hover:underline">Select All</button>
          <span className="text-gray-300">|</span>
          <button onClick={() => setSel(new Set())} className="text-gray-500 hover:underline">Clear</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: Companies */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Company छान्नुहोस्</h3>
          <div className="border border-gray-200 rounded-lg bg-white divide-y divide-gray-100">
            {companies.map(company => (
              <div key={company.id} className="p-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={sel.has(company.id)} onChange={() => toggle(company.id)} className="w-4 h-4 accent-blue-600" />
                  <span className="text-sm font-medium text-gray-900">{company.name}</span>
                </label>
                {sel.has(company.id) && (
                  <div className="mt-2 ml-7">
                    <button onClick={() => setExpanded(expanded === company.id ? null : company.id)} className="text-xs text-blue-600 hover:underline">
                      {expanded === company.id ? "Details hide gara ▲" : "Details fill/edit gara ▼"}
                    </button>
                    {expanded === company.id && (
                      <div className="mt-2 bg-gray-50 rounded p-3 space-y-2">
                        {FIELDS.map(([field, label]) => (
                          <div key={field}>
                            <label className="block text-xs text-gray-500 mb-0.5">{label}</label>
                            <input
                              type="text"
                              value={getMeta(company.id)[field]}
                              onChange={e => updateMeta(company.id, field, e.target.value)}
                              style={{ fontFamily: field.endsWith("P") ? "'Preeti',serif" : "inherit" }}
                              className="w-full border border-gray-200 rounded px-2 py-1 text-sm bg-white"
                            />
                          </div>
                        ))}
                        <p className="text-xs text-gray-400">✅ Auto-saved in browser</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {sel.size > 0 && <p className="text-xs text-gray-500 mt-2">{sel.size} company selected</p>}
        </div>

        {/* RIGHT: Common fields */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Common Details</h3>
          <div className="border border-gray-200 rounded-lg bg-white p-4 space-y-4">

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">📁 Office naam (ZIP filename ko lagi)</label>
              <input type="text" value={officeName} onChange={e => setOfficeName(e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
                placeholder="e.g. Biratnagar, Butwal" />
              <p className="text-xs text-gray-400 mt-1">
                Example: <strong>{selectedList[0]?.name || "CompanyName"} Suchidarta {officeName}.pdf</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Address Block (Preeti maa)</label>
              <textarea value={addrBlock} onChange={e => setAddrBlock(e.target.value)} rows={4}
                style={{ fontFamily: "'Preeti',serif" }}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none" />
              <p className="text-xs text-gray-400 mt-1">Each line = form maa ek line</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Mathi ko Miti</label>
                <input type="text" value={topDate} onChange={e => setTopDate(e.target.value)}
                  style={{ fontFamily: "'Preeti',serif" }}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tala ko Miti</label>
                <input type="text" value={botDate} onChange={e => setBotDate(e.target.value)}
                  style={{ fontFamily: "'Preeti',serif" }}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Arthik Barsha</label>
              <input type="text" value={fy} onChange={e => setFy(e.target.value)}
                style={{ fontFamily: "'Preeti',serif" }}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none" />
            </div>
          </div>

          {/* ZIP Button */}
          <button onClick={genZIP} disabled={sel.size === 0 || gen !== ""}
            className="w-full bg-blue-600 text-white rounded-lg py-3 text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
            {gen === "zip" ? `⏳ ${progress || "Generating..."}` : `📦 Download ZIP — ${sel.size} PDF${sel.size !== 1 ? "s" : ""} (${officeName})`}
          </button>

          {sel.size === 0 && (
            <p className="text-xs text-amber-600 text-center bg-amber-50 rounded py-2">⚠️ Pehile company select gara</p>
          )}

          {/* File list preview */}
          <div className="text-xs text-gray-400 bg-gray-50 rounded p-3 space-y-1">
            <p className="font-medium text-gray-500">📌 ZIP maa yeti files aunxa:</p>
            {selectedList.length > 0
              ? selectedList.map(c => <p key={c.id}>• {c.name} Suchidarta {officeName}.pdf</p>)
              : <p>• Company select garyo pachhi list dekhauxa</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
