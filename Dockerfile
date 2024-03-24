# Use Node.js 16.17.0 as the base image
FROM node:16.17.0

# Set the working directory in the container
WORKDIR /app

# Install git (for Debian-based images)
RUN apt-get update && apt-get install -y git nginx openssl

# Copy the package.json and yarn.lock files to the container
# COPY package.json yarn.lock ./
# Copy the rest of the application code from the project folder to the container
COPY . ./


# Install project dependencies
# RUN ls -a && pwd && sleep 10
RUN yarn install



# Set environment variable for the backend (replace 'YOUR_BACKEND_SECRET' with your actual secret)
# ENV BACKEND_SECRET=YOUR_BACKEND_SECRET

# Expose ports 80 and 443
EXPOSE 80
EXPOSE 443

# Install NGINX and copy NGINX configuration files and SSL certificate generation script
RUN mkdir -p /etc/ssl/private && \
    mkdir -p /etc/ssl/certs

# Copy NGINX configuration files from the helper folder
COPY ./helper/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./helper/nginx/default.conf /etc/nginx/conf.d/default.conf

# SSL certificate generation
COPY ./helper/generate-ssl-certificate.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/generate-ssl-certificate.sh
RUN /usr/local/bin/generate-ssl-certificate.sh

# Start NGINX in the background
# CMD ["sh", "-c", "nginx -g 'daemon off;' & yarn install && yarn dev"]
CMD ["/bin/bash", "./entrypoint.sh"]
