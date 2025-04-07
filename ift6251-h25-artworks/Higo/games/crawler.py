import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

START_INDEX = 27465
START_URL = "https://www.thecoverproject.net"
URL_TO_VISIT = ["https://www.thecoverproject.net/view.php?cover_id="+str(i) for i in range(START_INDEX,30000)]
SAVE_DIR = "images"
TIMEOUT = 25
os.makedirs(SAVE_DIR, exist_ok=True)

def get_soup(url):
    try:
        response = requests.get(url, timeout=TIMEOUT, verify="certif.pem")
        response.raise_for_status() 
        return BeautifulSoup(response.text, "html.parser")
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'accès à {url} : {e}")
        return None

def download_image(img_url):
    try:
        response = requests.get(img_url, stream=True, timeout=TIMEOUT, verify="certif.pem")
        if response.status_code == 200:
            filename = os.path.join(SAVE_DIR, os.path.basename(img_url))
            with open(filename, "wb") as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)
            print(f"[✔] Image téléchargée : {filename}")
        else:
            print(f"[✘] Impossible de télécharger : {img_url}")
    except Exception as e:
        print(f"[✘] Erreur de téléchargement {img_url} : {e}")

def extract_images(soup, base_url):
    img_tags = soup.find_all("img")
    img_urls = [urljoin(base_url, img["src"]) for img in img_tags if "src" in img.attrs]
    
    for img_url in img_urls:
        if img_url.lower().endswith((".jpg", ".jpeg", ".png", ".webp")) and "thumb" in img_url.lower():
            download_image(img_url)

def crawl(url):
    print(f"[↪] Scraping : {url}")
    soup = get_soup(url)
    if soup:
        extract_images(soup, url) 

for url in URL_TO_VISIT:
    crawl(url)

