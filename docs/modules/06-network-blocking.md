# Module 6: Network Blocking

**Researcher**: [Mohamed Elsheikh](https://www.linkedin.com/in/mohamedelsheiikh/)  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/

---

## Module Overview

The Network Blocking module intercepts and blocks network requests to Smowl's security endpoints. This prevents incident data, screen captures, and other security information from reaching the server.

**Code Location**: `scripts/complete_bypass.js` (Lines 411-495)

---

## Purpose

This module prevents server-side logging by:

1. **Intercepting `fetch()` API** - Blocks security endpoint requests
2. **Intercepting `XMLHttpRequest`** - Blocks XHR-based requests
3. **Returning fake success responses** - Extension thinks requests succeeded

---

## Technical Implementation

### Function: `patchNetworkRequests()`

**Location**: Lines 411-495

#### Patch 1: Override `fetch()`

**Lines**: 415-450

Blocks endpoints like:
- `saveExpel.php` - User expulsion
- `saveCapture.php` - Screen capture
- `saveDisplay.php` - Display information
- And many more...

#### Patch 2: Override `XMLHttpRequest`

**Lines**: 453-494

Intercepts XHR requests and blocks the same security endpoints.

---

## Why It Works

### 1. API Interception

By replacing `fetch` and `XMLHttpRequest`, we intercept all network requests. Security-related requests are blocked, while normal requests pass through.

### 2. Fake Responses

Blocked requests return fake 200 OK responses immediately. The extension thinks the request succeeded, but no data reaches the server.

---

## Security Analysis

### Attack Vector

**How Smowl Logs to Server**:
1. Makes POST requests to security endpoints
2. Sends incident data, captures, display info
3. Server receives and processes data

**How Bypass Defeats Logging**:
1. **Requests Intercepted**: Filtered before network
2. **Fake Responses**: Extension thinks request succeeded
3. **No Server Data**: Server never receives security information

### Impact

- **No server-side logging** - incidents never recorded
- **No screen capture uploads** - captures never sent
- **No display information** - server has no visibility

---

## Code Examples

### Example: Testing Network Blocking

```javascript
// After patchNetworkRequests() is called
// Try to send security request (should be blocked)
fetch('https://example.com/saveExpel.php', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        console.log('Response:', data);
        // Should show: { success: true, message: "Request blocked by bypass" }
        // Check bypassStats.networkRequestsBlocked - should increment
    });
```

---

## Related Modules

- **[Configuration & Storage](01-configuration-storage.md)**: Stores original functions
- **[Message Interception](05-message-interception.md)**: Blocks client-side messages
- **[Storage Manipulation](07-storage-manipulation.md)**: Blocks local storage

---

**Author**: Mohamed Elsheikh  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/  
**Last Updated**: 2024

