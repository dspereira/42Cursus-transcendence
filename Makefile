# Containers Names
DB		= postgres
ADMIN	= pgadmin4
NGINX	= nginx-server
REVERSE_PROXY = reverse-proxy
BACKEND_DJANGO = backend-django

# Docker Compose
COMPOSE		= sudo docker compose -f srcs/docker-compose.yml
DOCKER		= sudo docker

include srcs/.env

.SILENT:

all:
	$(MAKE) start

start:
	$(COMPOSE) up -d --build

stop:
	$(COMPOSE) stop

clean:
	$(COMPOSE) down -v

# Careful! This command can remove data you don't want.
clean-data: 
	$(COMPOSE) down --rmi all --volumes

re: clean all

update-reverse-proxy:
	$(COMPOSE) stop $(REVERSE_PROXY)
	$(COMPOSE) rm -v -f $(REVERSE_PROXY)
	$(COMPOSE) build $(REVERSE_PROXY)
	$(COMPOSE) up -d $(REVERSE_PROXY)

update-frontend:
	$(COMPOSE) stop $(NGINX)
	$(COMPOSE) rm -v -f $(NGINX)
	$(COMPOSE) build $(NGINX)
	$(COMPOSE) up -d $(NGINX)

update-backend:
	$(COMPOSE) stop $(BACKEND_DJANGO)
	$(COMPOSE) rm -v -f $(BACKEND_DJANGO)
	$(COMPOSE) build $(BACKEND_DJANGO)
	$(COMPOSE) up -d $(BACKEND_DJANGO)

logs:
	-@$(COMPOSE) logs -f

logs-reverse-proxy:
	@$(COMPOSE) logs -f $(REVERSE_PROXY)

logs-nginx:
	-@$(COMPOSE) logs -f $(NGINX)

logs-backend-django:
	-@$(COMPOSE) logs -f $(BACKEND_DJANGO)

logs-db:
	-@$(COMPOSE) logs -f $(DB)

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

backend-django-it:
	$(DOCKER) exec -it $(BACKEND_DJANGO) /bin/bash

reverse-proxy-it:
	$(DOCKER) exec -it $(REVERSE_PROXY) /bin/bash
