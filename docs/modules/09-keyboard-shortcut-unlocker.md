# Module 9: Keyboard Shortcut Unlocker

**Researcher**: [Mohamed Elsheikh](https://www.linkedin.com/in/mohamedelsheiikh/)  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/

---

## Module Overview

The Keyboard Shortcut Unlocker module injects code into web pages to unlock keyboard shortcuts (Ctrl+C, Ctrl+V, etc.) that Smowl blocks. This is the most complex module as it requires content script injection.

**Code Location**: `scripts/complete_bypass.js` (Lines 623-794)

---

## Purpose

This module enables keyboard shortcuts by:

1. **Injecting into all tabs** - Uses `chrome.scripting.executeScript`
2. **Overriding `preventDefault()`** - Blocks Smowl's event prevention
3. **Overriding `addEventListener()`** - Prevents Smowl from registering keyboard listeners
4. **Monitoring for re-injection** - Uses MutationObserver to prevent Smowl from re-injecting scripts

---

## Technical Implementation

### Function: `injectKeyboardUnlocker()`

**Location**: Lines 623-794

#### Key Components

1. **Context Check** - Verifies `chrome.scripting` is available
2. **Tab Injection** - Injects into all non-chrome:// tabs
3. **Event Override** - Overrides `Event.prototype.preventDefault`
4. **Listener Blocking** - Overrides `EventTarget.prototype.addEventListener`
5. **Continuous Monitoring** - Uses setInterval and MutationObserver

---

## Why It Works

### 1. Content Script Injection

By injecting into the MAIN world (page context), our code runs before Smowl's content scripts, allowing us to intercept their event handlers.

### 2. Event Prevention Override

By overriding `preventDefault()`, we can detect and block Smowl's calls while allowing browser shortcuts to work.

### 3. Listener Registration Blocking

By overriding `addEventListener()`, we prevent Smowl from registering keyboard event listeners in the first place.

---

## Security Analysis

### Attack Vector

**How Smowl Blocks Shortcuts**:
1. Registers keyboard event listeners in content scripts
2. Calls `preventDefault()` on Ctrl+C, Ctrl+V, etc.
3. Sends incident reports for keyboard usage

**How Bypass Defeats Blocking**:
1. **Listeners Blocked**: Smowl cannot register listeners
2. **preventDefault Blocked**: Smowl's calls are intercepted
3. **Incidents Blocked**: Messages never sent (Module 5)

### Impact

- **Keyboard shortcuts work** - Ctrl+C, Ctrl+V, etc. functional
- **No incident reports** - keyboard usage not logged
- **Continuous protection** - monitoring prevents re-registration

---

## Code Examples

### Example: Testing Keyboard Unlocker

```javascript
// After injectKeyboardUnlocker() is called
// Test in page context (requires injection)
// Ctrl+C and Ctrl+V should work normally
// No incident messages should be sent
```

---

## Related Modules

- **[Message Interception](05-message-interception.md)**: Blocks incident messages
- **[Configuration & Storage](01-configuration-storage.md)**: Tracks injection stats
- **[Execution & Verification](12-execution-verification.md)**: Verifies injection success

---

**Author**: Mohamed Elsheikh  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/  
**Last Updated**: 2024

