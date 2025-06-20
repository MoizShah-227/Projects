# Docker Setup for Voting Server

This guide explains how to run the voting server using Docker with an external MongoDB database.

## Prerequisites

- Docker
- Docker Compose
- External MongoDB database (MongoDB Atlas, local MongoDB, etc.)

## Quick Start

### Production Environment

1. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your MongoDB URL and other settings
   ```

2. **Build and run with Docker Compose:**
   ```bash
   npm run docker:compose
   ```

3. **Or manually:**
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

The Docker setup includes only the application server:
- **App**: Node.js Express server (port 5000)

## Environment Variables

Copy `env.example` to `.env` and configure:

```bash
cp env.example .env
```

Key variables:
- `DATABASE_URL`: Your external MongoDB connection string
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

## Database Setup

Since you're using an external MongoDB:

1. **MongoDB Atlas** (recommended):
   - Create a cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Get your connection string
   - Add it to your `.env` file

2. **Local MongoDB**:
   - Install MongoDB locally
   - Use connection string: `mongodb://localhost:27017/voting_app`

3. **Other MongoDB services**:
   - Use your provider's connection string

## Troubleshooting

1. **Database connection**: Ensure your MongoDB URL is correct in `.env`
2. **Network issues**: Check if your MongoDB is accessible from Docker
3. **Environment variables**: Verify `.env` file exists and is configured
4. **Prisma issues**: Run `npx prisma generate` inside container if needed

## Production Deployment

For production, consider:
- Using MongoDB Atlas or managed MongoDB service
- Setting up proper environment variables
- Configuring reverse proxy (nginx)
- Setting up SSL certificates
- Using Docker secrets for sensitive data
- Setting up database backups 