#!/bin/bash

create_files_in_dirs() {
	local directories=("$@")

	for dir in "${directories[@]}"; do
		if [ -d "$dir" ]; then
			cd $dir && mkdir -p migrations && cd migrations && touch __init__.py && cd ../..
			echo "Directory migrations created at $dir"
		else
			echo "Directory $dir does not exist!"
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
python3 manage.py check_pong_games
python3 manage.py reset_users_online_status

echo "Iniciando server..."
python3 manage.py runserver 0.0.0.0:8000
