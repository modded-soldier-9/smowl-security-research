# Multi-Screen Detection Bypass: Technical Analysis

**Researcher**: [Mohamed Elsheikh](https://www.linkedin.com/in/mohamedelsheiikh/)  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/

---

## Executive Summary

This document provides a comprehensive security researcher's analysis of the `bypass_twoscreen.js` proof-of-concept script. The script demonstrates a **critical vulnerability** in the Smowl proctoring extension's multi-screen detection mechanism, allowing users to completely bypass the restriction against using multiple monitors during proctored exams.

**Severity**: Critical (CVSS 8.7)  
**Impact**: Complete bypass of multi-screen monitoring, enabling academic dishonesty  
**Root Cause**: Client-side-only security model with no integrity checks

---

## Table of Contents

1. [Extension's Detection Mechanism](#extensions-detection-mechanism)
2. [Bypass Script Breakdown](#bypass-script-breakdown)
3. [Why Each Bypass Works](#why-each-bypass-works)
4. [Fundamental Security Flaws](#fundamental-security-flaws)
5. [Detection Flow Analysis](#detection-flow-analysis)
6. [Limitations and Countermeasures](#limitations-and-countermeasures)
7. [Conclusion](#conclusion)

---

## Extension's Detection Mechanism

The Smowl extension implements a multi-layered approach to detect multiple displays, but all layers operate entirely client-side and can be manipulated.

### 1. Primary Detection: Display Count Check

**Location**: Service Worker (`serviceworker.txt`, lines 794-801)

```javascript
async function To() {
    var o, n;
    // Check if multi-screen expulsion is enabled in configuration
    if (!((n = (o = r.cornerInfo.flags) == null ? void 0 : o.lockConfig.expelDisplays) == null ? void 0 : n.enabled))
        return;
    
    // Get display information from Chrome API
    let t = await chrome.system.display.getInfo();
    i("info", ["Displays", t.length]),
    
    // If more than 1 display detected, expel user with type 3
    t.length > 1 && h(3)
}
```

**How it works**:
- Calls `chrome.system.display.getInfo()` to retrieve all connected displays
- Checks if `displays.length > 1`
- If true, calls expulsion function `h(3)` where `3` represents multi-screen violation

**Vulnerability**: The entire detection relies on a single API call that can be intercepted and manipulated.

### 2. Display Change Monitoring

**Location**: Service Worker (`serviceworker.txt`, lines 804-818)

```javascript
async function Co() {
    let e = await chrome.system.display.getInfo()
      , t = Eo(e);  // Generate display fingerprint
    
    // If display configuration changed, update and save
    Ee !== t && (Ee = t,
    i("info", ["Displays changed", Ee, t]),
    tt()),  // Save display info to server
    J()     // Check for multiple monitors
}

function Eo(e) {
    let t = [];
    for (let o of e)
        // Create fingerprint: id_enabled_internal_unified_name
        t.push(o.id + "_" + o.isEnabled + "_" + o.isInternal + "_" + o.isUnified + "_" + o.name);
    return JSON.stringify(t)
}
```

**How it works**:
- Periodically checks display configuration
- Creates a "fingerprint" by concatenating display properties
- Compares current fingerprint with previous (`Ee`)
- If changed, saves new configuration to server and re-checks for multiple displays
- Uses `chrome.system.display.onDisplayChanged` event listener to detect real-time changes

**Vulnerability**: Event listeners can be blocked, and fingerprint generation uses the same manipulable API.

### 3. Expulsion Mechanism

**Location**: Service Worker (`serviceworker.txt`, lines 599-617)

```javascript
async function lo(e) {  // e = expulsion type (3 for multi-screen)
    let t = await C();  // Get incident data from storage
    
    if (t.expelled) {
        // Already expelled, just log
        T(4),
        fe(e, t.totalIncidents, t.totalLeavingTime)
    } else {
        // Mark as expelled
        t.expelled = !0,
        await ie({ id: "IMMEDIATE_DESKTOP_CAPTURE" }),  // Capture screen
        L(t),  // Save expelled state to chrome.storage
        T(3),  // Log expulsion event
        fe(e, t.totalIncidents, t.totalLeavingTime)  // Send to server
    }
    
    i("info", ["EXPELLING USER", e, t]),
    
    // Send expulsion message to content scripts
    ie({
        id: "CS_EXPEL",
        type: e,  // 3 for multi-screen
        reason: "3"
    }),
    I(!0)  // Stop lock mechanism
}

var h = lo;  // Alias for expulsion function
```

**How it works**:
- Marks user as expelled in local storage
- Triggers immediate screen capture
- Sends `CS_EXPEL` message to content scripts via `chrome.runtime.sendMessage`
- Content scripts display expulsion UI and stop monitoring

**Vulnerability**: Messages can be intercepted before reaching content scripts, and storage can be manipulated.

### 4. Server-Side Logging

**Location**: Service Worker (`serviceworker.txt`, lines 770-793)

```javascript
async function tt() {
    // ... validation code ...
    
    let e = new FormData();
    e.append("param1", r.cornerInfo.entityId);
    e.append("param2", r.cornerInfo.activityType + r.cornerInfo.activityId);
    e.append("param3", r.cornerInfo.userId);
    e.append("swlLicenseKey", r.cornerInfo.swlLicenseKey);
    e.append("uuid", t);
    
    // Get display info and append to form data
    let o = await chrome.system.display.getInfo();
    e.append("displays", JSON.stringify(o));
    
    // Send to server
    let a = r.cornerInfo.swlBaseUrl + "/save/saveExtension/saveDisplay.php";
    fetch(a, {
        method: "POST",
        body: e
    })
}
```

**How it works**:
- Periodically sends display configuration to `saveDisplay.php`
- Includes user ID, activity ID, and full display information
- Server could theoretically verify display count, but doesn't actively enforce it

**Vulnerability**: Network requests can be intercepted and blocked, or fake data can be sent.

---

## Bypass Script Breakdown

The `bypass_twoscreen.js` script implements **four coordinated patches** that neutralize all detection mechanisms. Each patch targets a specific layer of the detection system.

### Patch 1: Display API Interception (Lines 15-57)

```javascript
// Patch 1: Override chrome.system.display.getInfo globally
if (chrome.system && chrome.system.display) {
    console.log("📺 Patching chrome.system.display.getInfo...");
    
    const originalGetInfo = chrome.system.display.getInfo;
    originalFunctions.set('getInfo', originalGetInfo);
    
    chrome.system.display.getInfo = function(callback) {
        console.log("🎯 getInfo intercepted by patch - returning fake single display");
        
        const fakeDisplay = [{
            id: "fake-display-1",
            name: "Fake Display",
            isEnabled: true,
            isInternal: true,
            isUnified: false,
            bounds: {
                left: 0,
                top: 0,
                width: 1920,
                height: 1080
            },
            workArea: {
                left: 0,
                top: 0,
                width: 1920,
                height: 1040
            },
            rotation: 0,
            scaleFactor: 1,
            dpiX: 96,
            dpiY: 96
        }];
        
        if (callback) {
            callback(fakeDisplay);
        }
        
        return Promise.resolve(fakeDisplay);
    };
    
    console.log("✅ getInfo patched successfully");
}
```

**What it does**:
1. **Stores original function**: Saves reference to real `getInfo` for potential restoration
2. **Replaces API function**: Overwrites `chrome.system.display.getInfo` with a custom function
3. **Returns fake data**: Always returns an array with exactly one display object
4. **Maintains API contract**: Supports both callback and Promise patterns

**Key Properties of Fake Display**:
- `id: "fake-display-1"` - Unique identifier (doesn't match real displays)
- `isInternal: true` - Appears as laptop/primary display
- `isUnified: false` - Not a unified desktop (macOS)
- `bounds` and `workArea` - Standard 1920x1080 resolution
- All other properties match typical display structure

**Impact**: Every call to `getInfo()` throughout the extension now returns fake single-display data, regardless of actual hardware configuration.

### Patch 2: Display Change Listener Blocking (Lines 59-88)

```javascript
// Patch 2: Override display change listeners
if (chrome.system && chrome.system.display && chrome.system.display.onDisplayChanged) {
    console.log("📺 Patching display change listeners...");
    
    const originalAddListener = chrome.system.display.onDisplayChanged.addListener;
    const originalRemoveListener = chrome.system.display.onDisplayChanged.removeListener;
    const originalHasListener = chrome.system.display.onDisplayChanged.hasListener;
    
    originalFunctions.set('addListener', originalAddListener);
    originalFunctions.set('removeListener', originalRemoveListener);
    originalFunctions.set('hasListener', originalHasListener);
    
    // Block all display change listeners
    chrome.system.display.onDisplayChanged.addListener = function(callback) {
        console.log("🚫 Blocked display change listener");
        return;
    };
    
    chrome.system.display.onDisplayChanged.removeListener = function(callback) {
        console.log("🚫 Blocked display change listener removal");
        return;
    };
    
    chrome.system.display.onDisplayChanged.hasListener = function(callback) {
        console.log("🚫 Fake hasListener response");
        return false;
    };
    
    console.log("✅ Display change listeners patched successfully");
}
```

**What it does**:
1. **Blocks listener registration**: `addListener` becomes a no-op, preventing the extension from receiving display change events
2. **Blocks listener removal**: `removeListener` is neutralized (defensive measure)
3. **Fakes listener status**: `hasListener` always returns `false`, so the extension thinks no listeners are active

**Why this matters**: Even if the extension tries to register event listeners for real-time display monitoring, they never actually get registered. The extension cannot detect when displays are connected/disconnected during the exam.

### Patch 3: Expulsion Message Interception (Lines 90-116)

```javascript
// Patch 3: Override chrome.runtime.sendMessage to block expulsion
if (chrome.runtime && chrome.runtime.sendMessage) {
    console.log("📨 Patching chrome.runtime.sendMessage...");
    
    const originalSendMessage = chrome.runtime.sendMessage;
    originalFunctions.set('sendMessage', originalSendMessage);
    
    chrome.runtime.sendMessage = function(message, callback) {
        // Block multi-screen expulsion messages
        if (message.id === 'EXPEL_USER' && message.type === 3) {
            console.log("🚫 Blocked multi-screen expulsion message");
            if (callback) callback();
            return;
        }
        
        // Block any display-related messages
        if (message.id && (message.id.includes('DISPLAY') || message.id.includes('display'))) {
            console.log("🚫 Blocked display-related message:", message.id);
            if (callback) callback();
            return;
        }
        
        return originalSendMessage.call(this, message, callback);
    };
    
    console.log("✅ sendMessage patched successfully");
}
```

**What it does**:
1. **Intercepts all messages**: Every `chrome.runtime.sendMessage` call goes through this wrapper
2. **Blocks expulsion messages**: Specifically filters `EXPEL_USER` with `type: 3` (multi-screen violation)
3. **Blocks display messages**: Catches any message with "DISPLAY" or "display" in the ID (defensive)
4. **Maintains callback**: Calls callback immediately to prevent hanging, but doesn't send the message

**Note**: The actual expulsion function sends `CS_EXPEL` messages, not `EXPEL_USER`. However, the second check (display-related messages) would catch `CS_EXPEL` if it contained "display" in the ID. In practice, the first patch prevents expulsion from being triggered at all, making this a defense-in-depth measure.

**Impact**: Even if detection somehow occurs, expulsion messages never reach content scripts, so the user never sees the expulsion UI.

### Patch 4: Network Request Blocking (Lines 118-145)

```javascript
// Patch 4: Override fetch to block display save requests (Service Worker context)
if (typeof fetch !== 'undefined') {
    console.log("🌐 Patching fetch requests...");
    
    const originalFetch = globalThis.fetch;
    originalFunctions.set('fetch', originalFetch);
    
    globalThis.fetch = function(url, options) {
        // Block display-related save requests
        if (url.includes('saveDisplay.php') || 
            url.includes('saveExtension') ||
            (options && options.body && options.body.toString().includes('displays'))) {
            
            console.log("🚫 Blocked display save request:", url);
            
            return Promise.resolve({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ success: true }),
                text: () => Promise.resolve('{"success": true}')
            });
        }
        
        return originalFetch.call(this, url, options);
    };
    
    console.log("✅ fetch patched successfully");
}
```

**What it does**:
1. **Intercepts fetch API**: Overwrites global `fetch` function
2. **Detects display requests**: Checks URL for `saveDisplay.php` or `saveExtension`, or body for "displays"
3. **Returns fake success**: Immediately resolves with a fake 200 OK response
4. **Prevents server logging**: Display information never reaches the server

**Why `globalThis.fetch`**: In service worker context, `fetch` is available on `globalThis`, not just `window`. This ensures the patch works in both contexts.

**Impact**: Server never receives accurate display information, preventing any server-side analysis or logging of multi-screen usage.

### Testing and Restoration (Lines 147-205)

The script includes built-in testing and restoration functionality:

```javascript
// Test the patches
console.log("🧪 Testing patches...");

if (chrome.system && chrome.system.display) {
    chrome.system.display.getInfo((displays) => {
        console.log("📊 Display count after patch:", displays.length);
        if (displays.length === 1) {
            console.log("✅ Multi-screen bypass successful!");
        } else {
            console.log("❌ Multi-screen bypass failed");
        }
    });
}
```

**Testing**: Verifies that `getInfo()` returns exactly 1 display.

**Restoration Function**: The `restorePatches()` function (lines 178-199) allows reverting all changes by restoring original function references. This is useful for testing and demonstrates that the bypass is completely reversible.

---

## Why Each Bypass Works

### 1. JavaScript Function Overriding

**Technical Explanation**:
JavaScript allows reassignment of function references. When the extension calls `chrome.system.display.getInfo()`, it's actually calling the function object stored at that property. By replacing the property with a new function, all subsequent calls use the replacement.

```javascript
// Original state
chrome.system.display.getInfo → [Native Chrome API Function]

// After patch
chrome.system.display.getInfo → [Our Fake Function]

// Extension code (unchanged)
let displays = await chrome.system.display.getInfo();  // Gets fake data!
```

**Why Chrome Doesn't Prevent This**:
- Chrome Extensions run in an isolated JavaScript context
- The extension's own code has full control over the global scope
- Chrome APIs are exposed as regular JavaScript objects
- No integrity protection exists for API functions

**Timing Advantage**:
The bypass script runs in the same service worker context as the extension. Since JavaScript is single-threaded, if the bypass runs before the extension's detection code, the extension will use the patched functions. Even if detection runs first, the patch can be applied at any time and will affect future calls.

### 2. Event Listener Neutralization

**Technical Explanation**:
Chrome's event listener system uses the `addListener` method to register callbacks. By replacing `addListener` with a no-op function, callbacks are never actually registered, so events never trigger them.

```javascript
// Extension tries to register listener
chrome.system.display.onDisplayChanged.addListener(() => {
    checkDisplays();  // This never runs!
});

// Our patch intercepts the registration
addListener = function(callback) {
    return;  // Do nothing - callback never registered
};
```

**Why This Works**:
- Event listeners are registered through a method call, not a direct assignment
- The extension cannot verify that the listener was actually registered
- `hasListener` can be faked to return `false`, so the extension thinks everything is normal

### 3. Message Passing Interception

**Technical Explanation**:
Chrome's message passing system uses `chrome.runtime.sendMessage()` to communicate between service worker and content scripts. By intercepting this function, we can filter messages before they're sent.

```javascript
// Extension sends expulsion message
chrome.runtime.sendMessage({
    id: 'CS_EXPEL',
    type: 3
}, callback);

// Our patch intercepts it
sendMessage = function(message, callback) {
    if (message.type === 3) {
        callback();  // Fake success, but message never sent
        return;
    }
    // ... forward other messages
};
```

**Why This Works**:
- Messages are sent through a function call, not direct IPC
- The extension has no way to verify the message was actually delivered
- Callbacks can be called immediately with fake success
- Content scripts never receive the message, so expulsion UI never appears

### 4. Network Request Interception

**Technical Explanation**:
The `fetch` API is a global function that can be overridden. By replacing it, we can intercept all network requests and filter out display-related ones.

```javascript
// Extension sends display data
fetch('https://server.com/saveDisplay.php', {
    method: 'POST',
    body: formData
});

// Our patch intercepts it
fetch = function(url, options) {
    if (url.includes('saveDisplay.php')) {
        return Promise.resolve({ ok: true, status: 200 });  // Fake success
    }
    // ... forward other requests
};
```

**Why This Works**:
- `fetch` is a regular function, not a protected API
- The extension cannot verify that the request actually reached the server
- Fake responses can be returned immediately
- Server never receives the data, so server-side detection is impossible

---

## Fundamental Security Flaws

The bypass is possible due to several fundamental architectural flaws in the extension's security model:

### 1. Client-Side-Only Security Model

**The Problem**:
All security logic runs entirely in the browser, where it can be inspected, modified, and bypassed. There is no server-side enforcement of multi-screen restrictions.

**Why It's a Flaw**:
- **No Trust Boundary**: The extension trusts its own client-side code, but that code runs in an environment the user controls
- **No Verification**: The server receives display information but doesn't actively verify or enforce restrictions
- **Single Point of Failure**: All detection mechanisms can be disabled with a single script

**What Should Happen**:
- Server should actively verify display count from multiple sources
- Client-side detection should be one layer, not the only layer
- Server should reject exam submissions if multi-screen is detected

### 2. No Integrity Checks

**The Problem**:
The extension never verifies that Chrome APIs are returning legitimate data. It assumes `chrome.system.display.getInfo()` will always return accurate hardware information.

**Why It's a Flaw**:
- **Blind Trust**: No validation that API responses match expected patterns
- **No Tamper Detection**: No mechanism to detect if APIs have been modified
- **No Cross-Validation**: Doesn't compare display info from multiple sources

**What Should Happen**:
- Verify API function signatures haven't changed
- Cross-reference display info with other system APIs
- Implement challenge-response verification with server
- Use multiple independent detection methods

### 3. API Manipulation Vulnerability

**The Problem**:
Chrome Extension APIs are exposed as regular JavaScript objects that can be reassigned. The extension has no protection against this.

**Why It's a Flaw**:
- **Mutable APIs**: JavaScript's dynamic nature allows function replacement
- **Same Context**: Bypass script runs in the same context as extension code
- **No Isolation**: Service worker context is accessible via DevTools

**What Should Happen**:
- Chrome should provide read-only API wrappers for security-critical functions
- Extension should verify API integrity before use
- Implement code obfuscation and anti-debugging measures
- Use isolated execution contexts where possible

### 4. Message Passing Without Verification

**The Problem**:
The extension uses unauthenticated message passing. There's no way to verify that messages are legitimate or that they were actually delivered.

**Why It's a Flaw**:
- **No Authentication**: Messages can be intercepted, modified, or blocked
- **No Delivery Confirmation**: Extension assumes messages are delivered
- **No Integrity**: Message content can be altered in transit

**What Should Happen**:
- Implement message signing/authentication
- Require delivery confirmation from recipients
- Use encrypted message channels
- Verify message integrity

### 5. Network Request Spoofing

**The Problem**:
Network requests can be intercepted and blocked, or fake responses can be returned. The extension cannot verify that data actually reached the server.

**Why It's a Flaw**:
- **No Request Verification**: Extension trusts that `fetch` actually sends data
- **No Response Validation**: Doesn't verify server actually received the data
- **No Retry Logic**: If request is blocked, extension doesn't retry or alert

**What Should Happen**:
- Implement request signing and server verification
- Require server acknowledgment of critical data
- Use WebSockets or persistent connections for real-time verification
- Implement retry logic with exponential backoff

### 6. Lack of Defense in Depth

**The Problem**:
The extension relies on a single detection method (display count). If that method is bypassed, there's no backup.

**Why It's a Flaw**:
- **Single Point of Failure**: One bypass defeats entire system
- **No Redundancy**: No alternative detection methods
- **No Behavioral Analysis**: Doesn't detect suspicious patterns

**What Should Happen**:
- Implement multiple independent detection methods
- Use behavioral analysis (mouse movement patterns, window focus, etc.)
- Cross-reference with screen capture analysis
- Implement machine learning for anomaly detection

---

## Detection Flow Analysis

### Normal Operation (Without Bypass)

```
1. Extension Service Worker Starts
   ↓
2. Registers display change listener
   chrome.system.display.onDisplayChanged.addListener(checkDisplays)
   ↓
3. Periodic check runs (every few seconds)
   displays = await chrome.system.display.getInfo()
   ↓
4. Check display count
   if (displays.length > 1) {
       ↓
5. Trigger expulsion
   h(3)  // Expulsion function with type 3
   ↓
6. Save expulsion state
   chrome.storage.local.set({ expelled: true })
   ↓
7. Send expulsion message to content scripts
   chrome.runtime.sendMessage({ id: 'CS_EXPEL', type: 3 })
   ↓
8. Content scripts receive message
   ↓
9. Display expulsion UI to user
   ↓
10. Send expulsion data to server
    fetch('saveExpel.php', { ... })
    ↓
11. User is expelled from exam
```

### With Bypass Applied

```
1. Bypass Script Executes (before or during exam)
   ↓
2. Patch 1: Replace getInfo()
   chrome.system.display.getInfo → fake function
   ↓
3. Patch 2: Block event listeners
   onDisplayChanged.addListener → no-op
   ↓
4. Patch 3: Intercept messages
   chrome.runtime.sendMessage → filter function
   ↓
5. Patch 4: Block network requests
   fetch → filter function
   ↓
6. Extension Service Worker Starts
   ↓
7. Tries to register display change listener
   onDisplayChanged.addListener(checkDisplays)
   → Blocked by Patch 2 (no-op, listener never registered)
   ↓
8. Periodic check runs
   displays = await chrome.system.display.getInfo()
   → Returns fake single display (Patch 1)
   ↓
9. Check display count
   if (displays.length > 1)  // Always false now!
   → Condition never true, expulsion never triggered
   ↓
10. (If expulsion somehow triggered)
    chrome.runtime.sendMessage({ id: 'CS_EXPEL', type: 3 })
    → Blocked by Patch 3 (message never sent)
    ↓
11. (If server logging attempted)
    fetch('saveDisplay.php', ...)
    → Blocked by Patch 4 (fake success returned)
    ↓
12. User continues exam with multiple displays undetected
```

**Key Differences**:
- **Step 2-5**: Bypass patches are applied, modifying extension behavior
- **Step 7**: Listener registration fails silently
- **Step 8**: Fake display data is returned
- **Step 9**: Detection logic never triggers
- **Steps 10-11**: Backup mechanisms are also neutralized

---

## Limitations and Countermeasures

### Current Limitations of the Bypass

1. **Requires DevTools Access**: User must be able to open Chrome DevTools and access the service worker console
2. **Timing Dependent**: Bypass must be applied before or during detection checks
3. **Reversible**: Extension reload or browser restart may restore original functions
4. **Detectable**: Console logs and function replacements could be detected by advanced monitoring

### Potential Countermeasures

#### 1. Server-Side Verification

**Implementation**:
```javascript
// Server-side endpoint
app.post('/verify-display-config', async (req, res) => {
    const { userId, displayInfo, timestamp, signature } = req.body;
    
    // Verify request signature
    if (!verifySignature(displayInfo, timestamp, signature, userId)) {
        return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Analyze display configuration
    const analysis = analyzeDisplayConfig(displayInfo);
    
    if (analysis.multipleDisplays) {
        // Expel user server-side
        await expelUser(userId, 'multiple_displays');
        return res.status(403).json({ 
            error: 'Multiple displays detected',
            action: 'expel'
        });
    }
    
    res.json({ status: 'verified' });
});
```

**Effectiveness**: High - Cannot be bypassed client-side  
**Drawback**: Requires network connectivity and server processing

#### 2. API Integrity Checks

**Implementation**:
```javascript
// Verify API hasn't been tampered with
function verifyDisplayAPI() {
    const getInfo = chrome.system.display.getInfo;
    
    // Check function is native (not user-defined)
    if (getInfo.toString().includes('[native code]') === false) {
        throw new Error('Display API has been modified!');
    }
    
    // Verify function signature
    if (typeof getInfo !== 'function') {
        throw new Error('Display API is not a function!');
    }
    
    // Cross-reference with other APIs
    const systemInfo = chrome.system;
    if (!systemInfo || !systemInfo.display) {
        throw new Error('System API structure invalid!');
    }
}
```

**Effectiveness**: Medium - Can detect simple replacements  
**Drawback**: Advanced techniques can still bypass (proxy objects, etc.)

#### 3. Code Obfuscation and Anti-Debugging

**Implementation**:
- Minify and obfuscate extension code
- Implement anti-debugging checks (detect DevTools)
- Use code integrity verification
- Implement self-modifying code

**Effectiveness**: Low-Medium - Slows down attackers but doesn't prevent bypass  
**Drawback**: Determined attackers can still reverse engineer

#### 4. Multiple Detection Methods

**Implementation**:
```javascript
// Use multiple independent detection methods
async function detectMultipleDisplays() {
    const methods = [
        chrome.system.display.getInfo(),
        getScreenDimensions(),  // Window.screen API
        analyzeMouseMovement(),  // Behavioral analysis
        checkWindowPositions(),  // Window management API
        serverVerification()     // Server-side check
    ];
    
    const results = await Promise.all(methods);
    return results.filter(r => r.multipleDisplays).length >= 2;
}
```

**Effectiveness**: High - Requires bypassing multiple systems  
**Drawback**: More complex to implement and maintain

#### 5. Real-Time Server Monitoring

**Implementation**:
- Establish WebSocket connection for real-time communication
- Server periodically requests display information
- Server actively monitors and enforces restrictions
- Client cannot block WebSocket without breaking connection

**Effectiveness**: Very High - Server has ultimate authority  
**Drawback**: Requires persistent connection and server resources

#### 6. Hardware-Level Detection

**Implementation**:
- Use native messaging to communicate with system-level process
- System process queries display hardware directly
- Bypass browser APIs entirely
- Requires native application installation

**Effectiveness**: Very High - Cannot be bypassed from browser  
**Drawback**: Requires additional software installation, platform-specific

---

## Conclusion

The `bypass_twoscreen.js` script demonstrates a **critical architectural vulnerability** in the Smowl proctoring extension. The bypass is not a simple bug or oversight, but rather a fundamental flaw in the security model: **relying entirely on client-side detection with no server-side enforcement or integrity checks**.

### Key Takeaways

1. **Client-Side Security is Inherently Weak**: Any security mechanism that runs entirely in the browser can be bypassed by a determined user with DevTools access.

2. **API Interception is Trivial**: JavaScript's dynamic nature makes it easy to intercept and modify API calls. Extensions must assume APIs can be manipulated.

3. **Defense in Depth is Essential**: A single detection method is insufficient. Multiple independent methods with server-side verification are required.

4. **Server-Side Enforcement is Critical**: The server must actively verify and enforce restrictions, not just log violations after they occur.

5. **Integrity Checks are Necessary**: Extensions should verify that APIs haven't been tampered with and that responses are legitimate.

### Implications for Proctoring Systems

This vulnerability highlights a broader issue with browser-based proctoring systems:

- **Fundamental Limitation**: Browser extensions cannot provide strong security guarantees when users have full control over the browser environment.

- **Academic Integrity Risk**: Students can bypass restrictions with minimal technical knowledge, compromising exam integrity.

- **False Sense of Security**: Institutions may believe the system is secure when it can be trivially bypassed.

- **Need for Alternative Approaches**: Hardware-level monitoring, dedicated proctoring software, or in-person proctoring may be necessary for high-stakes exams.

### Recommendations

For **Security Researchers**:
- Continue to identify and responsibly disclose vulnerabilities
- Develop proof-of-concept exploits to demonstrate risks
- Advocate for improved security practices

For **Extension Developers**:
- Implement server-side verification for all critical security checks
- Use multiple independent detection methods
- Add integrity checks and tamper detection
- Assume client-side code can be modified

For **Educational Institutions**:
- Understand the limitations of browser-based proctoring
- Consider alternative proctoring methods for high-stakes exams
- Implement additional security measures (locked-down devices, network monitoring)
- Educate students about academic integrity

---

## References

- **Vulnerability Report**: `VULN-2024-003.md`
- **Complete Functional Analysis**: `complete_functional_analysis.md`
- **Extension Service Worker**: `serviceworker.txt` (lines 794-818)
- **Chrome Extension APIs**: [Chrome System Display API Documentation](https://developer.chrome.com/docs/extensions/reference/system_display/)
- **Complete Bypass Script**: `scripts/complete_bypass.js` (comprehensive bypass of all security features)

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-XX  
**Author**: Mohamed Elsheikh  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/  
**Classification**: Public (Proof of Concept)

