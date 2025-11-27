import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationAPI } from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDonations();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchDonations, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await donationAPI.getAll();
      setDonations(response.data.donations);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        navigate('/login');
      } else {
        setError('Failed to fetch donations');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'PAID') {
      return <span style={styles.badgePaid}>✅ Payment Received</span>;
    }
    return <span style={styles.badgePending}>⏳ Payment Pending</span>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading your donations...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Your Donations</h1>
        <button onClick={() => navigate('/donate')} style={styles.donateBtn}>
          Make Another Donation
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {donations.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>You haven't made any donations yet.</p>
          <button onClick={() => navigate('/donate')} style={styles.emptyBtn}>
            Make Your First Donation
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {donations.map((donation) => (
            <div key={donation.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.amount}>₹{donation.amount}</span>
                {getStatusBadge(donation.paymentStatus)}
              </div>
              
              <div style={styles.cardBody}>
                <div style={styles.info}>
                  <span style={styles.label}>Email:</span>
                  <span style={styles.value}>{donation.email}</span>
                </div>
                
                <div style={styles.info}>
                  <span style={styles.label}>Created:</span>
                  <span style={styles.value}>{formatDate(donation.createdAt)}</span>
                </div>
                
                {donation.verifiedAt && (
                  <div style={styles.info}>
                    <span style={styles.label}>Verified:</span>
                    <span style={styles.value}>{formatDate(donation.verifiedAt)}</span>
                  </div>
                )}
              </div>

              {donation.paymentStatus === 'PENDING' && (
                <div style={styles.cardFooter}>
                  <p style={styles.footerText}>
                    ⚠️ Complete payment in Google Form to verify this donation
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={styles.note}>
        <h3 style={styles.noteTitle}>Payment Verification</h3>
        <p style={styles.noteText}>
          Once you complete the payment through the Google Form, our backend system will 
          automatically verify your payment from the Google Sheet (every 2 minutes) and 
          update the status to "Payment Received ✅".
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 80px)',
    backgroundColor: '#ecf0f1',
    padding: '2rem 1rem',
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    color: '#2c3e50',
  },
  donateBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#7f8c8d',
  },
  error: {
    maxWidth: '1200px',
    margin: '0 auto 1rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '1rem',
    borderRadius: '4px',
  },
  empty: {
    maxWidth: '1200px',
    margin: '3rem auto',
    backgroundColor: 'white',
    padding: '3rem',
    borderRadius: '8px',
    textAlign: 'center',
  },
  emptyText: {
    margin: '0 0 1.5rem 0',
    fontSize: '1.2rem',
    color: '#7f8c8d',
  },
  emptyBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '0.9rem 1.8rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  grid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #e9ecef',
  },
  amount: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  badgePaid: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  badgePending: {
    backgroundColor: '#f39c12',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  cardBody: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  label: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  value: {
    color: '#2c3e50',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  cardFooter: {
    padding: '1rem 1.5rem',
    backgroundColor: '#fff3cd',
    borderTop: '1px solid #ffeaa7',
  },
  footerText: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#856404',
  },
  note: {
    maxWidth: '1200px',
    margin: '2rem auto 0',
    backgroundColor: '#d1ecf1',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #bee5eb',
  },
  noteTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.2rem',
    color: '#0c5460',
  },
  noteText: {
    margin: 0,
    fontSize: '0.95rem',
    color: '#0c5460',
    lineHeight: '1.6',
  },
};

export default Dashboard;
