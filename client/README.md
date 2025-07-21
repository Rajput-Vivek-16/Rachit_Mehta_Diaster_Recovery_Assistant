# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Deployment on Vercel

1. Deploy the `client/` directory to Vercel as a static site (Vite/React is supported out of the box).
2. After deploying your backend (Flask app) to a public URL (e.g., Render, Railway, Heroku), update the `VITE_BACKEND_URL` in the `.env` file to point to your backend's public URL.
3. Redeploy the frontend if you change the `.env` file.

## Backend Deployment

- Deploy the Flask backend (`Server/app.py`) to a Python-friendly platform (Render, Railway, Heroku, etc.).
- Make sure to allow CORS and set up any required environment variables (e.g., MongoDB URI, JWT secret).
- After deployment, use the public backend URL in your frontend `.env` file as described above.
