import os
files = []
path = "templates/ovo/mobile/games/ovo/"
for f in os.listdir(path):
    try:
        with open(os.path.join(path, f), "r", encoding="utf-8", errors="ignore") as file:
            for line in file:
                if "hoodamath" in line:
                    files.append(f)
                    break
    except:
        continue
with open("data.log", "a+") as f:
    for file in files:
        f.write(file + "\n")