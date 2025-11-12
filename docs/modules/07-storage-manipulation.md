# Module 7: Storage Manipulation

**Researcher**: [Mohamed Elsheikh](https://www.linkedin.com/in/mohamedelsheiikh/)  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/

---

## Module Overview

The Storage Manipulation module intercepts Chrome storage operations to prevent incident data from being saved and to reset existing incident data when read.

**Code Location**: `scripts/complete_bypass.js` (Lines 501-552)

---

## Purpose

This module prevents local storage of security incidents by:

1. **Intercepting `storage.local.set()`** - Blocks saving incident data
2. **Intercepting `storage.local.get()`** - Resets incident data when read

---

## Technical Implementation

### Function: `patchStorage()`

**Location**: Lines 501-552

#### Patch 1: Block Incident Storage

**Lines**: 511-528

```javascript
chrome.storage.local.set = function(items, callback) {
    const keys = Object.keys(items);
    const hasIncidentData = keys.some(key => 
        key.includes('incidentsv32-') && 
        (items[key].expelled === true || items[key].totalIncidents > 0)
    );
    
    if (hasIncidentData) {
        console.log("🚫 Blocked incident storage set:", keys);
        if (typeof callback === 'function') {
            callback();
        }
        return;
    }
    
    return originalStorageSet.call(this, items, callback);
};
```

#### Patch 2: Reset Incident Data

**Lines**: 530-548

```javascript
chrome.storage.local.get = function(keys, callback) {
    return originalStorageGet.call(this, keys, function(result) {
        if (result) {
            Object.keys(result).forEach(key => {
                if (key.includes('incidentsv32-') && result[key]) {
                    result[key] = {
                        totalIncidents: 0,
                        totalLeavingTime: 0,
                        expelled: false
                    };
                }
            });
        }
        if (callback) callback(result);
    });
};
```

---

## Why It Works

### 1. Storage Interception

By intercepting storage operations, we can filter out incident data before it's saved and reset it when it's read.

### 2. Data Manipulation

When incident data is read, we modify it to reset all incident counters and expulsion status.

---

## Security Analysis

### Attack Vector

**How Smowl Uses Storage**:
1. Saves incident data with key `incidentsv32-{userId}`
2. Tracks total incidents and expulsion status
3. Reads data to check if user is expelled

**How Bypass Defeats Storage**:
1. **Saves Blocked**: Incident data never saved
2. **Data Reset**: Existing data reset when read
3. **Expulsion Cleared**: Expulsion status always false

### Impact

- **No incident tracking** - incidents never recorded locally
- **Expulsion status cleared** - user never marked as expelled
- **Clean state maintained** - storage always shows no incidents

---

## Code Examples

### Example: Testing Storage Manipulation

```javascript
// After patchStorage() is called
// Try to save incident data (should be blocked)
chrome.storage.local.set({
    'incidentsv32-test': {
        totalIncidents: 5,
        expelled: true
    }
}, () => {
    console.log('Storage set attempted');
    // Data should not be saved
});

// Read data (should be reset)
chrome.storage.local.get(['incidentsv32-test'], (result) => {
    console.log('Incident data:', result['incidentsv32-test']);
    // Should show: { totalIncidents: 0, totalLeavingTime: 0, expelled: false }
});
```

---

## Related Modules

- **[Configuration & Storage](01-configuration-storage.md)**: Uses similar storage patterns
- **[Network Blocking](06-network-blocking.md)**: Blocks server-side storage
- **[Message Interception](05-message-interception.md)**: Blocks incident messages

---

**Author**: Mohamed Elsheikh  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/  
**Last Updated**: 2024

