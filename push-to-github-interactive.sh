#!/bin/bash

# Clear screen for better visibility
clear

echo "═══════════════════════════════════════════════════════════════"
echo "🚀 PUSH COST OF DELAY CALCULATOR TO GITHUB"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Repository: https://github.com/TobyElwin/CoD-Software"
echo ""
echo "You will be prompted for:"
echo "  Username: TobyElwin"
echo "  Password: [Your Personal Access Token]"
echo ""
echo "🔑 Don't have a token? Get it here:"
echo "   https://github.com/settings/tokens"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Press ENTER to continue..."
read

# Change to the correct directory
cd "/Users/tobyelwin/Library/CloudStorage/OneDrive-TobyElwin/Web Brand/Chaos - Cost of Confusion/Cost of Delay/CoD Software"

# Push to GitHub
echo "Pushing to GitHub..."
echo ""
git push -u origin main

# Check if successful
if [ $? -eq 0 ]; then
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "✅ SUCCESS! Code pushed to GitHub!"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "🎯 Next Steps:"
    echo ""
    echo "1. Enable GitHub Pages:"
    echo "   👉 https://github.com/TobyElwin/CoD-Software/settings/pages"
    echo ""
    echo "2. Configure Pages:"
    echo "   - Source: Deploy from a branch"
    echo "   - Branch: main"
    echo "   - Folder: / (root)"
    echo "   - Click Save"
    echo ""
    echo "3. Wait 1-2 minutes, then visit:"
    echo "   👉 https://tobyelwin.github.io/CoD-Software/"
    echo ""
    echo "4. Share with testers using TESTER-INSTRUCTIONS.md"
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
else
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "❌ Push failed"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "Common issues:"
    echo "1. Using GitHub password instead of Personal Access Token"
    echo "2. Token expired or incorrect"
    echo "3. Username misspelled"
    echo ""
    echo "📖 See TROUBLESHOOTING-GUIDE.md for help"
    echo ""
fi

echo ""
echo "Press ENTER to close this window..."
read
