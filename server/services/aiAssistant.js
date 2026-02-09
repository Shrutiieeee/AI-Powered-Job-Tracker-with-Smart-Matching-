import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { StateGraph, END } from '@langchain/langgraph';

// Define the state structure
class AssistantState {
    constructor() {
        this.messages = [];
        this.intent = null;
        this.filters = {};
        this.response = '';
    }
}

// Intent detection node
async function detectIntent(state) {
    const userMessage = state.messages[state.messages.length - 1];
    const apiKey = process.env.OPENAI_API_KEY;

    // Try LLM detection first if API key is available
    if (apiKey && apiKey !== 'your_openai_api_key_here') {
        try {
            const model = new ChatOpenAI({
                modelName: 'gpt-3.5-turbo',
                temperature: 0,
                openAIApiKey: apiKey
            });

            const prompt = PromptTemplate.fromTemplate(`
                Classify the user's intent for a job search assistant.
                Message: "{message}"
                
                Intents:
                - filter_update: User wants to find jobs with specific criteria (location, skills, mode, type, match).
                - clear_filters: User wants to see all jobs or reset their search.
                - help: User is asking how to use the assistant or what it can do.
                - job_search: General questions about jobs or vague requests.
                
                Respond with ONLY the intent name.
            `);

            const chain = prompt.pipe(model).pipe(new StringOutputParser());
            const intent = (await chain.invoke({ message: userMessage })).trim().toLowerCase();

            if (['filter_update', 'clear_filters', 'help', 'job_search'].includes(intent)) {
                state.intent = intent;
                return state;
            }
        } catch (error) {
            console.error('LLM Intent detection failed:', error.message);
        }
    }

    // Rule-based fallback
    const messageLower = userMessage.toLowerCase();
    if (messageLower.includes('clear') || messageLower.includes('reset')) {
        state.intent = 'clear_filters';
    } else if (
        messageLower.match(/remote|hybrid|onsite|location|filter|show|find|search|only|with|score/)
    ) {
        state.intent = 'filter_update';
    } else if (messageLower.includes('help') || messageLower.includes('how')) {
        state.intent = 'help';
    } else {
        state.intent = 'job_search';
    }

    return state;
}

// Filter update node
async function updateFilters(state) {
    const userMessage = state.messages[state.messages.length - 1];
    const apiKey = process.env.OPENAI_API_KEY;
    let filters = {};

    if (apiKey && apiKey !== 'your_openai_api_key_here') {
        try {
            const model = new ChatOpenAI({
                modelName: 'gpt-3.5-turbo',
                temperature: 0,
                openAIApiKey: apiKey
            });

            const prompt = PromptTemplate.fromTemplate(`
                Extract job search filters from this message: "{message}"
                
                Fields:
                - workMode: "remote", "hybrid", or "on-site"
                - jobType: "full-time", "part-time", or "contract"
                - location: City name (e.g., "Bangalore")
                - search: Key skill or role (e.g., "Frontend", "Python")
                - matchScore: "high" (for 70+), "medium" (for 40-70)
                
                Respond in exact JSON format. Use null if not mentioned.
                {{"workMode": string, "jobType": string, "location": string, "search": string, "matchScore": string}}
            `);

            const chain = prompt.pipe(model).pipe(new StringOutputParser());
            const result = await chain.invoke({ message: userMessage });
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                Object.entries(parsed).forEach(([key, value]) => {
                    if (value && value !== 'null') filters[key] = value;
                });
            }
        } catch (error) {
            console.error('LLM filter extraction failed:', error.message);
        }
    }

    // If LLM failed or returned nothing, use keyword fallback
    if (Object.keys(filters).length === 0) {
        const msgLow = userMessage.toLowerCase();
        if (msgLow.includes('remote')) filters.workMode = 'remote';
        if (msgLow.includes('hybrid')) filters.workMode = 'hybrid';
        if (msgLow.includes('onsite') || msgLow.includes('on-site')) filters.workMode = 'on-site';
        if (msgLow.includes('full-time') || msgLow.includes('full time')) filters.jobType = 'full-time';
        if (msgLow.includes('part-time') || msgLow.includes('part time')) filters.jobType = 'part-time';
        if (msgLow.includes('contract')) filters.jobType = 'contract';
        if (msgLow.includes('high match')) filters.matchScore = 'high';

        const cities = ['bangalore', 'mumbai', 'delhi', 'hyderabad', 'pune'];
        for (const city of cities) {
            if (msgLow.includes(city)) filters.location = city.charAt(0).toUpperCase() + city.slice(1);
        }
    }

    state.filters = filters;

    // Generate response
    const filterDescriptions = [];
    if (filters.workMode) filterDescriptions.push(`work mode: ${filters.workMode}`);
    if (filters.jobType) filterDescriptions.push(`job type: ${filters.jobType}`);
    if (filters.location) filterDescriptions.push(`location: ${filters.location}`);
    if (filters.search) filterDescriptions.push(`role/skill: ${filters.search}`);
    if (filters.matchScore) filterDescriptions.push(`match score: ${filters.matchScore}`);

    if (filterDescriptions.length > 0) {
        state.response = `I've updated the filters: ${filterDescriptions.join(', ')}. The job list will refresh automatically.`;
    } else {
        state.response = "I understood your request, but couldn't find specific filters. Try saying 'show remote jobs' or 'React roles in Bangalore'.";
    }

    return state;
}

