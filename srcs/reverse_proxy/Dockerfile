FROM nginx

RUN apt update -y
RUN apt install openssl -y

RUN mkdir -p /etc/nginx/certs/
RUN openssl req \
-x509 \
-nodes \
-days 365 \
-newkey rsa:2048 \
-keyout /etc/nginx/certs/nginx-selfsigned.key \
-out /etc/nginx/certs/nginx-selfsigned.crt \
-subj "/C=PT/L=Lisbon/O=42 Lisboa/CN=localhost"

RUN rm /etc/nginx/conf.d/default.conf
COPY ./conf/nginx.conf /etc/nginx/conf.d/

CMD ["nginx", "-g", "daemon off;"]
