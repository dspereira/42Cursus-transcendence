#!/bin/bash

ERROR='\033[0;31m'
RESET='\033[0m'

if [ "$#" -eq 1 ]; then
	TABLE="$1"
	if psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\dt" | grep -q "$TABLE"; then
		psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT * FROM $TABLE;" >last_view.txt
		clear && cat last_view.txt
	else
		echo -e "${ERROR}Table '$TABLE' does not exist.${RESET}"
		exit 1
	fi
else
	psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\dt" >all_tables.txt
	clear && cat all_tables.txt
fi
