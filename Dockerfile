FROM nginx:1-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# All pages (index, programm, ueber-uns, spenden, impressum, datenschutz, 404, ...)
COPY *.html /usr/share/nginx/html/
COPY sitemap.xml robots.txt /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 80
