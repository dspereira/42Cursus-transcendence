#!/bin/bash

VENVPATH="venv/bin/activate"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
YELLOW_BOLD='\033[1;33m'
NC='\033[0m'

print_sucess() {
	echo -e "${GREEN}Virtual environment activated. ${NC}"
}

print_warning() {
	echo -e "${YELLOW}WARNING: If virtual environment is not active run the command: ${YELLOW_BOLD}source activate_venv.sh ${NC}"
}

print_error() {
	echo -e "${RED}ERROR: Failed to activate the virtual environment. ${NC}"
}

if [ -f "$VENVPATH" ]; then
	if source "$VENVPATH"; then
		print_sucess
	else
		print_warning
		print_error
	fi
else
	print_error
fi
