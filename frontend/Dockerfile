# Usa la imagen base nginx:alpine
FROM nginx:alpine

# Copia los archivos estáticos a la carpeta de Nginx
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto 8080
EXPOSE 8080

# Arranca Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]