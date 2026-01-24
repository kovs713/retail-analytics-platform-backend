# Retail Analytics Platform Backend

A comprehensive backend system for retail analytics, providing transaction processing, customer insights, and AI-powered document analysis for retail stores.

## Overview

This platform serves as the backend for retail point-of-sale systems, integrating with payment terminals, managing transaction data, and providing analytics capabilities. It includes AI-powered document analysis for intelligent querying of retail and transaction data.

## Technology Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Vector Database**: ChromaDB
- **Object Storage**: MinIO S3
- **AI/ML**: LangChain framework, HuggingFace Transformers, Groq API

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager
- Docker and Docker Compose
- Groq API key (for AI features)

### Installation

```bash
# Clone repository
git clone https://github.com/kovs713/retail-analytics-platform-backend.git
cd retail-analytics-platform-backend

# Install dependencies
pnpm install

# Copy environment configuration
cp .env.example .env

# Configure environment variables (see Configuration section)
```

### Database Setup

```bash
# Start infrastructure services
docker-compose up -d

# Verify services are running
docker-compose ps
```

### Running the Application

```bash
# Development mode
pnpm run start:dev

# Production build
pnpm run build
pnpm run start:prod
```

## Configuration

### Environment Variables

| Variable                 | Description         | Default                 | Required              |
| ------------------------ | ------------------- | ----------------------- | --------------------- |
| `NODE_ENV`               | Environment mode    | development             | No                    |
| `PORT`                   | Application port    | 3000                    | No                    |
| `GROQ_API_KEY`           | Groq AI API key     | -                       | Yes (for AI features) |
| `GROQ_MODEL`             | AI model            | llama-3.3-70b-versatile | No                    |
| `DB_HOST`                | PostgreSQL host     | 127.0.0.1               | No                    |
| `DB_PORT`                | PostgreSQL port     | 5432                    | No                    |
| `DB_USERNAME`            | Database username   | postgres                | No                    |
| `DB_PASSWORD`            | Database password   | postgres                | No                    |
| `DB_DATABASE`            | Database name       | retail_analytics        | No                    |
| `REDIS_HOST`             | Redis host          | 127.0.0.1               | No                    |
| `REDIS_PORT`             | Redis port          | 6379                    | No                    |
| `REDIS_PASSWORD`         | Redis password      | redis                   | No                    |
| `S3_HOST`                | MinIO host          | 127.0.0.1               | No                    |
| `S3_PORT`                | MinIO port          | 9000                    | No                    |
| `S3_USERNAME`            | MinIO username      | admin                   | No                    |
| `S3_PASSWORD`            | MinIO password      | password                | No                    |
| `S3_BUCKET`              | Default S3 bucket   | retail-data             | No                    |
| `VECTOR_COLLECTION_NAME` | ChromaDB collection | documents               | No                    |

### Project Structure

```
src/
├── modules/
│   ├── auth/              # Authentication module
│   ├── rag/               # RAG system
│   │   ├── embeddings/    # Vector embeddings
│   │   ├── llm/          # AI integration
│   │   └── vector-store/  # ChromaDB integration
│   ├── analytics/         # Business analytics
│   ├── third-party/       # External integrations
│   ├── admin/            # Administrative functions
│   └── gamification/     # Customer engagement
├── database/             # Database configuration
├── api/                  # REST API controllers
├── common/               # Shared utilities
└── config/               # Configuration management

test/
├── unit/                 # Unit tests
├── integration/          # Integration tests
└── e2e/                  # End-to-end tests
```

## License

This project is licensed under the GNU General Public License v3.0.
