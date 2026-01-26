#!/bin/bash
# Quick tunnel script to expose the app to the internet temporarily

echo "Starting tunnel to expose your CRM..."
echo ""
echo "This will create a public URL you can access from any device."
echo "Press Ctrl+C to stop."
echo ""

npx localtunnel --port 5173
