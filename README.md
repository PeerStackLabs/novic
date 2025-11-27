# Novic Foundation Platform

**Give Movement. Give Independence.**

A full-stack MERN donation platform for Novic Foundation - providing AI-powered prosthetics with intelligent motion chips for poor disabled individuals.

## Features

✅ **User Authentication**
- Signup/Login with name, email, and password
- bcrypt password hashing
- JWT authentication with 7-day expiry
- Protected API routes

✅ **Donation Management**
- Create donations with PENDING status
- Google Form integration for payment simulation
- Automatic verification from Google Sheets
- Dashboard showing payment status

✅ **Backend Auto-Verification**
- Reads Google Sheets (READ-ONLY) every 2 minutes
- Matches Email + Amount + "PAID" status
- Updates MongoDB: PENDING → PAID with timestamp
- Secure backend-only access to Google Sheets

✅ **Client Dashboard**
- Shows all user donations
- Real-time status: "Payment Pending ⏳" or "Payment Received ✅"
- Auto-refreshes every 10 seconds

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcrypt for password hashing
- Google Sheets API (googleapis)
- node-cron for scheduled verification

**Frontend:**
- React 18
- React Router v6
- Axios for API calls
- Inline CSS styling

## Project Structure

```
novic/
├── backend/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── googleAuth.js            # Google Sheets API setup
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication middleware
│   ├── models/
│   │   ├── User.js                  # User schema with bcrypt
│   │   └── Donation.js              # Donation schema
│   ├── routes/
│   │   ├── auth.js                  # Signup/Login/Me endpoints
│   │   └── donations.js             # Donation CRUD endpoints
│   ├── services/
│   │   └── donationVerifier.js      # Google Sheets verification logic
│   ├── cron/
│   │   └── verifyCron.js            # Scheduled verification job
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Environment template
│   ├── package.json
│   └── index.js                     # Server entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── Navbar.js            # Navigation bar
    │   ├── pages/
    │   │   ├── Login.js             # Login page
    │   │   ├── Signup.js            # Signup page
    │   │   ├── Donate.js            # Donation form
    │   │   └── Dashboard.js         # User donations dashboard
    │   ├── utils/
    │   │   └── api.js               # Axios API client
    │   ├── App.js                   # Main app with routing
    │   └── index.js                 # React entry point
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- Google Account (for Google Forms and Sheets)

### 1. Clone and Install

```bash
# Navigate to project folder
cd novic

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service (Windows)
net start MongoDB
```

**Option B: MongoDB Atlas**
1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Use in `.env` file

### 3. Google Sheets API Setup

#### Step 1: Create Google Cloud Project
1. Go to https://console.cloud.google.com/
2. Create a new project (e.g., "Novic Donations")
3. Enable **Google Sheets API**:
   - Go to "APIs & Services" > "Enable APIs and Services"
   - Search "Google Sheets API"
   - Click "Enable"

#### Step 2: Create Service Account
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Name it (e.g., "novic-sheets-reader")
4. Grant role: "Viewer" (READ-ONLY access)
5. Click "Done"

#### Step 3: Generate Private Key
1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Choose "JSON"
5. Download the JSON file
6. Open it and copy:
   - `client_email` → Use for `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → Use for `GOOGLE_PRIVATE_KEY`

#### Step 4: Create Google Sheet
1. Create a new Google Sheet
2. Name it "Novic Donations Tracker"
3. Add headers in first row:
   ```
   A1: Email
   B1: Amount
   C1: Status
   ```
4. Share the sheet:
   - Click "Share" button
   - Paste the `client_email` (service account email)
   - Give "Viewer" access (READ-ONLY)
   - Click "Send"
