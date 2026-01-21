# Authentication Management - Complete Implementation Guide

## 🎯 What Was Implemented

A complete JWT-based authentication system for the consumer-frontend that seamlessly integrates with the OTP authentication backend. The system includes automatic token refresh, persistent authentication, and secure token storage.

## 📦 What You Get

### Core Features
✅ OTP-based login with phone number verification
✅ JWT access and refresh tokens
✅ Automatic token refresh on expiration
✅ Persistent authentication across sessions
✅ Secure token storage (localStorage + HTTP-only cookies)
✅ Protected API calls with automatic Bearer token injection
✅ Single-click logout with complete cleanup
✅ Comprehensive error handling and user feedback

### Developer Experience
✅ Simple `useAuth()` hook for accessing auth state
✅ Simple `useApi()` hook for making authenticated requests
✅ Automatic token management (no manual refresh needed)
✅ Type-safe with JSDoc documentation
✅ Production-ready error handling

## 📁 Files Modified/Created

### Modified
- `src/context/AuthContext.jsx` - Enhanced with token management
- `src/components/LoginDialog.jsx` - Updated to handle token response

### Created
- `src/hooks/useApi.js` - Hook for authenticated API requests
- `src/lib/services/apiClient.js` - Standalone API client utilities
- `AUTHENTICATION.md` - Complete system documentation
- `AUTH_QUICK_REFERENCE.md` - Quick usage guide
- `AUTH_IMPLEMENTATION.md` - Implementation details
- `AUTH_CHECKLIST.md` - Testing and deployment checklist
- `EXAMPLES.md` - Code examples for common tasks

## 🚀 Quick Start

### 1. Basic Login
```jsx
import LoginDialog from "@/components/LoginDialog";
import { useAuth } from "@/context/AuthContext";

export default function App() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.firstName}!</p>
      ) : (
        <LoginDialog />
      )}
    </div>
  );
}
```

### 2. Make Authenticated API Calls
```jsx
import { useApi } from "@/hooks/useApi";

export function PropertyList() {
  const api = useApi();
  
  const loadProperties = async () => {
    const response = await api.get("/api/properties");
    const data = await response.json();
    return data;
  };
  
  return <button onClick={loadProperties}>Load Properties</button>;
}
```

### 3. Handle Logout
```jsx
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { logout } = useAuth();
  
  return (
    <button onClick={logout}>Logout</button>
  );
}
```

## 🔐 Security Features

1. **HTTP-only Cookies** - Prevents XSS attacks
2. **Short-lived Access Tokens** - 15 minute expiration
3. **Long-lived Refresh Tokens** - 7 day expiration
4. **Automatic Token Rotation** - On every refresh
5. **Secure CORS Policy** - sameSite: "None" with secure flag
6. **Bearer Token Authorization** - Standard JWT authentication
7. **Automatic Logout on Refresh Failure** - Prevents stale state

## 📊 Architecture

```
┌─────────────────────────────────────────────────────┐
│           Application Components                    │
│  (Header, LoginDialog, PropertyList, etc.)         │
└────────────┬──────────────────────────────────────┘
             │
             ├─────────────────────────────────────┐
             │                                     │
             ▼                                     ▼
        useAuth()                              useApi()
        (Get auth state)                   (Make API calls)
             │                                     │
             └─────────────┬───────────────────────┘
                           │
                           ▼
                    AuthContext
                  (Token Management)
                    - User state
                    - accessToken
                    - refreshToken
                    - Refresh logic
                           │
                           ▼
                    Backend API
                  - /api/otp/*
                  - /api/auth/*
```

## 🔄 Token Lifecycle

```
1. User enters phone → OTP sent
2. User enters OTP → API verification
3. Receives tokens:
   - accessToken (15 min)
   - refreshToken (7 days)
4. Tokens stored in:
   - localStorage (persistence)
   - HTTP-only cookies (auto-transmission)
5. API calls include token:
   - Authorization: Bearer <token>
6. On 401:
   - Refresh token automatically
   - Retry request with new token
7. On logout:
   - Clear all tokens
   - Clear localStorage
   - Redirect to login
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `AUTHENTICATION.md` | Complete system documentation |
| `AUTH_QUICK_REFERENCE.md` | Quick code snippets & examples |
| `AUTH_IMPLEMENTATION.md` | What was changed and why |
| `AUTH_CHECKLIST.md` | Testing and deployment checklist |
| `EXAMPLES.md` | Real-world usage examples |

## ✨ Key Methods

### AuthContext Methods
```jsx
const {
  user,                    // Current user data
  accessToken,             // JWT access token
  refreshToken,            // JWT refresh token
  isAuthenticated,         // Boolean auth status
  login,                   // Login function
  logout,                  // Logout function
  refreshAccessToken,      // Manual token refresh
  getAuthHeaders,          // Get Bearer headers
  updateUser               // Update user data
} = useAuth();
```

### useApi Hook
```jsx
const {
  get,       // GET request
  post,      // POST request
  put,       // PUT request
  patch,     // PATCH request
  delete,    // DELETE request
  fetch      // Custom fetch with auth
} = useApi();

