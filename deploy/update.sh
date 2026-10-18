#!/usr/bin/env bash
# Serverda saytni yangilash: GitHub'dagi eng so'nggi build'ni oladi.
# Ishlatish:  sudo bash /var/www/texnikum2son/deploy-update.sh   (yoki pastdagi ikki buyruq)
set -euo pipefail
cd /var/www/texnikum2son
git fetch --depth 1 origin dist
git reset --hard origin/dist
echo "Sayt yangilandi: $(git log -1 --format='%h %cd' --date=format:'%Y-%m-%d %H:%M')"

# Admin panel o'rnatilgan bo'lsa, uning jadvallari va server kodini ham yangilaymiz
PB_DIR=/opt/texnikum-pb
if [ -d "$PB_DIR" ]; then
  changed=0
  for d in pb_migrations pb_hooks; do
    if [ -d ".server/$d" ] && ! diff -rq ".server/$d" "$PB_DIR/$d" >/dev/null 2>&1; then
      rm -rf "${PB_DIR:?}/$d"
      cp -r ".server/$d" "$PB_DIR/"
      chown -R pocketbase: "$PB_DIR/$d"
      changed=1
    fi
  done
  if [ "$changed" = 1 ]; then
    systemctl restart texnikum-pb
    echo "Admin panel yangilandi"
  fi
fi
