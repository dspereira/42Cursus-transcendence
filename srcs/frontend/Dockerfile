FROM nginx

COPY ./static/* /usr/share/nginx/html
COPY ./conf/nginx.conf /etc/nginx/conf.d

CMD ["nginx", "-g", "daemon off;"]