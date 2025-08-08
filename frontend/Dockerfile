FROM nginx:alpine

# Copy the static frontend into the nginx document root
COPY index.html /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]