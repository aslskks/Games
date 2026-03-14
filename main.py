from flask import Flask, render_template, send_from_directory, request

app = Flask(__name__, template_folder="templates")

# --- Game pages ---
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
@app.get("/snowrider3d")
def snow():
    return render_template("snowrider3d/snowrider3d.html")
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
@app.get("/<name>")
def p4(name):
    return send_from_directory("templates/ovo/", name)
@app.get("/")
def index():
    return render_template("home.html")
@app.get("/<dir>/<name>")
def p3(dir, name):
    return send_from_directory("templates/ovo/" + dir, name)
app.run(debug=True, host="0.0.0.0")