// ==============================================
// Shared Types
// ==============================================

export interface SectionType {
  id: string;
  key: string;
  label: string;
  isDefault: boolean;
}

export interface Sector {
  id: string;
  name: string;
}

export interface CompanyDocument {
  id: string;
  companyId: string;
  sectionTypeId: string;
  sectionType: SectionType;
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number | null;
  uploadedAt: string | Date;
}

export interface TaxClearance {
  id: string;
  companyId: string;
  fiscalYear: string;
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number | null;
  isLatest: boolean;
  uploadedAt: string | Date;
}

export interface ExperienceLetter {
  id: string;
  companyId: string;
  fiscalYear: string;
  sectorId: string;
  sector: Sector;
  province: string;
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number | null;
  uploadedAt: string | Date;
}

export interface Company {
  id: string;
  name: string;
  establishmentYearBS: string;
  documents: CompanyDocument[];
  taxClearances: TaxClearance[];
  experienceLetters: ExperienceLetter[];
}

export const PROVINCES: { value: string; label: string }[] = [
  { value: "KOSHI", label: "Koshi" },
  { value: "MADHESH", label: "Madhesh" },
  { value: "BAGMATI", label: "Bagmati" },
  { value: "GANDAKI", label: "Gandaki" },
  { value: "LUMBINI", label: "Lumbini" },
  { value: "KARNALI", label: "Karnali" },
  { value: "SUDURPASHCHIM", label: "Sudurpashchim" },
];

// Merge/download ko lagi selected document ko sequence track garna
export interface SelectedDoc {
  docType: "static" | "tax_clearance" | "experience_letter";
  docId: string;
  order: number;
  label: string; // display purpose
}
