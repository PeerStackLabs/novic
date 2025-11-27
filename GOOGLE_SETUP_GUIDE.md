# Google Form & Sheets Configuration Guide

This guide will help you set up the Google Form and Google Sheets integration for the Novic Foundation Platform.

## Part 1: Google Cloud Console Setup

### Step 1: Create Google Cloud Project
1. Go to https://console.cloud.google.com/
2. Click "Select a project" dropdown at the top
3. Click "New Project"
4. Project name: `Novic Foundation Platform`
5. Click "Create"
6. Wait for project creation (10-15 seconds)

### Step 2: Enable Google Sheets API
1. Make sure your new project is selected
2. Click hamburger menu (☰) → "APIs & Services" → "Library"
3. Search for "Google Sheets API"
4. Click on it
5. Click "Enable" button
6. Wait for API to be enabled

### Step 3: Create Service Account
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Service account details:
   - **Name:** `novic-sheets-reader`
   - **Service account ID:** (auto-filled)
   - **Description:** `Read-only access to donation verification sheet`
4. Click "Create and Continue"
5. **Grant this service account access to project:**
   - Select role: "Basic" → "Viewer"
   - Click "Continue"
6. Click "Done"

### Step 4: Generate Service Account Key
1. On the Credentials page, find your service account in the list
2. Click on the service account name (not the edit icon)
3. Go to "Keys" tab
4. Click "Add Key" → "Create New Key"
5. Select "JSON" format
6. Click "Create"
7. JSON file downloads automatically
8. **Save this file securely** - you'll need it for backend configuration

### Step 5: Get Credentials from JSON File
Open the downloaded JSON file and find these values:

```json
{
  "client_email": "novic-sheets-reader@your-project.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYour long private key...\n-----END PRIVATE KEY-----\n"
}
```

Copy these values - you'll use them in your `.env` file.

## Part 2: Google Sheet Setup

### Step 1: Create Google Sheet
1. Go to https://sheets.google.com/
2. Click "+ Blank" to create new sheet
3. Name it: `Novic Donation Tracker`

### Step 2: Set Up Column Headers
In the first row (Row 1), add these headers:

| A1 | B1 | C1 |
|----|----|----|
| Email | Amount | Status |

### Step 3: Format the Sheet (Optional but Recommended)
1. Select Row 1 (header row)
2. Make it **bold**
3. Change background color to light blue
4. Freeze header row: View → Freeze → 1 row

### Step 4: Share Sheet with Service Account
1. Click the "Share" button (top right)
2. In "Add people and groups" field, paste your service account email:
   - Example: `novic-sheets-reader@your-project.iam.gserviceaccount.com`
3. Set permission to **Viewer** (READ-ONLY)
4. **UNCHECK** "Notify people" (no need to send email)
5. Click "Share" or "Send"

### Step 5: Get Sheet ID
From the Google Sheet URL:
```
https://docs.google.com/spreadsheets/d/1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R9s0T1u2V/edit
```

The Sheet ID is the part between `/d/` and `/edit`:
```
1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R9s0T1u2V
```

Copy this ID - you'll use it in your `.env` file.

## Part 3: Google Form Setup

### Step 1: Create Google Form
1. Go to https://forms.google.com/
2. Click "+ Blank" to create new form
3. Title: `Novic Donation Payment Verification`
4. Description: `Please confirm your donation payment details`

### Step 2: Add Form Questions

**Question 1: Email**
- Question type: Short answer
- Question: `Email Address`
- Make it **Required**
- Add description: `Enter the email you used to create your donation`

**Question 2: Amount**
- Question type: Short answer
- Question: `Donation Amount (₹)`
- Make it **Required**
- Add description: `Enter the exact amount you donated`
- Click ⋮ (three dots) → "Response validation"
  - Select "Number" → "Greater than" → 0

**Question 3: Status**
- Question type: Multiple choice
- Question: `Payment Status`
- Options:
  - ☐ PENDING
  - ☑ PAID (default selected)
- Make it **Required**
- You can set PAID as default since users will only submit after paying

### Step 3: Configure Form Settings
1. Click Settings (gear icon)
2. **General tab:**
   - ☑ Collect email addresses (optional)
   - ☐ Limit to 1 response (unchecked)
   - ☑ Allow response editing
3. **Presentation tab:**
   - ☑ Show progress bar
   - Confirmation message: `Thank you! Your payment has been recorded and will be verified shortly.`

### Step 4: Link Form to Google Sheet
1. Go to "Responses" tab in the form
2. Click the green Sheets icon (Create Spreadsheet)
3. Select "Select existing spreadsheet"
4. Choose your `Novic Donation Tracker` sheet
5. Click "Select"

**Important:** This will add a new sheet tab named "Form Responses 1" in your spreadsheet. The backend verification will read from "Sheet1", so you need to:
- Copy the column headers (Email, Amount, Status) to Sheet1
- Or configure the backend to read from "Form Responses 1"

