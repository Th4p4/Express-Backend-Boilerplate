#!/bin/bash

# Define the expected Node.js version
expected_version="v16.17.0"

# Check if the `node` command is installed and its version matches the expected version
if command -v node &> /dev/null && [ "$(node -v)" == "$expected_version" ]; then
    echo "Node.js is installed and the version matches $expected_version."
else
    echo "Node.js is not installed or the version does not match $expected_version."
    
    # Check if the desired Node.js version argument is provided
    if [ -n "$1" ]; then
        required_version="$1"
    else
        required_version="v16.17.0"  # Default version if no argument is provided
    fi
    echo "****************************************************************************"
    echo "Installing Node.js version $required_version using NVM..."
    
    # Install NVM if not already installed
    if ! command -v nvm &> /dev/null; then
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
        source ~/.nvm/nvm.sh
    fi
    
    # Install the required Node.js version using NVM
    nvm install "$required_version"
    
    # Set the installed Node.js version as the default
    nvm alias default "$required_version"
    
    # Reload .bashrc to ensure NVM changes take effect
    source ~/.bashrc
    
    echo "Node.js version $required_version has been installed and set as the default."
fi
echo "****************************************************************************"
bash ./env_checker.sh
# Check if the `yarn` command is installed
if ! command -v yarn &> /dev/null; then
    echo "****************************************************************************"
    echo "Yarn is not installed. Installing Yarn using npm..."
    
    # Install Yarn using npm
    npm install --global yarn
    
    echo "Yarn has been installed."
else
    echo "****************************************************************************"
    echo "Yarn is already installed"
fi
source ~/.bashrc
echo "****************************************************************************"
echo "Continuing the script"
echo "Installing Packages"
echo "****************************************************************************"
yarn install
echo "****************************************************************************"
echo "Running the server after sleeping for 5 seconds."
sleep 5
echo "****************************************************************************"
yarn dev

