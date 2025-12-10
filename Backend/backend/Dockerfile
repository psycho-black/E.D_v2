 # Usamos una imagen oficial de Node.js (versión 18)
FROM node:18-slim

# Creamos y definimos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos el package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalamos las dependencias del proyecto
RUN npm install

# Copiamos el resto del código fuente de la aplicación
COPY . .

# Exponemos el puerto en el que correrá la aplicación
EXPOSE 8080

# El comando para iniciar la aplicación
CMD [ "npm", "start" ]