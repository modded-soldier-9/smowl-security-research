# Testing Guide

**Researcher**: [Mohamed Elsheikh](https://www.linkedin.com/in/mohamedelsheiikh/)  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/

---

## Table of Contents

- [Overview](#overview)
- [Automated Testing](#automated-testing)
- [Manual Testing](#manual-testing)
- [Module-Specific Tests](#module-specific-tests)
- [Interpreting Results](#interpreting-results)
- [Troubleshooting Tests](#troubleshooting-tests)

---

## Overview

This guide explains how to test and verify that the bypass scripts are working correctly. Testing ensures that all security monitoring has been successfully disabled.

### Testing Methods

1. **Automated Testing**: Built-in test functions
2. **Manual Testing**: User-performed verification
3. **Module-Specific Testing**: Individual module verification

---

## Automated Testing

### Built-in Test Function

The complete bypass includes a comprehensive test suite:

```javascript
testAllBypasses()
```

### What It Tests

1. **Multi-screen detection** - Verifies fake single display is returned
2. **Message blocking** - Tests that security messages are blocked
3. **Network blocking** - Verifies security endpoints are intercepted
4. **Screen capture** - Tests fake stream generation
5. **Storage manipulation** - Verifies storage API is patched
6. **Keyboard shortcuts** - Tests keyboard unlocker injection

### Expected Output

```
🧪 Testing all bypasses...
📊 Multi-screen test: ✅ PASSED (1 displays)
📊 Message blocking test: ✅ PASSED
📊 Network blocking test: ✅ PASSED
📊 Screen capture test: ✅ PASSED
📊 Storage manipulation test: ✅ PASSED
📊 Keyboard shortcuts test: ✅ PASSED
   - Ctrl+C: ✅
   - Ctrl+V: ✅

📊 BYPASS TEST SUMMARY: 6/6 tests passed
🎉 ALL BYPASSES WORKING CORRECTLY!
```

### Running Tests

```javascript
// Run all tests
testAllBypasses();

// Check results after delay (tests are async)
setTimeout(() => {
    console.log('Tests completed');
}, 3000);
```

---

## Manual Testing

### Test 1: Multi-Screen Detection

**Purpose**: Verify that multiple displays are not detected

**Steps**:
1. Connect multiple displays to your computer
2. Run the bypass script
3. Execute test:

```javascript
chrome.system.display.getInfo((displays) => {
    console.log('Display count:', displays.length);
    console.log('Expected: 1');
    console.log('Test:', displays.length === 1 ? '✅ PASSED' : '❌ FAILED');
});
```

**Expected Result**: Always returns 1 display, regardless of actual hardware

### Test 2: Keyboard Shortcuts

**Purpose**: Verify that keyboard shortcuts work

**Steps**:
1. Navigate to a webpage (exam page)
2. Run the complete bypass script
3. Test shortcuts:
   - **Ctrl+C** (Copy) - Should work
   - **Ctrl+V** (Paste) - Should work
   - **Ctrl+A** (Select All) - Should work
   - **Right-click** - Context menu should appear

**Expected Result**: All shortcuts work normally

### Test 3: Fullscreen Enforcement

**Purpose**: Verify that fullscreen cannot be forced

**Steps**:
1. Run the bypass script
2. Try to exit fullscreen mode (F11 or Esc)
3. Verify you can exit

**Expected Result**: Can exit fullscreen freely

### Test 4: Tab Management

**Purpose**: Verify that tabs cannot be closed by extension

**Steps**:
1. Run the bypass script
2. Open multiple tabs
3. Extension should not be able to close them

**Expected Result**: Tabs remain open

### Test 5: Network Blocking

**Purpose**: Verify that security requests are blocked

**Steps**:
1. Open DevTools → Network tab
2. Run the bypass script
3. Trigger extension activity
4. Check Network tab for blocked requests

**Expected Result**: Security endpoints return fake 200 OK responses

### Test 6: Message Interception

**Purpose**: Verify that security messages are blocked

**Steps**:
1. Run the bypass script
2. Check console for blocked messages:

```javascript
// Messages should be blocked
chrome.runtime.sendMessage({ id: 'EXPEL_USER', type: 3 }, (response) => {
    console.log('Response:', response);  // Should be undefined
});
```

**Expected Result**: Messages are blocked, no response received

---

## Module-Specific Tests

### Display API Tests

```javascript
// Test 1: getInfo returns fake display
chrome.system.display.getInfo((displays) => {
    const test1 = displays.length === 1;
    console.log('Test 1 (Display count):', test1 ? '✅' : '❌');
});

// Test 2: Listener blocking
chrome.system.display.onDisplayChanged.addListener(() => {});
const hasListener = chrome.system.display.onDisplayChanged.hasListener(() => {});
const test2 = hasListener === false;
console.log('Test 2 (Listener blocked):', test2 ? '✅' : '❌');
```

### Window API Tests

```javascript
// Test: Fullscreen enforcement blocked
chrome.windows.update(windowId, { state: 'fullscreen' }, () => {
    console.log('Fullscreen enforcement attempted');
    // Should be blocked, check bypassStats.fullscreenBlocked
});
```

### Tab API Tests

```javascript
// Test: Tab removal blocked
chrome.tabs.remove(tabId, () => {
    console.log('Tab removal attempted');
    // Should be blocked, check bypassStats.tabCloseBlocked
});
```

### Message Interception Tests

```javascript
// Test: Security messages blocked
const testMessages = [
    'EXPEL_USER',
    'ADD_INCIDENT',
    'CS_START_LOCK'
];

testMessages.forEach(msgId => {
    chrome.runtime.sendMessage({ id: msgId }, (response) => {
        const blocked = response === undefined;
        console.log(`Message ${msgId}:`, blocked ? '✅ Blocked' : '❌ Not blocked');
    });
});
```

### Network Blocking Tests

```javascript
// Test: Security endpoints blocked
const testEndpoints = [
    'saveExpel.php',
    'saveDisplay.php',
    'saveCapture.php'
];

testEndpoints.forEach(endpoint => {
    fetch(`https://example.com/${endpoint}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            const blocked = data.message && data.message.includes('blocked');
            console.log(`Endpoint ${endpoint}:`, blocked ? '✅ Blocked' : '❌ Not blocked');
        });
});
```

### Storage Manipulation Tests

```javascript
// Test: Incident data reset
chrome.storage.local.get(['incidentsv32-test'], (result) => {
    if (result['incidentsv32-test']) {
        const reset = result['incidentsv32-test'].totalIncidents === 0;
        console.log('Storage reset test:', reset ? '✅' : '❌');
    }
});
```

### Screen Capture Tests

```javascript
// Test: Fake stream generation
navigator.mediaDevices.getDisplayMedia()
    .then(stream => {
        const hasTracks = stream.getVideoTracks().length > 0;
        console.log('Screen capture test:', hasTracks ? '✅' : '❌');
        stream.getTracks().forEach(track => track.stop());
    });
```

### Keyboard Shortcut Tests

```javascript
// Test: Shortcuts work (run in page context)
// This requires injection into a tab
chrome.tabs.query({active: true}, (tabs) => {
    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
            const event = new KeyboardEvent('keydown', {
                key: 'c',
                ctrlKey: true,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
            const works = !event.defaultPrevented;
            return works;
        }
    }, (results) => {
        console.log('Keyboard test:', results[0].result ? '✅' : '❌');
    });
});
```

---

## Interpreting Results

### Success Indicators

✅ **All Tests Pass**
- Automated tests show 6/6 passed
- Manual tests confirm functionality
- Statistics show activity

✅ **Bypass Active**
- `verifyAllBypassesActive()` returns all true
- Console shows success messages
- No errors in execution

### Failure Indicators

❌ **Tests Fail**
- Automated tests show failures
- Manual tests don't work
- Statistics remain at 0

❌ **Bypass Not Persistent**
- Extension reloads and bypass is lost
- Functions revert to original
- Tests fail after reload

### Common Issues

**Issue**: Tests pass but functionality doesn't work
- **Cause**: Tests may be running in wrong context
- **Solution**: Ensure tests run in same context as bypass

**Issue**: Some tests pass, others fail
- **Cause**: Partial bypass execution
- **Solution**: Re-run complete bypass script

**Issue**: Tests fail intermittently
- **Cause**: Timing issues or extension reload
- **Solution**: Re-run bypass and tests

---

## Troubleshooting Tests

### Problem: Tests don't run

**Solution**:
1. Check console for errors
2. Ensure bypass script executed successfully
3. Verify you're in correct context (background script)

### Problem: Tests show false positives

**Solution**:
1. Verify bypass actually executed
2. Check that patches were applied
3. Run manual tests to confirm

### Problem: Tests timeout

**Solution**:
1. Increase timeout in test code
2. Check for async operations
3. Ensure callbacks are being called

---

## Verification Functions

### Check Bypass Persistence

```javascript
verifyAllBypassesActive()
```

**Output**:
```
🔍 Verifying all bypasses remain active...
📊 BYPASS PERSISTENCE VERIFICATION: 8/8 active
📺 Display APIs: ✅
🪟 Window APIs: ✅
📑 Tab APIs: ✅
📨 Messaging: ✅
🌐 Network: ✅
💾 Storage: ✅
📹 Screen Capture: ✅
⌨️  Keyboard: ✅
🎉 ALL BYPASSES REMAIN ACTIVE!
```

### Check Statistics

```javascript
console.log(bypassStats);
```

**Output**:
```javascript
{
    messagesBlocked: 15,
    networkRequestsBlocked: 8,
    apisPatched: 25,
    tabCloseBlocked: 3,
    fullscreenBlocked: 2,
    startTime: 1234567890123
}
```

---

## Best Practices

1. **Test After Execution**: Always run tests after bypass execution
2. **Verify Persistence**: Check that bypasses remain active over time
3. **Monitor Statistics**: Track bypass effectiveness
4. **Test Manually**: Don't rely solely on automated tests
5. **Document Results**: Note any test failures or issues

---

**Related Documentation**:
- [Usage Guide](usage-guide.md) - How to use bypasses
- [Module Documentation](../modules/) - Technical details
- [Architecture Overview](../architecture-overview.md) - System architecture

---

**Author**: Mohamed Elsheikh  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/  
**Last Updated**: 2024

