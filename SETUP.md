# CareerLink - CORS-Free Setup Guide

This project has been restructured to **eliminate CORS completely** by serving the React frontend from the same Express server.

## 🎯 Architecture

- **Single Server**: Express on port 5000
- **Frontend**: React build served as static files
- **API**: Routes under `/api/*`
- **No CORS**: Everything on same origin = no CORS needed

## 📁 Project Structure

```
OnlinePortal/
├── backend/
│   ├── server.js          # Express server (serves React build)
│   ├── routes/            # API routes
│   ├── controllers/       # Business logic
│   ├── models/            # Mongoose models
│   └── middleware/        # Auth middleware
├── frontend/
│   ├── build/             # React production build (generated)
│   ├── src/               # React source code
│   └── package.json
└── package.json
```

## 🚀 Setup Instructions

### Step 1: Build the React Frontend

```bash
cd frontend
npm run build
cd ..
```

This creates the `frontend/build/` directory with production-ready static files.

### Step 2: Start the Backend Server

```bash
npm start
```

Or:

```bash
node backend/server.js
```

### Step 3: Open in Browser

Open: **http://localhost:5000**

- Frontend: http://localhost:5000
- API: http://localhost:5000/api

## ✅ Verification

1. **Server starts successfully**
   ```
   ✅ Server running on port 5000
   ✅ React app available at http://localhost:5000
   ✅ API available at http://localhost:5000/api
   ```

2. **Test registration**
   - Go to http://localhost:5000
   - Click "Register"
   - Fill form and submit
   - ✅ Should work WITHOUT any CORS errors

3. **Check browser console**
   - No CORS errors
   - Network tab shows requests to `/api/auth/register` (relative path)

## 🔧 Development Workflow

### For Development (Hot Reload)

During development, you can still use React dev server with proxy:

1. **Terminal 1 - Backend:**
   ```bash
   npm run server
   ```

2. **Terminal 2 - Frontend (dev mode):**
   ```bash
   cd frontend
   npm start
   ```

React dev server will run on port 3000 and proxy API calls to port 5000.

### For Production

1. Build frontend: `npm run build`
2. Start server: `npm start`
3. Everything runs on port 5000

## 🔑 Key Changes Made

### Backend (`backend/server.js`)
- ✅ Removed ALL CORS middleware
- ✅ Serves static files from `frontend/build/`
- ✅ API routes under `/api/*`
- ✅ Fallback route serves `index.html` for React Router

### Frontend (`frontend/src/services/api.js`)
- ✅ Changed `baseURL` from `"http://localhost:5000/api"` to `"/api"`
- ✅ Removed all localhost references
- ✅ Uses relative paths (same origin)

### Components
- ✅ Removed hardcoded `http://localhost:5000` from image URLs
- ✅ All static assets use relative paths

## ❓ Why This Eliminates CORS

**CORS (Cross-Origin Resource Sharing)** only applies when:
- Frontend is on one origin (e.g., `http://localhost:3000`)
- Backend is on another origin (e.g., `http://localhost:5000`)

**Our solution:**
- Frontend and backend are on the **same origin** (`http://localhost:5000`)
- Browser treats it as same-origin request
- **No CORS headers needed** - browser allows it automatically
- No preflight OPTIONS requests
- No CORS errors ever

## 🐛 Troubleshooting

### "Cannot GET /" error
- Make sure you ran `npm run build` in the frontend directory
- Check that `frontend/build/index.html` exists

### API calls failing
- Check that API routes are mounted before static file serving
- Verify routes are under `/api/*` path

### Images not loading
- Ensure image paths in database are relative (e.g., `/uploads/profiles/image.jpg`)
- Check that `backend/uploads/` directory exists

## 📝 Notes

- This is a **production-ready** setup
- Same approach used by major frameworks (Next.js, Nuxt, etc.)
- No CORS configuration needed anywhere
- Works in all browsers
- Secure and simple


