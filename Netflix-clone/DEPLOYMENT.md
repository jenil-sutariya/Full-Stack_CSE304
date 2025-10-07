# Deployment Guide

This guide will help you deploy your Netflix clone to Firebase Hosting and push it to GitHub.

## Prerequisites

- Node.js installed
- Git installed
- Firebase account
- GitHub account

## Step 1: Firebase Deployment

### 1.1 Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 1.2 Login to Firebase

```bash
firebase login
```

### 1.3 Initialize Firebase Project

```bash
firebase init hosting
```

When prompted:
- Select "Use an existing project" or create a new one
- Set public directory to `dist`
- Configure as single-page app: `Yes`
- Set up automatic builds: `No` (for now)

### 1.4 Deploy to Firebase

```bash
firebase deploy
```

Your app will be available at: `https://your-project-id.web.app`

## Step 2: GitHub Repository

### 2.1 Initialize Git Repository

```bash
git init
```

### 2.2 Add All Files

```bash
git add .
```

### 2.3 Create Initial Commit

```bash
git commit -m "Initial commit: Netflix clone with TMDB API integration"
```

### 2.4 Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it `netflix-clone`
4. Make it public
5. Don't initialize with README (we already have one)

### 2.5 Connect Local Repository to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/netflix-clone.git
```

### 2.6 Push to GitHub

```bash
git push -u origin main
```

## Step 3: Continuous Deployment (Optional)

### 3.1 Enable GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Build
      run: npm run build
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: live
        projectId: your-project-id
```

### 3.2 Add Firebase Service Account Secret

1. Go to Firebase Console > Project Settings > Service Accounts
2. Generate new private key
3. Copy the JSON content
4. Go to GitHub Repository > Settings > Secrets
5. Add new secret named `FIREBASE_SERVICE_ACCOUNT`
6. Paste the JSON content

## Step 4: Environment Variables

### 4.1 For Local Development

Create `.env.local`:
```
REACT_APP_TMDB_API_KEY=your_actual_api_key
```

### 4.2 For Production

Update `src/config.js` with your actual API key before deploying.

## Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain in Firebase Console

1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the verification steps

### 5.2 Update DNS Records

Add the provided DNS records to your domain registrar.

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that all dependencies are installed
2. **API Key Not Working**: Verify your TMDB API key is correct
3. **Firebase Deploy Fails**: Ensure you're logged in and project is initialized
4. **Git Push Fails**: Check your GitHub credentials and repository URL

### Performance Optimization

1. **Image Optimization**: Consider using WebP format for images
2. **Code Splitting**: Implement lazy loading for components
3. **Caching**: Configure proper cache headers in Firebase

## Security Notes

- Never commit API keys to public repositories
- Use environment variables for sensitive data
- Enable HTTPS for all deployments
- Regularly update dependencies for security patches

## Monitoring

- Use Firebase Analytics to track usage
- Monitor performance with Firebase Performance
- Set up error reporting with Firebase Crashlytics

---

Your Netflix clone is now live! 🎉

Remember to:
- Keep your API key secure
- Regularly update dependencies
- Monitor your Firebase usage
- Test on different devices and browsers
