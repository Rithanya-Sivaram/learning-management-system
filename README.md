# 📚 Learning Management System (LMS)

A comprehensive, full-stack Learning Management System built with Spring Boot and React, featuring role-based access control, AI-powered content assistance, and AWS integration for authentication and storage.

## 🌟 Key Features

- **Role-Based Access Control**: Separate interfaces for administrators and learners
- **Course Management**: Create, edit, and organize courses with topics and materials
- **AI-Powered Assistance**: Integrated OpenAI for enhanced learning experiences
- **Secure Authentication**: AWS Cognito integration with JWT-based security
- **File Management**: AWS S3 for secure document storage and CDN delivery
- **Real-time Chat**: Interactive communication features for learners
- **Markdown Support**: Rich content rendering for educational materials
- **Responsive Design**: Modern, mobile-friendly React interface

## 🏗️ Architecture

### Backend (Spring Boot)
- **Language**: Java 17
- **Framework**: Spring Boot 2.6.x
- **Database**: PostgreSQL 15 (Dockerized)
- **Authentication**: AWS Cognito + Dynamo Auth
- **Storage**: AWS S3
- **AI Integration**: OpenAI + Spring AI
- **Build Tool**: Maven 3.6.3+
- **Migrations**: Flyway

### Frontend (React)
- **Framework**: React
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Authentication**: AWS Cognito SDK
- **Styling**: CSS Modules

## 📋 Prerequisites

- Java 17 or higher
- Node.js 14+ and npm/yarn
- Maven 3.6.3+
- Docker & Docker Compose
- AWS Account (for Cognito, S3, SES/SNS)
- OpenAI API Key

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd learning-management-system
```

### 2. Backend Setup

#### Configure Database

Start PostgreSQL using Docker:

```bash
docker compose up -d
```

#### Configure Application

Update `backend/api-app/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5435/lms_db
spring.datasource.username=lms_usr
spring.datasource.password=lms123

# OpenAI
spring.ai.openai.api-key=YOUR_OPENAI_KEY

# AWS Configuration
aws.accessKey=YOUR_AWS_ACCESS_KEY
aws.secretKey=YOUR_AWS_SECRET_KEY
aws.region=us-east-1
aws.s3-bucket=your_s3_bucket

# Cognito
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=https://cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}/.well-known/jwks.json
aws.cognito.user-pool.id=YOUR_COGNITO_USER_POOL_ID
```

#### Build and Run

```bash
# Build api-lib
cd backend/api-lib
mvn clean install -s mvn-settings.xml

# Build and run api-app
cd ../api-app
mvn clean install
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`

### 3. Frontend Setup

#### Configure Environment

Create `.env` file in the frontend root:

```env
REACT_APP_COGNITO_USER_POOL_ID=<your-user-pool-id>
REACT_APP_COGNITO_CLIENT_ID=<your-client-id>
REACT_APP_COGNITO_REGION=<your-region>
REACT_APP_API_BASE_URL=http://localhost:8080
```

#### Install and Run

```bash
cd frontend
npm install
npm start
```

The frontend will be available at `http://localhost:3000`

## 🗂️ Project Structure

### Backend Structure
```
backend/
├── api-lib/              # Shared libraries and utilities
├── api-app/              # Main Spring Boot application
│   ├── src/main/
│   │   ├── java/         # Java source code
│   │   └── resources/
│   │       ├── application.properties
│   │       └── db/migration/    # Flyway migrations
│   └── Dockerfile
└── docker-compose.yml
```

### Frontend Structure
```
src/
├── auth/                 # Authentication components
├── components/           # Reusable UI components
├── features/
│   ├── admin/           # Admin dashboard and management
│   ├── learner/         # Learner interface
│   ├── course/          # Course management
│   └── topics/          # Topic/content management
├── routes/              # Application routing
├── service/             # API integration
├── store/               # Redux store configuration
└── App.jsx
```

## 👥 User Roles

### Administrator
- Manage courses and topics
- View and manage learners
- Create and edit educational content
- Monitor system usage

### Learner
- Browse available courses
- Enroll in courses
- View enrolled courses and progress
- Access course materials and topics
- Use chat functionality

## 🔐 Authentication Flow

1. Users authenticate through AWS Cognito
2. JWT tokens are issued upon successful authentication
3. Tokens are validated on each API request
4. User roles and permissions are resolved from the `dynamo` schema
5. Access is granted based on role-based rules

## 🐳 Docker Deployment

### Full Stack Deployment

```bash
# Build and start all services
docker compose up --build

# Run in detached mode
docker compose up -d

# Stop all services
docker compose down
```

## 📡 API Endpoints

### Health Check
```
GET /actuator/health
```

### Courses
```
GET    /api/courses
POST   /api/courses
PUT    /api/courses/{id}
DELETE /api/courses/{id}
```

### Authentication
All endpoints (except public ones) require:
```
Authorization: Bearer <jwt_token>
```

## 🔧 Configuration Details

### Allowed Public Endpoints
- `/` - Root
- `/actuator/health` - Health check
- `/api/api-docs/**` - API documentation
- `/api/swagger-ui/**` - Swagger UI
- `/api/service/user-management/users/account-setup/**` - Account setup

### CORS Configuration
Configured to allow requests from `http://localhost:3000` by default. Update in `application.properties` for production.

## 🧪 Testing

### Backend Tests
```bash
cd backend/api-app
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Production Build

### Backend
```bash
mvn clean package
java -jar target/api-app-*.jar
```

### Frontend
```bash
npm run build
# Serve the build folder using your preferred web server
```

## 📝 Database Schema

The system uses two main schemas:

- **`dynamo`**: Authentication and authorization (users, roles, groups, organizations)
- **`lms`**: Application data (courses, topics, enrollments)

Flyway manages all database migrations automatically on startup.

## 🛠️ Development Tools

- **Redux DevTools**: For state debugging
- **Swagger UI**: API documentation at `/api/swagger-ui/`
- **Spring Boot Actuator**: Monitoring and health checks

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Support

For issues and questions:
- Create an issue in the GitHub repository
- Contact the development team

