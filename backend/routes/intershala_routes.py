from flask import Blueprint, request, jsonify
from services.auth_service import internshala_login, apply_with_session, confirm_apply
from models.db import get_connection
import json

internshala_bp = Blueprint("internshala", __name__)


def save_cookies(student_id, cookies):
    conn = get_connection()
    conn.execute(
        "UPDATE students SET internshala_cookies = ? WHERE id = ?",
        (json.dumps(cookies), student_id)
    )
    conn.commit()
    conn.close()


def get_cookies(student_id):
    conn = get_connection()
    row = conn.execute(
        "SELECT internshala_cookies FROM students WHERE id = ?",
        (student_id,)
    ).fetchone()
    conn.close()

    if row and row["internshala_cookies"]:
        return json.loads(row["internshala_cookies"])
    return None


def check_session_valid(cookies):
    if not cookies:
        return False
    # Cookies mein expiry check karo
    for cookie in cookies:
        if cookie.get("name") == "internshala_session":
            expiry = cookie.get("expiry", 0)
            if expiry:
                import time
                if time.time() > expiry:
                    return False
            return True
    return False


# ── Login ──────────────────────────────────────────────────────
@internshala_bp.route("/api/internshala/login", methods=["POST"])
def login():
    data       = request.json
    email      = data.get("email")
    password   = data.get("password")
    student_id = data.get("student_id")

    if not email or not password:
        return jsonify({"error": "Email aur password dono chahiye"}), 400

    result = internshala_login(email, password)

    if result["success"]:
        save_cookies(student_id, result["cookies"])
        return jsonify({"success": True, "message": "Internshala login ho gaya!"}), 200
    else:
        return jsonify({"success": False, "message": result["message"]}), 401


# ── Apply ──────────────────────────────────────────────────────
@internshala_bp.route("/api/internshala/apply", methods=["POST"])
def apply():
    data       = request.json
    student_id = data.get("student_id")
    apply_link = data.get("apply_link")
    cv_path    = data.get("cv_path", None)
    confirmed  = data.get("confirmed", False)

    if not apply_link:
        return jsonify({"error": "Apply link chahiye"}), 400

    # Cookies lo DB se
    cookies = get_cookies(student_id)

    # Session valid hai?
    if not check_session_valid(cookies):
        return jsonify({
            "success": False,
            "session_expired": True,
            "message": "Internshala session expire ho gaya — dobara login karo"
        }), 401

    # Agar confirmed nahi — preview dikhao pehle
    if not confirmed:
        result = apply_with_session(cookies, apply_link, cv_path)
        return jsonify(result), 200

    # Confirmed — actually apply karo
    result = confirm_apply(cookies, apply_link)

    # DB mein save karo
    if result["success"]:
        conn = get_connection()
        conn.execute(
            """INSERT INTO applications 
               (student_id, job_title, company, platform, status)
               VALUES (?, ?, ?, ?, ?)""",
            (student_id, data.get("job_title", ""), data.get("company", ""),
             "Internshala", "Applied")
        )
        conn.commit()
        conn.close()

    return jsonify(result), 200


# ── Session Check ──────────────────────────────────────────────
@internshala_bp.route("/api/internshala/session", methods=["GET"])
def session_status():
    student_id = request.args.get("student_id")
    cookies    = get_cookies(student_id)
    valid      = check_session_valid(cookies)

    return jsonify({
        "logged_in": valid,
        "message": "Session active hai" if valid else "Session expire ho gaya — login karo"
    }), 200