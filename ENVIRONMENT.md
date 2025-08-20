# Environment Configuration Guide

## Overview
This project uses environment variables to configure different settings for development, staging, and production environments.

## Environment Files

### `.env` (Base Configuration)
- Contains default values for all environments
- Safe to commit to version control
- Used as fallback when other env files don't exist

### `.env.local` (Local Development Override)
- Overrides `.env` for local development
- **NEVER commit this file** (it's in .gitignore)
- Use this for your personal development settings

### `.env.production` (Production Configuration)
- Used when deploying to production (Vercel, etc.)
- Contains production-specific values
- Safe to commit to version control

### `.env.example` (Template)
- Template file showing all available environment variables
- Copy this to `.env.local` to get started
- Safe to commit to version control

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NEXT_PUBLIC_DEBUG` | Enable debug logging | `false` | `true` |
| `NEXT_PUBLIC_API_TIMEOUT` | API timeout (ms) | `30000` | `45000` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `BFUB CBT System` | `BFUB CBT System` |
| `NEXT_PUBLIC_APP_VERSION` | App version | `1.0.0` | `1.0.0` |

## Setup Instructions

### For Development
1. Copy `.env.example` to `.env.local`
2. Update `NEXT_PUBLIC_API_URL` to your backend URL
3. Set `NEXT_PUBLIC_DEBUG=true` for debug logging

### For Production (Vercel)
1. Go to your Vercel project settings
2. Add environment variables in the Environment Variables section:
   - `NEXT_PUBLIC_API_URL`: Your Railway backend URL
   - `NEXT_PUBLIC_DEBUG`: `false`
3. Redeploy your application

### For Local Testing with Production Backend
Update your `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://web-production-68097.up.railway.app
NEXT_PUBLIC_DEBUG=true
```

## Environment Priority (Next.js)
1. `.env.local` (highest priority, not committed)
2. `.env.production` / `.env.development` (environment specific)
3. `.env` (lowest priority, default values)

## Security Notes
- Never commit `.env.local` to version control
- All `NEXT_PUBLIC_*` variables are exposed to the browser
- Don't put sensitive data in `NEXT_PUBLIC_*` variables
- Use server-side environment variables for secrets

## Troubleshooting

### "Environment variable not found"
- Check if the variable exists in your `.env.local` file
- Make sure the variable name starts with `NEXT_PUBLIC_`
- Restart your development server after changing env files

### "Still connecting to localhost in production"
- Check Vercel environment variables are set correctly
- Make sure to redeploy after setting environment variables
- Check browser dev tools for the actual API URL being used

### "API calls failing"
- Check if the backend URL is accessible
- Verify CORS settings on the backend
- Check browser dev tools for network errors
