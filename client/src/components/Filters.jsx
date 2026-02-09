import './Filters.css';

const SKILLS_OPTIONS = [
    'React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'Django',
    'Flask', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes',
    'GraphQL', 'REST API', 'Figma', 'TensorFlow', 'PyTorch'
];

function Filters({ filters, onChange, onClear }) {
    const handleChange = (key, value) => {
        onChange({ ...filters, [key]: value });
    };

    const handleSkillToggle = (skill) => {
        const currentSkills = filters.skills ? filters.skills.split(',') : [];
        const newSkills = currentSkills.includes(skill)
            ? currentSkills.filter(s => s !== skill)
            : [...currentSkills, skill];

        handleChange('skills', newSkills.join(','));
    };

    const selectedSkills = filters.skills ? filters.skills.split(',') : [];

    return (
        <div className="filters">
            <div className="filters-header">
                <h3>Filters</h3>
                {Object.keys(filters).length > 0 && (
                    <button onClick={onClear} className="btn-clear">Clear</button>
                )}
            </div>

            <div className="filter-group">
                <label className="label">Search Role/Title</label>
                <input
                    type="text"
                    className="input"
                    placeholder="e.g. Frontend Developer"
                    value={filters.search || ''}
                    onChange={(e) => handleChange('search', e.target.value)}
                />
            </div>

            <div className="filter-group">
                <label className="label">Skills</label>
                <div className="skills-grid">
                    {SKILLS_OPTIONS.map(skill => (
                        <button
                            key={skill}
                            onClick={() => handleSkillToggle(skill)}
                            className={`skill-tag ${selectedSkills.includes(skill) ? 'active' : ''}`}
                        >
                            {skill}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-group">
                <label className="label">Date Posted</label>
                <select
                    className="input"
                    value={filters.datePosted || 'any'}
                    onChange={(e) => handleChange('datePosted', e.target.value)}
                >
                    <option value="any">Any time</option>
                    <option value="24h">Last 24 hours</option>
                    <option value="week">Last week</option>
                    <option value="month">Last month</option>
                </select>
            </div>

            <div className="filter-group">
                <label className="label">Job Type</label>
                <select
                    className="input"
                    value={filters.jobType || ''}
                    onChange={(e) => handleChange('jobType', e.target.value)}
                >
                    <option value="">All types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                </select>
            </div>

            <div className="filter-group">
                <label className="label">Work Mode</label>
                <select
                    className="input"
                    value={filters.workMode || ''}
                    onChange={(e) => handleChange('workMode', e.target.value)}
                >
                    <option value="">All modes</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-site</option>
                </select>
            </div>

            <div className="filter-group">
                <label className="label">Location</label>
                <input
                    type="text"
                    className="input"
                    placeholder="e.g. Bangalore"
                    value={filters.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                />
            </div>

            <div className="filter-group">
                <label className="label">Match Score</label>
                <select
                    className="input"
                    value={filters.matchScore || ''}
                    onChange={(e) => handleChange('matchScore', e.target.value)}
                >
                    <option value="">All scores</option>
                    <option value="high">High (&gt;70)</option>
                    <option value="medium">Medium (40-70)</option>
                </select>
            </div>
        </div>
    );
}

export default Filters;
