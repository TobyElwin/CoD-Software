# GitHub Personal Access Token - Complete Guide
**Everything you need to know about getting and using your GitHub token**

---

## 🔐 **What is a Personal Access Token (PAT)?**

A Personal Access Token is like a special password that:
- Grants access to your GitHub repositories from the command line
- Is more secure than using your GitHub password
- Can be revoked or regenerated anytime
- Can have limited permissions and expiration dates

**Think of it as:** A temporary key that you create specifically for pushing code.

---

## 📋 **Step-by-Step: Create Your Token**

### **Step 1: Go to GitHub Token Settings**

1. **Open your web browser**
2. **Log into GitHub** if you're not already
3. **Click this link:**
   ```
   https://github.com/settings/tokens
   ```
   
   Or navigate manually:
   - Click your profile picture (top right)
   - Click **Settings**
   - Scroll down the left sidebar
   - Click **Developer settings**
   - Click **Personal access tokens**
   - Click **Tokens (classic)**

---

### **Step 2: Generate New Token**

1. **Click the green button:** `Generate new token` 
2. **Select:** `Generate new token (classic)`
3. You may be asked to **confirm your password** - enter your GitHub password

---

### **Step 3: Configure Your Token**

You'll see a form with several fields:

#### **Note (Required)**
Give your token a memorable name so you know what it's for:
```
CoD Software Deployment
```
Or:
```
Mac Terminal Access
```

#### **Expiration (Required)**
Choose how long the token will be valid:
- `7 days` - Good for short-term projects
- `30 days` - Good for monthly work
- `60 days` - Recommended for active projects
- `90 days` - Good balance of security and convenience
- `No expiration` - **Not recommended** (security risk)

**Recommendation:** Choose `90 days` or `60 days`

#### **Select Scopes (Required)**
This controls what the token can do. For pushing code, you need:

✅ **Check the box next to `repo`**
   - This will automatically check all sub-boxes:
     - `repo:status`
     - `repo_deployment`
     - `public_repo`
     - `repo:invite`
     - `security_events`

**Don't check anything else** unless you know you need it.

---

### **Step 4: Generate and Copy Token**

1. **Scroll to the bottom** of the page
2. **Click the green button:** `Generate token`
3. **You'll see your new token** - it looks like:
   ```
   ghp_1234567890abcdefghijklmnopqrstuvwxyz1234
   ```

4. **CRITICAL:** Copy this token immediately!
   - Click the **📋 copy icon** next to the token
   - Or **select all the text** and copy it (Cmd+C)

5. **⚠️ IMPORTANT:** You will only see this token ONCE!
   - If you navigate away, you can't see it again
   - If you lose it, you'll need to generate a new one

---

### **Step 5: Save Your Token Securely**

**Option 1: Password Manager (Recommended)**
Save it in:
- 1Password
- LastPass
- Bitwarden
- Apple Keychain
- Any password manager you use

**Option 2: Secure Note**
- Create a note in Notes app
- Title it: "GitHub Personal Access Token"
- Paste the token
- Lock the note if possible

**Option 3: Text File (Temporary)**
- Create a file called `github-token.txt`
- Paste the token
- Save it somewhere safe
- **Delete it after you're done using it**

**❌ DO NOT:**
- Email the token to yourself
- Post it in Slack/Teams/Discord
- Commit it to a git repository
- Share it with anyone
- Save it in a public place

---

## 💻 **How to Use Your Token**

### **When Pushing to GitHub**

When you run:
```bash
git push -u origin main
```

You'll be prompted:
```
Username for 'https://github.com':
```
**Type:** `TobyElwin` and press Enter

```
Password for 'https://TobyElwin@github.com':
```
**Paste your token** and press Enter

**Note:** The token won't be visible when you paste (this is normal for security)

---

### **Store Token in Git (Optional - For Convenience)**

If you don't want to enter the token every time, you can store it:

```bash
git config --global credential.helper store
```

Then next time you push and enter your token, Git will remember it.

**⚠️ Security Note:** The token will be stored in plain text on your computer. Only do this on your personal, secure machine.

---

## 🔄 **Managing Your Tokens**

### **View Your Tokens**

Go to: https://github.com/settings/tokens

You'll see a list of all your tokens with:
- Token name
- Scopes (permissions)
- Last used date
- Expiration date

### **Regenerate a Token**

If you lost your token or it expired:
1. Go to: https://github.com/settings/tokens
2. Find your token in the list
3. Click **Regenerate token**
4. Copy the new token

### **Delete a Token**

If you no longer need a token:
1. Go to: https://github.com/settings/tokens
2. Find the token
3. Click **Delete**
4. Confirm deletion

**When to delete:**
- When you're done with a project
- If the token is compromised
- If you created a duplicate by mistake

---

## 🆘 **Troubleshooting**

### **Problem: "Authentication failed"**

**Possible causes:**
- You're using your GitHub password instead of the token
- The token was miscopied (extra spaces, missing characters)
- The token expired
- The token was deleted

**Solutions:**
1. Make sure you're pasting the FULL token (starts with `ghp_`)
2. Check if token is still active at: https://github.com/settings/tokens
3. Generate a new token if needed

---

### **Problem: "Token doesn't have required scopes"**

**Solution:**
- Your token needs `repo` scope
- Generate a new token with the correct scope
- Or edit the existing token and add `repo` scope

---

### **Problem: "Token expired"**

**Solution:**
1. Go to: https://github.com/settings/tokens
2. Click **Regenerate token** next to the expired one
3. Copy the new token
4. Use it immediately

---

### **Problem: "I lost my token"**

**Solution:**
You can't view an existing token again, but you can:
1. Go to: https://github.com/settings/tokens
2. Click **Regenerate token** to get a new one
3. Copy and save the new token

---

## 📚 **Quick Reference**

| Action | URL |
|--------|-----|
| Create Token | https://github.com/settings/tokens |
| View Tokens | https://github.com/settings/tokens |
| Token Documentation | https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token |

**Token Format:** `ghp_` followed by 40 characters

**Required Scope:** `repo` (for pushing code)

**Recommended Expiration:** 60-90 days

---

## ✅ **Checklist**

Before you try to push to GitHub, make sure:

- [ ] You've created a Personal Access Token
- [ ] The token has `repo` scope checked
- [ ] You've copied the token
- [ ] You've saved the token securely
- [ ] You know your GitHub username (`TobyElwin`)
- [ ] You're ready to paste the token when prompted for password

---

## 🎯 **Quick Start Summary**

1. Go to: https://github.com/settings/tokens
2. Click: `Generate new token` → `Generate new token (classic)`
3. Name it: `CoD Software`
4. Expiration: `90 days`
5. Check: `repo` scope
6. Click: `Generate token`
7. Copy the token immediately
8. Save it securely
9. Use it when pushing to GitHub (as your password)

---

**Need help?** See the troubleshooting section above or start over with a fresh token.

**Ready?** Head back to `STEP-BY-STEP-GITHUB-SETUP.md` to continue with pushing your code!
