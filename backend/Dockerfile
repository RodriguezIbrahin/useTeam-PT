# Usamos Node.js LTS
FROM node:20-alpine

# Creamos directorio de trabajo
WORKDIR /usr/src/app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos todo el código
COPY . .

# Construimos el proyecto (NestJS)
RUN npm run build

# Exponemos el puerto
EXPOSE 3000

# Comando para correr la app
CMD ["npm", "run", "start"]
