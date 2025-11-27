# KMEC Donation Platform - Testing Checklist

## Pre-Testing Setup Verification

### Backend Configuration
- [ ] MongoDB is running (local or Atlas connection works)
- [ ] `backend/.env` file exists with all required values
- [ ] JWT_SECRET is set (not the default from .env.example)
- [ ] GOOGLE_SHEET_ID matches your Google Sheet
- [ ] GOOGLE_SERVICE_ACCOUNT_EMAIL is correct
- [ ] GOOGLE_PRIVATE_KEY is properly formatted with `\n` preserved
- [ ] Backend dependencies installed (`npm install` completed)

### Frontend Configuration
- [ ] Google Form URL updated in `Donate.js`
- [ ] Form entry IDs replaced with actual values
- [ ] Frontend dependencies installed (`npm install` completed)

### Google Setup
- [ ] Google Cloud project created
- [ ] Google Sheets API enabled
- [ ] Service account created with Viewer role
- [ ] Service account JSON key downloaded
- [ ] Google Sheet created with headers (Email | Amount | Status)
- [ ] Sheet shared with service account email (Viewer access)
- [ ] Google Form created with 3 questions
- [ ] Form linked to Google Sheet

## Testing Phase 1: Backend API Tests

### Start Backend
```powershell
cd backend
npm start
```

**Expected Output:**
```
✅ MongoDB Connected Successfully
✅ Google Sheets API Initialized (READ-ONLY)
✅ Verification cron job started (runs every 2 minutes)
🚀 Server running on http://localhost:5000
```

### Test 1.1: Health Check
```powershell
# Open browser or use curl
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{"status":"OK","message":"KMEC Donation API is running"}
```

- [ ] Health check passes

### Test 1.2: Signup
```powershell
# Use Postman, curl, or Thunder Client
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

- [ ] Signup creates user
- [ ] Returns JWT token
- [ ] Password is hashed (check MongoDB)

### Test 1.3: Login
```powershell
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {...}
}
```

- [ ] Login succeeds with correct password
- [ ] Login fails with wrong password
- [ ] Returns new JWT token

### Test 1.4: Protected Route (Get User)
```powershell
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response:**
```json
{
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

- [ ] Works with valid token
- [ ] Fails without token (401)
- [ ] Fails with invalid token (401)

### Test 1.5: Create Donation
```powershell
POST http://localhost:5000/api/donations
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "amount": 500
}
```

**Expected Response:**
```json
{
  "message": "Donation created successfully. Please complete payment.",
  "donation": {
    "id": "...",
    "email": "test@example.com",
    "amount": 500,
    "paymentStatus": "PENDING",
    "createdAt": "..."
  }
}
```

- [ ] Donation created with PENDING status
- [ ] Email matches logged-in user
- [ ] Amount is correct

### Test 1.6: Get Donations
```powershell
GET http://localhost:5000/api/donations
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response:**
```json
{
  "donations": [
    {
      "id": "...",
      "email": "test@example.com",
      "amount": 500,
      "paymentStatus": "PENDING",
      "verifiedAt": null,
      "createdAt": "..."
    }
  ]
}
```

- [ ] Returns user's donations only
- [ ] Sorted by newest first

## Testing Phase 2: Frontend Tests

### Start Frontend
```powershell
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view kmec-donation-frontend in the browser.
Local: http://localhost:3000
```

Browser should open automatically.

- [ ] Frontend starts without errors
- [ ] Page loads at http://localhost:3000

### Test 2.1: Navigation
- [ ] Navbar shows "KMEC" logo
- [ ] Shows "Login" and "Sign Up" buttons when logged out
- [ ] "/" redirects to "/donate" (then to login if not authenticated)

### Test 2.2: Signup Flow
1. Click "Sign Up"
2. Fill form:
   - Name: "Test User"
   - Email: "testuser@example.com"
   - Password: "password123"
3. Click "Sign Up"

**Expected Behavior:**
- [ ] Form submits successfully
- [ ] Redirects to /donate page
- [ ] Navbar shows "Welcome, Test User"
- [ ] Navbar shows "Donate", "Dashboard", "Logout" buttons

### Test 2.3: Logout
1. Click "Logout" button

**Expected Behavior:**
- [ ] Redirects to /login
- [ ] Token removed from localStorage
- [ ] Navbar shows "Login" and "Sign Up" again

### Test 2.4: Login Flow
1. Click "Login"
2. Fill form:
   - Email: "testuser@example.com"
   - Password: "password123"
3. Click "Login"

