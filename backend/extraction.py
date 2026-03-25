import cv2
import numpy as np
from PIL import Image
import os
import io
import json
import re
import uuid
import random
import fitz # PyMuPDF
from typing import Any, Optional

try:
    import pytesseract
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False

try:
    from pyzbar import pyzbar
    PYZBAR_AVAILABLE = True
except ImportError:
    PYZBAR_AVAILABLE = False

# Auto-configure Tesseract path for Windows
if TESSERACT_AVAILABLE:
    common_tess_paths = [
        r'C:\Program Files\Tesseract-OCR\tesseract.exe',
        r'C:\Users\LENOVO\AppData\Local\Tesseract-OCR\tesseract.exe' # Common user install
    ]
    for path in common_tess_paths:
        if os.path.exists(path):
            pytesseract.pytesseract.tesseract_cmd = path
            break

def extract_metadata(file_bytes: bytes, filename: str, mime_type: str) -> dict:
    """
    Forensic OCR Engine v2.0: Multi-Stage Extraction.
    Combines Raw PDF Text + High-Res Rasterization + Tesseract.
    Optimized for NPTEL and standard academic credentials.
    """
    extracted_text = ""
    integrity_score = 0.98
    anomalies = 0
    
    # 1. PRIMARY EXTRACTION
    if mime_type == "application/pdf":
        try:
            # Stage A: Try Raw Text (Vector)
            pdf_doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in pdf_doc:
                extracted_text += page.get_text() + "\n"
            
            # Stage B: If vector text is garbage/missing, RASTERIZE and OCR (High-Res 300 DPI)
            if (len(extracted_text.strip()) < 50 or "certificate" not in extracted_text.lower()) and TESSERACT_AVAILABLE:
                for page in pdf_doc:
                    # Matrix(4, 4) gives us roughly 288-300 DPI - essential for small text on landscape
                    pix = page.get_pixmap(matrix=fitz.Matrix(4, 4)) 
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    extracted_text += pytesseract.image_to_string(img) + "\n"
            
            # Integrity Check
            if pdf_doc.metadata and not pdf_doc.metadata.get('creator'):
                integrity_score -= 0.05
            pdf_doc.close()
        except Exception:
            anomalies += 1
            integrity_score = 0.7

    elif mime_type and mime_type.startswith("image/"):
        try:
            img = Image.open(io.BytesIO(file_bytes))
            if TESSERACT_AVAILABLE:
                extracted_text = pytesseract.image_to_string(img)
            else:
                extracted_text = ""
        except Exception:
            anomalies += 1
            integrity_score = 0.6

    # 2. STRUCTURED PARSING (NPTEL & General)
    # Clean OCR noise: replace multi-spaces and weird chars
    text = re.sub(r'\s+', ' ', extracted_text).strip()
    
    print("\n--- FORENSIC OCR RAW BUFFER START ---")
    print(text[:1000]) # Peek at the first 1KB of data in console
    print("--- END BUFFER ---\n")
    
    # Advanced Heuristics for NPTEL (Geometric & Case-Sensitive)
    name_patterns = [
        r"(?i)awarded\s*to\s+([^,.\n|]+)",
        # University Degree layout (e.g., "makes known that VIDHYA SHREE has been admitted")
        r"(?i)known\s+that\s+([A-Z\s]+?)(?:\s*(?:[§\W]|has|Aas|having|been))",
        # Captures 2+ ALL-CAPS words. Removed (?i) so it remains STRICTLY case-sensitive.
        r"(?:[a-z]\s+)([A-Z]{3,}(?:\s+[A-Z]+)+)(?=\s+[\d]|NPTEL|nptel|Roll|roll|$)" 
    ]
    
    course_patterns = [
        # University Degrees
        r"(?i)(DEGREE\s+OF\s+.*?)(?=\s+under\s+|\s+having\s+|,)",
        r"(?i)successfully\s+completing\s+the\s+course\s+([^,.\n|]+)",
        # Captures everything between the duration marker and the ALL-CAPS Name
        r"(?:course\)?)\s+(.*?)(?=\s+[A-Z]{3,}\s+[A-Z]+)"
    ]
    
    nptel_name = _parse_field(text, name_patterns, None)
    nptel_course = _parse_field(text, course_patterns, None)
    
    # Debugging Console (Essential for your testing)
    print(f"--- PARSING RESULTS ---")
    print(f"NAME: {nptel_name}")
    print(f"COURSE: {nptel_course}")
    print(f"--- END PARSING ---")
    
    # Fallback to general patterns (ZERO HALLUCINATION - ABSOLUTE STRICTNESS)
    data = {
        "name": nptel_name or _parse_field(text, [r"Name:\s*([^,.\n]+)", r"Student:\s*([^,.\n]+)"], "NOT_DETECTED"),
        "institution": _parse_field(text, [
            r"(?i)(The\s+Syndicate\s+of\s+the\s+[A-Za-z\s]+University)",
            r"(?i)([A-Z][a-z]+\s+University)",
            r"(?i)Indian\s+Institute\s+of\s+Technology\s+([A-Z][a-z]+)", 
            r"(?i)IIT\s+([A-Z][a-z]+)",
            r"(?i)(Indian\s*Institute\s*of\s*Technology)",
            r"(?i)(NPTEL)" # Validate as NPTEL if found in text
        ], "UNKNOWN_INSTITUTION"),
        "course": nptel_course or "UNKNOWN_CERTIFICATION",
        "year": _parse_field(text, [
            r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-zA-Z\s\-]+(20\d{2})", 
            r"\b(202[0-9])\b"
        ], "0000"),
        "certificate_id": _parse_field(text, [r"(NPTEL\d+[A-Z0-9]+)", r"Roll No:\s*([A-Z0-9]+)"], f"GEN-{str(uuid.uuid4())[:8].upper()}"),
        "integrity_score": max(0.01, integrity_score - (anomalies * 0.2)),
        "anomalies": anomalies,
        "raw_text_preview": text[:200]
    }
    
    return data

