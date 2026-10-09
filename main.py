from fastapi import FastAPI, UploadFile, File, HTTPException
import fitz
import re
from pathlib import Path


app = FastAPI()


UPLOAD_DIR = Path("uploads")
EXTRACTED_DIR = Path("extracted")

UPLOAD_DIR.mkdir(exist_ok=True)
EXTRACTED_DIR.mkdir(exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "Book Extractor API is running"
    }


@app.post("/extract")
async def extract_text(file: UploadFile = File(...)):

    # 1. Check file type
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )

    # 2. Read uploaded PDF
    pdf_bytes = await file.read()

    # 3. Open PDF using PyMuPDF
    document = fitz.open(
        stream=pdf_bytes,
        filetype="pdf"
    )

    page_count = len(document)

    # 4. Extract text from every page
    full_text = ""

    for page in document:
        full_text += page.get_text() + "\n"

    document.close()

    # 5. Clean extracted text
    cleaned_text = clean_text(full_text)

    # 6. Save cleaned text
    output_filename = Path(file.filename).stem + "_cleaned.txt"
    output_path = EXTRACTED_DIR / output_filename

    output_path.write_text(
        cleaned_text,
        encoding="utf-8"
    )

    # 7. Return information
    return {
        "filename": file.filename,
        "pages": page_count,
        "raw_characters": len(full_text),
        "cleaned_characters": len(cleaned_text),
        "output_file": str(output_path)
    }


def clean_text(text: str) -> str:

    # Remove excessive spaces
    text = re.sub(r"[ \t]+", " ", text)

    # Remove spaces around new lines
    text = re.sub(r" *\n *", "\n", text)

    # Reduce 3+ consecutive new lines to 2
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Remove standalone page numbers
    text = re.sub(r"(?m)^\s*\d+\s*$", "", text)

    # Remove unnecessary blank lines again
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip()