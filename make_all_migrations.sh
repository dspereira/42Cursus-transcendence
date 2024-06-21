#!/bin/bash

cd backend || exit
source ./venv/bin/activate || exit

cd transcendence || exit
python3 manage.py makemigrations
python3 manage.py migrate

deactivate || exit
cd ../.. || exit
