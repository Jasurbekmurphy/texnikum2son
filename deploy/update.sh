#!/usr/bin/env bash
# Serverda saytni yangilash: GitHub'dagi eng so'nggi build'ni oladi.
# Ishlatish:  sudo bash /var/www/texnikum2son/deploy-update.sh   (yoki pastdagi ikki buyruq)
set -euo pipefail
cd /var/www/texnikum2son
git fetch --depth 1 origin dist
git reset --hard origin/dist
echo "Sayt yangilandi: $(git log -1 --format='%h %cd' --date=format:'%Y-%m-%d %H:%M')"

# Admin panel o'rnatilgan bo'lsa, uning jadvallarini ham yangilaymiz
PB_DIR=/opt/texnikum-pb
if [ -d "$PB_DIR" ] && ! diff -rq .server/pb_migrations "$PB_DIR/pb_migrations" >/dev/null 2>&1; then
  rm -rf "$PB_DIR/pb_migrations"
  cp -r .server/pb_migrations "$PB_DIR/"
  chown -R pocketbase: "$PB_DIR/pb_migrations"
  systemctl restart texnikum-pb
  echo "Admin panel jadvallari yangilandi"
fi
