import os
import subprocess
from docx import Document
from pypdf import PdfWriter
from unicode_to_preeti import to_preeti

def fill_word_template(template_path, output_docx_path, form_data):
    doc = Document(template_path)
    
    # Text replacements using Preeti font
    for p in doc.paragraphs:
        if "{{ADDRESS_BLOCK}}" in p.text or "Address Block" in p.text:
            p.text = ""
            lines = form_data.get("address_block", "").split("\n")
            for line in lines:
                preeti_text = to_preeti(line.strip())
                run = p.add_run(preeti_text + "\n")
                run.font.name = "Preeti"
                
        if "{{MITI_MATHI}}" in p.text:
            p.text = p.text.replace("{{MITI_MATHI}}", to_preeti(form_data.get("miti_mathi", "")))
            
        if "{{MITI_TALA}}" in p.text:
            p.text = p.text.replace("{{MITI_TALA}}", to_preeti(form_data.get("miti_tala", "")))

    doc.save(output_docx_path)

def convert_to_pdf(docx_path, output_dir):
    # Converts DOCX to PDF using LibreOffice
    cmd = ['libreoffice', '--headless', '--convert-to', 'pdf', docx_path, '--outdir', output_dir]
    subprocess.run(cmd, check=True)

def generate_final_suchidarta_pdf(template_docx, company_docs_pdfs, form_data, output_pdf_path):
    temp_docx = "temp_nivedan.docx"
    temp_pdf = "temp_nivedan.pdf"
    
    # Step 1: Word template me Preeti Text Fill karein
    fill_word_template(template_docx, temp_docx, form_data)
    
    # Step 2: Convert to PDF
    convert_to_pdf(temp_docx, ".")
    
    # Step 3: Merge Nivedan PDF + Company Docs (Reg, PAN, Tax Clearances)
    merger = PdfWriter()
    merger.append(temp_pdf)
    
    for doc_pdf in company_docs_pdfs:
        if os.path.exists(doc_pdf):
            merger.append(doc_pdf)
            
    merger.write(output_pdf_path)
    merger.close()
    
    # Cleanup temp files
    if os.path.exists(temp_docx): os.remove(temp_docx)
    if os.path.exists(temp_pdf): os.remove(temp_pdf)
