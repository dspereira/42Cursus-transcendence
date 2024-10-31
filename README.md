# ft_transcendence

## Table of Content

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


## Installation / Usage
Here you will find instructions to start this project in `Shell` for Unix systems and `PowerShell` for Windows systems.

This project runs on `Docker`. To use it, you need to install Docker. See the documentation [here](https://docs.docker.com/engine/install/).

### Clone repo:
Shell:
```shell
git clone git@github.com:dspereira/42Cursus-transcendence.git transcendence && cd transcendence
```

PowerShell:
```shell
git clone git@github.com:dspereira/42Cursus-transcendence.git transcendence; cd transcendence
```

### Setting Up Environment Variables:
Before running the project, create a .env file in the root directory and populate it with the required environment variables, following the [.env.template](https://github.com/dspereira/42Cursus-transcendence/blob/main/.env_template) as a guide.

Shell:
```shell
touch .env
```

PowerShell:
```shell
New-Item -Path .env -ItemType File
```

### Build:

Shell:
```shell
make
```

PowerShell:
```shell
docker compose -f docker-compose.yml up -d --build
```

## License

This project is licensed under the [MIT License]().
