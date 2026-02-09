import { useState, useEffect } from 'react';
import { applicationsAPI } from '../api';
import './Applications.css';

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const { data } = await applicationsAPI.getAll();
            setApplications(data.applications);
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            await applicationsAPI.update(id, { status: newStatus });
            await fetchApplications();
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading-container">
                    <div className="loading" style={{ width: '40px', height: '40px' }}></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="applications-page">
                <h1>📋 My Applications</h1>

                {applications.length === 0 ? (
                    <div className="no-applications">
                        <p>You haven't applied to any jobs yet.</p>
                        <p className="text-muted">Start applying to jobs to track your progress here!</p>
                    </div>
                ) : (
                    <div className="applications-grid">
                        {applications.map(app => (
                            <div key={app.id} className="application-card">
                                <div className="application-header">
                                    <div>
                                        <h3>{app.jobTitle}</h3>
                                        <p className="company-name">{app.company}</p>
                                    </div>
                                    <select
                                        value={app.status}
                                        onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                                        className="status-select"
                                        disabled={updatingId === app.id}
                                    >
                                        <option value="applied">Applied</option>
                                        <option value="interview">Interview</option>
                                        <option value="offer">Offer</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>

                                <div className="application-timeline">
                                    <h4>Timeline</h4>
                                    {app.timeline.map((event, idx) => (
                                        <div key={idx} className="timeline-event">
                                            <div className="timeline-dot"></div>
                                            <div className="timeline-content">
                                                <div className="timeline-status">{event.status}</div>
                                                <div className="timeline-date">{formatDate(event.date)}</div>
                                                {event.note && <div className="timeline-note">{event.note}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Applications;
