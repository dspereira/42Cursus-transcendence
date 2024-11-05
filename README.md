# ft_transcendence
This project is an integral part of the 42Lisboa curriculum and aims to create a web application that allows users to register, log in, add friends, chat, play Pong, and participate in tournaments.
In this project, we have the flexibility to choose from multiple modules to build the application. Detailed information about each module is available in the project’s subject. Below, there is a section listing all the chosen [modules](#modules).

For more info see the [subject](https://github.com/dspereira/42Cursus-transcendence/blob/improve-readme/en.subject.pdf).

## Table of Content
* [Application Architecture](#application-architecture)
* [Video Showcases](#video-showcases)
* [Installation / Usage](#installation--usage)
* [Makefile Commands](#makefile-commands)
* [Modules](#modules)
* [License](#license)

## Application Architecture
<img src="https://github.com/dspereira/42Cursus-transcendence/blob/improve-readme/architecture-schema.jpg" alt="Application Architecture" width="900"/>

## Video Showcases
### Register/Login
https://github.com/user-attachments/assets/b6433038-3eb9-46dc-8d08-fdc04155295f

### Friendships/Chat/Games
https://github.com/user-attachments/assets/e0450f30-1a60-464f-a25e-887bf9f038e8

### Tournaments
https://github.com/user-attachments/assets/c617ba59-7a98-489f-b513-617a737ac3ec

## Installation / Usage
Here you will find instructions to start this project in `Shell` for Unix systems.

This project runs on `Docker`. To use it, you need to install Docker. See the documentation [here](https://docs.docker.com/engine/install/).

### Clone repo:
```shell
git clone git@github.com:dspereira/42Cursus-transcendence.git transcendence && cd transcendence
```

### Setting Up Environment Variables:
Before running the project, create a `.env` file in the root directory and fill it with the required environment variables, as outlined in this [documentation](https://github.com/dspereira/42Cursus-transcendence/blob/improve-readme/env.md).
```shell
touch .env
```

### Build:
```shell
make
```

### Usage
You can access the app by navigating to `https://DOMAIN:PORT` (where `DOMAIN` and `PORT` are configured in the `.env` file).  
**Example:**  
`https://localhost:8443/`

Since we are using OpenSSL, your certificate is self-signed, which may trigger a privacy and security warning in your browser. If this occurs, you will need to click on the option to "accept and continue" or a similar prompt, depending on the browser you are using.

## Makefile Commands

### Docker Compose Setup and Management

- **`make all`**: Creates necessary directories and starts Docker Compose services in detached mode.
- **`make start`**: Starts Docker Compose services in detached mode.
- **`make stop`**: Stops Docker Compose services.
- **`make clean`**: Stops and removes all containers, images, and volumes created by Docker Compose.
- **`make clean-data`**: Performs `make clean` and deletes any associated data directories.
- **`make re`**: Executes a clean operation followed by starting Docker Compose services.
- **`make logs`**: Displays logs for all Docker Compose services.
- **`make logs-reverse-proxy`**: Shows logs specifically for the reverse proxy container.
- **`make logs-nginx`**: Shows logs for the SPA Nginx container.
- **`make logs-backend-django`**: Shows logs for the Django backend container.
- **`make logs-db`**: Shows logs for the database container.
- **`make info`**: Displays information about active Docker Compose services, Docker images, networks, and volumes.
- **`make update-backend`**: Restarts the Django backend container.
- **`make update-frontend`**: Restarts the SPA Nginx container.
- **`make update-reverse-proxy`**: Restarts the reverse proxy container.

### Interactive Shell Access

- **`make db-it`**: Opens an interactive shell session in the database container.
- **`make nginx-it`**: Opens an interactive shell session in the Nginx container.
- **`make backend-django-it`**: Opens an interactive shell session in the Django backend container.
- **`make reverse-proxy-it`**: Opens an interactive shell session in the reverse proxy container.

## Modules
### Major Modules
- [x] Django
- [x] Standart user management
- [x] Live Chat
- [x] Implement Two-Factor Authentication (2FA) and JWT
- [x] Remote players
- [x] Server side pong - API

### Minor Modules
- [x] Bootstrap
- [x] Database
- [x] Multi language support
- [x] Expanding Browser Compatibility

## License
This project is licensed under the [MIT License]().
