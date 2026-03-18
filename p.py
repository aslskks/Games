import json
import os
import requests
from urllib.parse import urlparse
import re
from concurrent.futures import ThreadPoolExecutor

OUTPUT_DIR = "templates/2v2"
MAX_WORKERS = 20  # puedes subir a 30-50 según tu internet

os.makedirs(OUTPUT_DIR, exist_ok=True)

def sanitize_name(name):
    return re.sub(r'[<>:"/\\|?*]', '_', name)

def build_path(url):
    parsed = urlparse(url)
    path = parsed.path

    if not path or path.endswith("/"):
        path += "index.html"

    parts = path.lstrip("/").split("/")

    safe_parts = []
    for p in parts:
        p = sanitize_name(p)

        # evitar nombres reservados en Windows
        if p.lower() in ["con", "prn", "aux", "nul"]:
            p = f"_{p}"

        safe_parts.append(p[:100])  # limitar longitud

    file_path = os.path.join(OUTPUT_DIR, *safe_parts)

    # 🔥 normaliza la ruta (muy importante en Windows)
    file_path = os.path.normpath(file_path)

    try:
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
    except Exception as e:
        print("Error creating path:", file_path, e)
        return None, None

    return file_path, "/".join(safe_parts)
def download(session, url):
    file_path, pretty = build_path(url)

    if not file_path:
        return f"Skipped: {url}"

    if os.path.exists(file_path):
        return f"Already exists: {pretty}"

    try:
        r = session.get(url, timeout=10)
        if r.status_code == 200:
            with open(file_path, "wb") as f:
                f.write(r.content)
            return f"Downloaded: {pretty}"
    except Exception as e:
        return f"Error: {url} -> {e}"
def main():
    har_files = [f for f in os.listdir() if f.endswith(".har")]

    if not har_files:
        print("No HAR files found")
        return

    for i, f in enumerate(har_files, 1):
        print(f"{i}. {f}")

    choice = int(input("SELECT a Har file: "))
    HAR_FILE = har_files[choice - 1]

    with open(HAR_FILE, "r", encoding="utf-8") as f:
        har = json.load(f)

    entries = har["log"]["entries"]

    urls = list({entry["request"]["url"] for entry in entries})

    session = requests.Session()

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        results = executor.map(lambda url: download(session, url), urls)

        for res in results:
            print(res)

if __name__ == "__main__":
    main()