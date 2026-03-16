from flask import Flask, render_template, send_from_directory, request, redirect, url_for, jsonify, session
import os
import sqlite3
from zoneinfo import ZoneInfo
from datetime import datetime
from threading import Thread
import json
import requests

app = Flask(__name__, template_folder="templates")
app.secret_key = os.getenv("SECRET", "hola")
EXTERNAL_FILE = "data.json"
JSON_FILE = EXTERNAL_FILE
DB = 'database.db'
OUTPUT_DIR = "templates/ovo/"
GAME_PATH = "mobile/games/ovo/"
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE="Strict"
)
def get_ip():
    return request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
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
    cursor.execute("""CREATE TABLE IF NOT EXISTS views(
        ip TEXT NOT NULL,
        game TEXT NOT NULL
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
    return render_template("eaglecraft/" + "index.html")

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
    views_data = all_data.get("views", [])

    user_count = len(ips_data)

    return render_template(
        "requests.html",
        data=requests_data,
        views=views_data,
        user_count=user_count
    )
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
    game_folder = os.path.join(OUTPUT_DIR, "mobile/", "games/", "ovo/")
    filename = "game.html"
    full_path = os.path.join(game_folder, filename)
    if not os.path.exists(full_path):
        return f"File not found: {full_path}", 404
    return render_template(full_path [len("templates/"):])

# --- Catch-all static files in ovo ---

@app.post("/log_ip")
def log_ip():
    data = request.get_json()
    ip = "ok"
    endpoint = data.get("endpoint", "unknown")
    if endpoint.startswith("/ovo"):
        game = "ovo"
    elif endpoint.startswith("/snowrider3d"):
        game = "snowrider3d"
    elif endpoint.startswith("/log_ip"):
        game = "log_ip"
    elif endpoint.startswith("/minecraft"):
        game = "minecraft"
    else:
        game = "unknown"
    with sqlite3.connect(DB) as conn:
        if game != "log_ip" and game != "unknown" and endpoint != "/see":
            cursor = conn.cursor()
            cursor.execute("INSERT INTO views (ip, game) VALUES (?, ?)", (ip, game))
            conn.commit()
    if session.get("logged_ip") is None:
        try:
            with sqlite3.connect(DB) as conn:
                cursor = conn.cursor()
                cursor.execute("INSERT INTO ips (ip) VALUES (?)", (ip,))
                conn.commit()
            session.permanent = True
            session["logged_ip"] = True
        except:
            session.permanent = True
            session["logged_ip"] = True
    return jsonify({"success": True})
@app.post("/remove-request/<int:index>")
def remove_request(index):
    all_data = load_json()
    requests_list = all_data.get("requests", [])

    if index < 0 or index >= len(requests_list):
        return jsonify({"success": False, "error": "Invalid index"})

    row = requests_list[index]

    # Send to external server
    try:
        response = requests.post(url_for("remove", _external=True), json=row)
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
    return redirect(url_for('see'))

@app.route("/removerequest", methods=["POST"])
def remove():
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
@app.get("/views")
def views():
    with open(EXTERNAL_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    views_data = data.get("views", [])
    return jsonify(views_data)
def update_json():
    while True:
        with sqlite3.connect(DB) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM requests")
            columns = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()
            requests_data = [dict(zip(columns, row)) for row in rows]
            cursor.execute("SELECT * FROM ips")
            columns = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()
            ips_data = [dict(zip(columns, row)) for row in rows]
            cursor.execute("SELECT * FROM views")
            columns = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()
            views_data = [dict(zip(columns, row)) for row in rows]
        full_data = {
            "requests": requests_data,
            "ips": ips_data,
            "views": views_data
        }

        with open(EXTERNAL_FILE, 'w') as file:
            json.dump(full_data, file, indent=4)
        import time
        time.sleep(5)
@app.get("/unlock")
def unlock():
    if session.get("first_time") is None:
        print("First time visitor")
        return redirect(url_for("welcome"))
    return "ok"
@app.get("/welcome")
def welcome():
    return render_template("welcome.html")
@app.get("/first-time")
def first_time():
    session.permanent = True
    session["first_time"] = True
    return redirect(url_for("index"))
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
    [print("File not found:", full_path)]
    return "File not found", 404
@app.get("/<path>")
def catch_all(path):
    game_folder = os.path.join(OUTPUT_DIR, GAME_PATH)
    full_path = os.path.normpath(os.path.join(game_folder, path))
    if os.path.isfile(full_path):
        directory = os.path.dirname(full_path)
        filename = os.path.basename(full_path)
        return send_from_directory(directory, filename)
    print("Unknown path:", game_folder)
    return "Page not found", 404
Thread(target=update_json, daemon=True).start()
app.run(debug=True)