// Clear filters node
async function clearFilters(state) {
    state.filters = { clear: true };
    state.response = "I've cleared all filters. You'll now see all available jobs.";
    return state;
}

// Job search node
async function searchJobs(state) {
    const userMessage = state.messages[state.messages.length - 1];
    state.response = `I can help you search for jobs! Try saying things like:
- "Show me remote frontend jobs"
- "Find Python roles in Bangalore"
- "Only high match score jobs"
- "Clear all filters"`;
    return state;
}

// Help node
async function provideHelp(state) {
    state.response = `I'm your AI job search assistant! I can help you:

🔍 Search jobs: "Find React developer roles"
🎯 Filter by location: "Show jobs in Bangalore"
💼 Filter by work mode: "Only remote positions"
⭐ Filter by match: "High match score only"
🧹 Reset: "Clear all filters"

Just tell me what you're looking for!`;
    return state;
}

// Route based on intent
function routeIntent(state) {
    switch (state.intent) {
        case 'filter_update':
            return 'update_filters';
        case 'clear_filters':
            return 'clear_filters';
        case 'help':
            return 'help';
        case 'job_search':
        default:
            return 'job_search';
    }
}

// Create the LangGraph
function createAssistantGraph() {
    const workflow = new StateGraph({
        channels: {
            messages: null,
            intent: null,
            filters: null,
            response: null
        }
    });

    // Add nodes
    workflow.addNode('detect_intent', detectIntent);
    workflow.addNode('update_filters', updateFilters);
    workflow.addNode('clear_filters', clearFilters);
    workflow.addNode('job_search', searchJobs);
    workflow.addNode('help', provideHelp);

    // Set entry point
    workflow.setEntryPoint('detect_intent');

    // Add conditional edges from intent detection
    workflow.addConditionalEdges(
        'detect_intent',
        routeIntent,
        {
            'update_filters': 'update_filters',
            'clear_filters': 'clear_filters',
            'job_search': 'job_search',
            'help': 'help'
        }
    );

    // All nodes end after execution
    workflow.addEdge('update_filters', END);
    workflow.addEdge('clear_filters', END);
    workflow.addEdge('job_search', END);
    workflow.addEdge('help', END);

    return workflow.compile();
}

// Main assistant function
export async function processAssistantMessage(message, conversationHistory = []) {
    try {
        const graph = createAssistantGraph();

        const initialState = {
            messages: [...conversationHistory, message],
            intent: null,
            filters: {},
            response: ''
        };

        const result = await graph.invoke(initialState);

        return {
            response: result.response,
            filters: result.filters,
            intent: result.intent
        };

    } catch (error) {
        console.error('Assistant error:', error);
        return {
            response: "I'm having trouble processing that. Try asking about job filters or type 'help'.",
            filters: {},
            intent: 'error'
        };
    }
}
