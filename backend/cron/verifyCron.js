const cron = require('node-cron');
const { verifyDonations } = require('../services/donationVerifier');

const startVerificationCron = () => {
  // Run every 2 minutes
  cron.schedule('*/2 * * * *', async () => {
    console.log('\n⏰ Running scheduled donation verification...');
    await verifyDonations();
  });

  console.log('✅ Verification cron job started (runs every 2 minutes)');
};

module.exports = { startVerificationCron };
