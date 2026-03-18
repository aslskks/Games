import os
import requests

# folders
build_folder = "Build"
template_folder = "TemplateData"
template = "templates/"
os.makedirs(template + "snowrider3d", exist_ok=True)
os.makedirs(template +"snowrider3d/" +build_folder, exist_ok=True)
os.makedirs(template +"snowrider3d/" + template_folder, exist_ok=True)

files = {
# Build files
"Build/SnowRider3D-gd-1.data.unityweb":
"https://www.hoodamath.com/mobile/games/snow-rider-3d/Build/SnowRider3D-gd-1.data.unityweb",

"Build/SnowRider3D-gd-1.wasm.code.unityweb":
"https://www.hoodamath.com/mobile/games/snow-rider-3d/Build/SnowRider3D-gd-1.wasm.code.unityweb",

"Build/SnowRider3D-gd-1.wasm.framework.unityweb":
"https://www.hoodamath.com/mobile/games/snow-rider-3d/Build/SnowRider3D-gd-1.wasm.framework.unityweb",

"Build/SnowRider3D-gd-1.json":
"https://www.hoodamath.com/mobile/games/snow-rider-3d/Build/SnowRider3D-gd-1.json",

"Build/UnityLoader.js":
"https://www.hoodamath.com/mobile/games/snow-rider-3d/Build/UnityLoader.js",

# TemplateData files
"TemplateData/style.css":
"https://www.hoodamath.com/mobile/games/snow-rider-3d/TemplateData/style.css",

"TemplateData/UnityProgress.js":
"https://www.hoodamath.com/mobile/games/snow-rider-3d/TemplateData/UnityProgress.js",

"TemplateData/favicon.ico":
"https://www.hoodamath.com/mobile/games/snow-rider-3d/TemplateData/favicon.ico",

"TemplateData/gears.gif":
    "https://www.hoodamath.com/mobile/games/snow-rider-3d/TemplateData/gears.gif",
"TemplateData/logo.png":
    "https://www.hoodamath.com/mobile/games/snow-rider-3d/TemplateData/logo.png",
# game page
"game.html":
"https://www.hoodamath.com/mobile/games/snow-rider-3d/game.html"
}

for path, url in files.items():
    
    if os.path.exists(template + "snowrider3d/" + path):
        print("Skiping: " + path)
        continue
    path = "snowrider3d/" + path
    print("Downloading", path)
    
    r = requests.get(url, stream=True)

    os.makedirs(template + os.path.dirname(path) if os.path.dirname(path) else ".", exist_ok=True)
    path = os.path.join(template, path)
    with open(path, "wb") as f:
        for chunk in r.iter_content(8192):
            if chunk:
                f.write(chunk)

print("Download complete.")