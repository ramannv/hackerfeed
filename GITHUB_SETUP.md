# Push to GitHub - Step by Step

## Step 1: Create a New Repository on GitHub

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name**: `hackerfeed`
   - **Description**: "Personalized Hacker News reader with AI recommendations"
   - **Visibility**: Public or Private (your choice)
   - ⚠️ **DO NOT** check "Initialize with README" (you already have one)
   - ⚠️ **DO NOT** add .gitignore or license (you already have them)
3. Click "Create repository"

## Step 2: Connect Your Local Repo to GitHub

GitHub will show you commands. Use these:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/hackerfeed.git

# Push your code
git push -u origin master
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

## Complete Commands (Copy & Paste)

```bash
# 1. Add your GitHub repo as remote
git remote add origin https://github.com/YOUR_USERNAME/hackerfeed.git

# 2. Push code to GitHub
git push -u origin master

# 3. Push the alpha tag too
git push origin alpha
```

## Troubleshooting

### "Remote already exists"
If you get this error, remove the old remote first:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/hackerfeed.git
git push -u origin master
```

### Authentication Error
GitHub requires a Personal Access Token (PAT) instead of password:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control)
4. Generate token and **copy it**
5. Use token as password when prompted

### Want to use SSH instead?
```bash
# Add SSH remote instead of HTTPS
git remote add origin git@github.com:YOUR_USERNAME/hackerfeed.git
git push -u origin master
```

## After Pushing

Your repo will be at: `https://github.com/YOUR_USERNAME/hackerfeed`

Now you can:
- ✅ Connect to Netlify for auto-deployment
- ✅ Share with others
- ✅ Track changes
- ✅ Collaborate

## Next Steps

Once pushed to GitHub, follow `DEPLOYMENT.md` to deploy on Netlify!
