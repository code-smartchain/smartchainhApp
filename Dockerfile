FROM nginx:1.15.5
WORKDIR /usr/share/nginx/html
COPY dist .
