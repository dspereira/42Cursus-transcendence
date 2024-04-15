# Containers Names
DB		= postgres
ADMIN	= pgadmin4
NGINX	= nginx-server


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
	$(COMPOSE) down -v
	$(DOCKER) image rm $(NGINX)

# Careful! This command can remove data you don't want.
clean-data: 
	$(COMPOSE) down --rmi all --volumes
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

nginx-it:
	$(DOCKER) exec -it $(NGINX) /bin/bash
