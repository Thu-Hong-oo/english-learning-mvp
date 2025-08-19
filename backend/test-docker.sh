#!/bin/bash

# Script để test Docker build local
echo "🐳 Testing Docker build..."

# Build Docker image
echo "📦 Building Docker image..."
docker build -t english-website-backend:test .

# Kiểm tra image size
echo "📊 Image size:"
docker images english-website-backend:test

# Test chạy container
echo "▶️ Testing container startup..."
docker run --rm -d --name test-container -p 3001:3000 english-website-backend:test

# Đợi container khởi động
echo "⏳ Waiting for container to start..."
sleep 10

# Kiểm tra logs
echo "📋 Container logs:"
docker logs test-container

# Test API endpoint
echo "🌐 Testing API endpoint..."
if curl -f http://localhost:3001/ > /dev/null 2>&1; then
    echo "✅ API is responding"
else
    echo "❌ API is not responding"
fi

# Cleanup
echo "🧹 Cleaning up..."
docker stop test-container

echo "🎉 Docker test completed!"
