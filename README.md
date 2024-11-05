# ft_transcendence

## Table of Content
* [Application Architecture](#application-architecture)
* [Video Showcases](#video-showcases)
* [Installation / Usage](#installation--usage)
* [License](#license)

## Major Modules
- [x] Django
- [x] Standart user management
- [x] Live Chat
- [x] Implement Two-Factor Authentication (2FA) and JWT
- [x] Remote players
- [x] Server side pong - API

## Minor Modules
- [x] Bootstrap
- [x] Database
- [x] Multi language support
- [x] Expanding Browser Compatibility

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

## License
This project is licensed under the [MIT License]().
