#!/bin/bash

env_file=".env"
required_variables=("NODE_ENV" "MONGODB_URL_DEVELOPMENT" "MONGODB_URL_PRODUCTION" "JWT_SECRET" "JWT_ACCESS_EXPIRATION_MINUTES" "JWT_REFRESH_EXPIRATION_DAYS" "JWT_RESET_PASSWORD_EXPIRATION_MINUTES" "JWT_VERIFY_EMAIL_EXPIRATION_MINUTES" "COOKIE_SECRET" "CLIENT_URL" "NODE_URL" "NOVU_API_KEY" "NOVU_WORKFLOW_ID" "MULTISIG_CONTRACT" "USDT_CONTRACT" "SMTP_HOST" "SMTP_PORT" "SMTP_USERNAME" "SMTP_PASSWORD" "EMAIL_FROM")

# Check if .env file exists
if [ -f "$env_file" ]; then
    echo ".env file exists."
    echo "****************************************************************************"
    # Check if required variables are defined in .env
    missing_variables=()
    for var in "${required_variables[@]}"; do
        if grep -qE "^$var=" "$env_file"; then

            echo "$var is defined in .env."
        else
            echo "----------------------------------------------------"
            echo "$var is not defined in .env."
            echo "----------------------------------------------------"
            missing_variables+=("$var")
        fi
    done

    # Prompt user for missing variables and add them to .env
    if [ ${#missing_variables[@]} -eq 0 ]; then
        echo "****************************************************************************"
        echo "All required variables are defined."
    else
        echo "****************************************************************************"
        echo "Missing variables: ${missing_variables[*]}"
        for var in "${missing_variables[@]}"; do
            read -p "Enter $var value: " value
            echo "$var=\"$value\"" >> "$env_file"
        done
        echo "Missing variables have been added to .env."
    fi
else
    echo "****************************************************************************"
    echo ".env file does not exist. Creating .env file..."

    # Prompt the user for values and store them in .env
    for var in "${required_variables[@]}"; do
        read -p "Enter $var value: " value
        echo "$var=\"$value\"" >> "$env_file"
    done

    echo ".env file has been created with the specified values."
    echo "****************************************************************************"
fi

