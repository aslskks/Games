import os

# Directory to search
path = "templates/2v2/"
# List to store matching file paths
results = []
target = """reCAPTCHA"""

for root, _, files in os.walk(path):
    for name in files:
        file_path = os.path.join(root, name)
        try:
            # if "sdk" in name:
            #     results.append(file_path)
            # Read file line by line to handle large files
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    if target in line:
                        results.append(file_path)
                        break  # Stop reading this file once found
        except Exception as e:
            print(f"Could not read {file_path}: {e}")
if results:
    print("Files containing the target string:" + target)
    for result in results:
        print(result)