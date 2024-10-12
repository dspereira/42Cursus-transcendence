FROM debian:stable

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y python3 python3-pip python3-venv

RUN mkdir -p app/
WORKDIR /app/

COPY transcendence transcendence/
COPY bot_images bot_images/
COPY requirements.txt .
COPY init_venv.sh .
COPY activate_venv.sh .
COPY run.sh .

RUN chmod +x init_venv.sh activate_venv.sh run.sh

RUN ./init_venv.sh
RUN bash -c "source activate_venv.sh"

EXPOSE 8000

CMD ["./run.sh"]
