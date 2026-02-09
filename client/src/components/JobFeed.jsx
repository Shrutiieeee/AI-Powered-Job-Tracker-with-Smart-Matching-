import { useState, useEffect } from 'react';
import { jobsAPI } from '../api';
import Filters from './Filters';
import JobCard from './JobCard';
import BestMatches from './BestMatches';
import ApplyModal from './ApplyModal';
import './JobFeed.css';

function JobFeed({ hasResume, externalFilters, onClearFilters }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const [applyModal, setApplyModal] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        fetchJobs();
    }, [filters]);

    useEffect(() => {
        if (Object.keys(externalFilters).length > 0) {
            setFilters(externalFilters);
        }
    }, [externalFilters]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const { data } = await jobsAPI.getAll(filters);
            setJobs(data.jobs);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleApply = (job) => {
        window.open(job.applyUrl, '_blank');
        // Show modal more immediately
        setApplyModal(job);
    };

    const handleApplied = () => {
        // Trigger re-check in all JobCards
        setRefreshTrigger(prev => prev + 1);
    };

    const handleCloseModal = () => {
        setApplyModal(null);
    };

    const handleClearFilters = () => {
        setFilters({});
        onClearFilters();
    };

    return (
        <div className="container">
            <div className="job-feed">
                <Filters
                    filters={filters}
                    onChange={handleFilterChange}
                    onClear={handleClearFilters}
                />

                <div className="job-content">
                    {hasResume && <BestMatches onApply={handleApply} refreshTrigger={refreshTrigger} />}

                    <div className="job-list-header">
                        <h2>All Jobs ({jobs.length})</h2>
                        {Object.keys(filters).length > 0 && (
                            <button onClick={handleClearFilters} className="btn btn-outline btn-sm">
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="loading-container">
                            <div className="loading" style={{ width: '40px', height: '40px' }}></div>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="no-jobs">
                            <p>No jobs found matching your criteria.</p>
                            <button onClick={handleClearFilters} className="btn btn-primary">
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="job-grid">
                            {jobs.map(job => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    onApply={handleApply}
                                    hasResume={hasResume}
                                    refreshTrigger={refreshTrigger}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {applyModal && (
                <ApplyModal
                    job={applyModal}
                    onClose={handleCloseModal}
                    onApplied={handleApplied}
                />
            )}
        </div>
    );
}

export default JobFeed;
