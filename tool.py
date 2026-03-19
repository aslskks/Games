import os
for root, dirs, files in os.walk("templates/2v2/"):
    for file in files:
        if file == "api.js":
            print(os.path.join(root, file))
        