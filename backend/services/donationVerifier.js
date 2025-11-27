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

    // Get all PENDING donations
    const pendingDonations = await Donation.find({ paymentStatus: 'PENDING' });

    if (pendingDonations.length === 0) {
      console.log('✓ No pending donations to verify');
      return;
    }

    console.log(`📋 Found ${pendingDonations.length} pending donation(s)`);

    // Read Google Sheet data (READ-ONLY)
    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:C', // Email | Amount | Status
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      console.log('⚠ No payment data found in Google Sheet');
      return;
    }

    // Skip header row
    const paymentData = rows.slice(1);

    let verifiedCount = 0;

    // Check each pending donation
    for (const donation of pendingDonations) {
      // Find matching entry in Google Sheet
      const matchingRow = paymentData.find(row => {
        const sheetEmail = row[0]?.trim().toLowerCase();
        const sheetAmount = parseFloat(row[1]);
        const sheetStatus = row[2]?.trim().toUpperCase();

        return (
          sheetEmail === donation.email.toLowerCase() &&
          sheetAmount === donation.amount &&
          sheetStatus === 'PAID'
        );
      });

      if (matchingRow) {
        // Update donation to PAID
        donation.paymentStatus = 'PAID';
        donation.verifiedAt = new Date();
        await donation.save();

        verifiedCount++;
        console.log(`✅ Verified donation: ${donation.email} - ₹${donation.amount}`);
      }
    }

    console.log(`✓ Verification complete: ${verifiedCount} donation(s) verified`);
  } catch (error) {
    console.error('❌ Donation verification error:', error.message);
  }
};

module.exports = { verifyDonations };
