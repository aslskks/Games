import os
files = []
path = "templates/ovo/mobile/games/ovo/"
for f in os.listdir(path):
    try:
        with open(os.path.join(path, f), "r", encoding="utf-8", errors="ignore") as file:
            for line in file:
                if "appmanifest.json" in line:
                    if f not in files:
                        files.append(f)
    except:
        continue
with open("data.log", "a+") as f:
    for file in files:
        f.write(file + "\n")