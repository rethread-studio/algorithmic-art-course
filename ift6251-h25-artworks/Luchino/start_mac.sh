#!/bin/bash

# Hardcode de la liste des dossiers
dossiers=("fool" "hex_grid" "hex_life" "météo²")

# Sélectionner un dossier au hasard
#dossier_choisi=$(echo "$dossiers" | shuf -n 1)
dossier_choisi=$(printf "%s\n" "${dossiers[@]}" | gshuf -n 1)

# Vérifier si un dossier a été trouvé
if [ -z "$dossier_choisi" ]; then
  echo "Aucun dossier trouvé dans le répertoire courant."
  exit 1
fi

# Se déplacer dans le dossier choisi
cd "$dossier_choisi" || exit

# Vérifier si le fichier index.html existe dans ce dossier
if [ ! -f "index.html" ]; then
  echo "Le fichier index.html n'a pas été trouvé dans le dossier $dossier_choisi."
  exit 1
fi

# Lancer la commande cmd.exe pour ouvrir index.html
echo "Lancement de la commande dans le dossier : $dossier_choisi"

# cmd.exe /c start "" index.html # pour windows
open index.html # pour mac OS
# xdg-open index.html # pour linux 

