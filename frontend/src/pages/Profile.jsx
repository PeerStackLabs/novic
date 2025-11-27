import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/endpoints';
import { formatCurrency, formatDate } from '../utils';
import Badge from '../components/Badge';

const Profile = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchDonations, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, donationsRes] = await Promise.all([
        axiosClient.get(ENDPOINTS.AUTH.ME),
        axiosClient.get(ENDPOINTS.DONATIONS.GET_ALL)
      ]);
      setUser(userRes.data);
      setDonations(donationsRes.data.donations);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await axiosClient.get(ENDPOINTS.DONATIONS.GET_ALL);
      setDonations(response.data.donations);
    } catch (err) {
      // Silent fail for polling
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'PAID') {
      return <Badge variant="success">✅ Payment Received</Badge>;
    }
    if (status === 'NOT_RECEIVED') {
      return <Badge variant="error">❌ Payment Not Received</Badge>;
    }
    return <Badge variant="warning">⏳ Payment Pending</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <div className="text-xl text-gray-500">Loading your profile...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-serif text-forest mb-2">Your Donations</h1>
          {user && <p className="text-gray-600">Welcome back, {user.name}</p>}
        </div>
        <button 
          onClick={() => navigate('/donate')} 
          className="bg-mint text-forest px-6 py-3 rounded-full font-medium hover:bg-mint-dark transition-colors shadow-lg shadow-mint/20"
        >
          Make Another Donation
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      {donations.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center shadow-sm border border-gray-100">
          <p className="text-xl text-gray-500 mb-6">You haven't made any donations yet.</p>
          <button 
            onClick={() => navigate('/donate')} 
            className="bg-forest text-cream px-8 py-3 rounded-full font-medium hover:bg-forest-light transition-colors"
          >
            Make Your First Donation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <div key={donation._id || donation.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <span className="text-2xl font-serif font-bold text-forest">{formatCurrency(donation.amount)}</span>
                {getStatusBadge(donation.paymentStatus)}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-forest">{donation.email}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Created</span>
                  <span className="font-medium text-forest">{formatDate(donation.createdAt)}</span>
                </div>

                {donation.verifiedAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Verified</span>
                    <span className="font-medium text-forest">{formatDate(donation.verifiedAt)}</span>
                  </div>
                )}
              </div>

              {donation.paymentStatus === 'PENDING' && (
                <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-100">
                  <p className="text-xs text-yellow-800 flex items-start gap-2">
                    <span>⚠️</span>
                    Complete payment in Google Form to verify this donation
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 bg-blue-50 p-8 rounded-3xl border border-blue-100">
        <h3 className="text-lg font-serif font-bold text-blue-900 mb-2">Payment Verification Process</h3>
        <p className="text-blue-800 text-sm leading-relaxed">
          Once you complete the payment through the Google Form, our backend system will
          automatically verify your payment from the Google Sheet (every 2 minutes) and
          update the status to "Payment Received ✅".
        </p>
      </div>
    </div>
  );
};

export default Profile;
