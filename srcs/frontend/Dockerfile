FROM nginx


RUN apt update -y
RUN apt install openssl -y

RUN mkdir -p /etc/nginx/certs/

#	req				specifies that we want to use X.509 certificate signing request (CSR) managment
#					X.590 is a public key infrastructure standard that SSL and TLS adheres to
#	-x509:			with [req] it specifies that we want a selfsigned certificate instead of generating a CSR
#	-nodes:			tells openssl to skip the option to put a passphrase on the certificate, so nginx can read the file without user intervention
#	-days 365:		amount of time the certificate is valid for
#	-newkey rsa:	2048 creates a key that is 2048 bits long
#	-keyout:		where to place the private key file we are creating
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
-keyout /etc/nginx/certs/nginx-selfsigned.key \
-out /etc/nginx/certs/nginx-selfsigned.crt \
-subj "/C=PT/L=Lisbon/O=42 Lisboa/CN=ralves-g.42.fr"
# COPY ./app/ /usr/share/nginx/html/app/


RUN rm /etc/nginx/conf.d/default.conf
COPY ./conf/nginx.conf /etc/nginx/conf.d/

RUN mkdir -p /usr/share/nginx/html/app


# ENTRYPOINT ["tail"]
# CMD ["-f", "/dev/null"]
CMD ["nginx", "-g", "daemon off;"]