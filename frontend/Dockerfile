FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Built to be served from https://sivaplana.cloud/fight-rank/ by default.
# Override at build time (--build-arg) to deploy elsewhere.
ARG VITE_BASE=/fight-rank/
ARG VITE_API_BASE=/fight-rank
ENV VITE_BASE=$VITE_BASE
ENV VITE_API_BASE=$VITE_API_BASE
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html/fight-rank
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
