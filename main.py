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
def migrate():
    import traceback
    stop_event = threading.Event()

    try:
        while True:
            print("Migrating data...", flush=True)
            try:
                # --- Fetch requests from DB ---
                with sqlite3.connect(DB) as conn:
                    cursor = conn.cursor()
                    cursor.execute("SELECT * FROM requests")
                    request_rows = cursor.fetchall()
                    request_columns = [desc[0] for desc in cursor.description]
                    requests_data = [dict(zip(request_columns, row)) for row in request_rows]

                # --- Fetch IPs from DB ---
                with sqlite3.connect(DB) as conn:
                    cursor = conn.cursor()
                    cursor.execute("SELECT * FROM ips")
                    ip_rows = cursor.fetchall()
                    ip_columns = [desc[0] for desc in cursor.description]
                    ips_data = [dict(zip(ip_columns, row)) for row in ip_rows]

                # --- Combine into one JSON object ---
                full_data = {
                    "requests": requests_data,
                    "ips": ips_data
                }

                # --- Write to local file safely ---
                with open(EXTERNAL_FILE, 'w', encoding='utf-8') as f:
                    json.dump(full_data, f, indent=4)

                print(f"Migrated {len(requests_data)} requests and {len(ips_data)} IPs.")

                # --- Send to external endpoints ---
                try:
                    requests.post("https://managment-ujja.onrender.com/migrate-requests", json=full_data)
                except Exception as e:
                    print("Error sending requests:", e)
                    traceback.print_exc()

                # --- Wait before next migration ---
                stop_event.wait(5)

            except Exception as e:
                print("Error during migration loop:", e)
                traceback.print_exc()
                # time.sleep(10)  # wait a bit before retrying in case of DB or file error

    except KeyboardInterrupt:
        print("Migration stopped by user.")
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
@app.route("/remove-request", methods=["POST"])
def remove_request():
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
try:
    t = Thread(target=migrate, daemon=True)
    t.start()
except KeyboardInterrupt:
    print("Stopping server...")
    sys.exit()
except Exception as e:
    print("Error:", e)
    sys.exit()