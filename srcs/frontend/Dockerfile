FROM nginx

RUN rm /etc/nginx/conf.d/default.conf
COPY ./conf/nginx.conf /etc/nginx/conf.d/
RUN mkdir -p /usr/share/nginx/html/app
# COPY ./app/ /usr/share/nginx/html/app/

CMD ["nginx", "-g", "daemon off;"]