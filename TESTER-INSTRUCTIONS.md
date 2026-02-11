# Cost of Delay Calculator - Tester Instructions
**Help us test and provide feedback on this tool!**

---

## 🌐 **Access the Calculator**

Open this URL in your web browser:
```
https://tobyelwin.github.io/CoD-Software/
```

**Supported Browsers:**
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

---

## 🧪 **What to Test**

### **1. Basic Cost of Delay Calculation**

**Test Scenario 1: Standard Project**
1. Enter these values:
   - **Weekly Value:** `100000`
   - **Development Weeks:** `10`
   - **Delay Weeks:** `4`
   - **Urgency Profile:** Select `Standard (Linear)`
2. Click **Calculate**
3. **Expected Results:**
   - Total Cost of Delay: **$400,000**
   - CD3 (Cost/Duration): **$40,000**

**Questions for Feedback:**
- [ ] Did the calculation complete without errors?
- [ ] Are the results clear and easy to understand?
- [ ] Do the numbers make sense to you?

---

### **2. Different Urgency Profiles**

Try each urgency profile and note how the results change:

**Test Scenario 2: Expedite Profile**
- Use same values as above
- Change **Urgency Profile** to `Expedite (Decreasing Value)`
- Click **Calculate**
- Note: Results should be LOWER than Standard

**Test Scenario 3: Fixed Date Profile**
- Change **Urgency Profile** to `Fixed Date (Deadline Driven)`
- Click **Calculate**
- Note: Results should be HIGHER than Standard

**Test Scenario 4: Intangible Profile**
- Change **Urgency Profile** to `Intangible (Growing Value)`
- Click **Calculate**
- Note: Results should be HIGHER than Standard

**Questions for Feedback:**
- [ ] Do the different profiles make sense for your use cases?
- [ ] Are the profile descriptions clear?
- [ ] Would you use these different profiles in real scenarios?

---

### **3. Employee Cost Calculations**

**Test Scenario 5: Team Costs**
1. Scroll down to **Employee Costs** section
2. Enter these values:
   - **Salary Type:** Select `Annual Salary`
   - **Annual Salary:** `120000`
   - **Team Size:** `5`
   - **Benefits Multiplier:** `1.5`
   - **Development Weeks:** `10`
   - **Delay Weeks:** `4`
3. Review the results

**Questions for Feedback:**
- [ ] Are the employee cost calculations useful?
- [ ] Do the numbers seem accurate for your organization?
- [ ] Is the Benefits Multiplier concept clear?

---

### **4. Export Functions**

**Test Scenario 6: Data Export**
1. After running a calculation, try each export button:
   - Click **Export JSON** → Should download a `.json` file
   - Click **Export CSV** → Should download a `.csv` file
   - Click **Export Excel** → Should download a `.xls` file

2. Open each file and verify:
   - Data is readable
   - All values are present
   - Format is usable

**Questions for Feedback:**
- [ ] Did all exports work?
- [ ] Which export format is most useful to you?
- [ ] Is there any data missing that you'd want included?

---

### **5. Project Comparison**

**Test Scenario 7: Compare Multiple Projects**
1. Calculate a project (Project A)
2. Click **Add to Comparison**
3. Change the values (make Project B)
4. Click **Calculate** again
5. Click **Add to Comparison** again
6. Review the comparison table and chart

**Questions for Feedback:**
- [ ] Is the comparison feature useful?
- [ ] Is the chart easy to read?
- [ ] Would you want to compare more than 2 projects?

---

### **6. Edge Cases & Error Handling**

**Test Scenario 8: Invalid Inputs**
Try entering unusual values and see what happens:
- Zero values: `0`
- Negative numbers: `-100`
- Very large numbers: `999999999`
- Decimal numbers: `100.5`
- Letters instead of numbers: `abc`

**Questions for Feedback:**
- [ ] Does the calculator handle errors gracefully?
- [ ] Are error messages clear and helpful?
- [ ] Did anything crash or freeze?

---

### **7. User Interface & Experience**

**Test Scenario 9: General Usability**
1. Navigate through all sections of the calculator
2. Try different screen sizes (if possible)
3. Test on mobile device (if available)

**Questions for Feedback:**
- [ ] Is the interface intuitive?
- [ ] Are labels and instructions clear?
- [ ] Is anything confusing or hard to find?
- [ ] Does it work on mobile devices?
- [ ] Are there any visual bugs or display issues?

---

## 📝 **Feedback Form**

Please provide feedback on:

### **Overall Experience**
- **Ease of Use:** (1-5 stars) ⭐⭐⭐⭐⭐
- **Usefulness:** (1-5 stars) ⭐⭐⭐⭐⭐
- **Design/Layout:** (1-5 stars) ⭐⭐⭐⭐⭐

### **Specific Feedback**

**What works well?**
- 

**What doesn't work or needs improvement?**
- 

**Features you'd like to see added?**
- 

**Bugs or errors encountered?**
- 

**Any other comments?**
- 

---

## 🐛 **How to Report Bugs**

If you find a bug, please provide:

1. **What you were doing** (step-by-step)
2. **What you expected to happen**
3. **What actually happened**
4. **Browser and version** (e.g., Chrome 121, Safari 17)
5. **Screenshot** (if possible)

**Send feedback to:** [Your email or preferred contact method]

---

## 💡 **Tips for Testers**

- **Use realistic values** from your actual projects when possible
- **Try to "break" the calculator** by testing edge cases
- **Compare results** to manual calculations or existing tools
- **Test on different devices** (desktop, tablet, mobile)
- **Open browser console** (F12 or Cmd+Option+I) to check for errors

---

## ⏱️ **Estimated Testing Time**

- **Quick test:** 10-15 minutes (scenarios 1-3)
- **Comprehensive test:** 30-45 minutes (all scenarios)
- **Deep dive:** 1+ hour (all scenarios + creative testing)

---

## 📊 **What Happens with Your Feedback?**

Your feedback will help us:
- ✅ Fix bugs and errors
- ✅ Improve usability and clarity
- ✅ Add requested features
- ✅ Optimize performance
- ✅ Enhance documentation

---

## 🙏 **Thank You!**

We appreciate you taking the time to test the Cost of Delay Calculator. Your feedback is invaluable in making this tool better for everyone!

**Questions?** Contact: [Your contact info]

---

**Version:** 1.0  
**Last Updated:** February 10, 2026  
**Testing URL:** https://tobyelwin.github.io/CoD-Software/
