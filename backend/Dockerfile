# Extend the Postgres 12.20 image
FROM postgres:12.19

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    postgresql-server-dev-12 \
    && rm -rf /var/lib/apt/lists/*

# Clone, build, and install the pgvector extension
RUN cd /tmp \
    && git clone --branch v0.7.0 https://github.com/pgvector/pgvector.git \
    && cd pgvector \
    && make \
    && make install

# Clean up
RUN rm -rf /tmp/pgvector

# Set the environment variables for Postgres (optional, can be handled in docker-compose)
ENV POSTGRES_DB=lms_db \
    POSTGRES_USER=lms_usr \
    POSTGRES_PASSWORD=lms123
