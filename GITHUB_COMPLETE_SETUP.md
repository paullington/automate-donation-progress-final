# GITHUB - COMPLETE SETUP GUIDE

## TABLE OF CONTENTS
1. Repository Setup & Access
2. Branch Management
3. Secrets & Environment Configuration
4. GitHub Actions & Workflows
5. Integration with Vercel
6. Collaboration & Protection
7. Monitoring & Deployment

---

## SECTION 1: REPOSITORY SETUP & ACCESS

### Step 1.1: Verify Repository Details

**Location:**
- URL: https://github.com/paullington/automate-donation-tracking
- Owner: paullington
- Visibility: Should be Public (for Vercel deployment)

**To verify:**
1. Go to: https://github.com/paullington/automate-donation-tracking
2. Check: "Public" badge at top
3. If Private: Need to change (see below)

### Step 1.2: Change Repository Visibility (If Private)

**Make repository public (required for Vercel deployment):**
1. Go to: Repository Settings
2. Click: **Settings** (top right)
3. Scroll to: **Danger Zone**
4. Click: **Change repository visibility**
5. Select: **Public**
6. Type repository name to confirm
7. Click: **I understand, change repository visibility**

### Step 1.3: Verify Collaborators

**Who has access:**
1. Go to: **Settings → Collaborators**
2. Should see your GitHub username
3. Current role: Owner

**Add team members (if needed):**
1. Click: **Add people**
2. Enter: GitHub username or email
3. Select: Role (Admin/Maintain/Push/Triage/Pull)
4. Recommended roles:
   - Admin: Project lead only
   - Maintain: DevOps/Backend lead
   - Push: Developers
   - Pull: Testers/Reviewers

### Step 1.4: Verify Repository is Connected to Vercel

**Check Vercel connection:**
1. Go to: https://vercel.com/dashboard
2. Select your project: automate-donation-tracking
3. Go to: **Settings → Git**
4. Verify:
   - **Repository**: paullington/automate-donation-tracking ✓
   - **Connected**: Yes ✓
   - **Deployments branch**: main ✓

**If not connected:**
1. Click: **Connect Repository**
2. Select GitHub
3. Select repository: automate-donation-tracking
4. Click: **Connect**

---

## SECTION 2: BRANCH MANAGEMENT

### Step 2.1: Current Branch Structure

**Your main branches should be:**
- `main` - Production branch (auto-deploys to Vercel)
- `develop` - Development branch (optional preview deployments)
- Feature branches - Temporary development branches

### Step 2.2: Set Main Branch Protection

**Protect the main branch to prevent accidents:**

1. Go to: **Settings → Branches**
2. Click: **Add rule**
3. Branch name pattern: `main`
4. Enable:
   - [ ] **Require a pull request before merging**
       - Required approving reviews: 1
   - [ ] **Require status checks to pass**
   - [ ] **Require branches to be up to date**
   - [ ] **Include administrators**: Check this
5. Click: **Create**

**This ensures:**
- ✓ Code review before production deployment
- ✓ Tests must pass before merge
- ✓ Branches must be up-to-date
- ✓ Admins can't bypass (safety)

### Step 2.3: Create Feature Branch Workflow

**For new features:**

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/anonymous-donor-improvements

# 2. Make changes
# ... edit files ...

# 3. Commit with clear message
git add .
git commit -m "feat: improve anonymous donor handling"

# 4. Push to GitHub
git push origin feature/anonymous-donor-improvements

# 5. Create Pull Request on GitHub
# Go to: https://github.com/paullington/automate-donation-tracking
# Click: "Compare & pull request"
# Add description
# Click: "Create pull request"

# 6. Wait for reviews & checks to pass
# Once approved: Click "Merge pull request"

# 7. Delete feature branch
git branch -d feature/anonymous-donor-improvements
git push origin --delete feature/anonymous-donor-improvements
```

### Step 2.4: Verify Main Branch Auto-Deploy

**Main branch should auto-deploy to Vercel:**
1. Make a small change to main branch
2. Commit and push:
```bash
git add .
git commit -m "test: verify auto-deployment"
git push origin main
```
3. Go to: https://vercel.com/dashboard
4. Should see new deployment in progress
5. Wait for "✓ Production" status

---

## SECTION 3: SECRETS & ENVIRONMENT CONFIGURATION

### Step 3.1: GitHub Secrets (Optional but Recommended)

**GitHub Secrets are used for:**
- Secure CI/CD workflows
- Protecting sensitive data in Actions
- Deploying to Vercel via GitHub Actions

**Add secrets:**
1. Go to: **Settings → Secrets and variables → Actions**
2. Click: **New repository secret**

**Secrets to add:**
- `VERCEL_TOKEN` - For automated Vercel deployments
- `DATABASE_URL` - For database migrations in CI

### Step 3.2: Generate Vercel Token

**Get your Vercel token:**
1. Go to: https://vercel.com/account/tokens
2. Click: **Create New Token**
3. Name: `github-actions`
4. Expiration: 90 days (or your preference)
5. Click: **Create**
6. Copy the token (shown once)

**Add to GitHub:**
1. Go back to GitHub: **Settings → Secrets and variables → Actions**
2. Click: **New repository secret**
3. Name: `VERCEL_TOKEN`
4. Value: Paste your Vercel token
5. Click: **Add secret**

### Step 3.3: Add Database URL Secret (For Migrations)

**Get your Neon connection string:**
1. Go to: https://console.neon.tech
2. Click your project
3. Click "Connection string"
4. Select "nodejs" from dropdown
5. Copy the string

**Add to GitHub:**
1. Go to: **Settings → Secrets and variables → Actions**
2. Click: **New repository secret**
3. Name: `DATABASE_URL`
4. Value: Paste Neon connection string
5. Click: **Add secret**

### Step 3.4: Check for Sensitive Data in Code

**Ensure no secrets in code:**
```bash
# Search for common secrets
grep -r "password" --include="*.ts" --include="*.js" .
grep -r "DATABASE_URL" --include="*.ts" --include="*.js" .
grep -r "token" --include="*.ts" --include="*.js" .

