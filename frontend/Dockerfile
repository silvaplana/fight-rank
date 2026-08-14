# ---- Étape 1 : "build" — compile l'app React avec Node ----
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# URL de l'API utilisée par le frontend une fois compilé : l'app est
# servie sous /fight-rank/ sur silvaplana.cloud (voir docker-compose.yml
# pour la valeur réelle), le Caddy "gateway" du VPS route ce chemin vers
# ce conteneur en retirant le préfixe (voir Caddyfile ci-dessous).
ARG VITE_API_URL=/fight-rank/api
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env.production

RUN npm run build

# ---- Étape 2 : image finale — juste Caddy + les fichiers statiques ----
FROM caddy:alpine

COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
