#!/bin/sh

# Detectar OS
OS="$(uname -s)"

# Comando base
CMD="docker compose up -d --build"

# Si es Linux => usar sudo
if [ "$OS" = "Linux" ]; then
  echo "Detectado Linux → usando sudo"
  sudo sh -c "$CMD"
else
  echo "Detectado $OS → ejecutando sin sudo"
  sh -c "$CMD"
fi
