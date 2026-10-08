"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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

// Company configs — only dates are dynamic per generation
type CompanyConfig = {
  nameEnglish: string;
  docxFile: string;      // The .docx filename in public/suchidarta/
  filePrefix: string;    // Output filename prefix
  date: string;          // Nepali date in Unicode
  datePreeti: string;    // Same date in Preeti encoding
};

const DEFAULT_COMPANIES_CONFIG: Record<string, Partial<CompanyConfig>> = {
  cmsrcze8c0000jv0443e2o5aa: {
    nameEnglish: "B.I. ENGINEERING CONSULTANCY PVT.LTD.",
    docxFile: "BI Suchidarta.docx",
    filePrefix: "BI Suchidarta For",
    date: "२०८३।०४।०५",
    datePreeti: "@)*#÷)$÷)%",
  },
  cmsrcjmk10001l10424k4dtiv: {
    nameEnglish: "NETRESHWORI ENGINEERING CONSULTANCY [P] Ltd.",
    docxFile: "Netreshwori Suchidarta.docx",
    filePrefix: "Suchidarta of Netreshwori for",
    date: "२०८३।०४।०६",
    datePreeti: "@)*#÷)$÷)^",
  },
  cmu2bv64v0000la04vx9ei2x3: {
    nameEnglish: "DILIGENT ENGINEERING Solution(p) ltd.",
    docxFile: "Diligent Suchidarta.docx",
    filePrefix: "Diligent Suchidarta For",
    date: "२०८३।०४।१२",
    datePreeti: "@)*#÷)$÷!@",
  },
  cmsrd0y4d0001jv04qlh0pa52: {
    nameEnglish: "MASTAMANDALI ENGINEERING CONSULTANCY (P) Ltd.",
    docxFile: "Mastamandali Suchidarta.docx",
    filePrefix: "Mastamandali Suchidarta For",
    date: "२०८३।०४।०४",
    datePreeti: "@)*#÷)$÷)$",
  },
  cmsyc4dd80000jx04khgkqvz6: {
    nameEnglish: "MIDAS ENGINEERING CONSULTANT",
    docxFile: "Midas Suchidarta.docx",
    filePrefix: "Midas Suchidarta For",
    date: "२०८३।०४।०५",
    datePreeti: "@)*#÷)$÷)%",
  },
  cmuxm3q2r0000kz04wznn2nwb: {
    nameEnglish: "HINTS CONSULT PVT. LTD.",
    docxFile: "Hints_Suchidartat.docx",
    filePrefix: "Hints Suchidarta For",
    date: "२०८३।०४।０６",
    datePreeti: "@)*#÷)$÷)^",
  },
};

const DEFAULT_OFFICE_UNICODE = `श्रीमान् डिभिजन प्रमुख ज्यू,\nखानेपानी तथा सरसफाई डिभिजन\nखोटाङ`;

