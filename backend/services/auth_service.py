from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


def get_driver(headless=False):
    options = Options()
    if headless:
        options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36")
    driver = webdriver.Chrome(options=options)
    return driver


def internshala_login():
    driver = get_driver(headless=False)

    try:
        driver.get("https://internshala.com/login/student")
        try:
            driver.find_element(By.ID, "close_popup").click()
            time.sleep(1)
        except:
            pass

        # User ko khud login karne do — yahan kuch fill nahi karna
        # Sirf wait karo jab tak login na ho jaye
        wait_long = WebDriverWait(driver, 120)  # 2 minute time do user ko
        try:
            wait_long.until(
                lambda d: "dashboard" in d.current_url or "student" in d.current_url
            )
            cookies = driver.get_cookies()
            driver.quit()
            return {"success": True, "cookies": cookies}
        except:
            driver.quit()
            return {"success": False, "message": "Login time out — dobara try karo"}

    except Exception as e:
        driver.quit()
        return {"success": False, "message": str(e)}


def apply_with_session(cookies, apply_link):
    driver = get_driver(headless=False)

    try:
        driver.get("https://internshala.com")
        time.sleep(1)

        for cookie in cookies:
            try:
                driver.add_cookie(cookie)
            except:
                continue

        driver.get(apply_link)
        time.sleep(3)
        try:
            driver.find_element(By.ID, "close_popup").click()
            time.sleep(1)
        except:
            pass

        try:
            apply_btn = driver.find_element(By.CSS_SELECTOR, ".btn.btn-primary.detail_page.apply")
            apply_btn.click()
            time.sleep(2)
        except:
            driver.quit()
            return {"success": False, "message": "Apply button nahi mila"}

        try:
            cv_section = driver.find_element(By.CSS_SELECTOR, ".resume_required, [class*='resume']")
            if "not uploaded" in cv_section.text.lower() or "upload" in cv_section.text.lower():
                driver.quit()
                return {"success": False, "message": "Pehle Internshala profile mein CV upload karo"}
        except:
            pass

        page_text = driver.find_element(By.TAG_NAME, "body").text[:500]
        driver.quit()

        return {
            "success": True,
            "message": "Form ready — confirm karo apply karne ke liye",
            "preview": page_text
        }

    except Exception as e:
        driver.quit()
        return {"success": False, "message": str(e)}


def confirm_apply(cookies, apply_link):
    driver = get_driver(headless=False)

    try:
        driver.get("https://internshala.com")
        time.sleep(1)

        for cookie in cookies:
            try:
                driver.add_cookie(cookie)
            except:
                continue

        driver.get(apply_link)
        time.sleep(3)
        try:
            driver.find_element(By.ID, "close_popup").click()
            time.sleep(1)
        except:
            pass
        # Step 1 — Apply now click
        apply_btn = driver.find_element(By.CSS_SELECTOR, ".btn.btn-primary.detail_page.apply")
        apply_btn.click()
        time.sleep(2)

        # Step 2 — Proceed to application click
        try:
            proceed_btn = driver.find_element(By.CSS_SELECTOR, ".proceed-btn")
            proceed_btn.click()
            time.sleep(2)
        except:
            driver.quit()
            return {"success": False, "message": "Proceed button nahi mila"}

        # Step 3 — Final submit
        try:
            submit_btn = driver.find_element(By.CSS_SELECTOR, "#submit")
            submit_btn.click()
            time.sleep(2)
            driver.quit()
            return {"success": True, "message": "Application submit ho gayi!"}
        except:
            driver.quit()
            return {"success": False, "message": "Submit button nahi mila"}

    except Exception as e:
        driver.quit()
        return {"success": False, "message": str(e)}