# Containers Names
DB		= postgres
ADMIN	= pgadmin4


# Docker Compose
COMPOSE		= sudo docker compose -f srcs/docker-compose.yml
DOCKER		= sudo docker

include srcs/.env

.SILENT:

all:
	sudo mkdir -p $(DB_VOLUME_DATA)
	$(COMPOSE) up -d

start:
	$(COMPOSE) up -d

stop:
	$(COMPOSE) stop

clean:
	$(COMPOSE) down --rmi all --volumes

# Careful! This command can remove data you don't want.
clean-data: clean
	sudo rm -rf $(DB_VOLUME_DATA)

re: clean all

logs:
	$(COMPOSE) logs

info:
	echo "-------------------------------------------------------------------------------------------------"
	$(COMPOSE) ps -a
	echo "-------------------------------------------------------------------------------------------------"
	$(DOCKER) images
	echo "-------------------------------------------------------------------------------------------------"
	$(DOCKER) network ls
	echo "-------------------------------------------------------------------------------------------------"
	$(DOCKER) volume ls
	echo "-------------------------------------------------------------------------------------------------"

db-it:
	$(DOCKER) exec -it $(DB) /bin/bash

admin-it:
	$(DOCKER) exec -it $(ADMIN) /bin/bash