// Usage
const response = await api.get("/api/properties");
```

## 🧪 Testing the System

### Test Login
1. Click Login button
2. Enter: 9631045873
3. Copy OTP from backend console
4. Paste OTP and submit
5. Should show user in Header ✓

### Test Persistence
1. Login successfully
2. Refresh page (F5)
3. Should still be logged in ✓

### Test Token Refresh
1. Make API call immediately after login
2. API should succeed ✓
3. Wait until access token expires (15 min)
4. Make another API call
5. Should auto-refresh and succeed ✓

### Test Logout
1. Click user avatar → Logout
2. Tokens should be cleared ✓
3. Should show Login button ✓

## 🐛 Troubleshooting

### "Not logged in after refresh"
- Check if localStorage is enabled
- Check DevTools → Application → Local Storage
- Verify accessToken and refreshToken are stored

### "401 errors keep happening"
- Check if refreshToken is expired (7 days)
- Verify backend /api/auth/refresh-token exists
- Check browser console for refresh errors

### "useAuth must be used within AuthProvider"
- Ensure AuthProvider wraps entire app in root layout
- Check if component is inside AuthProvider

### "Tokens not included in requests"
- Use useApi hook instead of fetch
- Verify useApi is importing from correct path
- Check Authorization header in DevTools

## 📋 Environment Setup

### .env.local
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Backend Requirements
```
✓ POST /api/otp/send
✓ POST /api/otp/verify (returns {user, accessToken, refreshToken})
✓ POST /api/otp/resend
✓ POST /api/auth/refresh-token
✓ GET /api/auth/logout
```

## 🎓 Learning Path

1. **Start Here**: Read `AUTH_QUICK_REFERENCE.md`
2. **Understand**: Read `AUTHENTICATION.md`
3. **See Examples**: Check `EXAMPLES.md`
4. **Integrate**: Copy useApi usage into your components
5. **Deploy**: Use `AUTH_CHECKLIST.md` for deployment

## 🚀 Production Deployment

### Before Deploying
- [ ] Test login flow completely
- [ ] Test token refresh (wait 15+ min)
- [ ] Test logout
- [ ] Verify error handling
- [ ] Update API_URL for production
- [ ] Clear browser cache

### Environment Variables
```env
# Production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Security Checklist
- [ ] Verify HTTPS is enabled
- [ ] Check secure flag on cookies
- [ ] Verify SameSite policy
- [ ] Test CORS headers
- [ ] Monitor token refresh logs

## 💡 Pro Tips

1. **Always use useApi for protected endpoints** - Ensures tokens are included
2. **Check isAuthenticated before rendering** - Prevents flashing login dialogs
3. **Use updateUser for local changes** - Keeps UI in sync
4. **Monitor token refresh errors** - Indicates refresh token expiration
5. **Use loading state** - Better UX during auth transitions

## 📞 Support Resources

- `AUTHENTICATION.md` - Technical reference
- `AUTH_QUICK_REFERENCE.md` - Quick lookup
- `EXAMPLES.md` - Code samples
- `AUTH_CHECKLIST.md` - Deployment guide

## ✅ Success Indicators

You'll know it's working when:
- ✓ User can login with OTP
- ✓ Page refresh keeps user logged in
- ✓ API calls automatically include token
- ✓ 401 responses trigger automatic refresh
- ✓ Logout clears everything
- ✓ No console errors
- ✓ User data shows in Header

## 🎉 Summary

You now have a production-ready authentication system that:
- Handles OTP-based login
- Manages JWT tokens securely
- Automatically refreshes tokens
- Persists authentication
- Provides easy-to-use hooks
- Includes comprehensive documentation

Start building authenticated features with confidence! 🚀
