# Mobile OTP Authentication

This document describes the mobile OTP authentication system implemented for the consumer frontend.

## Overview

The authentication system allows users to log in using their mobile number via OTP (One-Time Password) verification.

## Backend Implementation

### Files Created

1. **Controller**: `partner-platform-backend/src/controller/OtpAuth.controller.js`
   - Handles HTTP requests for OTP operations
   - Functions: `sendOtp`, `verifyOtp`, `resendOtp`

2. **Service**: `partner-platform-backend/src/service/OtpAuthService.service.js`
   - Business logic for OTP generation and verification
   - In-memory OTP storage (can be replaced with Redis for production)
   - OTP expires in 5 minutes
   - Maximum 3 verification attempts

3. **Route**: `partner-platform-backend/src/routes/otpAuth.route.js`
   - API endpoints for OTP authentication

### API Endpoints

#### 1. Send OTP
```
POST /api/otp/send
Content-Type: application/json

Request Body:
{
  "phone": "9876543210"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "phone": "9876543210",
    "expiresIn": 300
  }
}
```

#### 2. Verify OTP
```
POST /api/otp/verify
Content-Type: application/json

Request Body:
{
  "phone": "9876543210",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "userId": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "9876543210",
      "email": null,
      "nameInitial": "JD",
      "profileImage": null
    },
    "accessToken": "jwt-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

#### 3. Resend OTP
```
POST /api/otp/resend
Content-Type: application/json

Request Body:
{
  "phone": "9876543210"
}

Response:
{
  "success": true,
  "message": "OTP resent successfully",
  "data": {
    "phone": "9876543210",
    "expiresIn": 300
  }
}
```

## Frontend Implementation

### Files Created/Modified

1. **Login Dialog**: `consumer-frontend/src/components/LoginDialog.jsx`
   - Two-step authentication flow (phone entry → OTP verification)
   - 30-second resend cooldown
   - Beautiful UI with shadcn components

2. **Auth Context**: `consumer-frontend/src/context/AuthContext.jsx`
   - Manages user authentication state
   - Persists user data in localStorage
   - Provides: `user`, `login`, `logout`, `updateUser`, `isAuthenticated`

3. **Toast Hook**: `consumer-frontend/src/hooks/use-toast.js`
   - Toast notification system for user feedback

4. **Header Component**: `consumer-frontend/src/components/Header.jsx`
   - Updated with login/logout functionality
   - User avatar with dropdown menu
   - Login button for unauthenticated users

5. **Layout**: `consumer-frontend/src/app/layout.js`
   - Wrapped with AuthProvider
   - Added Toaster component

6. **Environment**: `consumer-frontend/.env.local`
   - Backend API URL configuration

## Features

### Security Features
- OTP expires in 5 minutes
- Maximum 3 verification attempts per OTP
- Phone number validation (10 digits, starting with 6-9)
- JWT tokens with httpOnly cookies
- Access token: 15 minutes expiry
- Refresh token: 7 days expiry

### User Experience
- Clean two-step login flow
- Real-time phone number validation
- OTP input with 6-digit slots
- Resend OTP with 30-second cooldown
- Change phone number option
- Toast notifications for all actions
- Smooth animations and transitions

### User Management
- Auto-creates user if phone doesn't exist
- Updates phoneVerifiedAt timestamp on successful login
- Persists user session in localStorage
- User dropdown menu with logout option

## Usage

### Starting the Backend
```bash
cd partner-platform-backend
npm install
npm start
```

The OTP will be logged to console during development. For production, integrate with SMS providers like:
- Twilio
- AWS SNS
- MSG91
- Nexmo

### Starting the Frontend
```bash
cd consumer-frontend
npm install
npm run dev
```

### Testing the Flow

1. **Click Login** on the header
2. **Enter Mobile Number**: e.g., 9876543210
3. **Click Send OTP**
4. **Check Console**: OTP will be displayed in backend console
5. **Enter OTP** in the dialog
6. **Click Verify & Login**
7. **Success**: User is logged in and profile appears in header

## Production Considerations

### SMS Integration
Replace the console.log in `OtpAuthService.service.js` with actual SMS service:

```javascript
// Example with Twilio
const twilio = require('twilio');
const client = twilio(accountSid, authToken);

await client.messages.create({
  body: `Your OTP is: ${otp}. Valid for ${OTP_EXPIRY_MINUTES} minutes.`,
  to: `+91${phone}`,
  from: twilioPhoneNumber
});
```

### OTP Storage
Replace in-memory storage with Redis for production:

```javascript
// Example with Redis
const redis = require('redis');
const client = redis.createClient();

// Store OTP
await client.setEx(`otp:${phone}`, 300, JSON.stringify(otpData));

// Get OTP
const otpData = JSON.parse(await client.get(`otp:${phone}`));
```

### Environment Variables
Add to backend `.env`:
```
# SMS Provider (example: Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Redis
REDIS_URL=redis://localhost:6379
```

## File Structure

```
partner-platform-backend/
├── src/
│   ├── controller/
│   │   └── OtpAuth.controller.js
│   ├── service/
│   │   └── OtpAuthService.service.js
│   └── routes/
│       └── otpAuth.route.js
└── server.js (updated)

consumer-frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx (updated)
│   │   └── LoginDialog.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── use-toast.js
│   └── app/
│       └── layout.js (updated)
└── .env.local
```

## API Response Format

All API responses follow the standard format using `ApiResponse` utility:

```javascript
{
  "success": true/false,
  "message": "Human readable message",
  "data": { /* Response data */ },
  "error": { /* Error details if any */ },
  "meta": { /* Additional metadata */ },
  "timestamp": "ISO timestamp"
}
```

## Troubleshooting

### OTP not received
- Check backend console for logged OTP (development mode)
- Verify phone number format
- Check network connectivity

### Login fails after OTP verification
- Check if cookies are enabled
- Verify CORS settings in backend
- Check browser console for errors

### User not persisted after refresh
- Verify localStorage is working
- Check AuthProvider is wrapping the app
- Ensure .env.local is loaded

## Future Enhancements

1. **Rate Limiting**: Prevent OTP spam
2. **Biometric Auth**: Add fingerprint/face ID support
3. **Social Login**: Google, Facebook integration
4. **Email OTP**: Alternative to mobile OTP
5. **2FA**: Two-factor authentication for enhanced security
