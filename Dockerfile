# Usa la imagen base oficial de Python slim
FROM python:3.12-slim

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo requirements.txt desde tu maquina local al contenedor
COPY requirements.txt .

# Instala las dependencias especificadas en requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo el código de la aplicación al contenedor
COPY . .

# Expone el puerto 8080
EXPOSE 8080

# Comando para ejecutar la aplicación FastAPI
# Ajusta main:app si tu punto de entrada es diferente
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
