import { useState } from 'react';
import { resumeAPI } from '../api';
import './ResumeUpload.css';

function ResumeUpload({ onUploaded }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const validTypes = ['application/pdf', 'text/plain'];
        if (!validTypes.includes(selectedFile.type)) {
            setError('Only PDF and TXT files are supported');
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setFile(selectedFile);
        setError('');
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            await resumeAPI.upload(file);
            onUploaded();
        } catch (err) {
            setError(err.response?.data?.error || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="resume-upload-banner">
            <div className="container">
                <div className="resume-upload-content">
                    <div className="resume-upload-info">
                        <h3>📄 Upload Your Resume</h3>
                        <p>Get AI-powered job matching by uploading your resume (PDF or TXT)</p>
                    </div>

                    <div className="resume-upload-actions">
                        <input
                            type="file"
                            id="resume-file"
                            accept=".pdf,.txt"
                            onChange={handleFileChange}
                            className="file-input"
                        />
                        <label htmlFor="resume-file" className="btn btn-outline">
                            {file ? file.name : 'Choose File'}
                        </label>

                        {file && (
                            <button
                                onClick={handleUpload}
                                className="btn btn-primary"
                                disabled={uploading}
                            >
                                {uploading ? <span className="loading"></span> : 'Upload'}
                            </button>
                        )}
                    </div>
                </div>

                {error && <div className="upload-error">{error}</div>}
            </div>
        </div>
    );
}

export default ResumeUpload;
