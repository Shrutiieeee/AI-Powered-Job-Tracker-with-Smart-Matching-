import { getUser, store, addUser } from '../store.js';

export default async function authRoutes(fastify) {
    // Register
    fastify.post('/register', async (request, reply) => {
        const { email, password } = request.body;

        if (!email || !password) {
            return reply.code(400).send({ error: 'Email and password are required' });
        }

        const existing = getUser(email);
        if (existing) {
            return reply.code(400).send({ error: 'User already exists' });
        }

        const user = addUser(email, password);

        // Create simple session token
        const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
        store.sessions.set(token, user.id);

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                hasResume: false
            }
        };
    });

    // Login
    fastify.post('/login', async (request, reply) => {
        const { email, password } = request.body;

        const user = getUser(email);

        if (!user || user.password !== password) {
            return reply.code(401).send({ error: 'Invalid credentials' });
        }

        // Create simple session token
        const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
        store.sessions.set(token, user.id);

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                hasResume: !!user.resume
            }
        };
    });

    // Logout
    fastify.post('/logout', async (request, reply) => {
        const token = request.headers.authorization?.replace('Bearer ', '');
        if (token) {
            store.sessions.delete(token);
        }
        return { success: true };
    });

    // Verify token
    fastify.get('/verify', async (request, reply) => {
        const token = request.headers.authorization?.replace('Bearer ', '');

        if (!token || !store.sessions.has(token)) {
            return reply.code(401).send({ error: 'Unauthorized' });
        }

        const userId = store.sessions.get(token);
        const user = store.users.find(u => u.id === userId);

        if (!user) {
            return reply.code(401).send({ error: 'User not found' });
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                hasResume: !!user.resume
            }
        };
    });
}
