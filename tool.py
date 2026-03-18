import os
import re

TEMPLATE_DIR = "Boxing-Random/"  # folder with your HTML templates

# Only convert local static files and local routes, ignore full URLs
STATIC_PATTERN = re.compile(r'(src|href)\s*=\s*"(?:/static/)([^"]+)"')
LOCAL_LINK_PATTERN = re.compile(r'href\s*=\s*"/(?!/)([^":?]+)"')  # skip full URLs

def convert_file(filepath):
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # Convert static files
    content = STATIC_PATTERN.sub(r'\1="{{ url_for(\'static\', filename=\'\2\') }}"', content)

    # Convert local links (basic, assumes route name = last path segment)
    def replace_link(match):
        path = match.group(1)
        # Use first segment as route name if needed, adjust if your routes differ
        route_name = path.replace('/', '_')  # simple conversion
        return f'href="{{{{ url_for(\'{route_name}\') }}}}"'

    content = LOCAL_LINK_PATTERN.sub(replace_link, content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

def process_templates():
    for root, _, files in os.walk(TEMPLATE_DIR):
        for file in files:
            if file.endswith(".html"):
                convert_file(os.path.join(root, file))

process_templates()
print("Templates converted successfully!")