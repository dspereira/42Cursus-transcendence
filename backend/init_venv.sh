#!/bin/bash

# create and activate venv (virtual environment)
python3 -m venv venv

# activate venv
source venv/bin/activate

pip3 install --upgrade pip3

# install dependencies of project
pip3 install -r requirements.txt