# Usage Guide

**Researcher**: [Mohamed Elsheikh](https://www.linkedin.com/in/mohamedelsheiikh/)  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Complete Bypass Usage](#complete-bypass-usage)
- [Multi-Screen Bypass Usage](#multi-screen-bypass-usage)
- [Context Requirements](#context-requirements)
- [Expected Output](#expected-output)
- [Troubleshooting](#troubleshooting)
- [Advanced Usage](#advanced-usage)

---

## Prerequisites

Before using the bypass scripts, ensure you have:

1. **Google Chrome** or **Microsoft Edge** browser (latest version)
2. **Smowl proctoring extension** installed and active
3. **Access to Chrome DevTools** (not blocked by system policies)
4. **Basic understanding** of browser console usage

### System Requirements

- Windows, macOS, or Linux
- Chrome/Edge browser with extension support
- Ability to open DevTools (F12 or right-click → Inspect)

---

## Quick Start

### Step 1: Open Extension DevTools

1. Open Chrome/Edge browser
2. Navigate to `chrome://extensions/` (or `edge://extensions/`)
3. Find the **Smowl** extension in the list
4. Click **"Inspect views: service worker"** or **"background page"** link
5. A DevTools window will open - click the **Console** tab

### Step 2: Choose Your Bypass

**Option A: Complete Bypass** (All features disabled)
- Use `scripts/complete_bypass.js`
- Disables ALL security monitoring

**Option B: Multi-Screen Bypass Only**
- Use `scripts/bypass_twoscreen.js`
- Only bypasses multi-screen detection

### Step 3: Execute the Script

1. Open the script file in a text editor
2. **Select All** (Ctrl+A / Cmd+A) and **Copy** (Ctrl+C / Cmd+C)
3. Paste into the DevTools Console
4. Press **Enter** to execute

### Step 4: Verify Bypass is Active

Look for success messages in the console:
```
✅ getInfo patched successfully
✅ Display change listeners patched successfully
...
🎯 ALL SECURITY MONITORING DISABLED!
```

---

## Complete Bypass Usage

### When to Use

Use the complete bypass when you need to disable **all** security monitoring:
- Multi-screen detection
- Fullscreen enforcement
- Tab management
- Keyboard shortcuts
- Screen capture
- Network monitoring
- Storage tracking

### Step-by-Step Instructions

1. **Open Extension Background Console**
   ```
   chrome://extensions/ → Smowl → Inspect views: service worker → Console
   ```

2. **Copy Script Content**
   - Open `scripts/complete_bypass.js`
   - Copy entire file content

3. **Paste and Execute**
   - Paste into console
   - Press Enter
   - Wait for execution to complete (~2-3 seconds)

4. **Verify Execution**
   ```javascript
   // Check statistics
   console.log(bypassStats);
   
   // Run built-in tests
   testAllBypasses();
   ```

5. **Verify Persistence** (Optional)
   ```javascript
   // Check bypasses remain active
   verifyAllBypassesActive();
   ```

### Expected Console Output

```
🔧 Starting Complete Smowl Extension Bypass...
⚠️  WARNING: This script disables ALL security monitoring!
📍 Context check: ✅ Background script context
📺 Patching display detection APIs...
📝 Stored original function: getInfo
🎯 getInfo intercepted - returning fake single display
✅ getInfo patched successfully
📺 Patching display change listeners...
✅ Display change listeners patched successfully
🪟 Patching window management APIs...
✅ Window bounds change listeners patched successfully
✅ Window update API patched successfully
📑 Patching tab management APIs...
✅ Tab creation listeners patched successfully
✅ Tab update listeners patched successfully
✅ Tab removal API patched successfully
📨 Patching messaging system...
✅ sendMessage patched successfully
✅ tabs.sendMessage patched successfully
✅ runtime.onMessage.addListener patched successfully
🌐 Patching network requests...
✅ fetch patched successfully
✅ XMLHttpRequest patched successfully
💾 Patching storage operations...
✅ chrome.storage patched successfully
📹 Patching screen capture APIs...
✅ getDisplayMedia patched successfully
✅ getUserMedia patched successfully
💉 Injecting keyboard shortcut unlocker into all tabs...
✅ Keyboard unlocker injected into X tabs (Y skipped)
🧪 Testing all bypasses...
📊 BYPASS TEST SUMMARY: 6/6 tests passed
🎉 ALL BYPASSES WORKING CORRECTLY!

📊 BYPASS STATISTICS:
⏱️  Runtime: 2345ms
🔧 APIs Patched: 25
📨 Messages Blocked: 0
🌐 Network Requests Blocked: 0
🚫 Tab Closures Blocked: 0
🚫 Fullscreen Enforcements Blocked: 0

🎯 ALL SECURITY MONITORING DISABLED!
🔓 Keyboard shortcuts (Ctrl+C, Ctrl+V, etc.) unlocked in all tabs!
🚫 Smowl incident reporting blocked for keyboard usage!
🔄 Continuous monitoring active to prevent re-registration!
💡 To restore original functionality, run: restoreAllFunctions()
🔍 To verify bypasses remain active, run: verifyAllBypassesActive()
```

---

## Multi-Screen Bypass Usage

### When to Use

Use the multi-screen bypass when you only need to bypass multi-screen detection:
- Simpler and faster
- Less invasive
- Only affects display detection

### Step-by-Step Instructions

1. **Open Extension Background Console**
   ```
   chrome://extensions/ → Smowl → Inspect views: service worker → Console
   ```

2. **Copy Script Content**
   - Open `scripts/bypass_twoscreen.js`
   - Copy entire file content

3. **Paste and Execute**
   - Paste into console
   - Press Enter

4. **Verify Execution**
   ```javascript
   // Test display count
   chrome.system.display.getInfo((displays) => {
       console.log("Display count:", displays.length);  // Should be 1
   });
   ```

### Expected Console Output

```
🔧 Starting Service Worker Patch for Multi-Screen Bypass...
📺 Patching chrome.system.display.getInfo...
📝 Stored original function: getInfo
🎯 getInfo intercepted by patch - returning fake single display
✅ getInfo patched successfully
📺 Patching display change listeners...
✅ Display change listeners patched successfully
📨 Patching chrome.runtime.sendMessage...
✅ sendMessage patched successfully
🌐 Patching fetch requests...
✅ fetch patched successfully
🧪 Testing patches...
📊 Display count after patch: 1
✅ Multi-screen bypass successful!
📊 Expulsion test result: undefined
📊 Display change listener active: false
✅ Service Worker Patch Complete!
📝 Patched functions: getInfo,addListener,removeListener,hasListener,sendMessage,fetch
💡 To restore original functionality, run: restorePatches()
```

---

## Context Requirements

### Background Script vs Service Worker

**Important**: The complete bypass **requires** background script context, not service worker.

#### How to Check Context

After pasting the script, check the console output:
```
📍 Context check: ✅ Background script context  ← Good!
📍 Context check: ❌ Service worker context    ← Wrong context!
```

#### If You See "Service Worker Context"

**Problem**: `chrome.scripting` API is not available in service worker context.

**Solution**:
1. The script will still work for most bypasses
2. Keyboard shortcut unlocker will be skipped
3. For full functionality, ensure you're in background script context

#### Finding Background Script

1. Go to `chrome://extensions/`
2. Find Smowl extension
3. Look for **"background page"** link (not "service worker")
4. Click it to open background script console

---

## Expected Output

### Success Indicators

✅ **All patches applied successfully**
- Console shows "✅" for each module
- No error messages
- Statistics show APIs patched > 0

✅ **Tests pass**
- `testAllBypasses()` shows all tests passed
- No failed tests in output

✅ **Bypass active**
- `verifyAllBypassesActive()` shows all bypasses active
- Statistics increment when actions occur

### Failure Indicators

❌ **Errors in console**
- JavaScript syntax errors
- "Cannot read property" errors
- "chrome.scripting not available" (expected in service worker)

❌ **Tests fail**
- `testAllBypasses()` shows failed tests
- Bypass statistics remain at 0

❌ **Bypass not persistent**
- `verifyAllBypassesActive()` shows inactive bypasses
- Extension reloads and bypass is lost

---

## Troubleshooting

### Problem: "chrome.scripting not available"

**Cause**: Running in service worker context instead of background script

**Solution**:
1. Find "background page" link (not "service worker")
2. Open that console instead
3. Re-run the script

### Problem: Script doesn't execute

**Cause**: Syntax error or copy-paste issue

**Solution**:
1. Check console for error messages
2. Ensure entire script was copied
3. Try copying in smaller sections
4. Check for hidden characters

### Problem: Bypass doesn't work

**Cause**: Extension reloaded or script not executed properly

**Solution**:
1. Re-run the bypass script
2. Verify execution with `testAllBypasses()`
3. Check that patches were applied (look for "✅" messages)
4. Ensure extension didn't reload

### Problem: Keyboard shortcuts still blocked

**Cause**: Keyboard unlocker not injected (service worker context)

**Solution**:
1. Ensure you're in background script context
2. Re-run the complete bypass script
3. Check console for "Keyboard unlocker injected" message
4. Refresh the exam page after injection

### Problem: Extension reloads and bypass is lost

**Cause**: Extension auto-reloads or browser restarted

**Solution**:
1. Re-run the bypass script
2. Consider running it automatically (advanced usage)
3. Monitor extension for reloads

---

## Advanced Usage

### Automatic Re-execution

To automatically re-run bypass if extension reloads:

```javascript
// Store bypass function
const bypassCode = `/* paste complete_bypass.js here */`;

// Monitor for extension reload
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === 'smowl-extension') {
        // Extension reloaded, re-run bypass
        eval(bypassCode);
    }
});
```

### Selective Module Execution

Run only specific bypass modules:

```javascript
// Run only display bypass
patchDisplayAPIs();

// Run only keyboard unlocker
injectKeyboardUnlocker();
```

### Custom Configuration

Modify bypass behavior:

```javascript
// Change fake display properties
const fakeDisplay = [{
    id: "custom-display",
    name: "Custom Display Name",
    // ... modify other properties
}];
```

### Statistics Monitoring

Monitor bypass effectiveness:

```javascript
// Check statistics periodically
setInterval(() => {
    console.log('Messages blocked:', bypassStats.messagesBlocked);
    console.log('Network requests blocked:', bypassStats.networkRequestsBlocked);
}, 5000);
```

---

## Restoration

### Restore Original Functionality

To restore all original Chrome APIs:

```javascript
// Complete bypass
restoreAllFunctions();

// Multi-screen bypass only
restorePatches();
```

### Verify Restoration

```javascript
// Test that original functions are restored
chrome.system.display.getInfo((displays) => {
    console.log('Real display count:', displays.length);
});
```

---

## Best Practices

1. **Test First**: Always test bypass in a safe environment
2. **Verify Execution**: Check console for success messages
3. **Monitor Statistics**: Use `bypassStats` to verify activity
4. **Restore When Done**: Use restoration functions when finished
5. **Document Changes**: Note any custom modifications

---

## Security Notes

⚠️ **Important Reminders**:

- This is for **authorized security testing only**
- Do not use to cheat on exams
- Respect academic integrity policies
- Use responsibly and ethically

---

**Related Documentation**:
- [Testing Guide](testing-guide.md) - How to test bypasses
- [Installation Guide](installation.md) - Setup instructions
- [Module Documentation](../modules/) - Technical details

---

**Author**: Mohamed Elsheikh  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/  
**Last Updated**: 2024

