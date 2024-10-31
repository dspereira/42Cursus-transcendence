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
Here you will find instructions to start this project in `Shell` for Unix systems.

This project runs on `Docker`. To use it, you need to install Docker. See the documentation [here](https://docs.docker.com/engine/install/).

### Clone repo:
```shell
git clone git@github.com:dspereira/42Cursus-transcendence.git transcendence && cd transcendence
```

### Setting Up Environment Variables:
Before running the project, create a .env file in the root directory and populate it with the required environment variables, following the [.env.template](https://github.com/dspereira/42Cursus-transcendence/blob/main/.env_template) as a guide.
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