# If found in code: REMOVE and use environment variables instead
```

**Good practice:**
- ✓ Use `.env.example` for template
- ✓ All secrets in environment variables
- ✓ Never commit `.env` files
- ✓ Use `.gitignore` to prevent accidents

---

## SECTION 4: GITHUB ACTIONS & WORKFLOWS

### Step 4.1: Set Up Automated Testing (Optional)

**Create workflow file:**
1. Go to: GitHub repository (in browser)
2. Click: **Actions** tab
3. Click: **set up a workflow yourself**

**Create file: `.github/workflows/test.yml`**

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run TypeScript check
      run: npx tsc --noEmit
    
    - name: Build
      run: npm run build
```

**This workflow:**
- ✓ Runs on every push to main
- ✓ Runs on every pull request
- ✓ Checks TypeScript
- ✓ Builds the project
- ✓ Fails if errors found (blocks merge)

### Step 4.2: Set Up Database Migration Workflow (Optional)

**Create file: `.github/workflows/migrate.yml`**

```yaml
name: Run Database Migrations

on:
  workflow_dispatch:
  
jobs:
  migrate:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run migrations
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
      run: npx ts-node scripts/process-existing-donations.ts
```

**This workflow:**
- ✓ Runs manually (click "Run workflow" in Actions tab)
- ✓ Uses DATABASE_URL secret from GitHub
- ✓ Runs database migrations
- ✓ Can be triggered anytime

---

## SECTION 5: INTEGRATION WITH VERCEL

### Step 5.1: Verify Vercel GitHub App Integration

**Check if installed:**
1. Go to: https://github.com/settings/installations
2. Look for: "Vercel"
3. Click on Vercel to see settings

**If not installed:**
1. Go to: https://vercel.com/integrations/github
2. Click: **Install**
3. Select repository: automate-donation-tracking
4. Click: **Install**

### Step 5.2: Verify Deployment on Push

**Test auto-deployment:**
```bash
# 1. Make a small change
echo "# Updated $(date)" >> README.md

# 2. Commit and push
git add README.md
git commit -m "test: verify vercel auto-deploy"
git push origin main

# 3. Check Vercel dashboard
# Should see new deployment within seconds
vercel logs --follow
```

### Step 5.3: Check Commit Status Checks

**GitHub should show deployment status:**
1. Go to: **Commits**
2. Click on latest commit
3. Should show:
   - ✓ Vercel deployment (green checkmark)
   - ✓ Any CI tests (if configured)
4. Can see deployment details

### Step 5.4: Revert Broken Deployment

**If a deployment breaks production:**

```bash
# 1. Find the commit before the bad one
git log --oneline | head -10

# 2. Revert to previous working state
git revert HEAD
# or
git reset --hard <commit-hash>

# 3. Push to GitHub (triggers auto-revert)
git push origin main

# 4. Vercel will re-deploy with previous version
```

---

## SECTION 6: COLLABORATION & PROTECTION

### Step 6.1: Code Review Best Practices

**When creating Pull Requests:**
1. Provide clear title and description
2. Link related issues
3. Request reviewers
4. Ensure checks pass before asking review

**Example PR description:**
```
## Description
Add improvements to anonymous donor feature

## Changes
- Improved anonymous donor handling
- Better privacy protection
- Enhanced admin display

## Testing
- Tested anonymous submission
- Verified email hidden from admin
- Confirmed stats update

## Screenshots
[If applicable]

Closes #123
```

### Step 6.2: Review & Merge Process

**As a reviewer:**
1. Go to: **Pull requests**
2. Click on PR to review
3. Review code changes
4. Add comments if needed
5. Click: **Approve** or **Request changes**

**As PR author:**
1. Address reviewer feedback
2. Make updates to branch
3. Push changes (auto-updates PR)
4. Once approved: Click **Merge pull request**

