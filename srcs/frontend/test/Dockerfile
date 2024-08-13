FROM nginx

RUN rm /etc/nginx/conf.d/default.conf
COPY ./conf/nginx.conf /etc/nginx/conf.d/

RUN mkdir -p /usr/share/nginx/html/app

# ENTRYPOINT ["tail"]
# CMD ["-f", "/dev/null"]
CMD ["nginx", "-g", "daemon off;"]