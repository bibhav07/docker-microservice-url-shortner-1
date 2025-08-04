# docker-microservice-url-shortner-1

 Services Overview
API Gateway (NGINX):
Routes requests to backend services:

/shorten → URL-Service

/stats → Stats-Service

URL-Service:
Responsible for creating short URLs and storing them in PostgreSQL.

Stats-Service:
Tracks how many times each short URL is visited. Stores stats in Redis.

Worker-Service:
Periodically processes stats from Redis and writes them into PostgreSQL.

# Environment & Commands
# DEV Environment
To run the services in development mode:

docker-compose --env-file .env.dev up --build

Or using explicit overrides:

docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build -d

# Access the services at:

localhost:3000 (url-short)

localhost:3001 (stats)


# PROD Environment
To run the services in production mode:

docker-compose --env-file .env.dev -f docker-compose.yml up --build -d

Access the endpoints at:

localhost/shorten/shorten/abc

localhost/stats/code/abc

