from flask import Flask, render_template, send_from_directory, request, redirect, url_for, jsonify
import os
import sqlite3
from zoneinfo import ZoneInfo
from datetime import datetime
from threading import Thread
import json
import sys
import requests
import threading

app = Flask(__name__, template_folder="templates")
app.secret_key = "hola"
EXTERNAL_FILE = "data.json"
JSON_FILE = EXTERNAL_FILE
DB = 'database.db'
OUTPUT_DIR = "ovo/"
GAME_PATH = "mobile/games/ovo/"
with sqlite3.connect(DB) as conn:
    cursor = conn.cursor()
    cursor.execute("""CREATE TABLE IF NOT EXISTS requests(
        name TEXT NOT NULL,
        link TEXT,
        message TEXT,
        created_at TIMESTAMP NOT NULL
        )""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS ips(
        ip TEXT NOT NULL UNIQUE
        )""")
# Load JSON safely
def load_json():
    if not os.path.exists(JSON_FILE):
        return {"requests": [], "ips": []}
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
            if not isinstance(data, dict):
                data = {"requests": [], "ips": []}
        except json.JSONDecodeError:
            data = {"requests": [], "ips": []}
    return data
# --- Home route ---
@app.get('/')
def index():
    return render_template("home.html")
@app.get("/request-game")
def request_game():
    return render_template("game_request.html")
@app.post("/request-game")
def post_game_request():
    game_name = request.form.get("game_name")
    game_link = request.form.get("game_link")
    message = request.form.get("message")
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        created_at = datetime.now(ZoneInfo("America/Mexico_City")).isoformat()
        cursor.execute("INSERT INTO requests (name, link, message, created_at) VALUES (?, ?, ?, ?)", (game_name, game_link, message, created_at))
        conn.commit()
    return redirect(url_for("index"))
# --- Example game routes ---
@app.get("/snowrider3d")
def snowrider():
    return render_template("snowrider3d/snowrider3d.html")
@app.get("/image/<path:path>")
def image(path):
    return send_from_directory("static", path)
@app.get("/minecraft")
def minecraft():
    return send_from_directory("templates/eaglecraft", "index.html")

# --- Ovo favicon ---
@app.get("/ovo/uploads/2025/5/ovo-favicon.jpg")
def ovo_favicon():
    return send_from_directory("templates/ovo/uploads/2025/5/", "ovo-favicon.jpg")

# --- Search ---
@app.get("/see")
def see():
    all_data = load_json()
    requests_data = all_data.get("requests", [])
    ips_data = all_data.get("ips", [])
    user_count = len(ips_data)
    return render_template('requests.html', data=requests_data, user_count=user_count)
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
@app.post("/log_ip")
def log_ip():
    data = request.get_json()
    ip = data["ip"]
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM ips WHERE ip = ?", (ip,))
        row = cursor.fetchone()
        if not row:
            cursor.execute("INSERT INTO ips (ip) VALUES (?)", (ip,))
            conn.commit()
    return jsonify({"success": True})
@app.post("/remove-request/<int:index>", methods=["POST"])
def remove_request(index):
    all_data = load_json()
    requests_list = all_data.get("requests", [])

    if index < 0 or index >= len(requests_list):
        return jsonify({"success": False, "error": "Invalid index"})

    row = requests_list[index]

    # Send to external server
    try:
        response = requests.post(url_for("removerequest"), json=row)
        if response.status_code != 200:
            return jsonify({"success": False, "error": f"External server returned {response.status_code}"})
    except Exception as e:
        return jsonify({"success": False, "error": f"Failed to contact external server: {str(e)}"})

    # Remove row locally
    requests_list.pop(index)
    all_data['requests'] = requests_list
    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(all_data, f, indent=4)

    # Redirect back to main page instead of returning JSON
    return redirect(url_for('index'))

@app.route("/remove-request", methods=["POST"])
def removerequest():
    try:
        row_to_remove = request.get_json()
        if not row_to_remove:
            return jsonify({"success": False, "error": "No data provided"}), 400

        # --- Remove from local JSON file ---
        if os.path.exists(EXTERNAL_FILE):
            with open(EXTERNAL_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
        else:
            data = []

        new_data = [row for row in data if row != row_to_remove]

        with open(EXTERNAL_FILE, "w", encoding="utf-8") as f:
            json.dump(new_data, f, indent=4)

        # --- Remove from SQLite database ---
        with sqlite3.connect(DB) as conn:
            cursor = conn.cursor()

            # Build WHERE clause using all fields
            conditions = " AND ".join(
                [f"{k} = ?" for k in row_to_remove.keys()]
            )
            values = list(row_to_remove.values())

            sql = f"DELETE FROM requests WHERE {conditions}"
            cursor.execute(sql, values)
            conn.commit()

        return jsonify({"success": True, "removed": row_to_remove})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500