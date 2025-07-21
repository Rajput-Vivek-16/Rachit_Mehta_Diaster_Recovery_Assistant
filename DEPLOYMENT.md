# Deployment Guide for Disaster Management Website

## Overview
This is a full-stack disaster management website with a React frontend and Python Flask backend, designed to be deployed on Vercel.

## Project Structure
```
├── client/                 # React frontend
├── api/                   # Python Flask API (serverless functions)
├── Server/                # Original heavy backend (for development)
├── vercel.json           # Vercel configuration
└── requirements.txt      # Python dependencies
```

## Features
- **Disaster Assistance Chatbot**: Provides safety instructions for earthquakes, floods, fires, and hurricanes
- **Emergency Alerts**: Real-time disaster alerts and updates
- **Healthcare Locator**: Find nearest healthcare facilities
- **Emergency Forms**: Request assistance and submit feedback
- **Admin Dashboard**: Manage disaster response operations

## Deployment Steps

### 1. Prerequisites
- [Vercel CLI](https://vercel.com/cli) installed
- Git repository connected to Vercel
- Node.js and npm installed

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect the configuration from `vercel.json`
5. Click "Deploy"

### 3. Environment Configuration
The application will work out of the box with the predefined disaster responses. For advanced features:

- **MongoDB**: Update MongoDB connection strings for user authentication
- **API Keys**: Add any required API keys for maps and external services

### 4. Testing the Deployment

#### Test the Frontend
- Visit your Vercel deployment URL
- Navigate through different pages (Home, Alerts, ChatBot, etc.)

#### Test the Chatbot
1. Go to `/chatbot` route
2. Try these sample messages:
   - "earthquake safety"
   - "flood emergency"
   - "fire evacuation"
   - "hurricane preparation"
   - "general disaster prep"

#### Test API Directly
- GET `https://your-domain.vercel.app/api/health`
- POST `https://your-domain.vercel.app/api/chat` with JSON body: `{"text": "earthquake help"}`

## Chatbot Features

### Supported Disaster Types
1. **Earthquakes**: Drop, cover, hold on procedures
2. **Floods**: Evacuation and water safety
3. **Wildfires**: Evacuation and property protection
4. **Hurricanes**: Storm preparation and shelter procedures
5. **General**: Emergency kit and family planning

### How It Works
- **Frontend**: React component sends user input via Axios
- **Backend**: Lightweight Flask API processes keywords and returns appropriate safety instructions
- **Response**: Detailed, step-by-step disaster response guidance

## Development

### Local Development
```bash
# Frontend (in client directory)
cd client
npm install
npm run dev

# Backend API (for testing)
cd api
python chat.py
```

### Adding New Disaster Types
1. Edit `api/chat.py`
2. Add new disaster type to `DISASTER_RESPONSES` dictionary
3. Update keyword matching in `get_disaster_advice()` function
4. Redeploy to Vercel

## Troubleshooting

### Common Issues
1. **API not responding**: Check Vercel function logs
2. **CORS errors**: Ensure `flask-cors` is properly configured
3. **Build failures**: Check Node.js version compatibility
4. **Function timeout**: Reduce response complexity or increase timeout in `vercel.json`

### Logs and Monitoring
- View function logs in Vercel dashboard
- Monitor API response times and errors
- Check browser console for frontend errors

## Performance Optimization
- Chatbot responses are instant (no AI model loading)
- Static frontend assets are cached by Vercel CDN
- API functions start cold but warm up quickly
- Optimized for mobile and desktop usage

## Security
- CORS properly configured for cross-origin requests
- Input validation on API endpoints
- No sensitive data stored in client-side code
- HTTPS enforced on Vercel deployment