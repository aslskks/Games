import json
import os
import requests
from urllib.parse import urlparse
import re

def list_har_files():
    har_files = [f for f in os.listdir() if f.endswith(".har")]
    if not har_files:
        print("No .har files found in this folder.")
        input("Press Enter to exit...")
        exit()

    print("0. Exit")
    for i, f in enumerate(har_files, start=1):
        print(f"{i}. {f}")

    return har_files


def choose_har_file(har_files):
    while True:
        try:
            choice = int(input("Select a HAR file: "))
            if choice == 0:
                exit()
            return har_files[choice - 1]
        except (ValueError, IndexError):
            print("Invalid selection, try again.")


def is_hoodamath():
    q = input("Is this a HoodaMath .har? (yes/no): ").strip().lower()
    return q == "yes"


def sanitize_name(name):
    return re.sub(r'[<>:"/\\|?*]', '_', name)


def download_files(entries, output_dir, hoodamath):
    downloaded = set()

    for entry in entries:
        url = entry["request"]["url"]

        if url in downloaded:
            continue
        downloaded.add(url)

        parsed = urlparse(url)
        path = parsed.path

        if not path or path.endswith("/"):
            continue

        parts = path.lstrip("/").split("/")
        safe_parts = [sanitize_name(p) for p in parts]

        # HoodaMath filtering logic
        if hoodamath:
            if len(safe_parts) < 3 or safe_parts[0] != "mobile" or safe_parts[1] != "games":
                continue

        file_path = os.path.join(output_dir, *safe_parts)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        if os.path.exists(file_path):
            continue

        try:
            r = requests.get(url, timeout=15)
            if r.status_code == 200:
                with open(file_path, "wb") as f:
                    f.write(r.content)
                print("Downloaded:", "/".join(safe_parts))
        except Exception as e:
            print("Error:", url, e)


def rename_spaces(folder):
    for root, _, files in os.walk(folder):
        for file in files:
            if "%20" in file:
                old_path = os.path.join(root, file)
                new_name = file.replace("%20", " ")
                new_path = os.path.join(root, new_name)
                os.rename(old_path, new_path)
                print(f"Renamed: {file} -> {new_name}")


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

    print("Removed ad script from index.html")


def create_sdkconfig():
    path = os.path.join("ovo", "mobile", "games", "ovo", "sdkconfig.json")
    os.makedirs(os.path.dirname(path), exist_ok=True)

    config = {
        "networks": [
            "Poki", "CrazyGames", "GamePix", "GameDistribution",
            "GameMonetize", "CoolMathGames", "HoodaMath", "FreezeNova"
        ],
        "name": "HoodaMath",
        "gameId": "1377b99c10284c229423118a941af3b1",
        "removeSocials": True,
        "stopAudioInBackground": False,
        "removeMidrollRewarded": True,
        "noReligion": False,
        "removeServiceWorker": True,
        "interTypes": {
            "loader": False,
            "mainMenuStart": True,
            "randomskins": True,
            "removeads": False,
            "levelStart": True,
            "restart": True,
            "levelStartFromMenu": True,
            "levelStartOnSuccess": True
        },
        "splashScreen": True,
        "sitelock": False,
        "sites": [
            "www.hoodamath.com",
            "hoodamath.com"
        ],
        "correctWebsite": "https://www.hoodamath.com/games/ovo.html"
    }

    with open(path, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=4)

    print("sdkconfig.json created (sitelock disabled)")


def main():
    har_files = list_har_files()
    selected = choose_har_file(har_files)
    output_dir = input("Output directory: ").strip()
    hoodamath = is_hoodamath()

    os.makedirs(output_dir, exist_ok=True)

    with open(selected, "r", encoding="utf-8") as f:
        har = json.load(f)

    entries = har["log"]["entries"]

    download_files(entries, output_dir, hoodamath)
    rename_spaces(output_dir)
    remove_ads_script(output_dir)

    if hoodamath:
        create_sdkconfig()

    print("Done!")


if __name__ == "__main__":
    main()