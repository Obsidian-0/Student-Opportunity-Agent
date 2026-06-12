# routes/auth.py
from flask import Blueprint, request, jsonify
from models.user import Student

auth = Blueprint("auth", __name__)

# ── Register ───────────────────────────────────────────────
@auth.route("/api/register", methods=["POST"])
def register():
    data = request.json

    # Validation
    required = ["name", "email", "password"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    result = Student.create(
        name     = data["name"],
        email    = data["email"],
        password = data["password"],
        degree   = data.get("degree", "CS"),
        semester = data.get("semester", "4th"),
        opp_type = data.get("opp_type", "Internship")
    )

    if result["success"]:
        return jsonify(result), 201
    return jsonify(result), 400


# ── Login ──────────────────────────────────────────────────
@auth.route("/api/login", methods=["POST"])
def login():
    data = request.json

    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400

    result = Student.login(data["email"], data["password"])

    if result["success"]:
        # Password hide karo response se
        result["student"].pop("password", None)
        return jsonify(result), 200

    return jsonify(result), 401


# ── Get Profile ────────────────────────────────────────────
@auth.route("/api/profile/<int:student_id>", methods=["GET"])
def get_profile(student_id):
    student = Student.get_by_id(student_id)

    if not student:
        return jsonify({"error": "Student not found"}), 404

    student.pop("password", None)
    return jsonify({"success": True, "student": student})