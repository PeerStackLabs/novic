const cron = require('node-cron');
const { verifyDonations } = require('../services/donationVerifier');

/**
 * Cron job to verify donations every 2 minutes
 * Pattern: */2 * * * * (every 2 minutes)
 */
const startVerificationCron = () => {
  // Run every 2 minutes
  cron.schedule('*/2 * * * *', async () => {
    console.log('\n⏰ Running scheduled donation verification...');
    await verifyDonations();
  });

  console.log('✅ Verification cron job started (runs every 2 minutes)');
};

module.exports = { startVerificationCron };
