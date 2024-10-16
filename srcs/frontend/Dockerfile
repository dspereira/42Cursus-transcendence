FROM nginx

RUN rm /etc/nginx/conf.d/default.conf
COPY ./conf/nginx.conf /etc/nginx/conf.d/
RUN mkdir -p /usr/share/nginx/html/app
COPY ./app/ /usr/share/nginx/html/app/

COPY set_domain_port.sh .
RUN chmod +x set_domain_port.sh

ENTRYPOINT ["./set_domain_port.sh"]

CMD ["nginx", "-g", "daemon off;"]
