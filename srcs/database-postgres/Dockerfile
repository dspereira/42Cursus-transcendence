FROM postgres:17

RUN mkdir -p /scripts
COPY scripts/* /scripts
RUN chmod +x scripts/*

EXPOSE 5432

WORKDIR /scripts
