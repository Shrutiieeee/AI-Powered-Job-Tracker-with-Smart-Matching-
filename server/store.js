// In-memory storage (simple and sufficient for assignment)
export const store = {
    users: [
        {
            id: '1',
            email: 'test@gmail.com',
            password: 'test@123', // In production, this would be hashed
            resume: null
        }
    ],
    applications: [],
    sessions: new Map()
};

export const getUser = (email) => {
    return store.users.find(u => u.email === email);
};

export const addUser = (email, password) => {
    const newUser = {
        id: (store.users.length + 1).toString(),
        email,
        password,
        resume: null
    };
    store.users.push(newUser);
    return newUser;
};

export const getUserById = (id) => {
    return store.users.find(u => u.id === id);
};

export const updateUserResume = (userId, resumeData) => {
    const user = getUserById(userId);
    if (user) {
        user.resume = resumeData;
    }
    return user;
};

export const getApplications = (userId) => {
    return store.applications.filter(app => app.userId === userId);
};

export const addApplication = (application) => {
    store.applications.push(application);
    return application;
};

export const updateApplication = (id, updates) => {
    const app = store.applications.find(a => a.id === id);
    if (app) {
        Object.assign(app, updates);
    }
    return app;
};

export const getApplicationByJobId = (userId, jobId) => {
    return store.applications.find(a => a.userId === userId && a.jobId === jobId);
};
