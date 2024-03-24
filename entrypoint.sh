#!/bin/bash

# Start NGINX in the background
nginx -g 'daemon off;' &

# Start the backend server
yarn install
yarn dev

# Trap the SIGTERM signal and gracefully stop NGINX
trap "nginx -s quit" SIGTERM

# Keep the script running
tail -f /dev/null
