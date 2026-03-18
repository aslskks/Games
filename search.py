import os

path = "ovo/"
results = []

for root, _, files in os.walk(path):
    for name in files:
        full_path = os.path.join(root, name)
        try:
            if os.path.basename(full_path) == "index.html":
                print(full_path)
        except:
            pass
