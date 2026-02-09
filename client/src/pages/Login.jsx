import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authAPI } from '../api';
import './Login.css';

function Login({ onLogin }) {
    const location = useLocation();
    const successMsg = location.state?.message;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await authAPI.login(email, password);
            onLogin(data.user, data.token);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <Link to="/" className="back-home-link">← Back to Home</Link>
                <div className="login-header">
                    <h1>🎯 AI Job Tracker</h1>
                    <p>Smart job matching powered by AI</p>
                </div>

                {successMsg && <div className="success-message">{successMsg}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="label">Email</label>
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="test@gmail.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="label">Password</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="test@123"
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? <span className="loading"></span> : 'Sign In'}
                    </button>

                    <div className="login-hint">
                        <p className="text-sm text-muted">Don't have an account? <Link to="/register">Sign Up</Link></p>
                        <p className="text-xs text-muted" style={{ marginTop: '0.5rem' }}>Demo: test@gmail.com | test@123</p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
