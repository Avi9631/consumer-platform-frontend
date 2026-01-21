# Authentication Management System

This document describes the authentication system for the consumer-frontend application using OTP-based authentication with JWT tokens.

## Overview

The authentication system consists of:
1. **AuthContext** - Manages user state, access tokens, and refresh tokens
2. **LoginDialog** - Handles OTP-based login flow
3. **useApi Hook** - Provides automatic token refresh on 401 responses
4. **API Client** - Utilities for making authenticated API requests

## Components

### AuthContext (`src/context/AuthContext.jsx`)

Manages authentication state including:
- `user` - Current logged-in user data
- `accessToken` - JWT access token (15 min expiry)
- `refreshToken` - JWT refresh token (7 day expiry)
- `isAuthenticated` - Boolean indicating if user is logged in

#### Methods

**`login(userData, accessToken, refreshToken)`**
- Stores user data and tokens in state and localStorage
- Called after successful OTP verification
- Example:
```jsx
const { login } = useAuth();
login(userData, accessToken, refreshToken);
```

**`logout()`**
- Clears user data and all tokens
- Calls backend logout endpoint
- Example:
```jsx
const { logout } = useAuth();
logout();
```

**`refreshAccessToken()`**
- Attempts to refresh the access token using the refresh token
- Automatically called when a 401 response is received
- Returns `true` if successful, `false` if failed
- On failure, automatically logs out the user

**`getAuthHeaders()`**
- Returns authorization headers with Bearer token
- Used by API clients to include token in requests
- Returns: `{ Authorization: "Bearer <accessToken>" }`

**`updateUser(userData)`**
- Updates user data in state and localStorage
- Merges with existing user data

### LoginDialog (`src/components/LoginDialog.jsx`)

Handles the OTP authentication flow with two steps:

**Step 1: Phone Number Entry**
- User enters 10-digit mobile number
- Calls `/api/otp/send` endpoint

**Step 2: OTP Verification**
- User enters 6-digit OTP
- Calls `/api/otp/verify` endpoint
- On success, receives user data and JWT tokens
- Automatically logs in user via AuthContext

#### API Response Format (OTP Verify)

```json
{
  "status": 200,
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "userId": 1,
      "firstName": "User",
      "lastName": "5873",
      "email": null,
      "phone": "9631045873",
      "nameInitial": "U5"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### useApi Hook (`src/hooks/useApi.js`)

Custom hook for making authenticated API requests with automatic token refresh.

#### Features
- Automatically includes Bearer token in requests
- Intercepts 401 responses and refreshes token
- Retries failed requests after token refresh
- Includes cookies in requests (`credentials: "include"`)

#### Usage Examples

```jsx
import { useApi } from "@/hooks/useApi";

export function MyComponent() {
  const api = useApi();

  const fetchData = async () => {
    const response = await api.get("/api/properties");
    const data = await response.json();
    return data;
  };

  const postData = async () => {
    const response = await api.post("/api/properties", {
      name: "New Property",
      price: 50000,
    });
    return response.json();
  };

  return (
    <button onClick={fetchData}>Fetch Properties</button>
  );
}
```

#### Available Methods
- `api.get(url, options)` - GET request
- `api.post(url, data, options)` - POST request
- `api.put(url, data, options)` - PUT request
- `api.patch(url, data, options)` - PATCH request
- `api.delete(url, options)` - DELETE request
- `api.fetch(url, options)` - Custom fetch with auth

## Token Storage & Lifecycle

### Storage
- **Tokens are stored in:**
  - localStorage (for persistence across sessions)
  - HTTP-only cookies (set by backend, used automatically in requests)

### Token Expiry
- **Access Token:** 15 minutes
- **Refresh Token:** 7 days

### Automatic Token Refresh Flow

1. User makes API request with expired access token
2. Server responds with 401 (Unauthorized)
3. `useApi` hook detects 401 and calls `refreshAccessToken()`
4. `refreshAccessToken()` calls `/api/auth/refresh-token` with refresh token
5. Server returns new access token
6. Original request is retried with new token
7. If refresh fails, user is logged out

## Initialization

### Root Layout (`src/app/layout.js`)

The AuthProvider should wrap the entire application:

```jsx
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

## API Endpoints Used

### OTP Authentication
- `POST /api/otp/send` - Send OTP to phone number
- `POST /api/otp/verify` - Verify OTP and login (returns tokens)
- `POST /api/otp/resend` - Resend OTP

### Token Management
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/logout` - Logout user

## Security Considerations

1. **HTTP-only Cookies**: Tokens are set as HTTP-only cookies to prevent XSS attacks
2. **Short-lived Access Tokens**: 15-minute expiry limits token lifetime
3. **Refresh Token Rotation**: Backend can implement refresh token rotation
4. **CORS & SameSite**: Cookies use `sameSite: "None"` for cross-site requests in development
5. **HTTPS in Production**: Ensure `secure: true` is set for production (via NODE_ENV)

## Common Usage Patterns

### Protecting Routes

```jsx
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) {
    router.push("/");
    return null;
  }

  return <div>Protected Content</div>;
}
```

### Using Auth in Components

```jsx
import { useAuth } from "@/context/AuthContext";

export function UserProfile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <p>Welcome, {user?.firstName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls

```jsx
import { useApi } from "@/hooks/useApi";

export function DataFetch() {
  const api = useApi();

  const loadData = async () => {
    try {
      const response = await api.get("/api/user/profile");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  return <button onClick={loadData}>Load Data</button>;
}
```

## Troubleshooting

### Token Refresh Not Working
- Ensure refresh token is stored in localStorage
- Check that `/api/auth/refresh-token` endpoint exists
- Verify NEXT_PUBLIC_API_URL is set correctly

### 401 Errors Persisting
- Check if refresh token has expired (7 days)
- Verify backend is returning new access token correctly
- Check browser console for refresh errors

### User Not Persisting on Page Reload
- Ensure localStorage is enabled
- Check that user data, accessToken, and refreshToken are all stored
- Verify AuthProvider wraps entire app

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Backend variables (see backend documentation):
- `ACCESS_TOKEN_SECRET` - Secret for signing access tokens
- `REFRESH_TOKEN_SECRET` - Secret for signing refresh tokens
