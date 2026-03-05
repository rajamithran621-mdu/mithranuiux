import os
from flask import Flask, render_template, request, jsonify, send_from_directory

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/contact", methods=["POST"])
def contact():
    data = request.get_json()
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    message = data.get("message", "").strip()

    if not name or not email or not message:
        return jsonify({"success": False, "error": "All fields are required."}), 400

    # Log submission (replace with email/DB logic in production)
    print(f"\n--- New Contact Message ---")
    print(f"Name:    {name}")
    print(f"Email:   {email}")
    print(f"Message: {message}")
    print(f"---------------------------\n")

    return jsonify({"success": True, "message": "Message received! I'll get back to you soon."})


@app.route("/resume")
def resume():
    resume_dir = os.path.join(app.root_path, "static", "resume")
    filename = "Mithran_UIUX_Resume.pdf"
    filepath = os.path.join(resume_dir, filename)

    # Create a placeholder PDF if it doesn't exist
    if not os.path.exists(filepath):
        try:
            from fpdf import FPDF
            pdf = FPDF()
            pdf.add_page()
            pdf.set_font("Helvetica", "B", 24)
            pdf.cell(0, 20, "Mithran R", ln=True, align="C")
            pdf.set_font("Helvetica", "", 14)
            pdf.cell(0, 10, "UI/UX Designer", ln=True, align="C")
            pdf.cell(0, 10, "rajamithran621@gmail.com | Madurai, India", ln=True, align="C")
            pdf.ln(10)
            pdf.set_font("Helvetica", "B", 12)
            pdf.cell(0, 10, "Skills", ln=True)
            pdf.set_font("Helvetica", "", 11)
            pdf.cell(0, 8, "Figma, Adobe XD, Canva, Wireframing, Prototyping, User Research", ln=True)
            pdf.output(filepath)
        except Exception:
            # If fpdf not available, create empty placeholder
            with open(filepath, "wb") as f:
                f.write(b"%PDF-1.4\n% placeholder\n")

    return send_from_directory(
        resume_dir,
        filename,
        as_attachment=True,
        download_name="Mithran_R_UIUX_Designer_Resume.pdf"
    )


if __name__ == "__main__":
    app.run(debug=True, port=5000)
