# CI/CD Deployment Guide for ChatFlow

This repository uses **GitHub Actions** for automated continuous integration and continuous deployment (CI/CD):
- **Backend (Express + Socket.IO + MongoDB)**: Deployed to [Render](https://render.com)
- **Frontend (React + Vite + Tailwind CSS)**: Deployed to [Vercel](https://vercel.com)

---

## 📁 CI/CD Architecture

```
GitHub Repository
  ├── Push / PR to backend/**  ───► Backend CI/CD Workflow (.github/workflows/backend-render.yml)
  │                                    ├── 1. CI: Install & Syntax/Test Validation
  │                                    └── 2. CD: Trigger Render Deploy Hook (on push to main/latest)
  │
  └── Push / PR to frontend/** ───► Frontend CI/CD Workflow (.github/workflows/frontend-vercel.yml)
                                       ├── 1. CI: Install & Production Vite Build
                                       └── 2. CD: Deploy via Vercel CLI (Preview on PR, Prod on push)
```

---

## 🛠️ Step 1: Render Setup (Backend)

### 1. Create Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository (`Krrish-Gupta-18/fs-project`).
3. Set the following settings (or Render will detect `render.yaml` automatically):
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
   - **Auto-Deploy**: **No** *(recommended so GitHub Actions controls when deployments occur after tests pass)*.

### 2. Configure Render Environment Variables
In your Render service's **Environment** tab:
- `NODE_ENV`: `production`
- `PORT`: `5000` (or leave default assigned by Render)
- `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster.mongodb.net/chatflow`
- `JWT_SECRET`: `<your_secure_jwt_secret_key>`
- `CLIENT_URL`: `https://<your-app>.vercel.app`

### 3. Copy the Render Deploy Hook
1. In your Render Web Service, go to **Settings** -> **Deploy Hook**.
2. Click **Create Deploy Hook** (or copy the existing URL).
   - Format: `https://api.render.com/deploy/srv-xxxxxxxxxxxx?key=yyyyyyyyyyyy`
3. Add it to GitHub Secrets:
   - Go to your GitHub repository: **Settings** -> **Secrets and variables** -> **Actions**.
   - Click **New repository secret**.
   - Name: `RENDER_DEPLOY_HOOK_URL`
   - Value: paste the webhook URL.

---

## ⚡ Step 2: Vercel Setup (Frontend)

### 1. Create Project on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import your GitHub repository.
3. Configure the project:
   - **Root Directory**: Click edit and select `frontend`.
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   - `VITE_API_URL`: `https://<your-render-backend-name>.onrender.com/api`
   - `VITE_SOCKET_URL`: `https://<your-render-backend-name>.onrender.com`
5. Deploy once to initialize the project.

### 2. Retrieve Vercel Credentials for GitHub Actions
You need 3 secrets in GitHub repository settings:

1. **`VERCEL_TOKEN`**:
   - Go to [Vercel Account Tokens](https://vercel.com/account/tokens).
   - Click **Create**, choose scope, and copy the token.
2. **`VERCEL_ORG_ID`**:
   - In Vercel, go to your Team/Account **Settings** -> **General**.
   - Copy the **Team ID** (or User ID if personal account).
3. **`VERCEL_PROJECT_ID`**:
   - In Vercel, go to your frontend project -> **Settings** -> **General**.
   - Copy the **Project ID**.

*(Alternatively, run `vercel link` in your local `frontend` directory; the values will be in `frontend/.vercel/project.json`)*.

### 3. Add Vercel Secrets to GitHub
In GitHub repository: **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## 🔒 Summary of GitHub Secrets

| Secret Name | Description | Used By |
|-------------|-------------|---------|
| `RENDER_DEPLOY_HOOK_URL` | Webhook URL from Render Web Service Settings | Backend CD |
| `VERCEL_TOKEN` | Personal/Team access token from Vercel Account | Frontend CD |
| `VERCEL_ORG_ID` | Vercel Organization / User ID | Frontend CD |
| `VERCEL_PROJECT_ID` | Vercel Project ID from Project Settings | Frontend CD |

---

## 🚀 Workflow Triggers

- **Backend CI/CD**:
  - Automatically triggered when any file under `backend/` changes on branches `main`, `latest`, or `master`.
  - Also triggers on pull requests targeting those branches to test backend before merging.
  - Can be manually triggered anytime via the **Actions** tab in GitHub (**Run workflow**).

- **Frontend CI/CD**:
  - Automatically triggered when any file under `frontend/` changes on branches `main`, `latest`, or `master`.
  - Runs full Vite production build checks on pull requests and deploys preview URLs.
  - Deploys prebuilt artifacts directly to production upon merge or push.
  - Can be manually triggered anytime via the **Actions** tab.
