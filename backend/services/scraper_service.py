from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


def get_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36")
    driver = webdriver.Chrome(options=options)
    return driver


def get_jobs(skills, opp_type="internship"):
    keyword = "-".join([s.lower().replace(" ", "-") for s in skills[:2]])
    url = f"https://internshala.com/internships/{keyword}-internship"

    driver = get_driver()
    driver.get(url)

    wait = WebDriverWait(driver, 10)
    try:
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".individual_internship")))
    except:
        driver.get("https://internshala.com/internships/computer-science-internship")
        try:
            wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".individual_internship")))
        except:
            driver.quit()
            return []

    # Sign-in popup band karo agar aaya ho
    try:
        close_btn = driver.find_element(By.ID, "close_popup")
        close_btn.click()
        time.sleep(1)
    except:
        pass

    cards = driver.find_elements(By.CSS_SELECTOR, ".individual_internship")
    jobs = []

    for i, card in enumerate(cards[:8]):
        try:
            title = card.find_element(By.CSS_SELECTOR, ".job-title-href").text.strip()
        except:
            title = "Internship"

        try:
            company = card.find_element(By.CSS_SELECTOR, ".company-name").text.strip()
        except:
            company = "Company"

        try:
            location = card.find_element(By.CSS_SELECTOR, ".row-1-item.locations span").text.strip()
        except:
            location = "Remote"

        try:
            stipend = card.find_element(By.CSS_SELECTOR, ".stipend").text.strip()
        except:
            stipend = "See listing"

        try:
            duration = card.find_element(By.CSS_SELECTOR, ".row-1-item i.ic-16-calendar").find_element(By.XPATH, "..").text.strip()
        except:
            duration = ""

        try:
          skill_els = card.find_elements(By.CSS_SELECTOR, ".job_skill")
          required_skills = ", ".join([s.text.strip() for s in skill_els]) if skill_els else ""
        except:
          required_skills = ""

        try:
            link_el = card.find_element(By.CSS_SELECTOR, ".job-title-href")
            href = link_el.get_attribute("href")
            apply_link = href if href.startswith("http") else "https://internshala.com" + href
        except:
            try:
                href = card.get_attribute("data-href")
                apply_link = "https://internshala.com" + href if href else "https://internshala.com/internships"
            except:
                apply_link = "https://internshala.com/internships"

        try:
            posted = card.find_element(By.CSS_SELECTOR, ".status-success").text.strip()
        except:
            posted = "Recently"

        jobs.append({
            "id":             f"internshala_{i}",
            "title":          title,
            "company":        company,
            "location":       location,
            "platform":       "Internshala",
            "type":           "Internship",
            "stipend":        stipend,
            "duration":       duration,
            "posted":         posted,
            "apply_link":     apply_link,
            "description": f"{title} at {company} — {location}. Skills: {required_skills}",
            "skills_needed":  required_skills,
        })

    driver.quit()
    print(f"Jobs found: {len(jobs)}")
    return jobs