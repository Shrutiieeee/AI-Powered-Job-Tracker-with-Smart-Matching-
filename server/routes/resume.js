import { getUserById, updateUserResume, store } from '../store.js';
import { pipeline } from 'stream/promises';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

const UPLOAD_DIR = './data/resumes';

// Ensure upload directory exists
await fs.mkdir(UPLOAD_DIR, { recursive: true });

// Middleware to verify auth
const verifyAuth = async (request, reply) => {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token || !store.sessions.has(token)) {
        reply.code(401).send({ error: 'Unauthorized' });
        return;
    }

    request.userId = store.sessions.get(token);
};

export default async function resumeRoutes(fastify) {
    // Upload resume
    fastify.post('/upload', { preHandler: verifyAuth }, async (request, reply) => {
        try {
            const data = await request.file();

            if (!data) {
                return reply.code(400).send({ error: 'No file uploaded' });
            }

            const filename = `${request.userId}_${Date.now()}_${data.filename}`;
            const filepath = path.join(UPLOAD_DIR, filename);

            // Save file
            await pipeline(data.file, createWriteStream(filepath));

            // Extract text
            let extractedText = '';

            if (data.filename.endsWith('.pdf')) {
                const buffer = await fs.readFile(filepath);
                const pdfData = await pdf(buffer);
                extractedText = pdfData.text;
            } else if (data.filename.endsWith('.txt')) {
                extractedText = await fs.readFile(filepath, 'utf-8');
            } else {
                await fs.unlink(filepath);
                return reply.code(400).send({ error: 'Only PDF and TXT files are supported' });
            }

            // Store resume data
            const resumeData = {
                filename: data.filename,
                filepath,
                text: extractedText,
                uploadedAt: new Date().toISOString()
            };

            updateUserResume(request.userId, resumeData);

            return {
                success: true,
                filename: data.filename,
                uploadedAt: resumeData.uploadedAt
            };
        } catch (error) {
            console.error('Resume upload error:', error);
            return reply.code(500).send({ error: 'Failed to upload resume: ' + error.message });
        }
    });

    // Get resume info
    fastify.get('/', { preHandler: verifyAuth }, async (request, reply) => {
        const user = getUserById(request.userId);

        if (!user?.resume) {
            return reply.code(404).send({ error: 'No resume found' });
        }

        return {
            filename: user.resume.filename,
            uploadedAt: user.resume.uploadedAt
        };
    });

    // Delete resume
    fastify.delete('/', { preHandler: verifyAuth }, async (request, reply) => {
        const user = getUserById(request.userId);

        if (user?.resume?.filepath) {
            try {
                await fs.unlink(user.resume.filepath);
            } catch (err) {
                // File might not exist, ignore
            }
            user.resume = null;
        }

        return { success: true };
    });
}
