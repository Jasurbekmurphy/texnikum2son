#!/usr/bin/env bash
# Serverda saytni yangilash: GitHub'dagi eng so'nggi build'ni oladi.
# Ishlatish:  sudo bash /var/www/texnikum2son/deploy-update.sh   (yoki pastdagi ikki buyruq)
set -euo pipefail
cd /var/www/texnikum2son
git fetch --depth 1 origin dist
git reset --hard origin/dist
echo "Sayt yangilandi: $(git log -1 --format='%h %cd' --date=format:'%Y-%m-%d %H:%M')"
