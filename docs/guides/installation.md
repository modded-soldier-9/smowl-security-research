# Installation Guide

**Researcher**: [Mohamed Elsheikh](https://www.linkedin.com/in/mohamedelsheiikh/)  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Browser Requirements](#browser-requirements)
- [Extension Installation](#extension-installation)
- [Repository Setup](#repository-setup)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

- **Operating System**: Windows 10+, macOS 10.14+, or Linux (any modern distribution)
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 100MB free space
- **Internet Connection**: Required for initial setup

### Required Software

1. **Google Chrome** (version 90+) or **Microsoft Edge** (version 90+)
2. **Text Editor** (for viewing script files):
   - VS Code (recommended)
   - Notepad++ (Windows)
   - TextEdit (macOS)
   - Any text editor

### Required Knowledge

- Basic understanding of web browsers
- Ability to use browser DevTools (F12)
- Basic copy-paste operations
- Understanding of console usage (helpful but not required)

---

## Browser Requirements

### Supported Browsers

| Browser | Minimum Version | Recommended Version |
|---------|----------------|---------------------|
| Google Chrome | 90+ | Latest |
| Microsoft Edge | 90+ | Latest |

### Why These Browsers?

- Both use Chromium engine
- Support Chrome Extension APIs
- Have DevTools for script execution
- Compatible with Smowl extension

### Browser Setup

1. **Update Browser**
   - Ensure you have the latest version
   - Check: `chrome://version/` or `edge://version/`

2. **Enable Extensions**
   - Extensions should be enabled by default
   - Check: `chrome://extensions/` or `edge://extensions/`

3. **Enable DevTools**
   - DevTools should be accessible (F12)
   - If blocked by policy, contact system administrator

---

## Extension Installation

### Installing Smowl Extension

The Smowl extension is typically installed by:
- Educational institutions
- Exam platforms
- System administrators

**If extension is not installed**:

1. **Check with Institution**
   - Contact your educational institution
   - Ask IT department for installation instructions
   - May require admin privileges

2. **Manual Installation** (if provided)
   - Download extension file (.crx)
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" or drag .crx file

### Verifying Extension Installation

1. Open `chrome://extensions/` or `edge://extensions/`
2. Look for "Smowl" in the extension list
3. Verify extension is enabled
4. Note the extension ID (for reference)

### Extension Status

**Required Status**:
- ✅ Extension installed
- ✅ Extension enabled
- ✅ Extension active (not disabled)

**If Extension is Disabled**:
- Click "Enable" button
- May require page refresh
- Check for error messages

---

## Repository Setup

### Option 1: Clone Repository (Recommended)

1. **Install Git** (if not already installed)
   - Download from: https://git-scm.com/
   - Follow installation instructions

2. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/smowl-security-research.git
   cd smowl-security-research
   ```

3. **Verify Files**
   - Check that `scripts/` folder exists
   - Verify `docs/` folder exists
   - Confirm README.md is present

### Option 2: Download ZIP

1. **Download Repository**
   - Click "Code" → "Download ZIP"
   - Extract ZIP file to desired location

2. **Navigate to Folder**
   - Open extracted folder
   - Locate `scripts/` folder

### Option 3: Direct File Access

1. **Navigate to Scripts**
   - Go to repository on GitHub
   - Navigate to `scripts/` folder
   - Open script files directly in browser

---

## Verification

### Step 1: Verify Browser

```javascript
// Open browser console (F12)
// Run this to check Chrome APIs
console.log(typeof chrome.system);
console.log(typeof chrome.runtime);
console.log(typeof chrome.tabs);
```

**Expected Output**:
```
object
object
object
```

### Step 2: Verify Extension

1. Go to `chrome://extensions/`
2. Find Smowl extension
3. Click "Inspect views: service worker" or "background page"
4. Console should open

**If console doesn't open**:
- Extension may not be active
- Try refreshing the page
- Check extension permissions

### Step 3: Verify Script Access

1. Open script file: `scripts/complete_bypass.js`
2. Verify file is readable
3. Check file size (should be ~40KB)
4. Confirm no corruption

### Step 4: Test Basic Execution

1. Open extension background console
2. Type: `console.log('Test')`
3. Press Enter
4. Should see "Test" in console

**If this doesn't work**:
- Check DevTools is open
- Verify correct console tab
- Try refreshing extension

---

## Troubleshooting

### Problem: Browser Not Supported

**Symptoms**: Script doesn't work, errors in console

**Solution**:
1. Update browser to latest version
2. Use Chrome or Edge (not Firefox/Safari)
3. Check browser version: `chrome://version/`

### Problem: Extension Not Found

**Symptoms**: Can't find Smowl extension

**Solution**:
1. Check extension is installed
2. Verify extension is enabled
3. May need to install from institution
4. Contact IT support

### Problem: DevTools Blocked

**Symptoms**: Can't open DevTools (F12 doesn't work)

**Solution**:
1. Check system policies
2. Contact system administrator
3. May require policy changes
4. Try alternative: Right-click → Inspect

### Problem: Script File Not Found

**Symptoms**: Can't locate script files

**Solution**:
1. Verify repository was cloned/downloaded correctly
2. Check file paths
3. Ensure scripts/ folder exists
4. Re-download if needed

### Problem: Extension Console Not Accessible

**Symptoms**: Can't open extension background console

**Solution**:
1. Ensure extension is active
2. Try refreshing extension page
3. Check extension permissions
4. May need to reload extension

### Problem: Script Execution Errors

**Symptoms**: Errors when running script

**Solution**:
1. Check console for specific error messages
2. Verify script was copied completely
3. Check for syntax errors
4. Ensure correct context (background script)

---

## Next Steps

After installation is complete:

1. **Read Usage Guide**: [Usage Guide](usage-guide.md)
2. **Review Testing Guide**: [Testing Guide](testing-guide.md)
3. **Understand Architecture**: [Architecture Overview](../architecture-overview.md)
4. **Read Module Docs**: [Module Documentation](../modules/)

---

## Security Notes

⚠️ **Important**:

- This is for **authorized security testing only**
- Do not install on systems without permission
- Respect institutional policies
- Use responsibly and ethically

---

**Related Documentation**:
- [Usage Guide](usage-guide.md) - How to use bypasses
- [Testing Guide](testing-guide.md) - Testing procedures
- [Main README](../../README.md) - Project overview

---

**Author**: Mohamed Elsheikh  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/  
**Last Updated**: 2024

