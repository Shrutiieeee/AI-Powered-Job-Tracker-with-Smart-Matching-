import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import JobFeed from '../components/JobFeed';
import Applications from '../components/Applications';
import Assistant from '../components/Assistant';
import ResumeUpload from '../components/ResumeUpload';
import { resumeAPI } from '../api';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
    const [hasResume, setHasResume] = useState(user.hasResume);
    const [showAssistant, setShowAssistant] = useState(false);
    const [filters, setFilters] = useState({});

    const handleResumeUploaded = () => {
        setHasResume(true);
    };

    const handleFiltersFromAssistant = (newFilters) => {
        if (newFilters.clear) {
            setFilters({});
        } else {
            setFilters(prev => ({ ...prev, ...newFilters }));
        }
    };

    return (
        <div className="dashboard">
            <Header user={user} onLogout={onLogout} hasResume={hasResume} />

            <main className="dashboard-main">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <JobFeed
                                hasResume={hasResume}
                                externalFilters={filters}
                                onClearFilters={() => setFilters({})}
                            />
                        }
                    />
                    <Route path="/applications" element={<Applications />} />
                </Routes>
            </main>

            {!hasResume && (
                <ResumeUpload onUploaded={handleResumeUploaded} />
            )}

            <Assistant
                isOpen={showAssistant}
                onToggle={() => setShowAssistant(!showAssistant)}
                onFiltersUpdate={handleFiltersFromAssistant}
            />
        </div>
    );
}

export default Dashboard;
