/**
 * JobProvider Service
 * Handles fetching jobs from external sources (simulated for demo).
 * In a production environment, this would integrate with Adzuna, LinkedIn, etc.
 */

// Mock external jobs data
const MOCK_EXTERNAL_JOBS = [
    {
        id: 'job1',
        title: 'Senior Frontend Engineer',
        company: 'TechFlow',
        location: 'Bangalore / Remote',
        description: 'We are looking for a Senior Frontend Engineer with expert React and Tailwind CSS skills. You will lead the development of our core dashboard and mentor junior developers.',
        jobType: 'full-time',
        workMode: 'remote',
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        skills: ['React', 'Tailwind', 'JavaScript', 'TypeScript'],
        applyUrl: 'https://example.com/jobs/1'
    },
    {
        id: 'job2',
        title: 'Backend Developer (Node.js)',
        company: 'DataScale',
        location: 'Hyderabad / Hybrid',
        description: 'Join our backend team building high-performance microservices. Experience with Fastify, MySQL, and Redis is a major plus.',
        jobType: 'full-time',
        workMode: 'hybrid',
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        skills: ['Node.js', 'Fastify', 'MySQL', 'Redis'],
        applyUrl: 'https://example.com/jobs/2'
    },
    {
        id: 'job3',
        title: 'Full Stack Developer',
        company: 'StartupX',
        location: 'Bangalore',
        description: 'Generalist developer needed for an early-stage startup. You will work on everything from React frontend to Node.js backend and AWS infrastructure.',
        jobType: 'full-time',
        workMode: 'on-site',
        postedDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
        applyUrl: 'https://example.com/jobs/3'
    },
    {
        id: 'job4',
        title: 'Python ML Engineer',
        company: 'AI Solutions',
        location: 'Remote',
        description: 'Help us build and deploy machine learning models. Deep knowledge of Python, PyTorch, and NLP is required.',
        jobType: 'contract',
        workMode: 'remote',
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        skills: ['Python', 'PyTorch', 'Machine Learning', 'NLP'],
        applyUrl: 'https://example.com/jobs/4'
    },
    {
        id: 'job5',
        title: 'UX/UI Designer',
        company: 'Creative Studio',
        location: 'Mumbai / Hybrid',
        description: 'Produce beautiful and functional designs for our mobile and web clients. Proficiency in Figma and Adobe Creative Suite is essential.',
        jobType: 'full-time',
        workMode: 'hybrid',
        postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
        applyUrl: 'https://example.com/jobs/5'
    },
    {
        id: 'job6',
        title: 'React Native Developer',
        company: 'MobileFirst',
        location: 'Remote',
        description: 'Build cross-platform mobile apps using React Native. Experience with Redux and mobile performance optimization is key.',
        jobType: 'full-time',
        workMode: 'remote',
        postedDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        skills: ['React Native', 'JavaScript', 'Redux', 'iOS/Android'],
        applyUrl: 'https://example.com/jobs/6'
    },
    {
        id: 'job7',
        title: 'DevOps Engineer',
        company: 'CloudNative',
        location: 'Chennai / Remote',
        description: 'Manage our Kubernetes clusters and CI/CD pipelines. Proficiency with Docker, Terraform, and GitHub Actions is required.',
        jobType: 'full-time',
        workMode: 'remote',
        postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        skills: ['Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
        applyUrl: 'https://example.com/jobs/7'
    },
    {
        id: 'job8',
        title: 'Junior Web Developer',
        company: 'EduTech',
        location: 'Pune',
        description: 'Great opportunity for fresh graduates. Learn full-stack development with React and Node.js in a supportive environment.',
        jobType: 'internship',
        workMode: 'on-site',
        postedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        skills: ['HTML', 'CSS', 'JavaScript', 'React'],
        applyUrl: 'https://example.com/jobs/8'
    },
    {
        id: 'job9',
        title: 'Product Manager',
        company: 'SocialHub',
        location: 'Bangalore / Hybrid',
        description: 'Define the product roadmap for our social features. Strong communication and analytical skills are a must.',
        jobType: 'full-time',
        workMode: 'hybrid',
        postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        skills: ['Product Strategy', 'Agile', 'Analytics', 'Communication'],
        applyUrl: 'https://example.com/jobs/9'
    },
    {
        id: 'job10',
        title: 'Security Analyst',
        company: 'SafeGuard',
        location: 'Remote',
        description: 'Help us maintain the security of our infrastructure. Experience with penetration testing and security audits is required.',
        jobType: 'contract',
        workMode: 'remote',
        postedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        skills: ['Cybersecurity', 'Pen Testing', 'Networking', 'Compliance'],
        applyUrl: 'https://example.com/jobs/10'
    }
];

export async function fetchJobsFromExternal() {
    // Simulate a network delay to an external provider (Adzuna, etc.)
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real app with Adzuna:
    /*
    const response = await axios.get(`https://api.adzuna.com/v1/api/jobs/in/search/1`, {
        params: {
            app_id: process.env.ADZUNA_APP_ID,
            app_key: process.env.ADZUNA_APP_KEY,
            results_per_page: 50
        }
    });
    return mapAdzunaJobsToLocalFormat(response.data.results);
    */

    return MOCK_EXTERNAL_JOBS;
}
