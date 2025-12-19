#!/bin/bash

# Hospice Tororo EMR - Development Server Startup Script

echo "🏥 Starting Hospice Tororo EMR Development Server..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🚀 Starting Vite development server..."
echo "📱 The app will be available at http://localhost:3000"
echo "🌐 For access from other devices on the network, use the Network URL shown below"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
