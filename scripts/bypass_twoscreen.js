/**
 * Service Worker Patch for Multi-Screen Bypass (Fixed for Service Worker Context)
 * 
 * This script patches the service worker functions directly to bypass
 * multi-screen detection. Run this in the background script context.
 * 
 * WARNING: For authorized security testing only
 * 
 * @author Mohamed Elsheikh
 * @email mohamedelsheikh4859@gmail.com
 * @linkedin https://www.linkedin.com/in/mohamedelsheiikh/
 */

console.log("🔧 Starting Service Worker Patch for Multi-Screen Bypass...");

// Store original functions for restoration
const originalFunctions = new Map();

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

// Test expulsion blocking
if (chrome.runtime) {
    chrome.runtime.sendMessage({ id: 'EXPEL_USER', type: 3 }, (response) => {
        console.log("📊 Expulsion test result:", response);
    });
}

// Test display change listener blocking
if (chrome.system && chrome.system.display) {
    const hasListener = chrome.system.display.onDisplayChanged.hasListener(() => {});
    console.log("📊 Display change listener active:", hasListener);
}

console.log("✅ Service Worker Patch Complete!");
console.log("📝 Patched functions:", Array.from(originalFunctions.keys()));

// Function to restore original functionality
function restorePatches() {
    console.log("🔄 Restoring original functions...");
    
    originalFunctions.forEach((original, key) => {
        if (key === 'getInfo') {
            chrome.system.display.getInfo = original;
        } else if (key === 'addListener') {
            chrome.system.display.onDisplayChanged.addListener = original;
        } else if (key === 'removeListener') {
            chrome.system.display.onDisplayChanged.removeListener = original;
        } else if (key === 'hasListener') {
            chrome.system.display.onDisplayChanged.hasListener = original;
        } else if (key === 'sendMessage') {
            chrome.runtime.sendMessage = original;
        } else if (key === 'fetch') {
            globalThis.fetch = original;
        }
    });
    
    originalFunctions.clear();
    console.log("✅ Original functions restored");
}

// Make restore function available globally (Service Worker context)
globalThis.restorePatches = restorePatches;

console.log("💡 To restore original functionality, run: restorePatches()");
console.log("🔗 For complete bypass of ALL security functions, see: complete_bypass.js");
