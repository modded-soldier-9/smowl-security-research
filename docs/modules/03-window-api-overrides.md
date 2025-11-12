# Module 3: Window API Overrides

**Researcher**: [Mohamed Elsheikh](https://www.linkedin.com/in/mohamedelsheiikh/)  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/

---

## Module Overview

The Window API Overrides module prevents Smowl from enforcing fullscreen mode and monitoring window changes. This allows users to exit fullscreen and prevents forced window focus.

**Code Location**: `scripts/complete_bypass.js` (Lines 126-188)

---

## Purpose

This module bypasses window management restrictions by:

1. **Blocking window bounds change listeners** - Prevents monitoring of window position/size changes
2. **Intercepting `windows.update()`** - Blocks fullscreen enforcement and forced focus
3. **Faking listener status** - Hides the bypass from extension monitoring

---

## Technical Implementation

### Function: `patchWindowAPIs()`

**Location**: Lines 130-188

#### Patch 1: Block Window Bounds Change Listeners

**Lines**: 134-158

```javascript
chrome.windows.onBoundsChanged.addListener = function(callback) {
    console.log("🚫 Blocked window bounds change listener");
    return;
};

chrome.windows.onBoundsChanged.removeListener = function(callback) {
    console.log("🚫 Blocked window bounds change listener removal");
    return;
};

chrome.windows.onBoundsChanged.hasListener = function(callback) {
    console.log("🚫 Fake window bounds hasListener response");
    return false;
};
```

**How It Works**: Prevents Smowl from registering listeners that monitor window position and size changes.

#### Patch 2: Intercept `windows.update()`

**Lines**: 162-188

```javascript
chrome.windows.update = function(windowId, updateInfo, callback) {
    // Block fullscreen enforcement
    if (updateInfo && updateInfo.state === 'fullscreen') {
        console.log("🚫 Blocked fullscreen enforcement for window:", windowId);
        bypassStats.fullscreenBlocked++;
        if (typeof callback === 'function') {
            callback();
        }
        return;
    }
    
    // Block forced focus as well
    if (updateInfo && updateInfo.focused === true && updateInfo.state) {
        console.log("🚫 Blocked forced window focus for window:", windowId);
        if (typeof callback === 'function') {
            callback();
        }
        return;
    }
    
    // Allow other window updates
    return originalUpdate.call(this, windowId, updateInfo, callback);
};
```

**How It Works**: Intercepts window update calls and blocks fullscreen enforcement and forced focus attempts.

---

## Why It Works

### 1. Listener Blocking

**Technical Explanation**: By replacing `addListener` with a no-op function, Smowl cannot register window change listeners. The extension thinks it's monitoring windows, but no callbacks are triggered.

**Why This Works**:
- Event listeners registered through method calls
- Extension cannot verify listener was registered
- `hasListener` can be faked to return false

### 2. Function Interception

**Technical Explanation**: `windows.update()` is intercepted to filter out fullscreen and forced focus operations. Other window updates are allowed through to maintain normal browser functionality.

**Why This Works**:
- Function can be replaced before extension calls it
- Extension cannot verify function hasn't been modified
- Callbacks can be called immediately to prevent hanging

---

## Security Analysis

### Attack Vector

**How Smowl Enforces Fullscreen**:
1. Calls `chrome.windows.update(windowId, { state: 'fullscreen' })`
2. Monitors window bounds changes
3. Re-applies fullscreen if user exits

**How Bypass Defeats Enforcement**:
1. **Step 1 Intercepted**: `windows.update()` blocks fullscreen state
2. **Step 2 Blocked**: Window change listeners never registered
3. **Step 3 Prevented**: Cannot re-apply fullscreen

### Impact

- **Users can exit fullscreen** freely (F11 or Esc)
- **No forced window focus** - can switch windows
- **Window monitoring disabled** - extension doesn't track window changes

---

## Code Examples

### Example 1: Testing Fullscreen Bypass

```javascript
// After patchWindowAPIs() is called
// Try to enforce fullscreen (should be blocked)
chrome.windows.update(windowId, { state: 'fullscreen' }, () => {
    console.log('Fullscreen enforcement attempted');
    // Check bypassStats.fullscreenBlocked - should increment
});
```

### Example 2: Verifying Listener Blocking

```javascript
// Try to register listener (should be blocked)
chrome.windows.onBoundsChanged.addListener(() => {
    console.log('This never runs');
});

// Check if listener exists
const hasListener = chrome.windows.onBoundsChanged.hasListener(() => {});
console.log(hasListener);  // Always false
```

---

## Related Modules

- **[Configuration & Storage](01-configuration-storage.md)**: Stores original functions
- **[Display API Overrides](02-display-api-overrides.md)**: Similar listener blocking technique
- **[Tab API Overrides](04-tab-api-overrides.md)**: Similar API interception pattern

---

## Testing

### Manual Testing

1. **Run the bypass script**
2. **Enter fullscreen mode** (F11)
3. **Try to exit fullscreen** (F11 or Esc)
4. **Verify** you can exit freely

### Automated Testing

```javascript
// Test fullscreen blocking
chrome.windows.update(windowId, { state: 'fullscreen' }, () => {
    const blocked = bypassStats.fullscreenBlocked > 0;
    console.log('Fullscreen blocking test:', blocked ? '✅' : '❌');
});
```

---

**Related Documentation**:
- [Usage Guide](../guides/usage-guide.md) - How to use bypasses
- [Testing Guide](../guides/testing-guide.md) - Testing procedures

---

**Author**: Mohamed Elsheikh  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/  
**Last Updated**: 2024

