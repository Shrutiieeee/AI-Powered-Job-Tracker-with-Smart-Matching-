import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header({ user, onLogout, hasResume }) {
    const location = useLocation();

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="header-left">
                        <h1 className="header-logo">🎯 AI Job Tracker</h1>
                        <nav className="header-nav">
                            <Link
                                to="/"
                                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/app"
                                className={`nav-link ${location.pathname === '/app' ? 'active' : ''}`}
                            >
                                Jobs
                            </Link>
                            <Link
                                to="/app/applications"
                                className={`nav-link ${location.pathname === '/app/applications' ? 'active' : ''}`}
                            >
                                Applications
                            </Link>
                        </nav>
                    </div>

                    <div className="header-right">
                        {!hasResume && (
                            <span className="resume-warning">⚠️ Upload resume</span>
                        )}
                        <span className="user-email">{user.email}</span>
                        <button onClick={onLogout} className="btn btn-outline btn-sm">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
