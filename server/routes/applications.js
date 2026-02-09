import { getApplications, addApplication, updateApplication, getApplicationByJobId, store } from '../store.js';

// Middleware to verify auth
const verifyAuth = async (request, reply) => {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token || !store.sessions.has(token)) {
        reply.code(401).send({ error: 'Unauthorized' });
        return;
    }

    request.userId = store.sessions.get(token);
};

export default async function applicationRoutes(fastify) {
    // Get all applications for user
    fastify.get('/', { preHandler: verifyAuth }, async (request, reply) => {
        const applications = getApplications(request.userId);
        return { applications };
    });

    // Create new application
    fastify.post('/', { preHandler: verifyAuth }, async (request, reply) => {
        const { jobId, jobTitle, company, appliedVia } = request.body;

        // Check if already applied
        const existing = getApplicationByJobId(request.userId, jobId);
        if (existing) {
            return reply.code(400).send({ error: 'Already applied to this job' });
        }

        const application = {
            id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: request.userId,
            jobId,
            jobTitle,
            company,
            status: 'applied',
            appliedVia: appliedVia || 'direct',
            appliedAt: new Date().toISOString(),
            timeline: [
                {
                    status: 'applied',
                    date: new Date().toISOString(),
                    note: 'Application submitted'
                }
            ]
        };

        addApplication(application);

        return { application };
    });

    // Update application status
    fastify.patch('/:id', { preHandler: verifyAuth }, async (request, reply) => {
        const { id } = request.params;
        const { status, note } = request.body;

        const application = store.applications.find(a => a.id === id && a.userId === request.userId);

        if (!application) {
            return reply.code(404).send({ error: 'Application not found' });
        }

        // Add timeline entry
        application.timeline.push({
            status,
            date: new Date().toISOString(),
            note: note || `Status updated to ${status}`
        });

        application.status = status;
        application.updatedAt = new Date().toISOString();

        return { application };
    });

    // Get application by job ID
    fastify.get('/job/:jobId', { preHandler: verifyAuth }, async (request, reply) => {
        const { jobId } = request.params;
        const application = getApplicationByJobId(request.userId, jobId);

        if (!application) {
            return reply.code(404).send({ error: 'Application not found' });
        }

        return { application };
    });
}
