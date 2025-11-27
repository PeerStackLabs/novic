import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';
import InfoPanel from '../components/InfoPanel';

const Donate = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || amount < 1) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      // Create donation in backend (status: PENDING)
      const response = await axiosClient.post(ENDPOINTS.DONATIONS.CREATE, { amount: parseFloat(amount) });

      // Get donation email from response
      const donationEmail = response.data.donation.email;

      // Redirect to Google Form with pre-filled data
      // TODO: Replace entry.XXXXXXXXX with actual entry IDs from your Google Form
      // To find entry IDs: Right-click on form fields → Inspect → Look for name="entry.XXXXXXXXX"
      const formUrl = `https://docs.google.com/forms/d/e/1FAIpQLSfu0krfVFOXgRaBns1rh1qP3VYP3cgJyeNHHQsNFCkB1Glhpw/viewform?usp=pp_url&entry.EMAIL_ENTRY_ID=${encodeURIComponent(donationEmail)}&entry.AMOUNT_ENTRY_ID=${amount}`;
      
      // Open Google Form in new tab
      window.open(formUrl, '_blank');

      // Show success message
      alert('Donation created! Please complete the payment in the Google Form that just opened.');

      // Redirect to profile/dashboard
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-forest mb-4">Give Movement. Give Independence.</h1>
          <p className="text-xl text-gray-600">
            AI-powered prosthetics with intelligent motion chips for underserved individuals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Donation Form */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-serif text-forest mb-6">Make a Donation</h2>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Donation Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-serif text-lg">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    step="1"
                    required
                    className="w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-mint focus:border-transparent outline-none text-lg"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-mint text-forest py-4 rounded-xl font-medium text-lg hover:bg-mint-dark transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-mint/20"
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>

              <p className="text-xs text-center text-gray-500 leading-relaxed">
                After clicking, you'll be redirected to a Google Form to complete the payment simulation securely.
              </p>
            </form>
          </div>

          {/* Info Panel */}
          <div className="space-y-8">
            <InfoPanel title="Your donation funds:">
              <ul className="space-y-3 mt-2">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint"></span>
                  Movement chip R&D
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint"></span>
                  Sensors and prosthetic materials
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint"></span>
                  Assembly and safety testing
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint"></span>
                  Free delivery and user support
                </li>
              </ul>
            </InfoPanel>

            <div className="bg-forest p-8 rounded-3xl text-cream relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-serif mb-4">100% Transparency</h3>
                <p className="text-cream/80 text-sm leading-relaxed mb-6">
                  All donations directly fund prosthetics for poor individuals. Novic Foundation is dedicated to building affordable high-tech prosthetic limbs powered by intelligent embedded chips.
                </p>
                <div className="pt-6 border-t border-white/10">
                  <h4 className="text-sm font-medium text-mint mb-2 uppercase tracking-wider">Core Team</h4>
                  <p className="text-xs text-cream/60">
                    Kunal • Kaushik • Pranathi • Shashank • Sivamshi • Srija
                  </p>
                </div>
              </div>
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-mint/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
