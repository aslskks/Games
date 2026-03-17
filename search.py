import os

path = "ovo/"
results = []

for root, _, files in os.walk(path):
    for name in files:
        full_path = os.path.join(root, name)
        try:
            with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                if any("adinplay" in line for line in f):
                    results.append(full_path)
        except:
            pass

with open("data.log", "w", encoding="utf-8") as f:
    f.write("\n".join(results))