# Déploiement sur le VPS (silvaplana.cloud/fight-rank)

Ce projet suit le même pattern que `test-python` sur le VPS : un Caddy
"gateway" partagé (`~/gateway`, hors de ce repo) possède le domaine et le
HTTPS, et route `/fight-rank/*` vers le conteneur `fight-rank-frontend` via
le réseau Docker externe `web`. Ce projet ne publie aucun port lui-même.

## 1. Sur le VPS

```bash
cd ~
git clone https://github.com/silvaplana/fight-rank.git
cd fight-rank
cp .env.example .env
# éditer .env : SECRET_KEY (chaîne aléatoire longue)
docker compose up -d --build
```

(Le réseau `web` existe déjà — créé pour `test-python`.)

## 2. Ajouter la route dans le gateway

Dans `~/gateway/Caddyfile`, ajouter un bloc à côté de celui de
`/sambo-admin` :

```caddy
redir /fight-rank /fight-rank/ 308
handle_path /fight-rank/* {
	reverse_proxy fight-rank-frontend:80
}
```

Puis recharger sans coupure :

```bash
cd ~/gateway
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile
```

Tester ensuite https://silvaplana.cloud/fight-rank/.

## 3. Mises à jour

```bash
cd ~/fight-rank
git pull
docker compose up -d --build
```

## Notes

- Vidéos et base SQLite vivent dans des volumes Docker nommés
  (`fight-rank_backend_data`, `fight-rank_backend_media`) — ils survivent aux
  rebuilds.
- `SECRET_KEY` (dans `.env`, jamais commité) sert à signer les tokens de
  connexion : le changer déconnecte tout le monde.
