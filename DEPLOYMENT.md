# 🚀 Deployment Guide - ShriRam Dairy Full-Stack Application

This guide contains step-by-step instructions to deploy the frontend client on **Netlify** and the backend API server on **Render**.

---

## 🎨 Frontend Deployment on Netlify

Netlify hosts static sites and single-page applications. The frontend client in this project uses Vite/React.

### 1. Create a New Netlify Site
1. Log in to your [Netlify Dashboard](https://app.netlify.com/).
2. Click **Add new site** > **Import from an existing project**.
3. Authorize and select your GitHub repository.

### 2. Configure Build Settings
During setup, set the following configuration values:
- **Base directory**: `client`
- **Build command**: `npm run build`
- **Publish directory**: `dist` (Netlify resolves this relative to the base directory, pointing to `client/dist`)

### 3. Add Environment Variables
Add the following key-value pairs in Netlify's **Site settings** > **Environment variables**:

| Key | Description / Example Value |
| :--- | :--- |
| `VITE_API_URL` | The live URL of your Render API backend (e.g., `https://shreeramdairy-backend.onrender.com`) |
| `VITE_RAZORPAY_KEY_ID` | Your Razorpay public Test/Live API Key ID (e.g., `rzp_test_SwFI9BNT...`) |
| `VITE_GOOGLE_CLIENT_ID` | Your Google API Client ID for OAuth login (e.g., `145880098160-...apps.googleusercontent.com`) |

---

## 💻 Backend Deployment on Render

Render will host the Node/Express backend server and handle database operations, payment orders, and email delivery.

### 1. Create a New Render Service
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.

### 2. Configure Web Service Settings
Provide the following details:
- **Name**: `shreeramdairy-backend` (or any custom name)
- **Runtime**: `Node`
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

### 3. Add Environment Variables
Under the **Environment** section, set the following environment variables (alternatively, upload the `.env` contents):

| Key | Example / Recommended Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render's default web port) |
| `MONGODB_URI` | Your MongoDB Atlas connection string (`mongodb+srv://...`) |
| `CORS_ORIGIN` | Your Netlify live URL (e.g., `https://shreeramdairy.netlify.app`) |
| `FRONTEND_URL` | Your Netlify live URL (e.g., `https://shreeramdairy.netlify.app`) |
| `ACCESS_TOKEN_SECRET` | *Generates a random secret string* (e.g., `22222222222214444444vanshu`) |
| `REFRESH_TOKEN_SECRET`| *Generates a random secret string* (e.g., `111111111122222222222222223333333333`) |
| `ACCESS_TOKEN_EXPIRY` | `1d` |
| `REFRESH_TOKEN_EXPIRY`| `10d` |
| `RAZORPAY_KEY_ID` | Your Razorpay API Key ID (matches the frontend key) |
| `RAZORPAY_KEY_SECRET` | Your Razorpay secret key |
| `SMTP_HOST` | E.g. `smtp.gmail.com` or your business SMTP server |
| `SMTP_PORT` | `465` (or `587`) |
| `SMTP_USER` | Your email address |
| `SMTP_PASS` | Your email app password |
| `EMAIL_FROM` | `noreply@shreeramdairy.com` |

---

## 🛠️ Verification & Testing
Once deployed:
1. Access your Netlify URL to verify the frontend loads.
2. Register a new user account, add a product to the cart, and select **Online Cards & UPI (Razorpay)** at checkout to verify communication with the Render API server is functional.
3. Access your Render API URL (e.g., `https://shreeramdairy-backend.onrender.com`) in the browser. You should see the message: `"Shree Ram Dairy MERN API is running..."`.
