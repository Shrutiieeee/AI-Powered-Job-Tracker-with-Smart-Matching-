import { Link } from 'react-router-dom';
import './Home.css';

function Home({ user }) {
    return (
        <div className="home">
            <header className="home-header">
                <div className="container">
                    <div className="home-nav">
                        <div className="logo">🎯 AI Job Tracker</div>
                        <div className="nav-actions">
                            {user ? (
                                <Link to="/app" className="btn btn-primary">Go to Dashboard</Link>
                            ) : (
                                <Link to="/login" className="btn btn-primary">Login</Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main>
                <section className="hero">
                    <div className="container">
                        <div className="hero-content fade-in">
                            <h1>Landing your dream job is now <span className="text-gradient">smarter</span></h1>
                            <p>Track your applications, match your resume with AI, and get personalized insights to boost your career.</p>
                            <div className="hero-btns">
                                {user ? (
                                    <Link to="/app" className="btn btn-primary btn-lg">View My Jobs</Link>
                                ) : (
                                    <>
                                        <Link to="/login" className="btn btn-primary btn-lg">Get Started Now</Link>
                                        <a href="#features" className="btn btn-outline btn-lg">Learn More</a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="features">
                    <div className="container">
                        <h2 className="section-title">Why choose AI Job Tracker?</h2>
                        <div className="features-grid">
                            <div className="feature-card card">
                                <div className="feature-icon">🤖</div>
                                <h3>AI Smart Matching</h3>
                                <p>Our AI analyzes your resume against job descriptions to give you a match score and expert feedback.</p>
                            </div>
                            <div className="feature-card card">
                                <div className="feature-icon">📈</div>
                                <h3>Track Progress</h3>
                                <p>Keep a detailed timeline of all your applications, from initial apply to final offer.</p>
                            </div>
                            <div className="feature-card card">
                                <div className="feature-icon">💬</div>
                                <h3>AI Assistant</h3>
                                <p>Talk to our built-in assistant to filter jobs, ask for advice, and navigate your career path.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="home-footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} AI Job Tracker. Minimum Effort, Maximum Success.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;
