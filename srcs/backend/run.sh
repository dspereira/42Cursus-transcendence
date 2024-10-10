#!/bin/bash

create_files_in_dirs() {
	local directories=("$@")

	for dir in "${directories[@]}"; do
		if [ -d "$dir" ]; then
			cd $dir && mkdir migrations && cd migrations && touch __init__.py && cd ../..
			echo "Directory migrations created at $dir"
		else
			echo "Directory $dir does not exist!"
		fi
	done
}

delete_all_migrations() {
    for dir in $(find transcendence -type d -name "migrations"); do
        if confirm "Do you want to check the contents of $dir?"; then
            if $auto_confirm || confirm "Do you want to delete the directory $dir and all its contents?"; then
                rm -rf "$dir"
                echo "$dir" >> "$deleted_dirs"
            fi
        fi
    done
}

source ./venv/bin/activate || exit

cd transcendence || exit

dirs=("live_chat/" "two_factor_auth/" "friendships/" "user_profile/" "user_auth/" "tournament/" "user_settings/" "game/")
create_files_in_dirs "${dirs[@]}"

python3 manage.py makemigrations
python3 manage.py migrate

python3 manage.py create_blitzpong_bot
python3 manage.py getCriptographerKeys

echo "Iniciando server..."
python3 manage.py runserver 0.0.0.0:8000
