#!/bin/bash

VENV_DIR="venv"

if [ -d $VENV_DIR ]; then
    rm -rf $VENV_DIR
fi

# create and activate venv (virtual environment)
python3 -m venv venv

# activate venv
source venv/bin/activate

pip3 install --upgrade pip

# install dependencies of project
pip3 install -r requirements.txt
