# Module 5: Message Interception

**Researcher**: [Mohamed Elsheikh](https://www.linkedin.com/in/mohamedelsheiikh/)  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/

---

## Module Overview

The Message Interception module blocks security-related messages between the extension's service worker and content scripts. This prevents expulsion notifications and security alerts from reaching the user.

**Code Location**: `scripts/complete_bypass.js` (Lines 271-405)

---

## Purpose

This module neutralizes message-based security mechanisms by:

1. **Intercepting `sendMessage()`** - Blocks security messages from service worker
2. **Intercepting `tabs.sendMessage()`** - Blocks messages to content scripts
3. **Wrapping `onMessage.addListener()`** - Intercepts incoming messages and modifies responses

---

## Technical Implementation

### Function: `patchMessaging()`

**Location**: Lines 271-405

#### Patch 1: Intercept `chrome.runtime.sendMessage`

**Lines**: 274-321

Blocks messages with IDs like:
- `EXPEL_USER` - User expulsion
- `ADD_INCIDENT` - Incident reporting
- `CS_EXPEL` - Content script expulsion
- `SHOW_ALERT` - Security alerts
- And many more...

#### Patch 2: Intercept `chrome.tabs.sendMessage`

**Lines**: 324-360

Blocks `CS_START_LOCK` and other security messages sent to tabs.

#### Patch 3: Wrap `chrome.runtime.onMessage.addListener`

**Lines**: 363-404

Intercepts incoming messages and returns false for `IS_LOCKED` queries to prevent lock activation.

---

## Why It Works

### 1. Message Filtering

By intercepting message sending functions, we can filter out security-related messages before they're delivered. The extension thinks messages are sent, but they never reach their destination.

### 2. Response Manipulation

By wrapping message listeners, we can modify responses. For example, always returning `false` for `IS_LOCKED` queries prevents the lock mechanism from activating.

---

## Security Analysis

### Attack Vector

**How Smowl Uses Messages**:
1. Service worker sends `CS_EXPEL` to content scripts
2. Content scripts display expulsion UI
3. Messages trigger security alerts

**How Bypass Defeats Messages**:
1. **Messages Intercepted**: Filtered before delivery
2. **UI Never Shown**: Content scripts never receive messages
3. **Alerts Blocked**: Security alerts never displayed

### Impact

- **No expulsion notifications** - user never sees expulsion UI
- **No security alerts** - alerts are blocked
- **Lock mechanism disabled** - `IS_LOCKED` always returns false

---

## Code Examples

### Example: Testing Message Blocking

```javascript
// After patchMessaging() is called
// Try to send security message (should be blocked)
chrome.runtime.sendMessage({ id: 'EXPEL_USER', type: 3 }, (response) => {
    console.log('Response:', response);  // Should be undefined
    // Check bypassStats.messagesBlocked - should increment
});
```

---

## Related Modules

- **[Configuration & Storage](01-configuration-storage.md)**: Stores original functions
- **[Network Blocking](06-network-blocking.md)**: Blocks network-based security
- **[Keyboard Shortcut Unlocker](09-keyboard-shortcut-unlocker.md)**: Works with message blocking

---

**Author**: Mohamed Elsheikh  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/  
**Last Updated**: 2024

