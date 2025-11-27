const { google } = require('googleapis');

let sheetsClient = null;

const initGoogleSheets = () => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    sheetsClient = google.sheets({ version: 'v4', auth });
    console.log('✅ Google Sheets API Initialized (READ-ONLY)');
    return sheetsClient;
  } catch (error) {
    console.error('❌ Google Sheets Initialization Error:', error.message);
    return null;
  }
};

const getSheetsClient = () => {
  if (!sheetsClient) {
    return initGoogleSheets();
  }
  return sheetsClient;
};

module.exports = { initGoogleSheets, getSheetsClient };
