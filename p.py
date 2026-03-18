import json
import os
import requests
from urllib.parse import urlparse
import re
import time
har_files = []
numbers= []
print("0. Exit")
har_files.append("Exit")
for i in range(0,51):
    numbers.append(str(i))
for f in os.listdir():
    if f.endswith(".har"):
        print(numbers[0] +". " + f)
        numbers.remove(numbers[0])
        har_files.append(f)
if len(har_files) == 1:
    print("Please add a Har file to the folder and try again, a har file is a file that contains all the requests made by the browser, you can get one entering the main page of the game not the iframe and in devtools you go to the network tab and then you search the download icon and you click on it and then you save the har file and put in the same folder as this script and then you run the script")
    time.sleep(30)
    exit()
har_file = int(input("SELECT a Har file: "))
if har_file == 0:
    exit()

HAR_FILE = har_files[har_file - 1]
if HAR_FILE == "Exit":
    exit()
OUTPUT_DIR = "templates/2v2"

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
        path += "index.html"
    parts = path.lstrip("/").split("/")
    safe_parts = [sanitize_name(p) for p in parts]
    # if len(safe_parts) < 3 or safe_parts[0] != "mobile" or safe_parts[1] != "games":
    #     continue
    if "ads" in safe_parts:
        continue
    file_path = os.path.join(OUTPUT_DIR, *safe_parts)
    try:
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
    except:
        continue

    if os.path.exists(file_path.replace("%20", " ")):
        print("Already exists:", "/".join(safe_parts))
        continue

    try:
        r = requests.get(url, timeout=15)
        if r.status_code == 200:
            with open(file_path, "wb") as f:
                f.write(r.content)
            print("Downloaded:", "/".join(safe_parts))
    except Exception as e:
        print("Error downloading:", url, e)
# folder = "ovo/mobile/games/ovo/media/"
# for file in os.listdir(folder):
#     if "%20" in file:
#         old_path = os.path.join(folder, file)
#         new_name = file.replace("%20", " ")
#         new_path = os.path.join(folder, new_name)
#         os.rename(old_path, new_path)
#         print(f"Renamed: {file} -> {new_name}")
# game_html_path = "ovo/mobile/games/ovo/game.html"
# with open(game_html_path, "r", encoding="utf-8") as f:
#     content = f.read()
# content = content.replace(
#     '<script src="https://www.hoodamath.com/game-preloader-ad.js"></script>', ""
# )
# with open(game_html_path, "w", encoding="utf-8") as f:
#     f.write(content)

# print("Removed game-preloader-ad.js script from game.html")

# json_path = "ovo/mobile/games/ovo/sdkconfig.json"

# # with open(json_path, "w", encoding="utf-8") as f:
# #     f.write(" ")
# print("Disabled sitelock in configuration file")
# print("Full ovo installation complete in ovo/mobile/games/ovo the game html is game.html")