**Expected Behavior:**
- [ ] Login successful
- [ ] Redirects to /donate
- [ ] Navbar shows user name
- [ ] Can access protected routes

### Test 2.5: Donate Page
Check donate page content:
- [ ] Hero section shows "Give Movement. Give Independence."
- [ ] Shows donation form
- [ ] Shows "About KMEC" section
- [ ] Shows team names
- [ ] Amount input field works
- [ ] Button says "Proceed to Payment"

### Test 2.6: Dashboard - Empty State
1. Navigate to /dashboard

**Expected Behavior:**
- [ ] Shows "You haven't made any donations yet"
- [ ] Shows "Make Your First Donation" button
- [ ] No donation cards shown

## Testing Phase 3: End-to-End Donation Flow

### Test 3.1: Create Donation
1. Go to /donate page
2. Enter amount: 500
3. Click "Proceed to Payment"

**Expected Behavior:**
- [ ] Google Form opens in new tab
- [ ] Form is pre-filled with email
- [ ] Form is pre-filled with amount (500)
- [ ] Alert shows: "Donation created! Please complete the payment..."
- [ ] Redirects to /dashboard after 1 second

### Test 3.2: Dashboard - Pending Donation
Check dashboard:
- [ ] Shows 1 donation card
- [ ] Amount shows ₹500
- [ ] Status badge shows "⏳ Payment Pending"
- [ ] Shows creation timestamp
- [ ] Warning message: "Complete payment in Google Form to verify"

### Test 3.3: Complete Payment (Google Form)
In the Google Form tab:
1. Verify email is pre-filled correctly
2. Verify amount is pre-filled (500)
3. Ensure "PAID" is selected
4. Click "Submit"

**Expected Behavior:**
- [ ] Form submits successfully
- [ ] Shows confirmation message
- [ ] Can close the form tab

### Test 3.4: Verify in Google Sheet
Open your Google Sheet:
- [ ] New row appears with form submission
- [ ] Email matches: testuser@example.com
- [ ] Amount matches: 500
- [ ] Status shows: PAID

### Test 3.5: Wait for Backend Verification
Check backend console (every 2 minutes):

**Expected Console Output:**
```
⏰ Running scheduled donation verification...
🔍 Starting donation verification...
📋 Found 1 pending donation(s)
✅ Verified donation: testuser@example.com - ₹500
✓ Verification complete: 1 donation(s) verified
```

- [ ] Backend logs show verification started
- [ ] Backend finds 1 pending donation
- [ ] Backend successfully verifies the donation

### Test 3.6: Dashboard - Verified Donation
After ~2 minutes, check dashboard (or refresh page):
- [ ] Status badge now shows "✅ Payment Received"
- [ ] Shows "Verified" timestamp
- [ ] No warning message shown
- [ ] Badge is green colored

**Manual verification in MongoDB:**
```javascript
// Use MongoDB Compass or CLI
db.donations.find({ email: "testuser@example.com" })

// Should show:
{
  email: "testuser@example.com",
  amount: 500,
  paymentStatus: "PAID",  // Changed from PENDING
  verifiedAt: ISODate("...") // Timestamp added
}
```

- [ ] MongoDB document updated to PAID
- [ ] verifiedAt timestamp is set

## Testing Phase 4: Multiple Donations

### Test 4.1: Create Second Donation
1. Go to /donate
2. Enter amount: 1000
3. Complete flow (Form + Sheet)
4. Wait for verification

- [ ] Both donations show on dashboard
- [ ] Each has correct amount and status
- [ ] Sorted by newest first

### Test 4.2: Create Third Donation (Don't Pay)
1. Create donation for ₹250
2. Don't fill Google Form
3. Check dashboard

- [ ] Shows PENDING status
- [ ] Other paid donations still show PAID
- [ ] Warning message only on pending donation

## Testing Phase 5: Error Handling

### Test 5.1: Invalid Signup
Try signup with:
- [ ] Empty fields → Shows validation error
- [ ] Password < 6 chars → Shows error
- [ ] Duplicate email → Shows "User already exists"

### Test 5.2: Invalid Login
Try login with:
- [ ] Wrong password → Shows "Invalid credentials"
- [ ] Non-existent email → Shows "Invalid credentials"
- [ ] Empty fields → Shows validation error

### Test 5.3: Invalid Donation
Try creating donation with:
- [ ] Amount = 0 → Shows validation error
- [ ] Negative amount → Shows validation error
- [ ] No token (logged out) → Redirects to login

### Test 5.4: Expired Token
1. Manually edit localStorage token to invalid value
2. Try accessing /dashboard
- [ ] Gets 401 error
- [ ] Redirects to login

