from flask import Flask, render_template, send_from_directory, request, session, redirect, url_for
import sqlite3
from passlib.hash import argon2
import smtplib
import ssl
from email.message import EmailMessage
import os
import requests
from datetime import datetime, timedelta
from flask_wtf import CSRFProtect
from zoneinfo import ZoneInfo
app = Flask(__name__, template_folder="templates")
app.secret_key = "hola"
csrf = CSRFProtect(app)
DB = "database.db"
sender_email = "example901231@gmail.com"
app_password = os.getenv("GMAIL")
assert app_password != None, "app_password is None"
def get_db():
    conn = sqlite3.connect(DB, timeout=10)
    conn.row_factory = sqlite3.Row
    return conn, conn.cursor()
conn, cursor = get_db()
cursor.execute("""CREATE TABLE IF NOT EXISTS users(
    name TEXT NOT NULL,
    user TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    ip TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")
cursor.execute("""CReATE TABLE IF NOT EXISTS codes(
    user TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""")
cursor.execute("""CREATE TABLE IF NOT EXISTS token(
    user TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP
    )""")
conn.commit()
conn.close()
def get_ip_location(ip_address):
    # Example using ipinfo.io (free plan limited)
    response = requests.get(f"https://ipinfo.io/{ip_address}/json")
    if response.status_code == 200:
        data = response.json()
        city = data.get("city", "")
        region = data.get("region", "")
        country = data.get("country", "")
        return f"{city}, {region}, {country}"
    return "Unknown Location"
def recent_login(user,ip):
    body = open("templates\\htmls\\recent_login.html", "r").read()
    location = get_ip_location(ip)

    body = body.replace("{{LOGIN_TIME}}", str(datetime.now(ZoneInfo("America/Mexico_City"))))
    body = body.replace("{{IP_ADDRESS}}", ip)
    body = body.replace("{{LOCATION}}", location)

    msg = EmailMessage()
    msg.set_content(body, subtype="html")

    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()

        cursor.execute(
            "SELECT email FROM users WHERE user = ? OR email = ?",
            (user, user)
        )

        result = cursor.fetchone()

        if result is None:
            return

        receiver = result[0]

    msg['Subject'] = "Recent Login"
    msg['From'] = sender_email
    msg['To'] = receiver

    try:
        context = ssl.create_default_context()

        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(sender_email, app_password)
            server.send_message(msg)

    except Exception as e:
        print(f"Error: {e}")

def send_forgot(user):
    body = open("templates\\htmls\\forgot_email.html").read()
    code = os.urandom(16).hex()
    body=body.replace("{{RESET_LINK}}","https://games-8upn.onrender.com/reset/" + code)
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM codes WHERE user = ? OR email = ?", (user,user))
        cursor.execute("SELECT email FROM users WHERE user = ? OR email = ?", (user,user))
        row = cursor.fetchone()
        cursor.execute("INSERT INTO codes (user, email, code, created_at) VALUES (?, ?, ?, ?)", (user, user,code, datetime.now(ZoneInfo("America/Mexico_City"))))
        conn.commit()
        if row is None:
            return ""
        receiver = row[0]
    msg = EmailMessage()
    msg.set_content(body,subtype="html")
    msg['Subject'] = "Password Reset"
    msg['From'] = sender_email
    msg['To'] = receiver
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(sender_email, app_password)
            server.send_message(msg)
    except smtplib.SMTPAuthenticationError:
        raise smtplib.SMTPAuthenticationError
    except Exception:
        raise Exception
public_dom = ["login", "register", "static", "assets", "uploads", "logout", "forgot", "reset", "reset_post", "index"]
@app.before_request
def require_login():
    if request.endpoint and "user" not in session and request.endpoint not in public_dom:
        print(request.endpoint)
        return redirect(url_for("login"))
@app.before_request
def verify_session():
    if request.endpoint not in public_dom:
        token = session.get("user")
        with sqlite3.connect(DB) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT created_at FROM token WHERE token = ?", (token,))
            row = cursor.fetchone()
            if row is not None:
                if datetime.fromisoformat(row[0]).replace(tzinfo=ZoneInfo("America/Mexico_City")) + timedelta(days=30) < datetime.now(ZoneInfo("America/Mexico_City")):
                    cursor.execute("DELETE FROM token WHERE token = ?", (token,))
                    session.clear()
            else:
                session.clear()
@app.route("/forgot", methods=["GET", "POST"])
def forgot():
    if request.method == "GET":
        return render_template("htmls//forgot.html")
    email = request.form.get("email")
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM codes WHERE email = ?", (email,))
        conn.commit()
    send_forgot(email)
    return redirect(url_for("index"))
@app.get("/reset/<code>")
def reset(code):
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM codes WHERE code = ?", (code,))
        row = cursor.fetchone()
        if row is None:
            return render_template("htmls/invalid.html")
        cursor.execute("SELECT created_at FROM codes WHERE code = ?", (code,))
        row = cursor.fetchone()[0]
        row = datetime.fromisoformat(row).replace(tzinfo=ZoneInfo("America/Mexico_City"))
        if row + timedelta(hours=1) <= datetime.now(ZoneInfo("America/Mexico_City")):
            cursor.execute("DELETE FROM codes WHERE code = ?", (code,))
            return render_template("htmls/invalid.html")
    return render_template("htmls/reset.html", code=code)

@app.post("/reset")
def reset_post():
    password = request.form.get("password")
    code = request.form.get("code")
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT user FROM codes WHERE code = ?", (code,))
        row = cursor.fetchone()
        if not row:
            return render_template("htmls/invalid.html")
        user = row[0]
        cursor.execute("SELECT created_at FROM codes WHERE code= ?", (code,))
        row = cursor.fetchone()
        cursor.execute("DELETE FROM codes WHERE code = ?", (code,))
        password_hash = argon2.hash(password)
        cursor.execute("UPDATE users SET password_hash = ? WHERE user = ?", (password_hash, user))
    return redirect(url_for("index"))
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "GET":
        return render_template("login/register.html")

    name = request.form.get("name")
    email = request.form.get("email")
    user = request.form.get("user")
    ip = request.form.get('ip')
    password = request.form.get("password")
    password_hash = argon2.hash(password)

    with sqlite3.connect(DB, timeout=10) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM users WHERE user = ?", (user,))
        if cursor.fetchone():
            return {"status": "error", "message": "User already exists"}, 200
        cursor.execute("SELECT 1 FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            return {"status": "error", "message": "Email already exists"}, 200
        cursor.execute(
            "INSERT INTO users (name, user, email, password_hash, ip) VALUES (?, ?, ?, ?, ?)",
            (name, user, email, password_hash, ip)
        )
        conn.commit()

    return {"status": "success", "message": "Account created successfully!"}, 200
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        if "user" not in session:
            return render_template("login/login.html")
        return redirect(url_for("index"))
    emailoruser = request.form.get("email")
    password = request.form.get("password")
    remember = request.form.get("remember")
    ip = request.form.get("ip")
    with sqlite3.connect(DB, timeout=10) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT password_hash FROM users WHERE email = ?", (emailoruser,))
        result = cursor.fetchone()
        if result is None:
            cursor.execute("SELECT password_hash FROM users WHERE user = ?", (emailoruser,))
            result = cursor.fetchone()
            if result is None:
                return {"status": "error", "message": "Invalid Credentials"}
        if argon2.verify(password, result[0]):
            recent_login(emailoruser, ip)
            session.permanent = True if remember else False
            cursor.execute("SELECT user FROM users WHERE email = ? OR user = ?", (emailoruser,emailoruser))
            user = cursor.fetchone()[0]
            token = os.urandom(64).hex()
            cursor.execute("INSERT INTO token (user, token, created_at) VALUES (?, ?, ?)", (user, token, datetime.now(ZoneInfo("America/Mexico_City"))))
            session["user"] = token
            return {"status": "success", "message": "Login Successfully"}, 200
        return {"status": "error", "message":"Invalid Credentials"}
@app.get("/logout")
def logout():
    token = session.get("user")
    with sqlite3.connect(DB) as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM token WHERE token = ?", (token,))
        conn.commit()
    session.clear()
    return redirect(url_for("index", logout=True))
@app.get("/snowrider3d")
def snowrider():
    return render_template("snowrider3d/snowrider3d.html")
@app.get("/ovo")
def ovo():
    # Live URL or local file
    url = "https://www.hoodamath.com/mobile/games/ovo/game.html"
    return render_template("ovo/game.html", url=url)
@app.get("/minecraft")
def minecraft():
    return render_template("eaglecraft/index.html")
@app.get("/ovo/uploads/2025/5/ovo-favicon.jpg")
def ovo_favicon():
    return send_from_directory("templates/ovo/uploads/2025/5/", "ovo-favicon.png")
@app.post("/search")
def search():
    web = request.form.get("name")
    return render_template("ovo/game.html", url=web)
@app.get("/images/<name>")
def images(name):
    if name == "snowrider3d.jpg":
        return send_from_directory("templates/snowrider3d/TemplateData/", "logo.png")
    else:
        return send_from_directory("templates/eaglecraft/", "logo.jpg")
# --- Static files for SnowRider3D ---
@app.get("/snowrider3d/Build/<path:name>")
def snowrider_build(name):
    return send_from_directory("templates/snowrider3d/Build", name)
@app.get("/snowrider3d/TemplateData/<path:name>")
def snowrider_template(name):
    return send_from_directory("templates/snowrider3d/TemplateData", name)

@app.get("/ovo_files/<path:name>")
def ovo_files(name):
    return send_from_directory("templates/ovo/", name)
@app.get("/")
def index():
    if "user" not in session:
        return render_template("login/login.html")
    return render_template("home.html")
@app.get("/<dir>/<name>")
def p3(dir, name):
    if dir == "static" or "css" in name:
        return send_from_directory("templates/" + dir, name)
    return send_from_directory("templates/ovo/" + dir, name)
app.run(debug=True, host="0.0.0.0")