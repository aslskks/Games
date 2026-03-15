import json
import os
import requests
from urllib.parse import urlparse
import re
har_files = []
numbers= []
for i in range(1,51):
    numbers.append(str(i))
for f in os.listdir():
    if f.endswith(".har"):
        print(numbers[0] +". " + f)
        numbers.remove(numbers[0])
        har_files.append(f)
har_file = int(input("SELECT a Har file: "))
if har_file == 0:
    exit()
HAR_FILE = har_files[har_file - 1]
OUTPUT_DIR = "ovo"

os.makedirs(OUTPUT_DIR, exist_ok=True)

with open(HAR_FILE, "r", encoding="utf-8") as f:
    har = json.load(f)

entries = har["log"]["entries"]
downloaded = set()

def sanitize_name(name):
    return re.sub(r'[<>:"/\\|?*]', '_', name)

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
    if len(safe_parts) < 3 or safe_parts[0] != "mobile" or safe_parts[1] != "games" or safe_parts[2] != "ovo":
        continue
    file_path = os.path.join(OUTPUT_DIR, *safe_parts)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    if os.path.exists(file_path.replace("%20", " ")):
        continue

    try:
        r = requests.get(url, timeout=15)
        if r.status_code == 200:
            with open(file_path, "wb") as f:
                f.write(r.content)
            print("Downloaded:", "/".join(safe_parts))
    except Exception as e:
        print("Error downloading:", url, e)
folder = "ovo/mobile/games/ovo/media/"
for file in os.listdir(folder):
    if "%20" in file:
        old_path = os.path.join(folder, file)
        new_name = file.replace("%20", " ")
        new_path = os.path.join(folder, new_name)
        os.rename(old_path, new_path)
        print(f"Renamed: {file} -> {new_name}")
game_html_path = "ovo/mobile/games/ovo/game.html"
with open(game_html_path, "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace(
    '<script src="https://www.hoodamath.com/game-preloader-ad.js"></script>', ""
)
with open(game_html_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Removed game-preloader-ad.js script from game.html")

json_path = "ovo/mobile/games/ovo/sdkconfig.json"

domain =  str(input("Write your domain (necesary for adding your domain to authorized pages): "))

with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

if domain not in data.get("networks", []):
    data.setdefault("networks", []).append(domain)
if domain not in data.get("sites", []):
    data.setdefault("sites", []).append(domain)
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
print(f"Domain '{domain}' added to networks and sites in {json_path}.")
print("Full ovo installation complete in ovo/mobile/games/ovo the game html is game.html")