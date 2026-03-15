from flask import Flask, render_template, send_from_directory, request
import os

app = Flask(__name__, template_folder="templates")
app.secret_key = "hola"

OUTPUT_DIR = "ovo/"
GAME_PATH = "mobile/games/ovo/"

# --- Home route ---
@app.get('/')
def index():
    return render_template("home.html")

# --- Example game routes ---
@app.get("/snowrider3d")
def snowrider():
    return render_template("snowrider3d/snowrider3d.html")
@app.get("/image/<path:path>")
def image(path):
    return send_from_directory("static", path)
@app.get("/minecraft")
def minecraft():
    return render_template("eaglecraft/index.html")

# --- Ovo favicon ---
@app.get("/ovo/uploads/2025/5/ovo-favicon.jpg")
def ovo_favicon():
    return send_from_directory("templates/ovo/uploads/2025/5/", "ovo-favicon.jpg")

# --- Search ---

# --- Snowrider images ---
@app.get("/images_snow/<name>")
def images(name):
    if name == "snowrider3d.jpg":
        return send_from_directory("templates/snowrider3d/TemplateData/", "logo.png")
    else:
        return send_from_directory("templates/eaglecraft/", "logo.jpg")

# --- Snowrider static files ---
@app.get("/snowrider3d/Build/<path:name>")
def snowrider_build(name):
    return send_from_directory("templates/snowrider3d/Build", name)

@app.get("/snowrider3d/TemplateData/<path:name>")
def snowrider_template(name):
    return send_from_directory("templates/snowrider3d/TemplateData", name)

# --- Main Ovo game ---
@app.get("/ovo")
def ovo():
    game_folder = os.path.join(OUTPUT_DIR, "mobile", "games", "ovo")
    filename = "game.html"
    full_path = os.path.join(game_folder, filename)
    if not os.path.exists(full_path):
        return f"File not found: {full_path}", 404
    return send_from_directory(game_folder, filename)

# --- Catch-all static files in ovo ---
@app.route("/<path:path>")
def serve_file(path: str):
    # Full folder path
    game_folder = os.path.join(OUTPUT_DIR, GAME_PATH)
    full_path = os.path.normpath(os.path.join(game_folder, path))



    if os.path.isfile(full_path):
        # Split directory and filename
        directory = os.path.dirname(full_path)
        filename = os.path.basename(full_path)
        return send_from_directory(directory, filename)
    return "File not found", 404

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")