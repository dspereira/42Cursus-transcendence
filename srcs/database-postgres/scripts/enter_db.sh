#!/bin/bash

check_env_vars() {
    local missing_vars=()

    [ -z "$POSTGRES_USER" ] && missing_vars+=("POSTGRES_USER")
    [ -z "$POSTGRES_DB" ] && missing_vars+=("POSTGRES_DB")

    if [ ${#missing_vars[@]} -ne 0 ]; then
        echo -e "Missing some enviromental variables:\n${missing_vars[*]}"
        return 1
    fi

    return 0
}

check_env_vars

if [ $? -ne 0 ]; then
    exit 1 # Sai com código 1 se houver variáveis faltando
fi

psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
