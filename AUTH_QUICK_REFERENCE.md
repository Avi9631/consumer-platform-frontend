# Authentication Quick Reference

## Using Authentication in Your Components

### Check if User is Logged In
```jsx
import { useAuth } from "@/context/AuthContext";

const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  console.log("Logged in as:", user.firstName);
}
```

### Make Authenticated API Calls
```jsx
import { useApi } from "@/hooks/useApi";

const api = useApi();

// GET request
const response = await api.get("/api/properties");

// POST request
const response = await api.post("/api/properties", {
  name: "New Property",
  price: 50000
});

// PUT request
const response = await api.put("/api/properties/1", { name: "Updated" });

// DELETE request
const response = await api.delete("/api/properties/1");
```

### Handle Login
```jsx
import { useAuth } from "@/context/AuthContext";

const { login } = useAuth();

// After successful OTP verification
login(userData, accessToken, refreshToken);
```

### Handle Logout
```jsx
import { useAuth } from "@/context/AuthContext";

const { logout } = useAuth();

logout(); // Clears all auth data
```

### Get Auth Headers
```jsx
import { useAuth } from "@/context/AuthContext";

const { getAuthHeaders } = useAuth();

const headers = getAuthHeaders();
// Returns: { Authorization: "Bearer <token>" }
```

## Token Flow

```
┌─────────────┐
│   User      │
│   Enters    │
│   Phone No. │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│ POST /api/otp/send                  │
│ {phone: "9631045873"}               │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────┐
│   User      │
│   Enters    │
│   OTP       │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│ POST /api/otp/verify                │
│ {phone: "...", otp: "123456"}       │
└──────┬──────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ Response:                                │
│ {                                        │
│   data: {                                │
│     user: {...},                         │
│     accessToken: "jwt...",               │
│     refreshToken: "jwt..."               │
│   }                                      │
│ }                                        │
└──────┬───────────────────────────────────┘
       │
       ▼
┌───────────────────────────────────────────┐
│ AuthContext.login()                       │
│ - Stores user in state & localStorage     │
│ - Stores tokens in state & localStorage   │
│ - Sets auth cookies                       │
└──────┬────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ User Authenticated ✓                 │
│ Can make protected API calls         │
└──────────────────────────────────────┘
```

## Token Refresh Flow

```
┌──────────────────────────┐
│ API Request with token   │
│ (useApi.get, etc)        │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Request sent with        │
│ Authorization: Bearer... │
└──────────┬───────────────┘
           │
           ▼
    ┌──────────────┐
    │ Status 401? │
    └──────┬───────┘
           │
      No   │    Yes
           │
    ┌──────▼─────────┐     ┌─────────────────────────┐
    │ Return response│     │ Call refresh endpoint   │
    └────────────────┘     │ POST /auth/refresh-token│
                           └──────────┬──────────────┘
                                      │
                                      ▼
                           ┌──────────────────────┐
                           │ New token received   │
                           └──────────┬───────────┘
                                      │
                                      ▼
                           ┌──────────────────────┐
                           │ Update stored token  │
                           └──────────┬───────────┘
                                      │
                                      ▼
                           ┌──────────────────────┐
                           │ Retry original req   │
                           └──────────┬───────────┘
                                      │
                                      ▼
                           ┌──────────────────────┐
                           │ Return response      │
                           └──────────────────────┘
```

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `useAuth must be used within an AuthProvider` | AuthProvider not wrapping component | Ensure AuthProvider wraps entire app |
| 401 Unauthorized persists | Token expired | Verify refresh token exists |
| Tokens not persisting | localStorage disabled | Check browser settings |
| CORS error | API URL mismatch | Verify NEXT_PUBLIC_API_URL |
| Token not in request headers | useApi not used | Use useApi hook for protected endpoints |

## File Structure
```
src/
├── context/
│   └── AuthContext.jsx          # Authentication state & logic
├── components/
│   ├── LoginDialog.jsx          # OTP login UI
│   └── Header.jsx               # Uses useAuth for user display
├── hooks/
│   └── useApi.js                # API client with auto token refresh
└── lib/
    └── services/
        └── apiClient.js         # Standalone API client utilities
```

## Environment Setup

Add to `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Testing Authentication

### Test Login Flow
1. Open app and click Login button
2. Enter valid 10-digit phone number
3. Copy OTP from backend console
4. Enter OTP in dialog
5. Should redirect and show user data

### Test Token Refresh
1. Make any authenticated API call
2. Wait for access token to expire (15 minutes)
3. Next API call should automatically refresh token
4. Request should succeed with new token

### Test Logout
1. Click user avatar dropdown
2. Click Logout
3. Should clear all tokens
4. Redirected to login when accessing protected routes
