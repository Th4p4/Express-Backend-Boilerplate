Hi everyone this is a boilerplate for express nodejs mongodb boilerplate with dependency injection feature
# Guide to Deploying the Express-Backend-Boilerplate Project with PM2

  

This guide will walk you through the process of deploying the "Express-Backend-Boilerplate" project to production using PM2, which is recommended for ensuring stability and robustness in a production environment. The backend is built using Node.js, and the recommended version is Node.js 16.17.0. You can use the `check_and_run.sh` script to check all the requirements and run the backend script using PM2. Additionally, you'll need to configure a reverse proxy server with specific headers for production.

  
  

# Prerequisites

  


Before you proceed with the deployment, make sure you have the following prerequisites in place:

1.  Node.js installed (recommended version: 16.17.0)
2.  Yarn package manager installed
3.  PM2 process manager installed
4.  Nginx or another reverse proxy server set up
  

# Deployment Steps

## 1. Clone the Project

  

Clone the "Express-Backend-Boilerplate" project repository from GitHub to your production server. You can use Git for this purpose.

```https://github.com/Th4p4/Express-Backend-Boilerplate```
```cd Express-Backend-Boilerplate```

  

## 2. Configure Environment Variables

  
Create an `.env` file in the project directory to configure any necessary environment variables for the "Express-Backend-Boilerplate" project. This file can contain settings like the database connection string, API keys, and the port number for your backend. Ensure it includes all the required variables specific to the backend. You can use [.env.example](.env.example) as a reference.

  

## 3. Check with script and Run with PM2
You can use the provided `check_and_run.sh` script to check for requirements and run the backend server using PM2. Execute the script:
	`./check_and_run.sh`
	

  Using pm2 you can run the project as:
  **Install dependencies**
		`yarn install`
		
**Run Project**
pm2 start yarn --name "Express-Backend-Boilerplate" -- dev

This command tells PM2 to start the `yarn dev` script and names the process "Express-Backend-Boilerplate"
By default this runs in port 5000, but you can configure this to run on other port using .env file.


## 4. Configure the Reverse Proxy Server (Nginx)

  


Configure your reverse proxy server (e.g., Nginx) to route requests to your backend server. Here's an example Nginx configuration:


server {
    listen 80;    
    server_name your_domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000; # This assumes your backend is running on port 5000
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # CORS headers
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PATCH, PUT, DELETE';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';

        # Additional Nginx configuration settings...
    }
}


Make sure to replace `your_domain.com` with your actual domain and configure the `proxy_pass` directive to point to the correct backend server URL. The backend have build in functionality to handle CORS therefor CORS is not needed in the config. Contact if any issues

  


## 5. Testing and Maintenance

  

After deployment, thoroughly test the "Express-Backend-Boilerplate" API to ensure it's working as expected in a production environment. Monitor the application for any issues, and regularly update environment variables or the project code as needed.

Congratulations! You've successfully deployed the "Express-Backend-Boilerplate" project to production using PM2. Your backend API is now accessible through the specified domain or IP address, with the necessary CORS headers and reverse proxy configuration in place.

 
