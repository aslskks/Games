import os

path = "templates/basket/"
results = []

for root, _, files in os.walk(path):
    for name in files:
        with open(os.path.join(root, name), "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            if "files.twoplayergames.org" in content:
                results.append(os.path.join(root, name))
print("Files containing 'files.twoplayergames.org':" + "\n".join(results))