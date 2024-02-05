#!/bin/bash

# create and activate venv (virtual environment)
python3 -m venv venv

# activate venv
source venv/bin/activate

# install dependencies of project
pip3 install -r requirements.txt