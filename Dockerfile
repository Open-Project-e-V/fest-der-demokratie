FROM nginx:1-alpine

COPY index.html /usr/share/nginx/html/
COPY programm.html /usr/share/nginx/html/
COPY ueber-uns.html /usr/share/nginx/html/
COPY spenden.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80
