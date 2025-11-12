# Module 8: Screen Capture Overrides

**Researcher**: [Mohamed Elsheikh](https://www.linkedin.com/in/mohamedelsheiikh/)  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/

---

## Module Overview

The Screen Capture Overrides module replaces media APIs to return fake screen and camera streams instead of real captures. This prevents Smowl from recording actual screen content.

**Code Location**: `scripts/complete_bypass.js` (Lines 558-617)

---

## Purpose

This module prevents screen and camera capture by:

1. **Overriding `getDisplayMedia()`** - Returns fake screen stream
2. **Overriding `getUserMedia()`** - Returns fake camera stream

---

## Technical Implementation

### Function: `patchScreenCapture()`

**Location**: Lines 558-617

#### Patch 1: Override `getDisplayMedia()`

**Lines**: 562-588

Creates a fake canvas stream with text indicating the bypass is active.

#### Patch 2: Override `getUserMedia()`

**Lines**: 591-616

Creates a fake camera stream with bypass indicator.

---

## Why It Works

### 1. API Replacement

By replacing media APIs, we return fake streams instead of real captures. The extension receives a stream, but it contains fake content.

### 2. Canvas Streams

Using HTML5 Canvas to generate fake video streams that appear valid to the extension but contain no real screen/camera content.

---

## Security Analysis

### Attack Vector

**How Smowl Captures Screen**:
1. Calls `navigator.mediaDevices.getDisplayMedia()`
2. Receives screen stream
3. Records or analyzes content

**How Bypass Defeats Capture**:
1. **API Replaced**: Returns fake stream
2. **Fake Content**: Stream shows bypass message
3. **No Real Capture**: Extension receives fake data

### Impact

- **No screen recording** - real screen never captured
- **No camera access** - real camera never accessed
- **Fake streams provided** - extension thinks it's recording

---

## Code Examples

### Example: Testing Screen Capture Bypass

```javascript
// After patchScreenCapture() is called
// Try to capture screen (should return fake stream)
navigator.mediaDevices.getDisplayMedia()
    .then(stream => {
        console.log('Stream received:', stream);
        console.log('Video tracks:', stream.getVideoTracks().length);
        // Should show fake stream with bypass message
        stream.getTracks().forEach(track => track.stop());
    });
```

---

## Related Modules

- **[Configuration & Storage](01-configuration-storage.md)**: Stores original functions
- **[Network Blocking](06-network-blocking.md)**: Blocks capture uploads
- **[Message Interception](05-message-interception.md)**: Blocks capture messages

---

**Author**: Mohamed Elsheikh  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/  
**Last Updated**: 2024

