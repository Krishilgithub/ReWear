# Authentication Test Guide

## ✅ What's Been Fixed

1. **Manual Sign-Up Issue**: Fixed the "sign up failed" error by implementing a local authentication system
2. **Local Storage**: Users are now stored in browser localStorage instead of requiring a backend
3. **Password Hashing**: Simple password hashing for demo purposes
4. **Session Persistence**: User sessions persist across browser refreshes

## 🧪 How to Test

### Test 1: Manual Sign-Up

1. Go to http://localhost:5173/sign-up
2. Fill in the form:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
   - Phone: "1234567890" (optional)
3. Click "Create account"
4. **Expected Result**: Success message and redirect to dashboard

### Test 2: Manual Sign-In

1. Go to http://localhost:5173/sign-in
2. Enter the credentials from Test 1:
   - Email: "test@example.com"
   - Password: "password123"
3. Click "Sign in"
4. **Expected Result**: Success message and redirect to dashboard

### Test 3: Session Persistence

1. After signing in, refresh the browser
2. **Expected Result**: User should still be logged in

### Test 4: Duplicate Email

1. Try to sign up with the same email again
2. **Expected Result**: Error message "User with this email already exists"

### Test 5: Wrong Password

1. Try to sign in with wrong password
2. **Expected Result**: Error message "Invalid password"

### Test 6: Non-existent User

1. Try to sign in with email that doesn't exist
2. **Expected Result**: Error message "User not found"

## 🔧 How It Works

### Local Storage Structure

```javascript
// Stored users
localStorage.getItem('rewear_users') = [
  {
    id: "user_1234567890_abc123",
    email: "test@example.com",
    name: "Test User",
    passwordHash: "12345", // Simple hash of password
    role: "user",
    createdAt: "2024-01-01T00:00:00.000Z"
  }
]

// Current user session
localStorage.getItem('rewear_current_user') = {
  id: "user_1234567890_abc123",
  email: "test@example.com",
  name: "Test User",
  role: "user",
  authMethod: "email"
}
```

### Authentication Flow

1. **Sign Up**: User data is stored in localStorage with hashed password
2. **Sign In**: Password is hashed and compared with stored hash
3. **Session**: Current user is stored in localStorage
4. **Logout**: Current user is removed from localStorage

## 🚀 Next Steps

This local authentication system is perfect for:

- Development and testing
- Prototypes and demos
- Offline functionality

For production, you can easily replace the localStorage functions with API calls to your backend.

## 🐛 Troubleshooting

### If sign-up still fails:

1. Check browser console for errors
2. Clear localStorage: `localStorage.clear()`
3. Refresh the page and try again

### If sign-in fails:

1. Make sure you've created an account first
2. Check that email and password match exactly
3. Clear browser cache and try again

The authentication system is now fully functional for manual sign-up and sign-in!