### Test 5.5: Wrong Google Sheet Data
Add a row to Google Sheet with:
- Email: "testuser@example.com"
- Amount: 999 (doesn't match any donation)
- Status: PAID

Wait for verification:
- [ ] Backend doesn't verify it (no matching donation)
- [ ] Logs show "No pending donations to verify" or skips this entry

## Testing Phase 6: Security Tests

### Test 6.1: Password Hashing
Check MongoDB:
- [ ] Password field is hashed (not plain text)
- [ ] Starts with `$2a$` or `$2b$` (bcrypt format)

### Test 6.2: JWT Validation
Try API calls:
- [ ] Without Authorization header → 401
- [ ] With "Bearer fake-token" → 401
- [ ] With valid token → 200 OK

### Test 6.3: Google Sheets Access
Verify:
- [ ] Service account has only "Viewer" permission
- [ ] Backend can READ sheet data
- [ ] Backend cannot WRITE to sheet (confirm by testing manually)
- [ ] Frontend has no sheet access (only form URL)

### Test 6.4: User Isolation
1. Create second user account
2. Create donations for both users
3. Login as user1 and check dashboard
- [ ] Only sees own donations
- [ ] Cannot see other user's donations

## Testing Phase 7: Performance & Edge Cases

### Test 7.1: Auto-Refresh
On dashboard:
- [ ] Page auto-refreshes every 10 seconds
- [ ] New verifications appear without manual refresh

### Test 7.2: Concurrent Donations
Create multiple donations quickly:
- [ ] All get created in MongoDB
- [ ] All show on dashboard
- [ ] Verification handles multiple at once

### Test 7.3: Large Amounts
Try donations with:
- [ ] ₹1 (minimum) → Works
- [ ] ₹100,000 → Works
- [ ] ₹1,00,00,000 → Works

### Test 7.4: Special Characters in Email
Signup with emails like:
- [ ] `test+tag@example.com`
- [ ] `user.name@domain.com`
- [ ] Works for signup, donation, verification

### Test 7.5: Cron Job Reliability
- [ ] Cron runs exactly every 2 minutes
- [ ] Doesn't crash on errors
- [ ] Continues running after verification failures

## Testing Phase 8: Mobile Responsiveness

Test on mobile or resize browser:
- [ ] Navbar adapts to mobile
- [ ] Forms are usable on mobile
- [ ] Dashboard cards stack vertically
- [ ] Donate page columns stack
- [ ] Google Form works on mobile

## Final Verification Checklist

### Documentation
- [ ] README.md is complete and accurate
- [ ] SETUP_GUIDE.md covers all steps
- [ ] GOOGLE_SETUP_GUIDE.md is detailed
- [ ] All file paths are correct

### Code Quality
- [ ] No console errors in browser
- [ ] No unhandled promise rejections
- [ ] Backend logs are clear and helpful
- [ ] All API responses have consistent format

### Security
- [ ] .env file is in .gitignore
- [ ] Passwords are hashed
- [ ] JWT tokens expire correctly
- [ ] Google Sheets is READ-ONLY

### Features Completion
- [x] User signup with validation
- [x] User login with JWT
- [x] JWT token expiry (7 days)
- [x] bcrypt password hashing
- [x] Protected API routes
- [x] Create donation (PENDING status)
- [x] Google Form redirection with pre-fill
- [x] Google Sheets integration (READ-ONLY)
- [x] Auto-verification cron job (every 2 minutes)
- [x] Dashboard with payment status
- [x] "Payment Received ✅" on verification
- [x] Dashboard auto-refresh (every 10 seconds)
- [x] Backend-only Google Sheets access

## Common Issues Encountered

Document any issues found during testing:

| Issue | Resolution | Status |
|-------|-----------|--------|
| Example: MongoDB not connecting | Started MongoDB service | ✅ Fixed |
|  |  |  |
|  |  |  |

## Test Results Summary

- **Total Tests Performed:** _____
- **Passed:** _____
- **Failed:** _____
- **Skipped:** _____

**Overall Status:** ⬜ Pass / ⬜ Fail / ⬜ Needs Review

---

## Sign-off

**Tested By:** _________________  
**Date:** _________________  
**Environment:** Localhost (Windows + PowerShell)  
**Node Version:** _________________  
**MongoDB Version:** _________________  

**Notes:**
_________________________________________________
_________________________________________________
_________________________________________________

**Ready for Production?** ⬜ Yes / ⬜ No / ⬜ Needs Changes
