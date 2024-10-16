#!/bin/bash

ERROR='\033[0;31m'
RESET='\033[0m'

if [ "$#" -eq 1 ]; then
	COMMAND="$1"
	psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "$COMMAND" >last_command_result.txt
	clear && cat last_command_result.txt
else
    echo -e "${ERROR}Invalid usage."
    echo -e "Usage: ./$0 [SQL_COMMAND]${RESET}"
    exit 1
fi