5. Copy the Sheet ID from URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```

#### Step 5: Create Google Form
1. Go to https://forms.google.com/
2. Create new form: "Novic Donation Payment"
3. Add questions:
   - **Email** (Short answer, required)
   - **Amount** (Short answer, required)
   - **Status** (Dropdown: PENDING, PAID) - Default: PAID
4. Link to Google Sheet:
   - Click "Responses" tab
   - Click green Sheets icon
   - Select "Create a new spreadsheet" or link to existing
5. Copy Form URL for frontend integration

### 4. Backend Configuration

Create `backend/.env` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/novic-donation

# JWT Secret (Change this!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_make_it_long_and_random

# Server Port
PORT=5000

# Google Sheets Configuration
GOOGLE_SHEET_ID=your_google_sheet_id_from_url
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here (paste entire key with \\n preserved)\n-----END PRIVATE KEY-----\n"

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Important Notes:**
- Keep the quotes around `GOOGLE_PRIVATE_KEY`
- Preserve the `\n` newline characters in the private key
- Never commit `.env` to Git

### 5. Frontend Configuration

Update `frontend/src/pages/Donate.js` line 29:

```javascript
// Replace YOUR_FORM_ID with your actual Google Form ID
const formUrl = `https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?usp=pp_url&entry.EMAIL_FIELD=${encodeURIComponent(userEmail)}&entry.AMOUNT_FIELD=${amount}`;
```

**How to get Form Field IDs:**
1. Open your Google Form
2. Click "Preview" (eye icon)
3. Right-click page > "View Page Source"
4. Search for `entry.` to find field entry IDs
5. Example: `entry.123456789` for email field

Update the form URL:
```javascript
const formUrl = `https://docs.google.com/forms/d/e/1FAIpQLSe.../viewform?usp=pp_url&entry.123456789=${encodeURIComponent(userEmail)}&entry.987654321=${amount}`;
```

### 6. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

Server runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Frontend runs on: http://localhost:3000

## Usage Flow

### 1. User Registration
1. Visit http://localhost:3000
2. Click "Sign Up"
3. Enter name, email, password
4. Redirected to Donate page

### 2. Make Donation
1. Enter donation amount
2. Click "Proceed to Payment"
3. Donation created in MongoDB with status: PENDING
4. Redirected to Google Form (opens in new tab)

### 3. Simulate Payment
1. Fill Google Form with same email and amount
2. Select Status: "PAID"
3. Submit form
4. Data appears in linked Google Sheet

### 4. Auto-Verification
1. Backend cron job runs every 2 minutes
2. Reads Google Sheet (READ-ONLY)
3. Finds matching: Email + Amount + "PAID"
4. Updates MongoDB: PENDING → PAID
5. Sets `verifiedAt` timestamp

### 5. Check Dashboard
1. Go to Dashboard page
2. See donation status update to "Payment Received ✅"
3. Page auto-refreshes every 10 seconds

## API Endpoints

### Authentication
```
POST   /api/auth/signup      # Register new user
POST   /api/auth/login       # Login user
GET    /api/auth/me          # Get current user (protected)
```

### Donations
```
POST   /api/donations        # Create donation (protected)
GET    /api/donations        # Get user donations (protected)
GET    /api/donations/:id    # Get single donation (protected)
```

### Health Check
```
GET    /api/health           # Server health check
```

## Security Features

✅ **Password Security**
- bcrypt hashing with salt rounds
- Passwords never stored in plain text

✅ **JWT Authentication**
- Token expires in 7 days
- Token required for protected routes
- Token validation on every request

✅ **Google Sheets Security**
- READ-ONLY access
- Service account (not user account)
- Backend-only access (client cannot read/write)

✅ **Input Validation**
- Email format validation
- Password minimum length (6 chars)
- Amount must be positive number

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service (Windows)
net start MongoDB

# Or use MongoDB Atlas connection string
```

### Google Sheets API Error
- Verify service account email has access to sheet
- Check private key format (must include \n)
- Ensure Google Sheets API is enabled in Cloud Console
- Check Sheet ID is correct

### JWT Token Expired
- Login again to get new token
- Tokens last 7 days by default

### Donation Not Verifying
- Check cron job is running (console logs every 2 min)
- Verify email and amount match exactly
- Ensure "PAID" status is uppercase in sheet
- Wait 2 minutes for next cron run

### Port Already in Use
```bash
# Backend (port 5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Frontend (port 3000)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Development Notes

### Verification Frequency
Change cron schedule in `backend/cron/verifyCron.js`:
```javascript
// Every 2 minutes (default)
cron.schedule('*/2 * * * *', ...)

// Every 30 seconds (for testing)
cron.schedule('*/30 * * * * *', ...)

// Every 5 minutes
cron.schedule('*/5 * * * *', ...)
```

### JWT Expiry
Change token expiry in `backend/routes/auth.js`:
```javascript
jwt.sign({ userId }, process.env.JWT_SECRET, {
  expiresIn: '7d', // Change to '1d', '12h', '30m', etc.
});
```

## Team

- Kunal
- Kaushik
- Pranathi
- Shashank
- Sivamshi
- Srija

## Mission

Novic Foundation is dedicated to building affordable high-tech prosthetic limbs powered by intelligent embedded chips to help economically challenged disabled individuals regain natural motion, dignity, and independence.

**100% of donations directly fund:**
- Movement chip R&D
- Sensors and prosthetic materials
- Assembly and safety testing
- Free delivery and user support

---

**License:** MIT

**Support:** For questions about setup or configuration, please provide:
1. Error message
2. Which step you're on
3. Console logs from terminal
