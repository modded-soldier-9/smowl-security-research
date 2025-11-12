# Architecture Overview

**Researcher**: [Mohamed Elsheikh](https://www.linkedin.com/in/mohamedelsheiikh/)  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Bypass Flow](#bypass-flow)
- [Module Interaction](#module-interaction)
- [Security Model Weaknesses](#security-model-weaknesses)
- [Execution Flow](#execution-flow)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Chrome Browser                            │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Smowl Extension                          │    │
│  │  ┌────────────────────────────────────────────┐  │    │
│  │  │  Service Worker / Background Script          │  │    │
│  │  │  - Display Detection                         │  │    │
│  │  │  - Message Passing                           │  │    │
│  │  │  - Network Requests                          │  │    │
│  │  └────────────────────────────────────────────┘  │    │
│  │                    │                               │    │
│  │  ┌────────────────────────────────────────────┐  │    │
│  │  │  Content Scripts                             │  │    │
│  │  │  - Keyboard Blocking                          │  │    │
│  │  │  - UI Overlays                                │  │    │
│  │  └────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────┘    │
│                    │                                         │
│  ┌────────────────────────────────────────────────────┐   │
│  │         Bypass Script (Our Code)                     │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │  API Interception Layer                      │    │   │
│  │  │  - Display APIs                              │    │   │
│  │  │  - Window APIs                               │    │   │
│  │  │  - Tab APIs                                  │    │   │
│  │  │  - Message APIs                              │    │   │
│  │  │  - Network APIs                              │    │   │
│  │  │  - Storage APIs                              │    │   │
│  │  │  - Media APIs                                │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  │                    │                                  │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │  Content Script Injection                   │    │   │
│  │  │  - Keyboard Unlocker                        │    │   │
│  │  │  - Event Listener Blocking                   │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Bypass Flow

### Execution Flow Diagram

```
START
  │
  ▼
┌─────────────────────────┐
│ executeCompleteBypass() │
└─────────────────────────┘
  │
  ├─► patchDisplayAPIs()
  │     ├─► Override getInfo()
  │     └─► Block display listeners
  │
  ├─► patchWindowAPIs()
  │     ├─► Block window listeners
  │     └─► Intercept windows.update()
  │
  ├─► patchTabAPIs()
  │     ├─► Block tab listeners
  │     └─► Intercept tabs.remove()
  │
  ├─► patchMessaging()
  │     ├─► Intercept sendMessage()
  │     ├─► Intercept tabs.sendMessage()
  │     └─► Wrap onMessage.addListener()
  │
  ├─► patchNetworkRequests()
  │     ├─► Override fetch()
  │     └─► Override XMLHttpRequest
  │
  ├─► patchStorage()
  │     ├─► Intercept storage.set()
  │     └─► Intercept storage.get()
  │
  ├─► patchScreenCapture()
  │     ├─► Override getDisplayMedia()
  │     └─► Override getUserMedia()
  │
  └─► injectKeyboardUnlocker()
        ├─► Inject into all tabs
        ├─► Override preventDefault()
        ├─► Override addEventListener()
        └─► Add MutationObserver()
  │
  ▼
┌─────────────────────────┐
│ testAllBypasses()       │
└─────────────────────────┘
  │
  ▼
┌─────────────────────────┐
│ verifyAllBypassesActive()│
└─────────────────────────┘
  │
  ▼
END (Bypass Active)
```

---

## Module Interaction

### Module Dependency Graph

```
Configuration & Storage (Module 1)
    │
    ├─► Used by ALL modules
    │
    ├─► Display API Overrides (Module 2)
    │     └─► Stores getInfo, listeners
    │
    ├─► Window API Overrides (Module 3)
    │     └─► Stores windows.update, listeners
    │
    ├─► Tab API Overrides (Module 4)
    │     └─► Stores tabs.remove, listeners
    │
    ├─► Message Interception (Module 5)
    │     └─► Stores sendMessage functions
    │
    ├─► Network Blocking (Module 6)
    │     └─► Stores fetch, XHR functions
    │
    ├─► Storage Manipulation (Module 7)
    │     └─► Stores storage functions
    │
    ├─► Screen Capture Overrides (Module 8)
    │     └─► Stores media functions
    │
    └─► Restoration Functions (Module 11)
          └─► Uses all stored functions
```

### Data Flow

```
Extension Code
    │
    ▼
Chrome API Call
    │
    ▼
┌─────────────────┐
│ Bypass Intercept│  ← Our code intercepts here
└─────────────────┘
    │
    ├─► Blocked? ──► Fake Response / No-op
    │
    └─► Allowed? ──► Original Function
```

---

## Security Model Weaknesses

### Attack Surface

```
┌─────────────────────────────────────────┐
│      Smowl Security Model                │
│                                          │
│  ┌──────────────────────────────────┐  │
│  │  Client-Side Only                  │  │
│  │  ❌ No Server Verification         │  │
│  │  ❌ No Integrity Checks            │  │
│  │  ❌ No API Validation              │  │
│  └──────────────────────────────────┘  │
│              │                           │
│              ▼                           │
│  ┌──────────────────────────────────┐  │
│  │  Mutable Chrome APIs              │  │
│  │  ✅ Functions Can Be Replaced     │  │
│  │  ✅ No Protection                 │  │
│  │  ✅ Same Execution Context        │  │
│  └──────────────────────────────────┘  │
│              │                           │
│              ▼                           │
│  ┌──────────────────────────────────┐  │
│  │  Vulnerable Components           │  │
│  │  • Display Detection              │  │
│  │  • Message Passing                │  │
│  │  • Network Requests               │  │
│  │  • Storage Operations             │  │
│  │  • Media APIs                     │  │
│  │  • Event Listeners                │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Why Bypass Works

1. **No Trust Boundary**
   - All code runs in same context
   - No isolation between extension and bypass
   - User controls execution environment

2. **No Integrity Verification**
   - APIs not verified before use
   - No detection of function replacement
   - No validation of API responses

3. **Client-Side Only**
   - No server-side enforcement
   - Server only receives data (can be faked)
   - No active monitoring

4. **Single Point of Failure**
   - One bypass defeats entire system
   - No defense in depth
   - No redundancy

---

## Execution Flow

### Normal Extension Operation

```
1. Extension Initializes
   │
   ├─► Register Event Listeners
   │     • Display changes
   │     • Window changes
   │     • Tab changes
   │
   ├─► Start Monitoring
   │     • Periodic display checks
   │     • Network requests
   │     • Storage operations
   │
   └─► Detect Violations
         • Multiple displays
         • Keyboard usage
         • Tab switching
         │
         └─► Trigger Expulsion
```

### With Bypass Applied

```
1. Bypass Script Executes
   │
   ├─► Intercept All APIs
   │     • Replace functions
   │     • Block listeners
   │     • Fake responses
   │
   ├─► Extension Initializes
   │     • Tries to register listeners → Blocked
   │     • Calls APIs → Gets fake data
   │     • Sends messages → Intercepted
   │
   └─► Monitoring Disabled
         • No violations detected
         • No expulsion triggered
         • User continues normally
```

---

## Component Details

### API Interception Layer

**Purpose**: Intercept and modify Chrome API calls

**Components**:
- Function replacement
- Listener blocking
- Response faking
- Callback manipulation

**Techniques**:
- Direct function assignment
- Prototype manipulation
- Wrapper functions
- Proxy objects (not used, but possible)

### Content Script Injection

**Purpose**: Modify page behavior

**Components**:
- Script injection via chrome.scripting
- Event listener override
- preventDefault override
- MutationObserver for persistence

**Execution Context**:
- Runs in MAIN world (page context)
- Executes before content scripts
- Has access to page DOM

### Statistics & Monitoring

**Purpose**: Track bypass effectiveness

**Components**:
- Bypass statistics object
- Function storage Map
- Test results
- Verification functions

---

## Security Implications

### For Extension Developers

1. **Never trust client-side code**
2. **Implement server-side verification**
3. **Use multiple detection methods**
4. **Add integrity checks**
5. **Assume APIs can be modified**

### For Educational Institutions

1. **Understand limitations** of browser-based proctoring
2. **Consider alternatives** for high-stakes exams
3. **Implement additional measures** (locked devices, network monitoring)
4. **Educate students** about academic integrity

---

**Related Documentation**:
- [Module Documentation](modules/) - Detailed module information
- [Multi-Screen Bypass Analysis](multi-screen-bypass-analysis.md) - Vulnerability analysis
- [Usage Guide](guides/usage-guide.md) - How to use bypasses

---

**Author**: Mohamed Elsheikh  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/  
**Last Updated**: 2024

