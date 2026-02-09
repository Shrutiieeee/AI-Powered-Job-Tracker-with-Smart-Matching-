import { getUserById, store } from '../store.js';
import { matchJobWithResume } from '../services/jobMatcher.js';
import { fetchJobsFromExternal } from '../services/jobProvider.js';

// Middleware to verify auth
const verifyAuth = async (request, reply) => {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token || !store.sessions.has(token)) {
        reply.code(401).send({ error: 'Unauthorized' });
        return;
    }

    request.userId = store.sessions.get(token);
};

export default async function jobRoutes(fastify) {
    // Get all jobs with optional filters
    fastify.get('/', { preHandler: verifyAuth }, async (request, reply) => {
        const {
            search,
            skills,
            datePosted,
            jobType,
            workMode,
            location,
            matchScore
        } = request.query;

        const allJobs = await fetchJobsFromExternal();
        let jobs = [...allJobs];

        // Apply filters
        if (search) {
            const searchLower = search.toLowerCase();
            jobs = jobs.filter(job =>
                job.title.toLowerCase().includes(searchLower) ||
                job.description.toLowerCase().includes(searchLower)
            );
        }

        if (skills) {
            const skillsArray = skills.split(',').map(s => s.trim().toLowerCase());
            jobs = jobs.filter(job =>
                job.skills.some(skill => skillsArray.includes(skill.toLowerCase()))
            );
        }

        if (datePosted && datePosted !== 'any') {
            const now = Date.now();
            const cutoffs = {
                '24h': 24 * 60 * 60 * 1000,
                'week': 7 * 24 * 60 * 60 * 1000,
                'month': 30 * 24 * 60 * 60 * 1000
            };
            const cutoff = cutoffs[datePosted];
            if (cutoff) {
                jobs = jobs.filter(job => now - new Date(job.postedDate).getTime() <= cutoff);
            }
        }

        if (jobType) {
            jobs = jobs.filter(job => job.jobType === jobType);
        }

        if (workMode) {
            jobs = jobs.filter(job => job.workMode === workMode);
        }

        if (location) {
            const locationLower = location.toLowerCase();
            jobs = jobs.filter(job => job.location.toLowerCase().includes(locationLower));
        }

        // Get user resume for matching
        const user = getUserById(request.userId);
        const resumeText = user?.resume?.text || '';

        // Calculate match scores using LangChain
        const jobsWithScores = await Promise.all(
            jobs.map(async (job) => {
                const matchResult = await matchJobWithResume(job, resumeText);
                return {
                    ...job,
                    matchScore: matchResult.score,
                    matchExplanation: matchResult.explanation,
                    matchingSkills: matchResult.matchingSkills
                };
            })
        );

        // Filter by match score
        let filteredJobs = jobsWithScores;
        if (matchScore === 'high') {
            filteredJobs = jobsWithScores.filter(job => job.matchScore > 70);
        } else if (matchScore === 'medium') {
            filteredJobs = jobsWithScores.filter(job => job.matchScore >= 40 && job.matchScore <= 70);
        }

        // Sort by match score (highest first)
        filteredJobs.sort((a, b) => b.matchScore - a.matchScore);

        return {
            jobs: filteredJobs,
            total: filteredJobs.length
        };
    });

    // Get best matches (top 6-8 jobs)
    fastify.get('/best-matches', { preHandler: verifyAuth }, async (request, reply) => {
        const user = getUserById(request.userId);
        const resumeText = user?.resume?.text || '';

        if (!resumeText) {
            return { jobs: [] };
        }

        const allJobs = await fetchJobsFromExternal();

        // Calculate match scores for all jobs
        const jobsWithScores = await Promise.all(
            allJobs.map(async (job) => {
                const matchResult = await matchJobWithResume(job, resumeText);
                return {
                    ...job,
                    matchScore: matchResult.score,
                    matchExplanation: matchResult.explanation,
                    matchingSkills: matchResult.matchingSkills
                };
            })
        );

        // Sort by score and take top 8
        const bestMatches = jobsWithScores
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 8);

        return {
            jobs: bestMatches,
            total: bestMatches.length
        };
    });
}
