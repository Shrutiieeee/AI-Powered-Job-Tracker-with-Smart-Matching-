import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

// Simple keyword-based matching as fallback
function simpleMatch(job, resumeText) {
    if (!resumeText) {
        return { score: 0, explanation: 'No resume uploaded', matchingSkills: [] };
    }

    const resumeLower = resumeText.toLowerCase();
    const jobDescLower = job.description.toLowerCase();
    const titleLower = job.title.toLowerCase();

    // Find matching skills
    const matchingSkills = job.skills.filter(skill =>
        resumeLower.includes(skill.toLowerCase())
    );

    // Calculate score based on:
    // 1. Matching skills (60% weight)
    // 2. Title keywords in resume (20% weight)
    // 3. Description keywords in resume (20% weight)

    const skillScore = (matchingSkills.length / job.skills.length) * 60;

    const titleWords = titleLower.split(' ').filter(w => w.length > 3);
    const titleMatches = titleWords.filter(word => resumeLower.includes(word)).length;
    const titleScore = (titleMatches / Math.max(titleWords.length, 1)) * 20;

    const descWords = jobDescLower.split(' ').filter(w => w.length > 4).slice(0, 10);
    const descMatches = descWords.filter(word => resumeLower.includes(word)).length;
    const descScore = (descMatches / Math.max(descWords.length, 1)) * 20;

    const score = Math.min(Math.round(skillScore + titleScore + descScore), 100);

    let explanation = '';
    if (score > 70) {
        explanation = `Strong match! ${matchingSkills.length} matching skills: ${matchingSkills.slice(0, 3).join(', ')}`;
    } else if (score >= 40) {
        explanation = `Moderate match. ${matchingSkills.length} matching skills: ${matchingSkills.join(', ') || 'some relevant experience'}`;
    } else {
        explanation = `Low match. Consider building skills: ${job.skills.slice(0, 3).join(', ')}`;
    }

    return { score, explanation, matchingSkills };
}

// LangChain-based matching (uses OpenAI if API key is available)
async function aiMatch(job, resumeText) {
    try {
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey || apiKey === 'your_openai_api_key_here') {
            // Fallback to simple matching
            return simpleMatch(job, resumeText);
        }

        const model = new ChatOpenAI({
            modelName: 'gpt-3.5-turbo',
            temperature: 0.3,
            openAIApiKey: apiKey
        });

        const prompt = PromptTemplate.fromTemplate(`
You are an expert job matching AI. Analyze how well a candidate's resume matches a job posting.

Job Title: {jobTitle}
Job Description: {jobDescription}
Required Skills: {skills}

Candidate Resume:
{resume}

Provide a match score from 0-100 and a brief explanation (max 100 characters).
Also list the matching skills found in the resume.

Respond in this exact JSON format:
{{"score": <number>, "explanation": "<text>", "matchingSkills": ["skill1", "skill2"]}}
`);

        const chain = prompt.pipe(model).pipe(new StringOutputParser());

        const result = await chain.invoke({
            jobTitle: job.title,
            jobDescription: job.description,
            skills: job.skills.join(', '),
            resume: resumeText.slice(0, 2000) // Limit resume length
        });

        // Parse JSON response
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                score: Math.min(Math.max(parsed.score || 0, 0), 100),
                explanation: parsed.explanation || 'AI analysis completed',
                matchingSkills: parsed.matchingSkills || []
            };
        }

        // Fallback if parsing fails
        return simpleMatch(job, resumeText);

    } catch (error) {
        console.error('AI matching error:', error.message);
        // Fallback to simple matching
        return simpleMatch(job, resumeText);
    }
}

export async function matchJobWithResume(job, resumeText) {
    // Try AI matching first, fallback to simple matching
    return await aiMatch(job, resumeText);
}
