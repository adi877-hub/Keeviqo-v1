#!/bin/bash

set -e

# Step 1: Ensure we're in the Keeviqo directory
CURRENT_DIR=$(pwd)
if [[ "$CURRENT_DIR" != *"/repos/Keeviqo-v1" ]]; then
    if [ -d ~/repos/Keeviqo-v1 ]; then
        cd ~/repos/Keeviqo-v1
        echo "Successfully navigated to Keeviqo directory"
    else
        echo "Error: Keeviqo directory not found at ~/repos/Keeviqo-v1"
        exit 1
    fi
else
    echo "Already in the Keeviqo directory"
fi

# Check if we're in a git repository before pulling
if [ -d ".git" ]; then
    echo "Pulling latest code..."
    git pull
else
    echo "Error: Not a git repository. Cannot pull latest code."
    exit 1
fi

echo "Updating submodules..."
git submodule update --init --recursive || true

echo "Installing dependencies..."
npm install

echo "Running ESLint..."
npx eslint . || true

echo "Starting Keeviqo..."
npm run dev
