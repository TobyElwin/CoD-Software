#!/bin/bash
# Quick script to push to GitHub

echo "🚀 Pushing Cost of Delay Calculator to GitHub..."
echo ""
echo "Repository: https://github.com/TobyElwin/CoD-Software"
echo ""

cd "/Users/tobyelwin/Library/CloudStorage/OneDrive-TobyElwin/Web Brand/Chaos - Cost of Confusion/Cost of Delay/CoD Software"

# Push to GitHub
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "Next steps:"
    echo "1. Go to: https://github.com/TobyElwin/CoD-Software/settings/pages"
    echo "2. Enable GitHub Pages (Branch: main, Folder: / root)"
    echo "3. Your site will be live at: https://tobyelwin.github.io/CoD-Software/"
    echo ""
else
    echo ""
    echo "❌ Push failed. You need to authenticate."
    echo ""
    echo "Please run this command manually:"
    echo "git push -u origin main"
    echo ""
    echo "When prompted for password, use a Personal Access Token from:"
    echo "https://github.com/settings/tokens"
    echo ""
fi
