from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
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
    time.sleep(3)

    cards = driver.find_elements(By.CSS_SELECTOR, ".individual_internship")

    if not cards:
        driver.get("https://internshala.com/internships/computer-science-internship")
        time.sleep(3)
        cards = driver.find_elements(By.CSS_SELECTOR, ".individual_internship")

    jobs = []

    for i, card in enumerate(cards[:8]):
        try:
            title = card.find_element(By.CSS_SELECTOR, ".profile").text.strip()
        except:
            title = "Internship"

        try:
            company = card.find_element(By.CSS_SELECTOR, ".company_name").text.strip()
        except:
            company = "Company"

        try:
            location = card.find_element(By.CSS_SELECTOR, ".location_link").text.strip()
        except:
            location = "Remote"

        try:
            stipend = card.find_element(By.CSS_SELECTOR, ".stipend").text.strip()
        except:
            stipend = "See listing"

        try:
            link = card.find_element(By.CSS_SELECTOR, "a.view_detail_button")
            href = link.get_attribute("href")
            apply_link = "https://internshala.com" + href if href.startswith("/") else href
        except:
            apply_link = "https://internshala.com/internships"

        jobs.append({
            "id":          f"internshala_{i}",
            "title":       title,
            "company":     company,
            "location":    location,
            "platform":    "Internshala",
            "type":        "Internship",
            "stipend":     stipend,
            "posted":      "Recently",
            "apply_link":  apply_link,
            "description": f"{title} at {company}",
        })

    driver.quit()
    print(f"Jobs found: {len(jobs)}")
    return jobs