### Step 6.3: Issue Management

**Create issues for tracking:**
1. Go to: **Issues**
2. Click: **New Issue**
3. Template: Bug report or Feature request
4. Add labels, assignees, projects
5. Click: **Submit new issue**

**Use issues for:**
- Bug reports
- Feature requests
- Documentation
- Tracking progress

---

## SECTION 7: MONITORING & DEPLOYMENT

### Step 7.1: Monitor Deployments

**Via GitHub:**
1. Go to: **Repository**
2. Look at right side: **Deployments** (or bottom of README)
3. Shows:
   - Latest deployment status
   - Environment (Production/Preview)
   - Timeline of deployments

**Via Terminal:**
```bash
vercel ls
vercel logs --follow
```

### Step 7.2: Check Deployment Status

**Green checkmark means:**
- ✓ Code pushed to GitHub
- ✓ Vercel received notification
- ✓ Build succeeded
- ✓ Deployment live

**Red X means:**
- ✗ Build failed or tests failed
- ✗ Check Vercel logs for details
- ✗ Fix the issue and push again

### Step 7.3: View Deployment Details

**Click on deployment:**
1. In Deployments section
2. Click the deployment
3. Can see:
   - Build logs
   - Deployment URL
   - Success/failure status
   - Environment variables used

### Step 7.4: Rollback Deployment (If Needed)

**Automatic rollback via git:**
```bash
# Find the good commit
git log --oneline

# Revert the bad commit
git revert <bad-commit-hash>

# Push to main
git push origin main

# Vercel auto-deploys the revert
```

**Or manually in Vercel:**
1. Go to Vercel dashboard
2. Click "Deployments"
3. Find the good deployment
4. Click "Promote to Production"

---

## SECTION 8: DOCUMENTATION & README

### Step 8.1: Update Repository README

**Your README.md should include:**
1. Project description
2. Features
3. Quick start
4. Deployment instructions
5. Architecture overview
6. Contributing guidelines
7. License

**Current README includes:**
- ✓ Project overview
- ✓ Feature list
- ✓ Quick start instructions
- ✓ Documentation links

### Step 8.2: Add Documentation Files

**Files included in repo:**
- START_HERE.md - Quick start
- VERCEL_COMPLETE_SETUP.md - This file
- GITHUB_COMPLETE_SETUP.md - GitHub setup (this file)
- DEPLOYMENT_CHECKLIST.md - Full checklist
- ANONYMOUS_DONORS_GUIDE.md - Feature guide
- Plus 5 more guides

**Users should read in order:**
1. START_HERE.md
2. This guide for their platform
3. DEPLOYMENT_CHECKLIST.md

---

## SECTION 9: FINAL CHECKLIST

### GitHub Setup Complete?

**Repository:**
- [ ] Repository is public
- [ ] Connected to Vercel
- [ ] Main branch protected
- [ ] All code pushed to main

**Access & Security:**
- [ ] Collaborators added (if team)
- [ ] GitHub Secrets configured (optional but recommended)
- [ ] No sensitive data in code
- [ ] .gitignore configured properly

**Integrations:**
- [ ] Vercel GitHub App installed
- [ ] Auto-deploy working
- [ ] Deployment status checks passing
- [ ] Commit statuses showing correctly

**Documentation:**
- [ ] README updated
- [ ] All guides added to repo
- [ ] Setup instructions clear
- [ ] Contributing guidelines present (optional)

**Automation:**
- [ ] Pull request workflow set up
- [ ] Branch protection rules active
- [ ] Auto-deployment working
- [ ] Status checks passing

---

## TROUBLESHOOTING

### Issue: "Vercel integration not found in GitHub"

**Solution:**
1. Go to: https://github.com/settings/installations
2. Look for Vercel
3. If not there:
   - Go to: https://vercel.com/integrations/github
   - Click: "Install"
   - Select repository
   - Click: "Install"

### Issue: Commits not showing deployment status

**Solution:**
1. Verify Vercel GitHub App is installed
2. Check Vercel dashboard for deployment
3. If deployment shows but GitHub doesn't:
   - Refresh GitHub page
   - It may take 30 seconds to update

### Issue: Pull request blocked by checks

**Solution:**
1. Click "Show all checks" to see which failed
2. Check Vercel logs for build errors
3. Fix the issue locally:
   ```bash
   npm run build  # Test build
   npx tsc --noEmit  # Test TypeScript
   ```
4. Commit fix and push to same branch
5. PR will auto-update

### Issue: Can't push to main branch

**Solution:**
1. This is intentional (branch protection)
2. Create a pull request instead
3. Get approval from reviewer
4. Then merge via GitHub UI

---

## NEXT STEPS

1. ✓ Complete all checklist items
2. ✓ Test deployment workflow
3. ✓ Test pull request process
4. ✓ Monitor first 24 hours
5. ✓ Share repo with team

**Questions?**
- GitHub Docs: https://docs.github.com
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
