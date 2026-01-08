# 📚 Learners Management System - React Frontend

## ⚡ Overview
A React-based learning platform frontend with role-based access.

- **Admin Users**: Manage courses, topics, and learners.
- **Learners**: Enroll, view, and interact with courses/topics.
- **Authentication**: Handled using AWS Cognito (login, signup, password reset).

### 🛠️ Tech Stack
- React
- Redux Toolkit (state management using slices)
- React Router
- AWS Cognito (authentication)

---

## 📂 Folder Structure
```
src/
├── assets/                 # Static assets (icons, images, svg)
│   └── img/
│   └── react.svg

├── auth/                   # Authentication feature
│   ├── AccountSetupSuccess.jsx
│   ├── AuthenticationSlice.jsx
│   ├── AuthHome.jsx
│   ├── CognitiSlice.jsx
│   ├── EnterOtp.jsx
│   ├── ForgotPassword.jsx
│   ├── Login.jsx
│   ├── OtpInput.jsx
│   ├── PasswordResetConfirmation.jsx
│   ├── PasswordResetSuccess.jsx
│   ├── PasswordSetupCard.jsx
│   ├── RegistryUser.jsx
│   ├── ResetPassword.jsx
│   ├── SignUp.jsx
│   ├── VerifyAndResetAccount.jsx
│   └── Auth.module.css

├── components/             # Reusable UI components
│   ├── CourseCard.jsx
│   ├── DeleteConfirmationModal.jsx
│   └── NavBar.jsx

├── features/               # Core application features
│   ├── admin/              # Admin-specific features
│   │   ├── Courses.jsx
│   │   └── StudentManagement.jsx
│   │
│   ├── course/             # Course management
│   │   ├── CreateOrEditCourse.jsx
│   │   └── ViewCourse.jsx
│   │
│   ├── learner/            # Learner features
│   │   ├── AllCourse.jsx
│   │   ├── ChatPopup.jsx
│   │   └── MyEnrolledCourses.jsx
│   │
│   └── topics/             # Topic management
│       ├── AddTopics.jsx
│       ├── MarkdownRenderer.jsx
│       └── Topics.module.css

├── routes/                 # Routing configuration
│   ├── AppRouter.jsx
│   └── AuthRouter.jsx

├── service/                # API and backend services
│   ├── BackendService.jsx
│   └── NotificationSlice.jsx

├── store/                  # Redux store configuration
│   └── Store.jsx

├── screens/                # Page-level views (if any)

├── App.jsx                 # Main App component
├── App.css                 # Global styles
├── cognito-config.js       # AWS Cognito config
├── index.js                # ReactDOM entry point
```

---

## 🚀 Features Breakdown

### 🔐 Authentication (auth/)
- Login, Signup, OTP Verification, Password Reset
- State handled by `AuthenticationSlice` and `CognitiSlice`
- Integrated with **AWS Cognito**

### 👨‍💼 Admin (features/admin/)
- `Courses.jsx` → Manage course list
- `StudentManagement.jsx` → Manage learners (enrollments, details)

### 🎓 Learner (features/learner/)
- `AllCourse.jsx` → View all available courses
- `MyEnrolledCourses.jsx` → View learner’s enrolled courses
- `ChatPopup.jsx` → Chat functionality for learners

### 📘 Course (features/course/)
- `CreateOrEditCourse.jsx` → Create or edit courses
- `ViewCourse.jsx` → View detailed course content

### 📝 Topics (features/topics/)
- `AddTopics.jsx` → Add topics inside a course
- `MarkdownRenderer.jsx` → Render topics with Markdown preview

---

## 🧭 Routing Flow

### Public Routes (AuthRouter)
- `/login` → `Login.jsx`
- `/signup` → `SignUp.jsx`

### Protected Routes (AppRouter)
- `/admin/courses` → `Courses.jsx`
- `/admin/learners` → `StudentManagement.jsx`
- `/learner/courses` → `AllCourse.jsx`
- `/learner/enrolled` → `MyEnrolledCourses.jsx`
- `/course/view/:id` → `ViewCourse.jsx`

---

## 🗂️ State Management
- **Store Setup** → `store/Store.jsx`
- **Slices**:
    - `AuthenticationSlice.jsx` → Auth states (login, signup, session)
    - `CognitiSlice.jsx` → Cognito integration
    - `NotificationSlice.jsx` → Notifications

---

## 🔌 API / Service Layer
- `BackendService.jsx` → Wrapper for API requests
- `cognito-config.js` → AWS Cognito credentials and setup

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone <repo-url>
cd learners-management-system
```

### 2️⃣ Install Dependencies
```bash
npm install
# or
yarn install
```

### 3️⃣ Configure AWS Cognito
- Update `cognito-config.js` with your AWS Cognito **User Pool ID**, **App Client ID**, and **Region**.

### 4️⃣ Run the Application
```bash
npm start
# or
yarn start
```

### 5️⃣ Build for Production
```bash
npm run build
```

---

## ✅ Environment Variables
Create a `.env` file in the root directory and add the following:
```env
REACT_APP_COGNITO_USER_POOL_ID=<your-user-pool-id>
REACT_APP_COGNITO_CLIENT_ID=<your-client-id>
REACT_APP_COGNITO_REGION=<your-region>
REACT_APP_API_BASE_URL=<your-backend-api-url>
```

---

## 📌 Notes
- Make sure your backend service is running and accessible at `REACT_APP_API_BASE_URL`.
- Use **Redux DevTools** for easier debugging.
- For production, configure AWS Cognito redirect URLs in your user pool.  