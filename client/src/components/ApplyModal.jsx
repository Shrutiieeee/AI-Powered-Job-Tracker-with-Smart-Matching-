import { useState } from 'react';
import { applicationsAPI } from '../api';
import './ApplyModal.css';

function ApplyModal({ job, onClose, onApplied }) {
    const [loading, setLoading] = useState(false);

    const handleResponse = async (applied) => {
        if (!applied) {
            onClose();
            return;
        }

        setLoading(true);
        try {
            await applicationsAPI.create({
                jobId: job.id,
                jobTitle: job.title,
                company: job.company,
                appliedVia: 'external'
            });
            if (onApplied) onApplied(job.id);
            onClose();
        } catch (error) {
            console.error('Failed to track application:', error);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Did you apply?</h3>
                    <button onClick={onClose} className="modal-close">×</button>
                </div>

                <div className="modal-body">
                    <p>Did you apply to <strong>{job.title}</strong> at <strong>{job.company}</strong>?</p>
                </div>

                <div className="modal-footer">
                    <button
                        onClick={() => handleResponse(true)}
                        className="btn btn-success"
                        disabled={loading}
                    >
                        {loading ? <span className="loading"></span> : '✓ Yes, Applied'}
                    </button>
                    <button
                        onClick={() => handleResponse(false)}
                        className="btn btn-outline"
                    >
                        No, just browsing
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ApplyModal;
