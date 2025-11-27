const cron = require('node-cron');
const { verifyDonations } = require('../services/donationVerifier');

const startVerificationCron = () => {
  // Run every 5 minutes (cleanup for any missed donations)
  cron.schedule('*/5 * * * *', async () => {
    console.log('\n⏰ Running scheduled donation verification cleanup...');
    await verifyDonations();
  });

  console.log('✅ Verification cron job started (cleanup runs every 5 minutes)');
};

module.exports = { startVerificationCron };
