import { useState, useEffect } from 'react';
import { jobsAPI } from '../api';
import JobCard from './JobCard';
import './BestMatches.css';

function BestMatches({ onApply, refreshTrigger }) {
    const [bestJobs, setBestJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBestMatches();
    }, []);

    const fetchBestMatches = async () => {
        try {
            const { data } = await jobsAPI.getBestMatches();
            setBestJobs(data.jobs);
        } catch (error) {
            console.error('Failed to fetch best matches:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="best-matches">
                <h2>🎯 Best Matches for You</h2>
                <div className="loading-container">
                    <div className="loading"></div>
                </div>
            </div>
        );
    }

    if (bestJobs.length === 0) {
        return null;
    }

    return (
        <div className="best-matches">
            <h2>🎯 Best Matches for You</h2>
            <p className="best-matches-subtitle">
                Top {bestJobs.length} jobs based on your resume
            </p>
            <div className="best-matches-grid">
                {bestJobs.map(job => (
                    <JobCard key={job.id} job={job} onApply={onApply} hasResume={true} refreshTrigger={refreshTrigger} />
                ))}
            </div>
        </div>
    );
}

export default BestMatches;
