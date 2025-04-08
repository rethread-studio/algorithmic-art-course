#!/bin/bash

cd "$(dirname "$0")"

# Cherche les index.html dans les dossiers nommés oeuvre*
files=($(find . -type f -path "./Oeuvre*/index.html"))

# Vérifie qu'il y en a
if [ ${#files[@]} -eq 0 ]; then
  echo "Aucune œuvre trouvée (index.html manquant ?)"
  exit 1
fi

# Choisit un au hasard
random_file=${files[RANDOM % ${#files[@]}]}
echo "→ Lancement de : $random_file"

# cmd.exe /c start "" index.html # pour windows
# Ouvre dans le navigateur (macOS)
open "$random_file"
# xdg-open index.html # pour linux 