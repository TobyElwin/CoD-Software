# Step-by-Step GitHub Setup Guide
**Complete Instructions for Publishing Your Cost of Delay Calculator**

---

## 📋 **Prerequisites**

Before you begin, make sure you have:
- ✅ A GitHub account (username: TobyElwin)
- ✅ The repository created at: https://github.com/TobyElwin/CoD-Software
- ✅ Your code committed locally (already done!)

---

## 🔑 **STEP 1: Get Your GitHub Personal Access Token**

### Why do you need this?
GitHub requires a Personal Access Token (PAT) instead of your password for command-line access.

### How to get it:

1. **Open your web browser** and go to:
   ```
   https://github.com/settings/tokens
   ```

2. **Click** the green button: **"Generate new token"** → Select **"Generate new token (classic)"**

3. **Fill in the form:**
   - **Note:** `CoD Software Deployment` (or any name you want)
   - **Expiration:** Select `90 days` or `No expiration` (your choice)
   - **Select scopes:** Check the box for **`repo`** (this gives full control of private repositories)
     - This will auto-check all sub-boxes under `repo`

4. **Scroll down** and click the green **"Generate token"** button

5. **IMPORTANT:** Copy the token immediately!
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Save it somewhere safe** (you won't see it again!)
   - I recommend saving it in a password manager or secure note

---

## 💻 **STEP 2: Push Your Code to GitHub**

### Option A: Using Terminal (Mac)

1. **Open Terminal** (Applications → Utilities → Terminal)

2. **Copy and paste this command** (all one line):
   ```bash
   cd "/Users/tobyelwin/Library/CloudStorage/OneDrive-TobyElwin/Web Brand/Chaos - Cost of Confusion/Cost of Delay/CoD Software"
   ```
   Press **Enter**

3. **Copy and paste this command**:
   ```bash
   git push -u origin main
   ```
   Press **Enter**

4. **You'll be prompted for:**
   ```
   Username for 'https://github.com':
   ```
   Type: `TobyElwin` and press **Enter**

5. **You'll be prompted for:**
   ```
   Password for 'https://TobyElwin@github.com':
   ```
   **Paste your Personal Access Token** (from Step 1) and press **Enter**
   - Note: You won't see the token as you paste it (this is normal for security)

6. **Wait for the upload to complete.** You should see:
   ```
   Enumerating objects: X, done.
   Counting objects: 100% (X/X), done.
   ...
   To https://github.com/TobyElwin/CoD-Software.git
    * [new branch]      main -> main
   ```

7. **Success!** Your code is now on GitHub.

---

### Option B: Using GitHub Desktop (If you prefer a GUI)

1. **Download GitHub Desktop:**
   - Go to: https://desktop.github.com/
   - Click **"Download for macOS"**
   - Install the app

2. **Open GitHub Desktop** and sign in with your GitHub account

3. **Add your repository:**
   - Click **"Add an Existing Repository"**
   - Click **"Choose..."**
   - Navigate to: `/Users/tobyelwin/Library/CloudStorage/OneDrive-TobyElwin/Web Brand/Chaos - Cost of Confusion/Cost of Delay/CoD Software`
   - Click **"Add Repository"**

4. **Publish to GitHub:**
   - Click the blue **"Publish repository"** button
   - Uncheck **"Keep this code private"** (if you want it public)
   - Click **"Publish Repository"**

5. **Done!** Much easier with the GUI.

---

## 🌐 **STEP 3: Enable GitHub Pages**

Once your code is pushed to GitHub:

1. **Open your browser** and go to:
   ```
   https://github.com/TobyElwin/CoD-Software
   ```

2. **Click the "Settings" tab** (top right of the page, has a gear icon)

3. **In the left sidebar**, scroll down and click **"Pages"**

4. **Under "Build and deployment":**
   - **Source:** Select `Deploy from a branch`
   - **Branch:** Select `main` from the dropdown
   - **Folder:** Select `/ (root)` from the dropdown
   - Click the **"Save"** button

5. **Wait 1-2 minutes** for GitHub to build your site

6. **Refresh the page** and you'll see a green box at the top that says:
   ```
   Your site is live at https://tobyelwin.github.io/CoD-Software/
   ```

7. **Click that URL** to see your live calculator!

---

## ✅ **STEP 4: Verify Your Live Site**

1. **Open the URL:**
   ```
   https://tobyelwin.github.io/CoD-Software/
   ```

2. **Test the calculator:**
   - Enter some sample values
   - Click **Calculate**
   - Verify the results appear correctly
   - Try the Export buttons (JSON, CSV, Excel)
   - Test the comparison feature

3. **Check for errors:**
   - Open browser Developer Tools (F12 or Cmd+Option+I)
   - Look at the **Console** tab
   - Should see no red error messages

4. **If everything works:** 🎉 **Success!** Your calculator is live!

---

## 📤 **STEP 5: Share with Testers**

Send them this URL:
```
https://tobyelwin.github.io/CoD-Software/
```

Plus any instructions from the **TESTER-INSTRUCTIONS.md** file (see below).

---

## 🔄 **Future Updates: How to Update Your Live Site**

When you make changes to your calculator:

1. **Edit your files locally** (in the folder)

2. **Open Terminal** and run:
   ```bash
   cd "/Users/tobyelwin/Library/CloudStorage/OneDrive-TobyElwin/Web Brand/Chaos - Cost of Confusion/Cost of Delay/CoD Software"
   
   git add .
   git commit -m "Description of what you changed"
   git push origin main
   ```

3. **Wait 1-2 minutes** and your changes will be live!

---

## 🆘 **Troubleshooting**

### Problem: "fatal: could not read Username"
**Solution:** Make sure you're using the correct commands from Step 2

### Problem: "Authentication failed"
**Solution:** You're using your GitHub password instead of the Personal Access Token. Go back to Step 1 and get a new token.

### Problem: "remote: Repository not found"
**Solution:** 
- Verify the repository exists at: https://github.com/TobyElwin/CoD-Software
- Make sure you're logged into GitHub as TobyElwin
- Check that the repository name is exactly `CoD-Software` (case-sensitive)

### Problem: "Host key verification failed"
**Solution:** Use the HTTPS method (Option A above) instead of SSH

### Problem: GitHub Pages shows 404
**Solution:**
- Wait 2-3 minutes after enabling Pages
- Make sure you selected `main` branch and `/ (root)` folder
- Check that `cost-of-delay-calculator.html` exists in your repository

### Problem: Calculator doesn't work on live site
**Solution:**
- Check browser console for JavaScript errors
- Make sure all three files are uploaded: `.html`, `.js`, `.css`
- Verify file names match exactly (case-sensitive)

---

## 📞 **Need More Help?**

If you get stuck:

1. Check the repository exists: https://github.com/TobyElwin/CoD-Software
2. Verify you can see the files in the repository
3. Check GitHub Pages settings: https://github.com/TobyElwin/CoD-Software/settings/pages
4. Look for error messages in Terminal and note them down

---

## 📚 **Additional Resources**

- **GitHub Personal Access Tokens:** https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- **GitHub Pages Documentation:** https://docs.github.com/en/pages
- **GitHub Desktop Guide:** https://docs.github.com/en/desktop

---

**Ready to begin? Start with STEP 1 above!**

Good luck! 🚀