export default function SuchidartaClient({
  companies,
}: {
  companies: Company[];
}) {
  const targetCompanies = useMemo(() => {
    return companies.filter((c) => DEFAULT_COMPANIES_CONFIG[c.id]);
  }, [companies]);

  const [sel, setSel] = useState<Set<string>>(
    new Set(targetCompanies.map((c) => c.id))
  );

  const [configs, setConfigs] = useState<Record<string, CompanyConfig>>({});

  // Common Office Address
  const [officeName, setOfficeName] = useState("Khotang");
  const [officeUnicode, setOfficeUnicode] = useState(DEFAULT_OFFICE_UNICODE);
  const [officePreeti, setOfficePreeti] = useState(
    unicodeToPreeti(DEFAULT_OFFICE_UNICODE)
  );

  // Fiscal Year
  const [fiscalYear, setFiscalYear] = useState("२०८३/०८४");
  const [fiscalYearPreeti, setFiscalYearPreeti] = useState(
    unicodeToPreeti("२०८३/०८४")
  );

  // Document attachment toggles
  const [attachReg, setAttachReg] = useState(true);
  const [attachVat, setAttachVat] = useState(true);
  const [attachTax, setAttachTax] = useState(true);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");

  // Hidden render container ref
  const renderContainerRef = useRef<HTMLDivElement>(null);

  // Initialize company configs
  useEffect(() => {
    // Inject Preeti font
    if (!document.getElementById("preeti-font")) {
      const s = document.createElement("style");
      s.id = "preeti-font";
      s.textContent = `@font-face{font-family:'Preeti';src:url('/fonts/Preeti.ttf') format('truetype');font-display:swap;}`;
      document.head.appendChild(s);
    }

    const initial: Record<string, CompanyConfig> = {};
    let saved: Record<string, Partial<CompanyConfig>> = {};
    try {
      const s = localStorage.getItem("suchi-meta-v5");
      if (s) saved = JSON.parse(s);
    } catch {}

    targetCompanies.forEach((c) => {
      const def = DEFAULT_COMPANIES_CONFIG[c.id] || {};
      const s = saved[c.id] || {};

      initial[c.id] = {
        nameEnglish: def.nameEnglish || c.name,
        docxFile: def.docxFile || "",
        filePrefix: def.filePrefix || `${c.name} Suchidarta For`,
        date: s.date || def.date || "२०८३।०४।०१",
        datePreeti: s.datePreeti || def.datePreeti || "@)*#÷)$÷)!",
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
        localStorage.setItem("suchi-meta-v5", JSON.stringify(next));
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
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const selectedList = useMemo(
    () => targetCompanies.filter((c) => sel.has(c.id)),
    [targetCompanies, sel]
  );

  const getOutputFilename = (company: Company): string => {
    const cfg = configs[company.id] || DEFAULT_COMPANIES_CONFIG[company.id] || {};
    return `${cfg.filePrefix} ${officeName}.pdf`;
  };

  // ========== Core: Fetch modified DOCX and render to PDF page ==========

  /**
   * 1. Call server API to get modified .docx (with updated date/FY)
   * 2. Use docx-preview to render it in a hidden container
   * 3. Use html2canvas to capture the rendered output
   * 4. Convert to PDF page using jsPDF
   */
  const renderDocxToPage1Base64 = useCallback(
    async (company: Company): Promise<string> => {
      const cfg = configs[company.id];
      if (!cfg) throw new Error("No config for company");

      // Step 1: Get modified DOCX from server
      const modifyRes = await fetch("/api/suchidarta/docx-modify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: company.id,
          newDatePreeti: cfg.datePreeti,
          newFiscalYearPreeti: fiscalYearPreeti,
          newOfficePreeti: officePreeti,
        }),
      });

      let docxArrayBuffer: ArrayBuffer;
      if (!modifyRes.ok) {
        // Fallback: use the original .docx without modifications
        console.warn("docx-modify failed, using original file");
        const origRes = await fetch(`/suchidarta/${cfg.docxFile}`);
        if (!origRes.ok) throw new Error("Failed to fetch original .docx");
        docxArrayBuffer = await origRes.arrayBuffer();
      } else {
        docxArrayBuffer = await modifyRes.arrayBuffer();
      }

      // Step 2: Render DOCX using docx-preview
      const { renderAsync } = await import("docx-preview");
      const { default: html2canvas } = await import("html2canvas");
      const { default: jsPDF } = await import("jspdf");

      const container = renderContainerRef.current;
      if (!container) throw new Error("Render container not available");

      // Clear previous render
      container.innerHTML = "";

      // Render the DOCX into the hidden container
      await renderAsync(docxArrayBuffer, container, undefined, {
        className: "docx-preview-render",
        inWrapper: true,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false,
        breakPages: true,
        ignoreLastRenderedPageBreak: true,
        experimental: false,
        trimXmlDeclaration: true,
        useBase64URL: true,
        renderHeaders: true,
        renderFooters: true,
        renderFootnotes: true,
        renderEndnotes: true,
      });

      // Wait for fonts and images to load
      await document.fonts.ready;
      await new Promise((r) => setTimeout(r, 1000));

      // Step 3: Capture the first page with html2canvas
      // docx-preview creates a wrapper > section structure
      const sections = container.querySelectorAll("section.docx");
      const firstPage = sections[0] as HTMLElement || container.firstElementChild as HTMLElement;

      if (!firstPage) throw new Error("No rendered page found");

      const canvas = await html2canvas(firstPage, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error("Failed to render DOCX page");
      }

      // Step 4: Convert to PDF
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);

      const pdfDataUri = pdf.output("datauristring");
      container.innerHTML = ""; // Clean up
      return pdfDataUri.split(",")[1];
    },
    [configs, fiscalYearPreeti, officePreeti]
  );

  // Generate full multi-page PDF for single company
  const generateSinglePDF = async (company: Company): Promise<Blob> => {
    const page1Base64 = await renderDocxToPage1Base64(company);
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

  // Download single company PDF
  const handleDownloadSingle = async (company: Company) => {
    setIsGenerating(true);
    setProgressMsg(`Generating ${company.name}...`);
    try {
      const { saveAs } = await import("file-saver");
      const blob = await generateSinglePDF(company);
      saveAs(blob, getOutputFilename(company));
    } catch (err) {
      console.error(err);
      alert("Error: " + String(err));
    } finally {
      setIsGenerating(false);
      setProgressMsg("");
    }
  };

  // Download just the modified DOCX (no PDF conversion)
  const handleDownloadDocx = async (company: Company) => {
    const cfg = configs[company.id];
    if (!cfg) return;

    setIsGenerating(true);
    setProgressMsg(`Preparing DOCX for ${company.name}...`);
    try {
      const res = await fetch("/api/suchidarta/docx-modify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: company.id,
          newDatePreeti: cfg.datePreeti,
          newFiscalYearPreeti: fiscalYearPreeti,
          newOfficePreeti: officePreeti,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate modified DOCX");

      const { saveAs } = await import("file-saver");
      const blob = await res.blob();
      const name = `${cfg.filePrefix} ${officeName}.docx`;
      saveAs(blob, name);
    } catch (err) {
      console.error(err);
      alert("Error: " + String(err));
    } finally {
      setIsGenerating(false);
      setProgressMsg("");
    }
  };

  // Download all selected as ZIP
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
        try {
          const pdfBlob = await generateSinglePDF(c);
          zip.file(getOutputFilename(c), pdfBlob);
        } catch (err) {
          console.error(`Failed for ${c.name}:`, err);
          setProgressMsg(`⚠️ Failed for ${c.name}, continuing...`);
          await new Promise((r) => setTimeout(r, 500));
        }
      }

      setProgressMsg("Packing ZIP...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `Suchidarta For ${officeName}.zip`);
    } catch (err) {
      console.error(err);
      alert("Error: " + String(err));
    } finally {
      setIsGenerating(false);
      setProgressMsg("");
    }
  };

  // Download all DOCX files as ZIP (no PDF conversion - preserves perfect formatting)
  const handleDownloadAllDocx = async () => {
    if (selectedList.length === 0) return;
    setIsGenerating(true);
    try {
      const { default: JSZip } = await import("jszip");
      const { saveAs } = await import("file-saver");
      const zip = new JSZip();

      for (let i = 0; i < selectedList.length; i++) {
        const c = selectedList[i];
        const cfg = configs[c.id];
        if (!cfg) continue;

        setProgressMsg(
          `Preparing DOCX ${i + 1}/${selectedList.length}: ${c.name}...`
        );

        try {
          const res = await fetch("/api/suchidarta/docx-modify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              companyId: c.id,
              newDatePreeti: cfg.datePreeti,
              newFiscalYearPreeti: fiscalYearPreeti,
              newOfficePreeti: officePreeti,
            }),
          });

          if (res.ok) {
            const blob = await res.blob();
            zip.file(`${cfg.filePrefix} ${officeName}.docx`, blob);
          }
        } catch (err) {
          console.error(`Failed DOCX for ${c.name}:`, err);
        }
      }

      setProgressMsg("Packing ZIP...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `Suchidarta DOCX For ${officeName}.zip`);
    } catch (err) {
      console.error(err);
      alert("Error: " + String(err));
    } finally {
      setIsGenerating(false);
      setProgressMsg("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden render container for docx-preview */}
      <div
        ref={renderContainerRef}
        style={{
          position: "fixed",
          top: 0,
          left: "-9999px",
          width: "794px",
          background: "#fff",
          zIndex: -1,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      />

      {/* Top Banner */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>📋</span> Suchidarta Generator — {officeName}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              ६ कम्पनीका DOCX टेम्प्लेटबाट सिधै — लेटरहेड, छाप, हस्ताक्षरसहित — PDF तयार गर्नुहोस्
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1.5">
              <span>✓</span> Uses Original DOCX Templates
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Company List */}
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
                          DOCX: <span className="font-mono text-purple-600 font-semibold">{cfg.docxFile}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Output: <span className="font-mono text-blue-700 font-semibold">{outName}</span>
                        </div>
                        <div className="text-xs text-emerald-700 mt-1 flex items-center gap-2">
                          <span>✓ 1 Page (from DOCX)</span>
                          <span>+</span>
                          <span>✓ 3 Pages (Reg + VAT + Tax)</span>
                        </div>
                      </div>
                    </label>

                    {/* Per-Company Date */}
                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      <div className="text-right">
                        <label className="block text-[11px] font-bold text-yellow-900">
                          मिति (Date):
                        </label>
                        <span
                          className="text-[10px] text-gray-500"
                          style={{ fontFamily: "Preeti, serif" }}
                        >
                          {cfg.datePreeti}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={cfg.date || ""}
                        onChange={(e) =>
                          updateCompanyDate(company.id, e.target.value)
                        }
                        placeholder="२०८३।०४।०१"
                        className="w-28 bg-white border border-yellow-300 rounded px-2 py-1 text-xs font-semibold text-gray-900 focus:ring-1 focus:ring-yellow-500"
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleDownloadDocx(company)}
                      disabled={isGenerating}
                      className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-lg font-medium transition"
                    >
                      📄 Download DOCX
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

        {/* RIGHT: Settings Panel */}
        <div className="lg:col-span-5 space-y-5">
          {/* Common Office Address */}
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
                Office Keyword (फाइलको नाममा):
              </label>
              <input
                type="text"
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
                placeholder="Khotang"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                कार्यालय (Office Address Block):
              </label>
              <textarea
                rows={3}
                value={officeUnicode}
                onChange={(e) => handleOfficeUnicodeChange(e.target.value)}
                placeholder="श्रीमान् डिभिजन प्रमुख ज्यू,\nखानेपानी तथा सरसफाई डिभिजन\nखोटाङ"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 focus:ring-1 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-500 mt-1 bg-white p-2 rounded border border-gray-200">
                Preeti:{" "}
                <div
                  style={{ fontFamily: "Preeti, serif" }}
                  className="text-blue-800 font-semibold text-sm mt-0.5 whitespace-pre-line"
                >
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
                  placeholder="२०८३/०८४"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold bg-white text-gray-900"
                />
                <span
                  style={{ fontFamily: "Preeti, serif" }}
                  className="text-sm font-semibold text-gray-600 whitespace-nowrap bg-gray-100 px-3 py-2 rounded-lg border border-gray-200"
                >
                  {fiscalYearPreeti}
                </span>
              </div>
            </div>
          </div>

          {/* Attached docs info */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <span>📎</span> जोडिने कागजातहरू
            </h3>
            <div className="space-y-2 text-xs text-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attachReg}
                  onChange={(e) => setAttachReg(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Page 2: Company Registration</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attachVat}
                  onChange={(e) => setAttachVat(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Page 3: VAT/PAN Registration</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attachTax}
                  onChange={(e) => setAttachTax(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Page 4: Latest Tax Clearance</span>
              </label>
            </div>
          </div>

          {/* Download Actions */}
          <div className="space-y-3">
            {/* Download All PDFs as ZIP */}
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span>{progressMsg || "Generating..."}</span>
                </>
              ) : (
                <>
                  <span>📦</span>
                  <span>
                    Download All PDFs as ZIP ({selectedList.length} Files)
                  </span>
                </>
              )}
            </button>

            {/* Download All DOCX as ZIP (fallback for perfect formatting) */}
            <button
              type="button"
              onClick={handleDownloadAllDocx}
              disabled={isGenerating || selectedList.length === 0}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              <span>📄</span>
              <span>
                Download All DOCX as ZIP ({selectedList.length} Files) — Perfect Letterhead
              </span>
            </button>

            {selectedList.length === 0 && (
              <p className="text-xs text-amber-600 text-center bg-amber-50 rounded-lg py-2">
                ⚠️ कृपया कम्तिमा १ वटा कम्पनी छान्नुहोस्
              </p>
            )}

            <p className="text-xs text-gray-400 text-center">
              💡 DOCX डाउनलोडमा लेटरहेड ठिक हुन्छ — WPS/Word मा खोलेर PDF Print गर्न सकिन्छ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
