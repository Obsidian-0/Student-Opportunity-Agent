# services/scraper_service.py
import requests
from config import Config

HEADERS = {
    "X-RapidAPI-Key": Config.RAPID_API_KEY,
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
}

def get_jobs(skills: list, opp_type: str = "internship"):
    try:
        query = "software developer intern Pakistan"
        
        r = requests.get(
            "https://jsearch.p.rapidapi.com/search",
            headers=HEADERS,
            params={"query": query, "num_pages": "1"},
            timeout=20
        )
        data = r.json()
        print("Jobs count:", len(data.get("data", [])))

        jobs = []
        for i, job in enumerate(data.get("data", [])[:8]):
            jobs.append({
                "id":          str(i),
                "title":       job.get("job_title", "N/A"),
                "company":     job.get("employer_name", "N/A"),
                "location":    job.get("job_city") or "Pakistan",
                "platform":    job.get("job_publisher", "Rozee.pk"),
                "type":        opp_type,
                "stipend":     "See listing",
                "posted":      "Recently",
                "apply_link":  job.get("job_apply_link", ""),
                "description": job.get("job_description", "")[:150] + "...",
            })
        return jobs

    except Exception as e:
        print(f"Error: {e}")
        return []