#!/usr/bin/env bash
# infra/deploy.sh
# Run on the EC2 instance from the app root (~/vivah-vedam) to ship a new version.
set -euo pipefail

echo "==> Pulling latest code"
git pull

echo "==> Installing dependencies"
npm ci

echo "==> Building"
npm run build

echo "==> Reloading PM2 (zero-downtime)"
pm2 reload vivah-vedam

echo "==> Done. Tail logs with: pm2 logs vivah-vedam"
