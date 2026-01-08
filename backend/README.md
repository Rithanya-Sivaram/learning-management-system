# ⚙️ Learning Management System (LMS) – Setup Guide


## 💻 Technology Stack

| Component        | Technology                | Version / Details |
| ---------------- | ------------------------- | ----------------- |
| Language         | Java                      | 17                |
| Framework        | Spring Boot               | 2.6.x             |
| Database         | PostgreSQL                | 15 (Dockerized)   |
| Authentication   | AWS Cognito / Dynamo Auth |                   |
| File Storage     | AWS S3                    | Latest            |
| Embeddings / AI  | OpenAI + Spring AI        | Latest            |
| Build Tool       | Maven                     | 3.6.3 or higher   |
| Migration Tool   | Flyway                    | Latest            |
| Containerization | Docker + Docker Compose   |                   |


## 📦 Prerequisites

- Java 17
- Maven (3.6.3 or higher)
- Docker & Docker Compose
- AWS credentials (for S3, SES, SNS if needed)
- OpenAI API Key

---

## 🔧 Installation Steps

### 1. Clone the Repository

```bash
git clone (Your Git repo URL)
cd learning-management-system
```

---

### 2. Setup PostgreSQL Database

You can run Postgres locally or via Docker.

#### Run with Docker Compose

```bash
docker compose up -d
```

📂 Example `docker-compose.yml`

```yaml
services:

  lms-postgres-server:
    build:
      context: .
      dockerfile: ./Dockerfile
    container_name: lms_postgres_server
    ports:
      - "5435:5432"
    environment:
      POSTGRES_DB: lms_db
      POSTGRES_USER: lms_usr
      POSTGRES_PASSWORD: lms123
```

---

### 3. Application Configuration

Update `application.properties` or set env variables:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5435/lms_db
spring.datasource.username=lms_usr
spring.datasource.password=lms123

# Flyway
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

# OpenAI
spring.ai.openai.api-key=YOUR_OPENAI_KEY

# AWS S3
aws.accessKey=YOUR_AWS_ACCESS_KEY
aws.secretKey=YOUR_AWS_SECRET_KEY
aws.region=us-east-1
aws.s3-bucket=your_s3_bucket
document.cdn-url=cdn_url
```
---

### 4. Dynamo Auth Setup (Authentication)

The LMS uses **`dynamo-auth`** to integrate with **Amazon Cognito** for authentication and authorization.

#### 4.1 Properties File

Add a `application.properties` file in your `resources` directory:

```properties
# AWS Cognito
dynamo.auth.http.allowed-endpoints=${DYNAMO_AUTH_HTTP_ALLOWED_ENDPOINTS:/,/actuator/health,/api/api-docs/**,/api/swagger-ui/**,/api/swagger/**,/api/service/user-management/users/account-setup/**}
dynamo.auth.cors.allowed-origins=${DYNAMO_AUTH_CORS_ALLOWED_ORIGINS:http://localhost:3000}
dynamo.auth.cors.allowed-methods=${DYNAMO_AUTH_CORS_ALLOWED_METHODS:GET,POST,OPTIONS,DELETE,PUT,PATCH}
dynamo.auth.cors.allowed-headers=${DYNAMO_AUTH_CORS_ALLOWED_HEADERS:Access-Control-Allow-Origin,Access-Control-Allow-Methods,Access-Control-Max-Age,Content-Type,Access-Control-Request-Headers,Authorization,Origin,accept}
dynamo.auth.cors.exposed-headers=${DYNAMO_AUTH_CORS_EXPOSED_ORIGINS:*}
dynamo.auth.http.jwt-token.user-claim=${DYNAMO_AUTH_HTTP_JWT_TOKEN_USER_CLAIM:sub}
dynamo.auth.http.jwt-token.authorities-claim=${DYNAMO_AUTH_HTTP_JWT_TOKEN_USER_CLAIM_GROUPS:cognito:groups}

#------------------AWS Cognito----------------#
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=https://cognito-idp.${AWS_REGION:*region*}.amazonaws.com/${COGNITO_USER_POOL_ID:*userPool*}/.well-known/jwks.json
spring.security.oauth2.resourceserver.jwt.issuer-uri=https://cognito-idp.${AWS_REGION:*region*}.amazonaws.com/${COGNITO_USER_POOL_ID:*userPool*}
aws.cognito.user-pool.id=${COGNITO_USER_POOL_ID:*userPool*}
aws.region=${AWS_REGION:*region*}
```

#### 4.2 Database Integration

The `dynamo` schema must contain:

- `idm_info` → stores Cognito pool info
- `user` → application users
- `organization`, `group`, `role` → access control
- Mapping tables (`user_role_map`, `user_group_map`, `user_organization_map`)

Sample data (already included in your script):
- Roles: `author`, `learner`
- Groups: `lms`
- Users mapped to Cognito IDs

#### 4.3 How It Works

1. Clients authenticate against **Cognito** and obtain a JWT access token.
2. The LMS validates the JWT via `spring-boot-starter-oauth2-resource-server`.
3. User roles/permissions are resolved via the `dynamo` schema.

Use the JWT token in API requests as:

```http
Authorization: Bearer <jwt_token>
```

---

### 5. Build & Run the Application

#### Local Run

First, build **api-lib**:

```bash
cd backend/api-lib
mvn clean install -s mvn-settings.xml
```

Then build & run **api-app**:

```bash
cd backend/api-app
mvn clean install
mvn spring-boot:run
```

#### Docker Run

```bash
docker compose up --build
```

---

### 6. Verify Health

- Health endpoint:  
  `http://localhost:8080/actuator/health`

- Example API:  
  `http://localhost:8080/api/courses`

---

