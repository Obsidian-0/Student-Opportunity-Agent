from flask import Blueprint, request, jsonify
from models.db import get_connection

auth = Blueprint("auth", __name__)


@auth.route("/api/student/create", methods=["POST"])
def create_student():
    data = request.json
    name     = data.get("name", "")
    degree   = data.get("degree", "")
    semester = data.get("sem", "")
    opp_type = data.get("type", "")

    if not name:
        return jsonify({"error": "Name required"}), 400

    conn = get_connection()
    try:
        cursor = conn.execute(
            "INSERT INTO students (name, degree, semester, opp_type) VALUES (?, ?, ?, ?)",
            (name, degree, semester, opp_type)
        )
        conn.commit()
        student_id = cursor.lastrowid
        return jsonify({"success": True, "student_id": student_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@auth.route("/api/student/<int:student_id>", methods=["GET"])
def get_student(student_id):
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM students WHERE id = ?", (student_id,)
    ).fetchone()
    conn.close()

    if not row:
        return jsonify({"error": "Student not found"}), 404
    return jsonify(dict(row)), 200