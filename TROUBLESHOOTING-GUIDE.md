# Troubleshooting Guide
**Common Problems and Solutions**

---

## 🔍 **GitHub Push Issues**

### Problem: "Authentication failed"
**Symptoms:** Git rejects your username/password

**Solutions:**
1. Make sure you're using your Personal Access Token (not GitHub password)
2. Verify the token is copied correctly (no extra spaces)
3. Check token hasn't expired: https://github.com/settings/tokens
4. Generate a new token if needed

---

### Problem: "Repository not found"
**Symptoms:** Git can't find your repository

**Solutions:**
1. Verify repository exists: https://github.com/TobyElwin/CoD-Software
2. Check repository name is exact: `CoD-Software` (case-sensitive)
3. Ensure you're logged in as the correct user
4. Verify remote URL: `git remote -v`

---

### Problem: "Permission denied"
**Symptoms:** You don't have access to push

**Solutions:**
1. Verify you own the repository
2. Check token has `repo` scope
3. Make sure you're using the correct GitHub account
4. Try regenerating your Personal Access Token

---

## 🌐 **GitHub Pages Issues**

### Problem: "404 - Page Not Found"
**Symptoms:** Your URL shows "404 There isn't a GitHub Pages site here"

**Solutions:**
1. Wait 2-3 minutes after enabling Pages (it takes time to build)
2. Verify Pages is enabled: https://github.com/TobyElwin/CoD-Software/settings/pages
3. Check you selected `main` branch and `/ (root)` folder
4. Refresh your browser cache (Cmd+Shift+R)
5. Make sure `cost-of-delay-calculator.html` exists in repository

---

### Problem: "Blank page loads"
**Symptoms:** URL loads but page is empty

**Solutions:**
1. Check browser console for errors (F12 → Console tab)
2. Verify all files uploaded: `.html`, `.js`, `.css`
3. Check file names match exactly (case-sensitive)
4. Clear browser cache and reload

---

### Problem: "Calculator doesn't work"
**Symptoms:** Page loads but calculations fail

**Solutions:**
1. Open browser console (F12) and check for JavaScript errors
2. Verify `cost-of-delay-calculator.js` is loading
3. Check all three files are in the same directory
4. Try a different browser
5. Check the live site vs local version

---

## 💻 **Local Testing Issues**

### Problem: "File won't open in browser"
**Symptoms:** Double-clicking HTML file doesn't work

**Solutions:**
1. Right-click the HTML file
2. Select "Open With" → Choose your browser
3. Or drag the file into an open browser window

---

### Problem: "Exports don't work locally"
**Symptoms:** Export buttons don't download files

**Solutions:**
- This is normal - some browsers block local file downloads
- Test exports on the live GitHub Pages site instead
- Or run a local server (see below)

---

## 🛠️ **Development Issues**

### Problem: "Tests won't run"
**Symptoms:** `npm test` fails

**Solutions:**
1. Make sure you're in the correct directory
2. Run `npm install` to install dependencies
3. Check Node.js is installed: `node --version`
4. Verify Puppeteer installed correctly

---

### Problem: "Git commands not recognized"
**Symptoms:** "git: command not found"

**Solutions:**
1. Install Git: https://git-scm.com/download/mac
2. Or install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```

---

## 📞 **Getting More Help**

If you're still stuck:

1. **Check the documentation:**
   - STEP-BY-STEP-GITHUB-SETUP.md
   - PERSONAL-ACCESS-TOKEN-GUIDE.md
   - GitHub documentation: https://docs.github.com

2. **Gather information:**
   - What exactly were you trying to do?
   - What error message did you see?
   - What have you tried already?

3. **Screenshots help!**
   - Take a screenshot of the error
   - Include the full Terminal output if relevant

---

**Last Updated:** February 10, 2026
