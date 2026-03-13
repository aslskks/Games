import os

carpeta = "templates/ovo/"   # carpeta donde buscar
buscar = "images/dedraloader-sheet1.png"
reemplazar = "files/" + buscar

for root, dirs, files in os.walk(carpeta):
    for archivo in files:
        ruta = os.path.join(root, archivo)

        try:
            with open(ruta, "r", encoding="utf-8") as f:
                contenido = f.read()

            nuevo_contenido = contenido.replace(buscar, reemplazar)

            with open(ruta, "w", encoding="utf-8") as f:
                f.write(nuevo_contenido)

            print("Modificado:", ruta)

        except:
            # ignora archivos binarios o que no se puedan leer
            pass