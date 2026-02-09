# 🚀 Step-by-Step Deployment Guide (Render)

Since I've already configured your project to be "Unified" (the backend serves the frontend), deployment is now very simple. We will use **Render.com** as it's the easiest free-tier option for Node.js apps.

---

## Step 1: Push your code to GitHub
If you haven't already, you need to put your code on GitHub.
1. Create a new **Public** repository on [GitHub](https://github.com/new).
2. Run these commands in your project folder:
   ```bash
   git init
   git add .
   git commit -m "Preparing for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

## Step 2: Create a Render Account
1. Go to [Render.com](https://render.com/) and sign up (using your GitHub account is easiest).

---

## Step 3: Create a new "Web Service"
1. In the Render Dashboard, click **New +** and select **Web Service**.
2. Connect your GitHub repository.
3. Enter the following settings:
   - **Name**: `ai-job-tracker` (or anything you like)
   - **Environment**: `Node`
   - **Region**: Select the one closest to you.
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

---

## Step 4: Add Environment Variables
This is the most important part!
1. Click the **Advanced** button or go to the **Environment** tab.
2. Add the following keys:
   - `OPENAI_API_KEY`: Paste your actual OpenAI API key here.
   - `PORT`: `3001`
   - `NODE_ENV`: `production`

---

## Step 5: Deploy and Verify
1. Click **Create Web Service**.
2. Wait for the logs to show: `🚀 Server running on http://localhost:3001`.
3. Render will give you a URL (e.g., `https://ai-job-tracker.onrender.com`).
4. Open that URL—your app should be live!

---

## 💡 Pro Tips for your Submission
- **Initial Load**: Since it's a free tier, the first time you open the link after a while, it might take 30-60 seconds to "wake up".
- **Database**: Remember that data is **in-memory**, so it resets every time the server restarts. Mention this in your assignment submit as a "intentional design choice for demo purposes".
- **Zip and Send**: If the recruiter wants the source code, make sure to delete `node_modules` before zipping to keep the file size small!
