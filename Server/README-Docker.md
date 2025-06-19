# Docker Setup for Voting Server

This guide explains how to run the voting server using Docker.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### Production Environment

1. **Build and run with Docker Compose:**
   ```bash
   npm run docker:compose
   ```

2. **Or manually:**
   ```bash
   # Build the image
   docker build -t voting-server .
   
   # Run the container
   docker run -p 5000:5000 --env-file .env voting-server
   ```

### Development Environment

1. **Run with hot reload:**
   ```bash
   npm run docker:compose:dev
   ```

2. **View logs:**
   ```bash
   npm run docker:logs:dev
   ```

## Services

The Docker setup includes:

- **App**: Node.js Express server (port 5000)
- **MongoDB**: Database (port 27017)
- **Mongo Express**: Database management UI (port 8081)

## Environment Variables

Copy `env.example` to `.env` and configure:

```bash
cp env.example .env
```

Key variables:
- `DATABASE_URL`: MongoDB connection string
- `NODE_ENV`: Environment (production/development)
- `JWT_SECRET`: Secret for JWT tokens
- `CORS_ORIGIN`: Frontend URL for CORS

## Useful Commands

```bash
# Start services
npm run docker:compose

# Start development services
npm run docker:compose:dev

# Stop services
npm run docker:compose:down

# View logs
npm run docker:logs

# Build image only
npm run docker:build

# Run container only
npm run docker:run
```

## Database Management

Access MongoDB Express at `http://localhost:8081`:
- Username: `admin`
- Password: `admin123`

## Troubleshooting

1. **Port conflicts**: Change ports in `docker-compose.yml`
2. **Database connection**: Ensure MongoDB service is running
3. **Environment variables**: Check `.env` file exists and is configured
4. **Prisma issues**: Run `npx prisma generate` inside container if needed

## Production Deployment

For production, consider:
- Using external MongoDB service
- Setting up proper environment variables
- Configuring reverse proxy (nginx)
- Setting up SSL certificates
- Using Docker secrets for sensitive data 