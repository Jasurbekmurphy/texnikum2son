#!/usr/bin/env bash
# Admin panel serverini o'rnatish yoki yangilash (PocketBase + nginx + admin).
# Ishlatish:  bash /var/www/texnikum2son/setup-admin.sh
# Qayta ishga tushirsa bo'ladi: ma'lumotlar (yangiliklar, rasmlar) o'chmaydi.
set -euo pipefail

PB_VERSION=0.40.5
PB_DIR=/opt/texnikum-pb
PORT=8095
SITE=/var/www/texnikum2son
NGINX_SITE=/etc/nginx/sites-available/texnikum2son

[ "$(id -u)" = 0 ] || { echo "root sifatida ishga tushiring (sudo)"; exit 1; }

echo "1/5 Saytning eng so'nggi versiyasi olinmoqda..."
bash "$SITE/deploy-update.sh"

if ss -ltn | grep -q ":$PORT " && ! systemctl is-active --quiet texnikum-pb; then
  echo "$PORT-port boshqa dastur tomonidan band. Skriptdagi PORT ni o'zgartiring."
  exit 1
fi

echo "2/5 PocketBase $PB_VERSION o'rnatilmoqda..."
command -v unzip >/dev/null || apt-get install -y unzip >/dev/null
id pocketbase &>/dev/null || useradd --system --home-dir "$PB_DIR" --shell /usr/sbin/nologin pocketbase
mkdir -p "$PB_DIR"
if ! "$PB_DIR/pocketbase" --version 2>/dev/null | grep -q "$PB_VERSION"; then
  tmp=$(mktemp -d)
  curl -fsSL -o "$tmp/pb.zip" "https://github.com/pocketbase/pocketbase/releases/download/v$PB_VERSION/pocketbase_${PB_VERSION}_linux_amd64.zip"
  unzip -q -o "$tmp/pb.zip" pocketbase -d "$PB_DIR"
  rm -rf "$tmp"
fi
rm -rf "$PB_DIR/pb_migrations"
cp -r "$SITE/.server/pb_migrations" "$PB_DIR/"
chown -R pocketbase: "$PB_DIR"

echo "3/5 Xizmat (systemd) sozlanmoqda..."
cat > /etc/systemd/system/texnikum-pb.service <<UNIT
[Unit]
Description=texnikum2son.com admin panel (PocketBase)
After=network.target

[Service]
User=pocketbase
Group=pocketbase
ExecStart=$PB_DIR/pocketbase serve --http=127.0.0.1:$PORT --dir=$PB_DIR/pb_data --migrationsDir=$PB_DIR/pb_migrations --automigrate=false
Restart=always
RestartSec=3
LimitNOFILE=4096

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable -q texnikum-pb
systemctl restart texnikum-pb
for _ in $(seq 1 20); do curl -fs "http://127.0.0.1:$PORT/api/health" >/dev/null && break; sleep 0.5; done
curl -fs "http://127.0.0.1:$PORT/api/health" >/dev/null || { journalctl -u texnikum-pb -n 30 --no-pager; exit 1; }

echo "4/5 nginx sozlanmoqda..."
cat > /etc/nginx/snippets/texnikum-pb.conf <<NGINX
# texnikum2son.com admin panel: /api va /_/ PocketBase'ga uzatiladi
client_max_body_size 60m;
location ^~ /api/ {
    proxy_pass http://127.0.0.1:$PORT;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_read_timeout 300s;
}
location ^~ /_/ {
    proxy_pass http://127.0.0.1:$PORT;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
}
NGINX
grep -q "texnikum-pb.conf" "$NGINX_SITE" || sed -i "/root \/var\/www\/texnikum2son;/a\\    include snippets/texnikum-pb.conf;" "$NGINX_SITE"
nginx -t
systemctl reload nginx

echo "5/5 Admin akkaunti"
read -rp "Admin email: " EMAIL
while true; do
  read -rsp "Parol (kamida 10 belgi): " PASS; echo
  [ ${#PASS} -ge 10 ] && break
  echo "Parol juda qisqa."
done
sudo -u pocketbase "$PB_DIR/pocketbase" superuser upsert "$EMAIL" "$PASS" --dir="$PB_DIR/pb_data"

echo
echo "Tayyor! Admin panel: https://texnikum2son.com/admin/"
