const { getSheetsClient } = require('../config/googleAuth');
const Donation = require('../models/Donation');

/**
 * Auto-verification service that reads Google Sheets and verifies donations
 * Runs periodically via cron job
 */
const verifyDonations = async () => {
  try {
    console.log('🔍 Starting donation verification...');

    const sheetsClient = getSheetsClient();
    if (!sheetsClient) {
      console.error('❌ Google Sheets client not initialized');
      return;
    }

    const now = new Date();

    // Mark expired donations as NOT_RECEIVED
    const expiredDonations = await Donation.find({
      paymentStatus: 'PENDING',
      verificationExpiresAt: { $lte: now },
    });

    if (expiredDonations.length > 0) {
      for (const donation of expiredDonations) {
        donation.paymentStatus = 'NOT_RECEIVED';
        await donation.save();
        console.log(`⏱️ Marked as NOT_RECEIVED: ${donation.email} - ₹${donation.amount}`);
      }
    }

    // Get all PENDING donations that haven't expired
    const pendingDonations = await Donation.find({
      paymentStatus: 'PENDING',
      verificationExpiresAt: { $gt: now },
    });

    if (pendingDonations.length === 0) {
      console.log('✓ No pending donations to verify');
      return;
    }

    console.log(`📋 Found ${pendingDonations.length} pending donation(s)`);

    // Read Google Sheet data (READ-ONLY)
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Form Responses 1!A:C', // Timestamp | donation amount | email
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      console.log('⚠ No payment data found in Google Sheet');
      return;
    }

    // Skip header row
    const paymentData = rows.slice(1);

    // Track used sheet rows to prevent duplicate matching
    const usedSheetRows = new Set();

    let verifiedCount = 0;

    // Check each pending donation
    for (const donation of pendingDonations) {
      // Find matching entry in Google Sheet
      // Column A = Timestamp, Column B = donation amount, Column C = email
      const matchingRowIndex = paymentData.findIndex((row, index) => {
        // Skip already used rows
        if (usedSheetRows.has(index)) return false;

        const sheetTimestamp = row[0]; // Column A - Google Form timestamp
        const sheetAmount = parseFloat(row[1]); // Column B
        const sheetEmail = row[2]?.trim().toLowerCase(); // Column C

        // Parse sheet timestamp - handle DD/MM/YYYY HH:mm:ss format
        let sheetDate;
        try {
          // Convert DD/MM/YYYY HH:mm:ss to YYYY-MM-DD HH:mm:ss for parsing
          const parts = sheetTimestamp.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
          if (parts) {
            const [_, day, month, year, hour, minute, second] = parts;
            sheetDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
          } else {
            sheetDate = new Date(sheetTimestamp);
          }
        } catch (e) {
          console.error(`⚠ Failed to parse timestamp: ${sheetTimestamp}`);
          return false;
        }
        
        // Match by email AND timestamp should be after donation creation
        // Accept ANY amount paid (no amount validation)
        const emailMatches = sheetEmail === donation.email.toLowerCase();
        const timestampValid = !isNaN(sheetDate.getTime()) && sheetDate >= donation.createdAt;

        // Debug logging
        if (emailMatches && timestampValid) {
          console.log(`🔍 Matching: Donation ₹${donation.amount} (created: ${donation.createdAt.toISOString()})`);
          console.log(`   Sheet: ₹${sheetAmount} at ${sheetDate.toISOString()}`);
        }

        return emailMatches && timestampValid;
      });

      if (matchingRowIndex !== -1) {
        const matchingRow = paymentData[matchingRowIndex];
        const sheetAmount = parseFloat(matchingRow[1]); // Column B - actual paid amount
        const originalAmount = donation.amount;
        
        // Mark this sheet row as used
        usedSheetRows.add(matchingRowIndex);
        
        // Update donation to PAID with actual amount
        donation.paymentStatus = 'PAID';
        donation.amount = sheetAmount; // Update to actual paid amount
        donation.verifiedAt = new Date();
        await donation.save();

        verifiedCount++;
        if (sheetAmount !== originalAmount) {
          console.log(`✅ Verified donation: ${donation.email} - Amount updated: ₹${originalAmount} → ₹${sheetAmount}`);
        } else {
          console.log(`✅ Verified donation: ${donation.email} - ₹${donation.amount}`);
        }
      } else {
        // Increment verification attempts
        donation.verificationAttempts += 1;
        await donation.save();
      }
    }

    console.log(`✓ Verification complete: ${verifiedCount} donation(s) verified`);
  } catch (error) {
    console.error('❌ Donation verification error:', error.message);
  }
};

/**
 * Verify a single donation by ID
 * Returns true if verified, false otherwise
 */
const verifySingleDonation = async (donationId) => {
  try {
    const sheetsClient = getSheetsClient();
    if (!sheetsClient) {
      console.error('❌ Google Sheets client not initialized');
      return false;
    }

    const donation = await Donation.findById(donationId);
    if (!donation || donation.paymentStatus !== 'PENDING') {
      return false;
    }

    // Read Google Sheet data (READ-ONLY)
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Form Responses 1!A:C', // Timestamp | donation amount | email
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return false;
    }

    // Skip header row
    const paymentData = rows.slice(1);

    // Find matching entry in Google Sheet
    // Column A = Timestamp, Column B = donation amount, Column C = email
    const matchingRow = paymentData.find(row => {
      const sheetTimestamp = row[0]; // Column A - Google Form timestamp
      const sheetAmount = parseFloat(row[1]); // Column B
      const sheetEmail = row[2]?.trim().toLowerCase(); // Column C

      // Parse sheet timestamp - handle DD/MM/YYYY HH:mm:ss format
      let sheetDate;
      try {
        // Convert DD/MM/YYYY HH:mm:ss to YYYY-MM-DD HH:mm:ss for parsing
        const parts = sheetTimestamp.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
        if (parts) {
          const [_, day, month, year, hour, minute, second] = parts;
          sheetDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
        } else {
          sheetDate = new Date(sheetTimestamp);
        }
      } catch (e) {
        console.error(`⚠ Failed to parse timestamp: ${sheetTimestamp}`);
        return false;
      }
      
      // Match by email AND timestamp should be after donation creation
      // Accept ANY amount paid (no amount validation)
      const emailMatches = sheetEmail === donation.email.toLowerCase();
      const timestampValid = !isNaN(sheetDate.getTime()) && sheetDate >= donation.createdAt;

      return emailMatches && timestampValid;
    });

    if (matchingRow) {
      const sheetAmount = parseFloat(matchingRow[1]); // Column B - actual paid amount
      const originalAmount = donation.amount;
      
      // Update donation to PAID with actual amount
      donation.paymentStatus = 'PAID';
      donation.amount = sheetAmount; // Update to actual paid amount
      donation.verifiedAt = new Date();
      await donation.save();

      if (sheetAmount !== originalAmount) {
        console.log(`✅ Verified donation: ${donation.email} - Amount updated: ₹${originalAmount} → ₹${sheetAmount}`);
      } else {
        console.log(`✅ Verified donation: ${donation.email} - ₹${donation.amount}`);
      }
      return true;
    }

    // Increment verification attempts
    donation.verificationAttempts += 1;
    await donation.save();
    return false;
  } catch (error) {
    console.error('❌ Single donation verification error:', error.message);
    return false;
  }
};

module.exports = { verifyDonations, verifySingleDonation };
