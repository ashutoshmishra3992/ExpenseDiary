# ExpenseDiary Backend - Firebase Functions

A secure backend service for the ExpenseDiary application built with Firebase Functions, featuring OTP-based authentication, JWT tokens, and user profile management.

## 🚀 Features

- **OTP Authentication**: Email-based one-time password verification
- **JWT Token Management**: Secure token-based authentication
- **User Profile Management**: Create, update, and retrieve user profiles
- **Email Integration**: Automated OTP delivery via Gmail
- **Firestore Integration**: Persistent data storage
- **TypeScript**: Fully typed codebase for better development experience
- **Security**: Environment-based secrets management

## 🚧 Work in Progress

This project is actively under development. New features and improvements are being added regularly. Stay tuned for updates!

**Upcoming Features:**
- Enhanced expense tracking functionality
- Advanced user management
- Analytics and reporting
- Mobile app integration
- Additional authentication methods

## 📋 Prerequisites

- Node.js 20+
- Firebase CLI
- Gmail account with App Password
- Firebase project with Firestore enabled

## 🛠️ Setup

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd Diary-Functions
cd functions
npm install
```

### 2. Firebase Configuration

```bash
# Login to Firebase
firebase login

# Initialize project (if not already done)
firebase init

# Set your Firebase project
firebase use your-project-id
```

### 3. Environment Secrets

Set up the required secrets using Firebase CLI:

```bash
# Set JWT secret for token signing
firebase functions:secrets:set JWT_SECRET_KEY
# Enter: your-secure-jwt-secret

# Set Gmail app password for OTP emails
firebase functions:secrets:set GMAIL_APP_PASSWORD
# Enter: your-gmail-app-password
```

### 4. Gmail Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password for the application
3. Update the Gmail credentials in `src/auth.ts` if needed

## 🚀 Deployment

```bash
# Build and deploy
firebase deploy

# Deploy only functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:sendOTP
```

## 📡 API Endpoints

### Authentication

#### Send OTP
- **POST** `/sendOTP`
- **Description**: Sends a 6-digit OTP to the provided email
- **Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "OTP sent to email"
  }
  ```

#### Verify OTP
- **POST** `/verifyOTP`
- **Description**: Verifies OTP and returns JWT token
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "otp": "ABC123"
  }
  ```
- **Response**:
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "OTP verified successfully",
    "email": "user@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Profile Management

#### Update Profile
- **PUT** `/updateProfile`
- **Description**: Updates user profile information
- **Headers**:
  ```
  Authorization: Bearer <jwt-token>
  ```
- **Body**:
  ```json
  {
    "name": "John Doe"
  }
  ```
- **Response**:
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Profile updated",
    "updatedUserData": {
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "isVerified": true
    }
  }
  ```

#### Get Profile
- **GET** `/getProfile`
- **Description**: Retrieves user profile information
- **Headers**:
  ```
  Authorization: Bearer <jwt-token>
  ```
- **Response**:
  ```json
  {
    "code": 200,
    "status": "success",
    "message": "Profile fetched",
    "userData": {
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLogin": "2024-01-01T00:00:00.000Z",
      "isVerified": true
    }
  }
  ```

## 🗄️ Database Structure

### Firestore Collections

#### `auth-otps`
```javascript
{
  email: "user@example.com",
  otp: "ABC123",
  createdAt: Timestamp,
  expiresAt: Timestamp, // 10 minutes from creation
  isUsed: false
}
```

#### `users`
```javascript
{
  email: "user@example.com",
  name: "John Doe", // Optional
  createdAt: Timestamp,
  lastLogin: Timestamp,
  updatedAt: Timestamp, // Optional
  isVerified: true
}
```

## 🔐 Security Features

- **JWT Tokens**: 7-day expiration with secure signing
- **OTP Expiration**: 10-minute validity window
- **Single-use OTPs**: Automatically marked as used after verification
- **Environment Secrets**: Sensitive data stored in Firebase secrets
- **Input Validation**: Request body and token validation
- **Error Handling**: Proper HTTP status codes and error messages

## 🧪 Testing

### Local Development

```bash
# Start Firebase emulators
npm run serve

# Run linting
npm run lint

# Build TypeScript
npm run build
```

### Example cURL Commands

```bash
# Send OTP
curl -X POST https://your-region-your-project.cloudfunctions.net/sendOTP \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify OTP
curl -X POST https://your-region-your-project.cloudfunctions.net/verifyOTP \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"ABC123"}'

# Get Profile
curl -X GET https://your-region-your-project.cloudfunctions.net/getProfile \
  -H "Authorization: Bearer your-jwt-token"

# Update Profile
curl -X PUT https://your-region-your-project.cloudfunctions.net/updateProfile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{"name":"John Doe"}'
```

## 📁 Project Structure

```
functions/
├── src/
│   ├── auth.ts          # Authentication functions
│   ├── profile.ts       # Profile management functions
│   ├── emailTemplates.ts # Email template utilities
│   ├── status.ts        # Status/health check functions
│   └── index.ts         # Main exports
├── package.json
├── tsconfig.json
└── tsconfig.dev.json
```

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request (missing/invalid data) |
| 401  | Unauthorized (invalid/missing token) |
| 404  | User not found |
| 405  | Method not allowed |
| 500  | Internal server error |

## 🔧 Configuration

### Environment Variables

The following secrets need to be configured in Firebase:

- `JWT_SECRET_KEY`: Secret key for JWT token signing
- `GMAIL_APP_PASSWORD`: Gmail app password for sending emails

### Email Configuration

Update the email configuration in `src/auth.ts`:

```typescript
const mailOptions = {
  from: "Your App <your-email@gmail.com>",
  // ... other options
};

const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: gmailAppPassword.value(),
  },
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email amdevprojects@gmail.com or create an issue in this repository. 