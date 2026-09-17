#!/usr/bin/env bash
# infra/setup-ec2.sh
# Run once on a fresh Ubuntu 24.04 EC2 instance (as the `ubuntu` user):
#   curl -fsSL https://raw.githubusercontent.com/<you>/vivah-vedam/main/infra/setup-ec2.sh | bash
# or copy the repo up first and run it locally: bash infra/setup-ec2.sh
set -euo pipefail

echo "==> Updating packages"
sudo apt-get update -y
sudo apt-get upgrade -y

echo "==> Installing Node.js 20 LTS"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "==> Installing nginx, git, postgresql-client, certbot"
sudo apt-get install -y nginx git postgresql-client certbot python3-certbot-nginx

echo "==> Installing PM2"
sudo npm install -g pm2

mkdir -p ~/logs

echo ""
echo "Base packages installed. Next steps (see AWS_DEPLOYMENT.md):"
echo "  1. git clone your repo, or scp the project up, into ~/vivah-vedam"
echo "  2. cd ~/vivah-vedam && npm ci"
echo "  3. Create .env.production.local with DATABASE_URL / JWT_SECRET / etc."
echo "  4. npm run db:migrate   (once, against your RDS instance)"
echo "  5. npm run build"
echo "  6. pm2 start infra/ecosystem.config.js && pm2 save && pm2 startup"
echo "  7. sudo cp infra/nginx.conf /etc/nginx/sites-available/vivah-vedam"
echo "     sudo ln -s /etc/nginx/sites-available/vivah-vedam /etc/nginx/sites-enabled/"
echo "     sudo rm -f /etc/nginx/sites-enabled/default"
echo "     sudo nginx -t && sudo systemctl reload nginx"
echo "  8. sudo certbot --nginx -d your-domain.com -d www.your-domain.com"
