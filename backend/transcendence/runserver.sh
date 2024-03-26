#!/bin/bash

if [ -z "$1" ]; then
    python3 manage.py runserver 8000
else
    python3 manage.py runserver $1
fi