**Recommended approach:**
Keep both sheets:
- "Form Responses 1" - Auto-populated by form submissions
- "Sheet1" - Copy verified entries here manually or use Apps Script

### Step 5: Get Form URL and Entry IDs
1. Click "Send" button (top right)
2. Click link icon 🔗
3. Copy the form URL
4. Click "Preview" (eye icon)
5. Right-click page → "View Page Source" (Ctrl+U)
6. Search (Ctrl+F) for `entry.` in the source code
7. Find the entry IDs for each field:
   ```
   entry.123456789  ← Email field
   entry.987654321  ← Amount field
   entry.555555555  ← Status field
   ```

### Step 6: Construct Pre-filled Form URL
Your pre-filled form URL format:
```
https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?usp=pp_url&entry.EMAIL_ENTRY_ID=USER_EMAIL&entry.AMOUNT_ENTRY_ID=DONATION_AMOUNT&entry.STATUS_ENTRY_ID=PAID
```

Example:
```
https://docs.google.com/forms/d/e/1FAIpQLSe_AbCdEfGhIjKlMnOpQrStUvWxYz/viewform?usp=pp_url&entry.123456789=john@example.com&entry.987654321=500&entry.555555555=PAID
```

## Part 4: Backend Configuration

### Update `.env` file:
```env
GOOGLE_SHEET_ID=1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R9s0T1u2V
GOOGLE_SERVICE_ACCOUNT_EMAIL=novic-sheets-reader@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here (keep all the \\n newlines)\n-----END PRIVATE KEY-----\n"
```

**Important for GOOGLE_PRIVATE_KEY:**
- Keep the surrounding quotes
- Keep all `\n` characters (they represent newlines)
- Don't add extra spaces or line breaks
- Paste it exactly as it appears in the JSON file

## Part 5: Frontend Configuration

### Update `frontend/src/pages/Donate.js` (line ~29):

Replace:
```javascript
const formUrl = `https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?usp=pp_url&entry.EMAIL_FIELD=${encodeURIComponent(donationEmail)}&entry.AMOUNT_FIELD=${amount}`;
```

With your actual values:
```javascript
const formUrl = `https://docs.google.com/forms/d/e/1FAIpQLSe_YOUR_ACTUAL_FORM_ID/viewform?usp=pp_url&entry.123456789=${encodeURIComponent(donationEmail)}&entry.987654321=${amount}`;
```

## Part 6: Testing

### Test Google Sheets Access
1. Start backend: `cd backend && npm start`
2. Check console for: `✅ Google Sheets API Initialized (READ-ONLY)`
3. If you see errors, check:
   - Service account email is correct
   - Private key format is correct
   - Sheet is shared with service account
   - Sheet ID is correct

### Test End-to-End Flow
1. Start both backend and frontend
2. Sign up for a new account
3. Create a donation (e.g., ₹500)
4. Google Form should open in new tab
5. Form should be pre-filled with email and amount
6. Submit the form
7. Check Google Sheet - new row should appear
8. Wait 2 minutes for backend verification
9. Refresh Dashboard - status should change to "Payment Received ✅"

### Verify Backend Logs
Backend console should show:
```
⏰ Running scheduled donation verification...
🔍 Starting donation verification...
📋 Found 1 pending donation(s)
✅ Verified donation: user@example.com - ₹500
✓ Verification complete: 1 donation(s) verified
```

## Troubleshooting

### Error: "Google Sheets API not enabled"
- Go back to Google Cloud Console
- Enable Google Sheets API
- Wait 2-3 minutes for propagation

### Error: "The caller does not have permission"
- Ensure sheet is shared with service account email
- Check permission is at least "Viewer"
- Try removing and re-adding the service account

### Error: "Invalid private key"
- Check that private key has proper format
- Ensure `\n` characters are preserved
- Quotes must surround the entire key in .env
- Don't add extra spaces

### Form not pre-filling
- Verify entry IDs are correct
- Check URL encoding of email
- Test form URL directly in browser

### Donations not verifying
- Check Sheet ID matches in .env
- Verify sheet has "Sheet1" tab with data
- Ensure Status column has "PAID" (uppercase)
- Email and amount must match exactly
- Wait 2 minutes for cron job to run

### "Request had insufficient authentication scopes"
- Service account needs "Viewer" role
- Sheet must be explicitly shared with service account
- Re-create service account key if needed

## Security Notes

✅ **Backend-only access:** Service account credentials are on backend only  
✅ **READ-ONLY:** Service account can only read, never write  
✅ **No client exposure:** Frontend only knows form URL, not sheet access  
✅ **Secure credentials:** Never commit .env file to Git  

## Next Steps

After completing this setup:
1. Test with a real donation flow
2. Monitor backend logs for verification
3. Check dashboard for status updates
4. Customize form styling if desired
5. Add more form questions if needed (optional)

---

**Need help?** Double-check:
- Service account email matches in .env and sheet sharing
- Sheet ID is correct from URL
- Private key format is exact from JSON file
- Form entry IDs match your specific form
- Backend console shows "✅ Google Sheets API Initialized"
