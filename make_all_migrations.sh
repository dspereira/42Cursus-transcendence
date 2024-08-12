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

cd backend || exit
source ./venv/bin/activate || exit

cd ..
bash delete_all_migrations.sh -y || exit

cd backend/transcendence || exit

dirs=("live_chat/" "two_factor_auth/" "friendships/" "user_profile/" "notifications/" "user_auth/" "tournament/" "game/")
create_files_in_dirs "${dirs[@]}"

pwd

python3 manage.py makemigrations
python3 manage.py migrate

deactivate || exit
cd ../.. || exit
