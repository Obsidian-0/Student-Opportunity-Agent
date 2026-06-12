# routes/jobs.py
from flask import Blueprint, request, jsonify
from services.scraper_service import get_jobs
from services.matcher_service import score_jobs
from models.db import get_connection

jobs_bp = Blueprint("jobs", __name__)

# ── Find & Match Jobs ──────────────────────────────────────
@jobs_bp.route("/api/jobs/match", methods=["POST"])
def match_jobs():
    data     = request.json
    skills   = data.get("skills", [])
    opp_type = data.get("opp_type", "internship")

    if not skills:
        return jsonify({"error": "Skills empty"}), 400

    jobs   = get_jobs([s["name"] for s in skills], opp_type)
    ranked = score_jobs(jobs, skills)

    return jsonify({"success": True, "total": len(ranked), "jobs": ranked}), 200


# ── Save Application ───────────────────────────────────────
@jobs_bp.route("/api/apply", methods=["POST"])
def apply():
    data = request.json
    conn = get_connection()
    conn.execute(
        """INSERT INTO applications 
           (student_id, job_title, company, platform, match_score, status)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (data["student_id"], data["job_title"], data["company"],
         data["platform"], data.get("match_score", 0), "Submitted")
    )
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Application saved!"}), 201


# ── History ────────────────────────────────────────────────
@jobs_bp.route("/api/history/<int:student_id>", methods=["GET"])
def history(student_id):
    conn = get_connection()
    apps = conn.execute(
        "SELECT * FROM applications WHERE student_id=? ORDER BY applied_at DESC",
        (student_id,)
    ).fetchall()
    conn.close()
    return jsonify({"success": True, "applications": [dict(a) for a in apps]}), 200