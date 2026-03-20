from flask import Flask, render_template, send_from_directory, request, redirect, url_for, jsonify, session, abort, Response, stream_with_context
import os
import sqlite3
from zoneinfo import ZoneInfo
from datetime import datetime
from threading import Thread
import json
import requests
import random

app = Flask(__name__, template_folder="templates")
app.secret_key = os.getenv("SECRET", "hola")
EXTERNAL_FILE = "data.json"
JSON_FILE = EXTERNAL_FILE
DB = 'database.db'
OUTPUT_DIR = "templates/ovo/"
GAME_PATH = "mobile/games/ovo/"
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
    cursor.execute("""CREATE TABLE IF NOT EXISTS code(
        code TEXT NOT NULL
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
@app.before_request
def before_request():
    if session.get("log_in") is None and request.endpoint not in ("login", "welcome", "first_time", "unlock", "static", "index", "s", "service_worker", "build_files", "serve_file", "images", "snowrider_build", "snowrider_template"):
        return redirect(url_for("login"))
@app.before_request
def log_request_info():
    ip = get_ip()
    if session.get("log_in") is None:
        with sqlite3.connect(DB) as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT OR IGNORE INTO ips (ip) VALUES (?)", (ip,))
            conn.commit()
        session.permanent = True
        session["logged_ip"] = True
@app.get('/')
def index():
    if session.get("log_in") is None:
        return redirect(url_for("login"))
    if session.get("admin") is not None:
        return render_template("home.html", admin=True)
    return render_template("home.html")
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method=="GET":
        if session.get("log_in") is None:
            return render_template("login/login.html")
        return redirect(url_for("index"))
    pin = request.get_json()["code"]
    if pin == "qwerty":
        session.permanent = True
        session["log_in"] = True
        return jsonify({"message": "Succesesfull login"}), 200
    elif pin == "0207":
        session.permanent = True
        session["log_in"] = True
        session["admin"] = True
        return jsonify({"message": "Succesesfull login"}), 200
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM code WHERE code = ?", (pin,))
        row = cursor.fetchone()
        if row is None:
            return jsonify({"message": "Incorrect password"}), 401
        session.permanent = True
        session["log_in"] = True
    return jsonify({"message": "Succesesfull login"}), 200
@app.get("/admin")
def admin():
    if session.get("admin") is not None:
        return render_template("admin/index.html")
    return "no permission"
@app.get("/current_code")
def current_code():
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT code FROM code LIMIT 1")
        row = cursor.fetchone()
        if row:
            return jsonify({"code": row[0]})
        return jsonify({"code": None})
@app.get("/backblue.gif")
def backblue_gif():
    return send_from_directory("templates/basket/", "backblue.gif")
@app.get("/fade.gif")
def fade_gif():
    return send_from_directory("templates/basket/", "fade.gif")
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
    session["ovo"] = True
    session["boxing"] = False
    session["basket"] = False
    session["smash"] = False
    game_folder = os.path.join(OUTPUT_DIR, "mobile/", "games/", "ovo/")
    filename = "game.html"
    full_path = os.path.join(game_folder, filename)
    if not os.path.exists(full_path):
        return f"File not found: {full_path}", 404
    return render_template("ovo/mobile/games/ovo/game.html")

# --- Catch-all static files in ovo ---

@app.post("/log_ip")
def log_ip():
    if session.get("logged_ip") is None:
        return redirect(url_for("login"))
    data = request.get_json()
    ip = get_ip()
    endpoint = data.get("endpoint", "unknown")
    if endpoint.startswith("/ovo"):
        game = "ovo"
    elif endpoint.startswith("/snowrider3d"):
        game = "snowrider3d"
    elif endpoint.startswith("/log_ip"):
        game = "log_ip"
    elif endpoint.startswith("/minecraft"):
        game = "minecraft"
    elif endpoint.startswith("/boxing"):
        game = "boxing"
    elif endpoint.startswith("/basket"):
        game = "basket"
    elif endpoint.startswith("/smash"):
        game = "smash_karts"
    elif endpoint.startswith("/2v2"):
        game = "2v2.io"
    else:
        game = "unknown"
        print(game)
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
@app.get("/smash")
def smash():
    session["smash"] = True
    session["boxing"] = False
    session["basket"] = False
    session["ovo"] = False
    session["2v2"] = False
    return send_from_directory("smash_karts/", "index.html")
@app.get("/boxing")
def boxingindex():
    session["boxing"] = True
    session["basket"] = False
    session["smash"] = False
    session["2v2"] = False
    return render_template("boxing/index.html")
@app.get("/basket")
def basket():
    session["boxing"] = False
    session["basket"] = True
    session["smash"] = False
    session["2v2"] = False
    return render_template("basket/files/games/other/Basket_Random/index.html")
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
    if session.get("first_time") is None:
        return render_template("welcome.html")
    return redirect(url_for("index"))
@app.get("/first-time")
def first_time():
    session.permanent = True
    session["first_time"] = True
    return redirect(url_for("index"))
from flask import make_response
@app.get("/s/<path:filename>")
def serve_static(filename):
    return send_from_directory("templates/2v2/s", filename)
@app.get("/sw.js")
def service_worker():
    if session.get("2v2") is False or session.get("2v2") is None:
        abort(404)
    return send_from_directory("templates/2v2/s", "sw.js")
BUILD_DIR = os.path.join(os.getcwd(), 'templates/2v2', 'Build')
CDN_BASE_URL = "https://splendid-kulfi-9ddf88.netlify.app/Build"

@app.route('/Build/<path:filename>')
def build_files(filename):
    if CDN_BASE_URL:
        # Proxy from CDN so clients never leave our domain.
        base = CDN_BASE_URL.rstrip("/")
        url = f"{base}/{filename}"
        resp = requests.get(url, stream=True)
        if resp.status_code != 200:
            return f"CDN fetch failed ({resp.status_code})", resp.status_code

        headers = {}
        for header in ("Content-Type", "Cache-Control", "Expires", "Last-Modified", "ETag"):
            if header in resp.headers:
                headers[header] = resp.headers[header]
        print("Proxied CDN request:", url)
        return Response(
            stream_with_context(resp.iter_content(chunk_size=8192)),
            headers=headers,
            status=resp.status_code,
            content_type=resp.headers.get("Content-Type"),
        )
@app.get("/basket/<path:path>")
def basket_files(path):
    return send_from_directory("templates/basket/files/games/other/Basket_Random", path)
@app.get("/2v2")
def io():
    session["2v2"] = True
    session["boxing"] = False
    session["basket"] = False
    session["smash"] = False
    return render_template("2v2/index.html")
@app.route("/<path:path>")
def serve_file(path: str):
    if ".." in path:
        return "Invalid path", 400

    # 🎮 2v2 (FIRST priority)
    if session.get("2v2") is True:
        base_dir = "templates/2v2"
        full_path = os.path.join(base_dir, path)

        if os.path.isfile(full_path):
            return send_from_directory(base_dir, path)

    # 🏀 Basket
    if session.get("basket") is True:
        base_dir = "templates/basket/files/games/other/Basket_Random"
        full_path = os.path.join(base_dir, path)

        if os.path.isfile(full_path):
            return send_from_directory(base_dir, path)

    # 🥊 Boxing
    if session.get("boxing") is True:
        base_dir = "templates/boxing"
        full_path = os.path.join(base_dir, path)

        if os.path.isfile(full_path):
            return send_from_directory(base_dir, path)

    # 🎮 Smash
    if session.get("smash") is True:
        base_dir = "smash_karts"
        full_path = os.path.join(base_dir, path)

        if os.path.isfile(full_path):
            return send_from_directory(base_dir, path)
    if session.get("ovo") is True:
        base_dir = "templates/ovo/mobile/games/ovo"
        full_path = os.path.join(base_dir, path)

        if os.path.isfile(full_path):
            return send_from_directory(base_dir, path)

    return "File not found", 404

def generate_code():
    """Genera un código aleatorio de 6 dígitos como string"""
    return f"{random.randint(0, 999999):06d}"
def update_code():
    """Actualiza el código en la base de datos cada 60 segundos"""
    while True:
        new_code = generate_code()
        with sqlite3.connect(DB) as conn:
            cursor = conn.cursor()
            # Si no hay fila, insertar; si hay, actualizar
            cursor.execute("SELECT COUNT(*) FROM code")
            if cursor.fetchone()[0] == 0:
                cursor.execute("INSERT INTO code (code) VALUES (?)", (new_code,))
            else:
                cursor.execute("UPDATE code SET code = ? WHERE rowid = 1", (new_code,))
            conn.commit()
        import time
        time.sleep(60)

Thread(target=update_code, daemon=True).start()
Thread(target=update_json, daemon=True).start()