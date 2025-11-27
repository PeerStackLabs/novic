import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationAPI } from '../utils/api';

const Donate = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userEmail = localStorage.getItem('userName'); // We'll use the stored email

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
      const response = await donationAPI.create({ amount: parseFloat(amount) });
      
      // Get donation email from response
      const donationEmail = response.data.donation.email;
      
      // Redirect to Google Form with pre-filled data
      // Replace YOUR_FORM_ID and entry IDs with your actual Google Form details
      const formUrl = `https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform?usp=pp_url&entry.EMAIL_FIELD=${encodeURIComponent(donationEmail)}&entry.AMOUNT_FIELD=${amount}`;
      
      // Open Google Form in new tab
      window.open(formUrl, '_blank');
      
      // Show success message
      alert('Donation created! Please complete the payment in the Google Form that just opened.');
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Give Movement. Give Independence.</h1>
        <p style={styles.heroText}>
          AI-powered prosthetics with intelligent motion chips for poor disabled individuals
        </p>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.title}>Make a Donation</h2>
          
          <div style={styles.info}>
            <h3 style={styles.infoTitle}>Your donation will fund:</h3>
            <ul style={styles.list}>
              <li>Movement chip R&D</li>
              <li>Sensors and prosthetic materials</li>
              <li>Assembly and safety testing</li>
              <li>Free delivery and user support</li>
            </ul>
            <p style={styles.transparency}>
              <strong>100% Transparency:</strong> All donations directly fund prosthetics for poor individuals.
            </p>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Donation Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="1"
                required
                style={styles.input}
                placeholder="Enter amount in ₹"
              />
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>

            <p style={styles.note}>
              After clicking, you'll be redirected to a Google Form to complete the payment simulation.
            </p>
          </form>
        </div>

        <div style={styles.impact}>
          <h3 style={styles.impactTitle}>About KMEC</h3>
          <p style={styles.impactText}>
            KMEC is dedicated to building affordable high-tech prosthetic limbs powered by 
            intelligent embedded chips to help economically challenged disabled individuals 
            regain natural motion, dignity, and independence.
          </p>
          
          <div style={styles.team}>
            <h4 style={styles.teamTitle}>Core Team</h4>
            <p style={styles.teamMembers}>
              Kunal • Kaushik • Pranathi • Shashank • Sivamshi • Srija
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 80px)',
    backgroundColor: '#ecf0f1',
  },
  hero: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '3rem 1rem',
    textAlign: 'center',
  },
  heroTitle: {
    margin: '0 0 1rem 0',
    fontSize: '2.5rem',
    fontWeight: 'bold',
  },
  heroText: {
    margin: 0,
    fontSize: '1.2rem',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: '1.6',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0 0 1.5rem 0',
    fontSize: '1.8rem',
    color: '#2c3e50',
  },
  info: {
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  infoTitle: {
    margin: '0 0 0.75rem 0',
    fontSize: '1.1rem',
    color: '#2c3e50',
  },
  list: {
    margin: '0 0 1rem 0',
    paddingLeft: '1.5rem',
    lineHeight: '1.8',
  },
  transparency: {
    margin: 0,
    fontSize: '0.95rem',
    color: '#27ae60',
  },
  error: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    color: '#2c3e50',
    fontSize: '1rem',
    fontWeight: '500',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '1rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1.1rem',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  note: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#7f8c8d',
    textAlign: 'center',
  },
  impact: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  impactTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.5rem',
    color: '#2c3e50',
  },
  impactText: {
    margin: '0 0 1.5rem 0',
    lineHeight: '1.8',
    color: '#34495e',
  },
  team: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  teamTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem',
    color: '#2c3e50',
  },
  teamMembers: {
    margin: 0,
    fontSize: '0.95rem',
    color: '#7f8c8d',
  },
};

export default Donate;
