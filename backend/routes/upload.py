from flask import Blueprint, request, jsonify
import fitz   # PyMuPDF
import io

from services.gemini import generate_script

upload_bp = Blueprint("upload", __name__)

MAX_BYTES = 20 * 1024 * 1024   # 20 MB
MAX_CHARS = 40_000              # ~20 pages of dense text


@upload_bp.route("/api/upload", methods=["POST"])
def upload():
    if "pdf" not in request.files:
        return jsonify({"error": "No file received. Field must be named 'pdf'."}), 400

    file = request.files["pdf"]

    if file.filename == "":
        return jsonify({"error": "No file selected."}), 400

    raw_bytes = file.read()

    if len(raw_bytes) > MAX_BYTES:
        mb = len(raw_bytes) / (1024 * 1024)
        return jsonify({"error": f"File too large ({mb:.1f} MB). Limit is 20 MB."}), 413

    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files are accepted."}), 415

    # Extract text with PyMuPDF (no disk writes)
    try:
        pdf_doc = fitz.open(stream=io.BytesIO(raw_bytes), filetype="pdf")
        pages_text = []
        for page_num in range(len(pdf_doc)):
            pages_text.append(pdf_doc.load_page(page_num).get_text("text"))
        pdf_doc.close()

        full_text = "\n\n--- Page Break ---\n\n".join(pages_text).strip()

        if not full_text:
            return jsonify({"error": "PDF appears blank. Is it text-based (not a scanned image)?"}), 422

        if len(full_text) > MAX_CHARS:
            full_text = full_text[:MAX_CHARS] + "\n\n[... content truncated ...]"

    except Exception as e:
        return jsonify({"error": f"Could not read PDF: {str(e)}"}), 500

    # Generate 5-field story via Gemini
    try:
        result = generate_script(full_text)
    except Exception as e:
        return jsonify({"error": f"Gemini failed: {str(e)}"}), 500

    return jsonify(result)
