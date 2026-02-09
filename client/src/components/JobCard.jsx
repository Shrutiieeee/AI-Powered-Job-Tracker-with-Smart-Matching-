import { useState, useEffect } from 'react';
import { applicationsAPI } from '../api';
import './JobCard.css';

function JobCard({ job, onApply, hasResume, refreshTrigger }) {
    const [application, setApplication] = useState(null);

    useEffect(() => {
        checkApplication();
    }, [job.id, refreshTrigger]);

    const checkApplication = async () => {
        try {
            const { data } = await applicationsAPI.getByJobId(job.id);
            setApplication(data.application);
        } catch (error) {
            // Not applied yet
        }
    };

    const getMatchBadgeClass = (score) => {
        if (score > 70) return 'badge-success';
        if (score >= 40) return 'badge-warning';
        return 'badge-muted';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays} days ago`;
        if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return `${Math.ceil(diffDays / 30)} months ago`;
    };

    return (
        <div className="job-card">
            <div className="job-card-header">
                <div>
                    <h3 className="job-title">{job.title}</h3>
                    <p className="job-company">{job.company}</p>
                </div>
                {hasResume && job.matchScore !== undefined && (
                    <div className={`match-badge ${getMatchBadgeClass(job.matchScore)}`}>
                        {job.matchScore}% Match
                    </div>
                )}
            </div>

            <div className="job-meta">
                <span className="job-meta-item">📍 {job.location}</span>
                <span className="job-meta-item">💼 {job.jobType}</span>
                <span className="job-meta-item">🏠 {job.workMode}</span>
                <span className="job-meta-item">🕒 {formatDate(job.postedDate)}</span>
            </div>

            <p className="job-description">{job.description}</p>

            <div className="job-skills">
                {job.skills.slice(0, 5).map(skill => (
                    <span key={skill} className="skill-badge">{skill}</span>
                ))}
                {job.skills.length > 5 && (
                    <span className="skill-badge">+{job.skills.length - 5} more</span>
                )}
            </div>

            {hasResume && job.matchExplanation && (
                <div className="match-explanation">
                    <strong>Why this matches:</strong> {job.matchExplanation}
                </div>
            )}

            <div className="job-card-footer">
                {application ? (
                    <div className="application-status">
                        <span className={`status-badge status-${application.status}`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                        <span className="text-sm text-muted">
                            Applied {formatDate(application.appliedAt)}
                        </span>
                    </div>
                ) : (
                    <button onClick={() => onApply(job)} className="btn btn-primary">
                        Apply Now →
                    </button>
                )}
            </div>
        </div>
    );
}

export default JobCard;
