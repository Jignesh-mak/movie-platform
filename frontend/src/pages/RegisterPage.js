import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/slices/authSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [localError, setLocalError] = useState('');

  useEffect(() => { dispatch(clearError()); }, []); // eslint-disable-line

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setLocalError('Passwords do not match'); return; }
    setLocalError('');
    const result = await dispatch(registerUser({ username: form.username, email: form.email, password: form.password }));
    if (!result.error) navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">CINEMA<span>VERSE</span></div>
        <p className="auth-subtitle">Create your account and start exploring</p>
        {(error || localError) && <div className="alert alert-error">{error || localError}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" type="text" placeholder="cooluser123"
              value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Min. 6 characters"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" placeholder="Repeat password"
              value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
          </div>
          <button className="btn-full" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
