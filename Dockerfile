# 1) Instalar dependencias (capa cacheable)
FROM node:20-alpine AS deps
WORKDIR /app
# Copiamos solo los manifests para aprovechar cache
COPY package*.json ./
# Usa npm ci para builds reproducibles
RUN npm ci

# 2) Build de Angular
FROM node:20-alpine AS builder
WORKDIR /app
# Reutilizamos node_modules de la etapa deps
COPY --from=deps /app/node_modules ./node_modules
# Copiamos el resto del código fuente (incluye src/, angular.json, tsconfigs, etc.)
COPY . .
# Compila en modo prod (ajusta si tu script ya usa --configuration)
RUN npm run build -- --configuration production

FROM nginx:1.23.3 AS prod
# Limpia el html por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copia TU config (con try_files … /index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ⚠️ Copiar el CONTENIDO de browser/ a la raíz (nota el slash final)
COPY --from=builder /app/dist/prot3/browser/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]