import json
import os
import requests
from urllib.parse import urlparse
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

MAX_THREADS = 60  # you can increase (20–50 depending on your internet)

session = requests.Session()  # reuse connections (BIG speed boost)


def sanitize_parts(path):
    raw_parts = re.split(r"[\\/]+", path)
    parts = [p for p in raw_parts if p.strip()]
    return [re.sub(r'[<>:"/\\|?*]', '_', p) for p in parts]


def should_download(parts, hoodamath):
    if not hoodamath:
        return True
    return len(parts) >= 3 and parts[0] == "mobile" and parts[1] == "games"


def download_one(entry, output_dir, hoodamath, downloaded):
    url = entry["request"]["url"]

    if url in downloaded:
        return
    downloaded.add(url)

    parsed = urlparse(url)
    path = parsed.path

    if not path:
        return
    if path.endswith("/"):
        path += "index.html"

    safe_parts = sanitize_parts(path)

    if not should_download(safe_parts, hoodamath):
        return

    file_path = os.path.join(output_dir, *safe_parts)
    dir_path = os.path.dirname(file_path)

    try:
        os.makedirs(dir_path, exist_ok=True)
    except:
        return

    if os.path.exists(file_path):
        return

    try:
        r = session.get(url, timeout=10)
        if r.status_code == 200:
            with open(file_path, "wb") as f:
                f.write(r.content)
            print("✔", "/".join(safe_parts))
    except:
        pass


def download_files(entries, output_dir, hoodamath):
    downloaded = set()

    with ThreadPoolExecutor(max_workers=MAX_THREADS) as executor:
        futures = [
            executor.submit(download_one, entry, output_dir, hoodamath, downloaded)
            for entry in entries
        ]

        for _ in as_completed(futures):
            pass


def rename_spaces(folder):
    for root, _, files in os.walk(folder):
        for file in files:
            if "%20" in file:
                old_path = os.path.join(root, file)
                new_name = file.replace("%20", " ")
                new_path = os.path.join(root, new_name)
                os.rename(old_path, new_path)


def remove_ads_script(folder):
    index_path = os.path.join(folder, "index.html")

    if not os.path.exists(index_path):
        return

    with open(index_path, "r", encoding="utf-8") as f:
        content = f.read()

    content = content.replace(
        '<script src="https://www.hoodamath.com/game-preloader-ad.js"></script>', ""
    )

    with open(index_path, "w", encoding="utf-8") as f:
        f.write(content)


def main():
    har_files = [f for f in os.listdir() if f.endswith(".har")]

    if not har_files:
        print("No HAR files found.")
        return

    for i, f in enumerate(har_files, 1):
        print(f"{i}. {f}")

    selected = har_files[int(input("Select HAR: ")) - 1]
    output_dir = input("Output folder: ").strip()
    hoodamath = input("HoodaMath? (yes/no): ").lower() == "yes"

    os.makedirs(output_dir, exist_ok=True)

    with open(selected, "r", encoding="utf-8") as f:
        har = json.load(f)

    entries = har["log"]["entries"]

    print("Downloading with", MAX_THREADS, "threads...")
    download_files(entries, output_dir, hoodamath)

    rename_spaces(output_dir)

    if hoodamath:
        remove_ads_script(output_dir)

    print("Done!")


if __name__ == "__main__":
    main()