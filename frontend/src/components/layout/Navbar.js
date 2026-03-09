import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { clearUserData } from '../../store/slices/userSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearUserData());
    navigate('/');
    setDropdownOpen(false);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('light');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="nav-logo">
          CINEMA<span>VERSE</span>
        </Link>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/movies" onClick={() => setMenuOpen(false)}>Movies</NavLink></li>
          <li><NavLink to="/tv" onClick={() => setMenuOpen(false)}>TV Shows</NavLink></li>
          <li><NavLink to="/people" onClick={() => setMenuOpen(false)}>People</NavLink></li>
          {user?.role === 'admin' && (
            <li><NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink></li>
          )}
        </ul>

        <div className="nav-right">
          <button className="nav-search-btn" onClick={() => navigate('/search')} title="Search">
            🔍
          </button>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {darkMode ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="nav-dropdown" ref={dropdownRef}>
              <div className="nav-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user.username[0].toUpperCase()}
              </div>
              {dropdownOpen && (
                <div className="nav-dropdown-menu">
                  <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid var(--border)', marginBottom: '6px' }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{user.username}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.email}</div>
                  </div>
                  <Link to="/favorites" onClick={() => setDropdownOpen(false)}>❤️ Favorites</Link>
                  <Link to="/watchlist" onClick={() => setDropdownOpen(false)}>🔖 Watchlist</Link>
                  <Link to="/history" onClick={() => setDropdownOpen(false)}>🕐 Watch History</Link>
                  {user.role === 'admin' && (
                    <>
                      <div className="divider" />
                      <Link to="/admin" onClick={() => setDropdownOpen(false)}>⚙️ Admin Panel</Link>
                    </>
                  )}
                  <div className="divider" />
                  <button onClick={handleLogout}>🚪 Log Out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-login">Log In</Link>
              <Link to="/register" className="btn-signup">Sign Up</Link>
            </>
          )}

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
