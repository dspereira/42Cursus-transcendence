#!/bin/bash

clear

if [ -z "$1" ]; then
    python3 manage.py runserver 8080
else
    python3 manage.py runserver $1
fi
