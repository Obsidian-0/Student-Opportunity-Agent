# services/matcher_service.py

def score_jobs(jobs: list, student_skills: list) -> list:
    """
    Har job ko student profile ke against score karo.
    """

    # Student ke skills lowercase mein
    student_skill_names = [s["name"].lower() for s in student_skills]
    student_skill_map   = {s["name"].lower(): s["score"] for s in student_skills}

    scored = []
    for job in jobs:
        desc = (job.get("title","") + " " + job.get("description","")).lower()

        matched  = []
        missing  = []
        total    = 0
        matched_score = 0

        for skill in student_skill_names:
            if skill in desc:
                matched.append(skill)
                matched_score += student_skill_map.get(skill, 5)
                total += 10
            else:
                total += 10

        # Match percentage calculate karo
        if total > 0:
            raw_pct = int((matched_score / total) * 100)
            # 5-95 range mein rakh
            match_pct = max(5, min(95, raw_pct))
        else:
            match_pct = 50

        scored.append({
            **job,
            "match":          match_pct,
            "matched_skills": matched,
            "missing_skills": [s for s in student_skill_names if s not in matched][:3],
        })

    # Score ke hisab se sort karo (high first)
    scored.sort(key=lambda x: x["match"], reverse=True)
    return scored