def scan_qr_from_bytes(file_bytes: bytes, region: str = "all") -> Optional[dict]:
    """
    Forensic QR Scanner v12.0: The 'Zonal Hunt' Engine.
    Collects QRs from specific spatial regions (top, bottom, all).
    Prevents blind scanning to separate CertiTrust seals from Native QRs.
    """
    import io
    from PIL import Image

    all_frames = []
    
    # 1. High-Precision Digital Rasterization
    try:
        pdf_doc = fitz.open(stream=file_bytes, filetype="pdf")
        for page in pdf_doc:
            # Rasterize at 6x resolution (Ultra-High DPI)
            pix = page.get_pixmap(matrix=fitz.Matrix(6, 6)) 
            img_data = pix.tobytes("png")
            nparr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is not None:
                all_frames.append(img)
                # Also add normalized version immediately
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                clahe = cv2.createCLAHE(clipLimit=4.0, tileGridSize=(8,8))
                all_frames.append(clahe.apply(gray))
        pdf_doc.close()
    except:
        nparr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is not None: all_frames.append(img)

    if not all_frames: return None

    certitrust_results = []
    other_qrs = []

    def process_frame(img):
        if img is None or img.size == 0 or not PYZBAR_AVAILABLE: return
        
        # Spatial Zonal Cropping
        h, w = img.shape[:2]
        if region == "top":
            # Crop to Top 35%
            scan_img = img[:int(h * 0.35), :]
        elif region == "bottom":
             # Crop to Bottom 35%
             scan_img = img[int(h * 0.65):, :]
        elif region == "top-right":
             # Search Top 35% and Right 40% of page (High impact zone)
             scan_img = img[:int(h * 0.35), int(w * 0.6):]
        else:
             scan_img = img
             
        try:
            decoded_objs = pyzbar.decode(scan_img)
            for obj in decoded_objs:
                raw_data = obj.data.decode("utf-8")
                # Priority 1: JSON matches (Legacy Fallback)
                try:
                    p = json.loads(raw_data)
                    if "cert_id" in p: 
                        certitrust_results.append(p)
                        continue
                except: pass
                
                # Priority 2: Direct Network URL match (New Standard)
                if "/verify/" in raw_data:
                    match = re.search(r'/verify/([A-Z0-9\-]+)', raw_data)
                    if match:
                        certitrust_results.append({"cert_id": match.group(1)})
                        continue
                
                # Priority 3: Non-CertiTrust QRs
                other_qrs.append(raw_data)
        except: pass

    # Run the hunt across all processed frames
    for frame in all_frames:
        process_frame(frame)
        if certitrust_results: break # Stop as soon as we find a REAL one

    # Final Decision Logic
    if certitrust_results:
        return certitrust_results[0]
    
    if other_qrs:
        # We found other QRs but no CertiTrust seal
        return {"raw_id": other_qrs[0]}

    return None

def _parse_field(text: str, patterns: list, default: Any) -> Any:
    for pattern in patterns:
        flags = 0
        if "(?i)" in pattern:
            flags = re.IGNORECASE
            pattern = pattern.replace("(?i)", "")
        
        try:
            match = re.search(pattern, text, flags)
            if match:
                # Safely attempt to get group 1, otherwise return the full match
                try:
                    return match.group(1).strip()
                except IndexError:
                    return match.group(0).strip()
        except Exception:
            continue
    return default
