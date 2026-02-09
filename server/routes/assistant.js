import { processAssistantMessage } from '../services/aiAssistant.js';
import { store } from '../store.js';

// Middleware to verify auth
const verifyAuth = async (request, reply) => {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token || !store.sessions.has(token)) {
        reply.code(401).send({ error: 'Unauthorized' });
        return;
    }

    request.userId = store.sessions.get(token);
};

// Store conversation history per user (in-memory)
const conversations = new Map();

export default async function assistantRoutes(fastify) {
    // Chat with assistant
    fastify.post('/chat', { preHandler: verifyAuth }, async (request, reply) => {
        const { message } = request.body;

        if (!message) {
            return reply.code(400).send({ error: 'Message is required' });
        }

        // Get or create conversation history
        if (!conversations.has(request.userId)) {
            conversations.set(request.userId, []);
        }
        const history = conversations.get(request.userId);

        // Process message with LangGraph
        const result = await processAssistantMessage(message, history);

        // Update conversation history
        history.push(message);
        history.push(result.response);

        // Keep only last 10 messages
        if (history.length > 10) {
            history.splice(0, history.length - 10);
        }

        return {
            response: result.response,
            filters: result.filters,
            intent: result.intent
        };
    });

    // Clear conversation
    fastify.post('/clear', { preHandler: verifyAuth }, async (request, reply) => {
        conversations.delete(request.userId);
        return { success: true };
    });
}
