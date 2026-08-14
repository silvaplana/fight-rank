# Déploiement sur le VPS (sivaplana.cloud/fight-rank)

## 1. Sur le VPS

```bash
git clone https://github.com/silvaplana/fight-rank.git
cd fight-rank
cp .env.example .env
# éditer .env : SECRET_KEY (chaîne aléatoire longue) + ALLOWED_ORIGINS=https://sivaplana.cloud
docker compose up -d --build
```

Ça démarre :
- `backend` (FastAPI, SQLite persisté dans un volume Docker) — pas exposé directement
- `frontend` (nginx) qui sert l'app sous `/fight-rank/` et proxy les appels API vers `backend` — publié sur le port hôte `8080`

## 2. Brancher le reverse proxy existant du VPS

Le reverse proxy du VPS doit juste transmettre tout ce qui commence par `/fight-rank/` vers `127.0.0.1:8080`, **sans réécrire le chemin**.

**Si nginx** (bloc à ajouter au `server {}` existant de sivaplana.cloud) :

```nginx
location /fight-rank/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    client_max_body_size 220m;
}
```

**Si Caddy** (dans le bloc `sivaplana.cloud { ... }`) :

```caddy
handle_path /fight-rank/* {
    reverse_proxy 127.0.0.1:8080
}
```
(avec `handle_path`, Caddy retire le préfixe — utiliser plutôt `handle /fight-rank/* { reverse_proxy 127.0.0.1:8080 }`, sans `_path`, pour garder `/fight-rank/` dans l'URL transmise, cohérent avec la conf nginx interne du conteneur frontend.)

Recharger le reverse proxy (`nginx -s reload` / `systemctl reload caddy`) puis tester https://sivaplana.cloud/fight-rank/.

## 3. Mises à jour

```bash
cd fight-rank
git pull
docker compose up -d --build
```

## Notes

- Les vidéos et la base SQLite vivent dans des volumes Docker nommés (`backend_data`, `backend_media`) — ils survivent aux rebuilds. Pense à les sauvegarder (`docker run --rm -v fight-rank_backend_data:/data ...`).
- Si le chemin de déploiement change un jour, adapter les `ARG VITE_BASE` / `VITE_API_BASE` dans `docker-compose.yml` et les blocs `location` dans `frontend/nginx.conf`.
