import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          <h2 style={styles.brandText}>KMEC</h2>
        </Link>
        
        <div style={styles.menu}>
          {token ? (
            <>
              <span style={styles.greeting}>Welcome, {userName}</span>
              <Link to="/donate" style={styles.link}>Donate</Link>
              <Link to="/dashboard" style={styles.link}>Dashboard</Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#2c3e50',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    textDecoration: 'none',
    color: 'white',
  },
  brandText: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  greeting: {
    color: '#ecf0f1',
    fontSize: '0.95rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'color 0.3s',
  },
  signupBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '0.5rem 1.2rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '0.5rem 1.2rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default Navbar;
