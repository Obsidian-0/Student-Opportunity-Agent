# routes/skills.py
from flask import Blueprint, request, jsonify
from services.nlu_service import extract_skills
from models.user import Student

skills_bp = Blueprint("skills", __name__)

# ── Extract Skills from Text ───────────────────────────────
@skills_bp.route("/api/skills/extract", methods=["POST"])
def analyze():
    data = request.json
    text       = data.get("text", "").strip()
    student_id = data.get("student_id")

    if not text:
        return jsonify({"error": "Text is required"}), 400

    if len(text) < 10:
        return jsonify({"error": "Please describe your skills in more detail"}), 400

    # Groq se extract karo
    result = extract_skills(text)

    # Agar student_id diya hai to DB mein save karo
    if student_id:
        Student.update_skills(student_id, result["skills"])

    return jsonify(result), 200


# ── Get Saved Skills ───────────────────────────────────────
@skills_bp.route("/api/skills/<int:student_id>", methods=["GET"])
def get_skills(student_id):
    skills = Student.get_skills(student_id)

    if not skills:
        return jsonify({"error": "No skills found for this student"}), 404

    return jsonify({"success": True, "skills": skills}), 200


# ── Update Skills Manually ─────────────────────────────────
@skills_bp.route("/api/skills/<int:student_id>", methods=["PUT"])
def update_skills(student_id):
    data   = request.json
    skills = data.get("skills", [])

    if not skills:
        return jsonify({"error": "Skills list is empty"}), 400

    Student.update_skills(student_id, skills)
    return jsonify({"success": True, "message": "Skills updated!"}), 200