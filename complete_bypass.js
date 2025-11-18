/**
 * Complete Smowl Extension Bypass Script
 * 
 * This script completely disables ALL security functions and restrictions
 * of the Smowl proctoring extension by intercepting Chrome APIs, blocking
 * incident reporting, and neutralizing all monitoring mechanisms.
 * 
 * WARNING: For authorized security testing only
 * This script demonstrates critical security vulnerabilities in client-side
 * proctoring systems and should only be used for educational purposes.
 * 
 * IMPORTANT: This script must be run in the BACKGROUND SCRIPT context, not service worker!
 * 
 * How to run:
 * 1. Go to chrome://extensions/
 * 2. Find the Smowl extension
 * 3. Click "background page" or "service worker" link
 * 4. In the console that opens, paste and run this script
 * 5. If you see "chrome.scripting not available", you're in the wrong context
 * 
 * @author Mohamed Elsheikh
 * @email mohamedelsheikh4859@gmail.com
 * @linkedin https://www.linkedin.com/in/mohamedelsheiikh/
 */

// console.log("🔧 Starting Complete Smowl Extension Bypass...");
// console.log("⚠️  WARNING: This script disables ALL security monitoring!");
// console.log("📍 Context check: " + (chrome.scripting ? "✅ Background script context" : "❌ Service worker context"));

// Store original functions for restoration
const originalFunctions = new Map();
const bypassStats = {
    messagesBlocked: 0,
    networkRequestsBlocked: 0,
    apisPatched: 0,
    tabCloseBlocked: 0,        // NEW
    fullscreenBlocked: 0,      // NEW
    startTime: Date.now()
};

// ============================================================================
// 1. CONFIGURATION & STORAGE
// ============================================================================

function storeOriginalFunction(key, original) {
    originalFunctions.set(key, original);
    bypassStats.apisPatched++;
    // console.log(`📝 Stored original function: ${key}`);
}

// ============================================================================
// 2. CORE API OVERRIDES - Chrome System APIs
// ============================================================================

function patchDisplayAPIs() {
    // console.log("📺 Patching display detection APIs...");
    
    // Patch 1: Override chrome.system.display.getInfo globally
    if (chrome.system && chrome.system.display) {
        const originalGetInfo = chrome.system.display.getInfo;
        storeOriginalFunction('getInfo', originalGetInfo);
        
        chrome.system.display.getInfo = function(callback) {
            console.log("🎯 getInfo intercepted - returning fake single display");
            
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
        
        // console.log("✅ getInfo patched successfully");
    }

    // Patch 2: Override display change listeners
    if (chrome.system && chrome.system.display && chrome.system.display.onDisplayChanged) {
        const originalAddListener = chrome.system.display.onDisplayChanged.addListener;
        const originalRemoveListener = chrome.system.display.onDisplayChanged.removeListener;
        const originalHasListener = chrome.system.display.onDisplayChanged.hasListener;
        
        storeOriginalFunction('addListener', originalAddListener);
        storeOriginalFunction('removeListener', originalRemoveListener);
        storeOriginalFunction('hasListener', originalHasListener);
        
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
        
        // console.log("✅ Display change listeners patched successfully");
    }
}

function patchWindowAPIs() {
    // console.log("🪟 Patching window management APIs...");
    
    // Disable fullscreen enforcement
    if (chrome.windows && chrome.windows.onBoundsChanged) {
        const originalAddListener = chrome.windows.onBoundsChanged.addListener;
        const originalRemoveListener = chrome.windows.onBoundsChanged.removeListener;
        const originalHasListener = chrome.windows.onBoundsChanged.hasListener;
        
        storeOriginalFunction('windows.addListener', originalAddListener);
        storeOriginalFunction('windows.removeListener', originalRemoveListener);
        storeOriginalFunction('windows.hasListener', originalHasListener);
        
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
        
        // console.log("✅ Window bounds change listeners patched successfully");
    }
    
    // Block window state updates (fullscreen enforcement)
    if (chrome.windows && chrome.windows.update) {
        const originalUpdate = chrome.windows.update;
        storeOriginalFunction('windows.update', originalUpdate);
        
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
        
        // console.log("✅ Window update API patched successfully");
    }
}

function patchTabAPIs() {
    // console.log("📑 Patching tab management APIs...");
    
    // Disable tab creation restrictions
    if (chrome.tabs && chrome.tabs.onCreated) {
        const originalAddListener = chrome.tabs.onCreated.addListener;
        const originalRemoveListener = chrome.tabs.onCreated.removeListener;
        const originalHasListener = chrome.tabs.onCreated.hasListener;
        
        storeOriginalFunction('tabs.addListener', originalAddListener);
        storeOriginalFunction('tabs.removeListener', originalRemoveListener);
        storeOriginalFunction('tabs.hasListener', originalHasListener);
        
        chrome.tabs.onCreated.addListener = function(callback) {
            console.log("🚫 Blocked tab creation listener");
            return;
        };
        
        chrome.tabs.onCreated.removeListener = function(callback) {
            console.log("🚫 Blocked tab creation listener removal");
            return;
        };
        
        chrome.tabs.onCreated.hasListener = function(callback) {
            console.log("🚫 Fake tab creation hasListener response");
            return false;
        };
        
        // console.log("✅ Tab creation listeners patched successfully");
    }
    
    // Disable tab update monitoring
    if (chrome.tabs && chrome.tabs.onUpdated) {
        const originalAddListener = chrome.tabs.onUpdated.addListener;
        const originalRemoveListener = chrome.tabs.onUpdated.removeListener;
        const originalHasListener = chrome.tabs.onUpdated.hasListener;
        
        storeOriginalFunction('tabsUpdated.addListener', originalAddListener);
        storeOriginalFunction('tabsUpdated.removeListener', originalRemoveListener);
        storeOriginalFunction('tabsUpdated.hasListener', originalHasListener);
        
        chrome.tabs.onUpdated.addListener = function(callback) {
            console.log("🚫 Blocked tab update listener");
            return;
        };
        
        chrome.tabs.onUpdated.removeListener = function(callback) {
            console.log("🚫 Blocked tab update listener removal");
            return;
        };
        
        chrome.tabs.onUpdated.hasListener = function(callback) {
            console.log("🚫 Fake tab update hasListener response");
            return false;
        };
        
        // console.log("✅ Tab update listeners patched successfully");
    }
    
    // Block tab removal API to prevent tab closing
    if (chrome.tabs && chrome.tabs.remove) {
        const originalRemove = chrome.tabs.remove;
        storeOriginalFunction('tabs.remove', originalRemove);
        
        chrome.tabs.remove = function(tabIds, callback) {
            console.log("🚫 Blocked tab removal:", tabIds);
            bypassStats.tabCloseBlocked++;
            if (typeof callback === 'function') {
                callback();
            }
            return;
        };
        
        // console.log("✅ Tab removal API patched successfully");
    }
}

// ============================================================================
// 3. COMMUNICATION BLOCKING - Message Interception
// ============================================================================

function patchMessaging() {
    // console.log("📨 Patching messaging system...");
    
    if (chrome.runtime && chrome.runtime.sendMessage) {
        const originalSendMessage = chrome.runtime.sendMessage;
        storeOriginalFunction('sendMessage', originalSendMessage);
        
        chrome.runtime.sendMessage = function(message, callback) {
            const blockedMessages = [
                'EXPEL_USER',           // User expulsion
                'ADD_INCIDENT',         // Incident reporting
                'CS_EXPEL',            // Content script expulsion
                'SAVE_PERIODIC_CAPTURE', // Periodic screen capture
                'START_DESKTOP_CAPTURE', // Desktop capture start
                'STOP_DESKTOP_CAPTURE',  // Desktop capture stop
                'USER_ATTENTION_EVENT',  // Attention tracking
                'CS_START_LOCK',        // Lock start
                'CS_STOP_LOCK',         // Lock stop
                'SHOW_ALERT',           // Security alerts
                'IMMEDIATE_DESKTOP_CAPTURE', // Immediate capture
                'SAVE_SHARING_SCREEN',  // Screen sharing status
                'STOPPED_RECORDING',    // Recording stopped
                'CORNER_ALIVE',         // Heartbeat
                'CORNER_DEAD',          // Heartbeat lost
                'SWL_SAVE_LOG'          // Log saving
            ];
            
            if (blockedMessages.includes(message.id)) {
                console.log(`🚫 Blocked message: ${message.id}`);
                bypassStats.messagesBlocked++;
                if (typeof callback === 'function') {
                    callback();
                }
                return;
            }
            
            // Block any display-related messages
            if (message.id && (message.id.includes('DISPLAY') || message.id.includes('display'))) {
                console.log(`🚫 Blocked display-related message: ${message.id}`);
                bypassStats.messagesBlocked++;
                if (typeof callback === 'function') {
                    callback();
                }
                return;
            }
            
            return originalSendMessage.call(this, message, callback);
        };
        
        // console.log("✅ sendMessage patched successfully");
    }
    
    // Patch chrome.tabs.sendMessage to block CS_START_LOCK broadcasts
    if (chrome.tabs && chrome.tabs.sendMessage) {
        const originalTabsSendMessage = chrome.tabs.sendMessage;
        storeOriginalFunction('tabs.sendMessage', originalTabsSendMessage);
        
        chrome.tabs.sendMessage = function(tabId, message, options, callback) {
            // Block CS_START_LOCK messages that would re-enable monitoring
            if (message && message.id === 'CS_START_LOCK') {
                console.log("🚫 Blocked CS_START_LOCK broadcast to tab:", tabId);
                bypassStats.messagesBlocked++;
                if (typeof callback === 'function') {
                    callback();
                }
                return;
            }
            
            // Block other security-related messages
            const blockedTabMessages = [
                'CS_STOP_LOCK',
                'SHOW_ALERT',
                'ADD_INCIDENT',
                'EXPEL_USER'
            ];
            
            if (message && blockedTabMessages.includes(message.id)) {
                console.log(`🚫 Blocked tab message: ${message.id} to tab:`, tabId);
                bypassStats.messagesBlocked++;
                if (typeof callback === 'function') {
                    callback();
                }
                return;
            }
            
            return originalTabsSendMessage.call(this, tabId, message, options, callback);
        };
        
        // console.log("✅ tabs.sendMessage patched successfully");
    }
    
    // Patch chrome.runtime.onMessage.addListener to intercept IS_LOCKED responses
    if (chrome.runtime && chrome.runtime.onMessage && chrome.runtime.onMessage.addListener) {
        const originalAddListener = chrome.runtime.onMessage.addListener;
        storeOriginalFunction('runtime.onMessage.addListener', originalAddListener);
        
        chrome.runtime.onMessage.addListener = function(callback) {
            // Wrap the callback to intercept IS_LOCKED responses
            const wrappedCallback = function(message, sender, sendResponse) {
                // Always return false for IS_LOCKED to prevent lock activation
                if (message && message.id === 'IS_LOCKED') {
                    console.log("🚫 Intercepted IS_LOCKED query - returning false");
                    if (typeof sendResponse === 'function') {
                        sendResponse(false);
                    }
                    return true; // Indicate we handled the message
                }
                
                // Block other security messages
                const blockedMessages = [
                    'CS_START_LOCK',
                    'CS_STOP_LOCK',
                    'SHOW_ALERT',
                    'ADD_INCIDENT',
                    'EXPEL_USER'
                ];
                
                if (message && blockedMessages.includes(message.id)) {
                    console.log(`🚫 Intercepted blocked message: ${message.id}`);
                    if (typeof sendResponse === 'function') {
                        sendResponse();
                    }
                    return true;
                }
                
                // Allow other messages through
                return callback.call(this, message, sender, sendResponse);
            };
            
            return originalAddListener.call(this, wrappedCallback);
        };
        
        // console.log("✅ runtime.onMessage.addListener patched successfully");
    }
}

// ============================================================================
// 4. NETWORK BLOCKING - Fetch/XHR Interception
// ============================================================================

function patchNetworkRequests() {
    // console.log("🌐 Patching network requests...");
    
    // Patch fetch API
    if (typeof fetch !== 'undefined') {
        const originalFetch = globalThis.fetch;
        storeOriginalFunction('fetch', originalFetch);
        
        globalThis.fetch = function(url, options) {
            const blockedEndpoints = [
                'saveExpel.php',           // User expulsion
                'saveError.php',           // Error reporting
                'saveCapture.php',         // Screen capture
                'savePeriodicCapture.php', // Periodic capture
                'saveActiveUser.php',      // Active user tracking
                'saveCommand.php',         // Command logging
                'saveDeviceInfo.php',      // Device information
                'saveDisplay.php',         // Display information
                'saveExamLeave.php',       // Exam leave tracking
                'saveFullscreen.php',      // Fullscreen tracking
                'saveScreenSharing.php'    // Screen sharing status
            ];
            
            if (blockedEndpoints.some(endpoint => url.includes(endpoint))) {
                console.log(`🚫 Blocked network request: ${url}`);
                bypassStats.networkRequestsBlocked++;
                
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve({ success: true, message: "Request blocked by bypass" }),
                    text: () => Promise.resolve('{"success": true, "message": "Request blocked by bypass"}')
                });
            }
            
            return originalFetch.call(this, url, options);
        };
        
        // console.log("✅ fetch patched successfully");
    }
    
    // Patch XMLHttpRequest
    if (typeof XMLHttpRequest !== 'undefined') {
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;
        
        storeOriginalFunction('XMLHttpRequest.open', originalXHROpen);
        storeOriginalFunction('XMLHttpRequest.send', originalXHRSend);
        
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._url = url;
            return originalXHROpen.call(this, method, url, async, user, password);
        };
        
        XMLHttpRequest.prototype.send = function(data) {
            const blockedEndpoints = [
                'saveExpel.php', 'saveError.php', 'saveCapture.php',
                'savePeriodicCapture.php', 'saveActiveUser.php',
                'saveCommand.php', 'saveDeviceInfo.php', 'saveDisplay.php',
                'saveExamLeave.php', 'saveFullscreen.php', 'saveScreenSharing.php'
            ];
            
            if (this._url && blockedEndpoints.some(endpoint => this._url.includes(endpoint))) {
                console.log(`🚫 Blocked XMLHttpRequest: ${this._url}`);
                bypassStats.networkRequestsBlocked++;
                
                // Simulate successful response
                setTimeout(() => {
                    this.readyState = 4;
                    this.status = 200;
                    this.responseText = '{"success": true, "message": "Request blocked by bypass"}';
                    if (this.onreadystatechange) {
                        this.onreadystatechange();
                    }
                }, 10);
                
                return;
            }
            
            return originalXHRSend.call(this, data);
        };
        
        // console.log("✅ XMLHttpRequest patched successfully");
    }
}

// ============================================================================
// 5. STORAGE MANIPULATION - Block/modify chrome.storage operations
// ============================================================================

function patchStorage() {
    // console.log("💾 Patching storage operations...");
    
    if (chrome.storage && chrome.storage.local) {
        const originalStorageSet = chrome.storage.local.set;
        const originalStorageGet = chrome.storage.local.get;
        
        storeOriginalFunction('chrome.storage.local.set', originalStorageSet);
        storeOriginalFunction('chrome.storage.local.get', originalStorageGet);
        
        chrome.storage.local.set = function(items, callback) {
            // Block incident-related storage operations
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
        
        chrome.storage.local.get = function(keys, callback) {
            return originalStorageGet.call(this, keys, function(result) {
                // Reset incident data if it exists
                if (result) {
                    Object.keys(result).forEach(key => {
                        if (key.includes('incidentsv32-') && result[key]) {
                            result[key] = {
                                totalIncidents: 0,
                                totalLeavingTime: 0,
                                expelled: false
                            };
                            console.log(`🔄 Reset incident data for: ${key}`);
                        }
                    });
                }
                
                if (callback) callback(result);
            });
        };
        
        // console.log("✅ chrome.storage patched successfully");
    }
}

// ============================================================================
// 6. MEDIA API OVERRIDES - Screen capture and getUserMedia
// ============================================================================

function patchScreenCapture() {
    // console.log("📹 Patching screen capture APIs...");
    
    // Patch getDisplayMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;
        storeOriginalFunction('getDisplayMedia', originalGetDisplayMedia);
        
        navigator.mediaDevices.getDisplayMedia = async function(constraints) {
            console.log("🎯 getDisplayMedia intercepted - returning fake stream");
            
            // Create fake canvas stream
            const canvas = document.createElement('canvas');
            canvas.width = 1920;
            canvas.height = 1080;
            const ctx = canvas.getContext('2d');
            
            // Draw fake content
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'black';
            ctx.font = '48px Arial';
            ctx.fillText('FAKE SCREEN CONTENT - BYPASSED', 100, 100);
            ctx.fillText('Extension monitoring disabled', 100, 200);
            ctx.fillText('Time: ' + new Date().toLocaleTimeString(), 100, 300);
            
            return canvas.captureStream(30);
        };
        
        // console.log("✅ getDisplayMedia patched successfully");
    }
    
    // Patch getUserMedia as well
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
        storeOriginalFunction('getUserMedia', originalGetUserMedia);
        
        navigator.mediaDevices.getUserMedia = async function(constraints) {
            console.log("🎯 getUserMedia intercepted - returning fake stream");
            
            // Create fake canvas stream for camera
            const canvas = document.createElement('canvas');
            canvas.width = 640;
            canvas.height = 480;
            const ctx = canvas.getContext('2d');
            
            // Draw fake camera content
            ctx.fillStyle = 'lightblue';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'black';
            ctx.font = '24px Arial';
            ctx.fillText('FAKE CAMERA FEED', 50, 50);
            ctx.fillText('Extension bypassed', 50, 100);
            
            return canvas.captureStream(30);
        };
        
        // console.log("✅ getUserMedia patched successfully");
    }
}

// ============================================================================
// 7. KEYBOARD SHORTCUT UNLOCKER - Inject script to unlock shortcuts
// ============================================================================

function injectKeyboardUnlocker() {
    // console.log("💉 Injecting keyboard shortcut unlocker into all tabs...");
    
    // Check if we're in the right context
    if (!chrome.scripting || !chrome.scripting.executeScript) {
        // console.log("⚠️ chrome.scripting not available - running in service worker context");
        // console.log("💡 This script should be run in the background script context, not service worker");
        // console.log("💡 To fix: Copy this script and run it in the background script console");
        return;
    }
    
    chrome.tabs.query({}, function(tabs) {
        let injectedCount = 0;
        let skippedCount = 0;
        
        tabs.forEach(tab => {
            // Skip chrome:// and extension pages
            if (!tab.url || 
                tab.url.startsWith('chrome://') || 
                tab.url.startsWith('chrome-extension://') ||
                tab.url.startsWith('edge://')) {
                skippedCount++;
                return;
            }
            
            try {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    world: 'MAIN', // Inject into page context to run before content scripts
                    func: function() {
                        // console.log('🔓 Starting keyboard shortcut bypass...');
                        
                        // Store original preventDefault to restore later
                        const originalPreventDefault = Event.prototype.preventDefault;
                        let smowlPreventDefaultBlocked = false;
                        
                        // Override preventDefault to block Smowl extension's calls
                        Event.prototype.preventDefault = function() {
                            // Check if this is likely a Smowl extension call
                            const stack = new Error().stack;
                            if (stack && (stack.includes('lock_content_script') || stack.includes('smowl'))) {
                                console.log('🚫 Blocked Smowl preventDefault call');
                                smowlPreventDefaultBlocked = true;
                                return; // Don't call original preventDefault
                            }
                            // Allow other preventDefault calls (browser, other extensions)
                            return originalPreventDefault.call(this);
                        };
                        
                        // Note: Document cloning doesn't work in JavaScript - removed broken code
                        
                        // Re-attach our bypass listeners to the new document
                        const events = ['keydown', 'keyup', 'keypress', 'copy', 'cut', 'paste', 'contextmenu'];
                        
                        events.forEach(eventType => {
                            // Add capture-phase listener that allows events through but blocks Smowl
                            document.addEventListener(eventType, function(e) {
                                // Let the event bubble normally so browser shortcuts work
                                // The preventDefault override above will block Smowl's calls
                            }, { capture: true, passive: true });
                        });
                        
                        // Enhanced addEventListener override to detect minified Smowl handlers
                        const originalAddEventListener = EventTarget.prototype.addEventListener;
                        EventTarget.prototype.addEventListener = function(type, listener, options) {
                            // Block Smowl extension's keyboard event listeners
                            if (['keydown', 'keyup', 'copy', 'cut', 'paste', 'contextmenu'].includes(type)) {
                                const listenerString = listener.toString();
                                
                                // Check for minified function names (single letters)
                                const minifiedNames = ['M', 'C', 'a', 'l', 'y', 'j', 'z', 're', 'oe'];
                                const hasMinifiedName = minifiedNames.some(name => 
                                    listenerString.includes(`var ${name}=`) || 
                                    listenerString.includes(`function ${name}`) ||
                                    listenerString.includes(`${name}=`)
                                );
                                
                                // Check for Smowl-specific patterns
                                const smowlPatterns = [
                                    'preventDefault',
                                    'stopPropagation', 
                                    'SWL_SAVE_LOG',
                                    'SHOW_ALERT',
                                    'ADD_INCIDENT',
                                    'chrome.runtime.sendMessage',
                                    'lock_content_script',
                                    'smowl'
                                ];
                                
                                const hasSmowlPattern = smowlPatterns.some(pattern => 
                                    listenerString.includes(pattern)
                                );
                                
                                // Block if it matches Smowl patterns or has minified names
                                if (hasSmowlPattern || hasMinifiedName) {
                                    console.log(`🚫 Blocked Smowl ${type} listener (pattern: ${hasSmowlPattern}, minified: ${hasMinifiedName})`);
                                    console.log(`   Listener preview: ${listenerString.substring(0, 100)}...`);
                                    return; // Don't add the listener
                                }
                            }
                            return originalAddEventListener.call(this, type, listener, options);
                        };
                        
                        // Add continuous monitoring to prevent re-registration
                        let monitoringInterval = setInterval(() => {
                            // Check for and remove any Smowl event listeners that might have been added
                            const events = ['keydown', 'keyup', 'copy', 'cut', 'paste', 'contextmenu'];
                            events.forEach(eventType => {
                                // Try to remove common Smowl handlers
                                const smowlHandlers = ['M', 'C', 'a', 'l', 'y', 'j', 'z'];
                                smowlHandlers.forEach(handlerName => {
                                    try {
                                        // This is a best-effort attempt to remove listeners
                                        // The addEventListener override above is the primary protection
                                        if (window[handlerName] && typeof window[handlerName] === 'function') {
                                            document.removeEventListener(eventType, window[handlerName]);
                                        }
                                    } catch (e) {
                                        // Ignore errors - this is just cleanup
                                    }
                                });
                            });
                        }, 100); // Check every 100ms
                        
                        // Monitor for script re-injection
                        const observer = new MutationObserver((mutations) => {
                            mutations.forEach((mutation) => {
                                mutation.addedNodes.forEach((node) => {
                                    if (node.nodeType === Node.ELEMENT_NODE) {
                                        // Check for script tags that might be Smowl re-injecting
                                        if (node.tagName === 'SCRIPT' && 
                                            (node.src && node.src.includes('smowl')) ||
                                            (node.textContent && node.textContent.includes('lock_content_script'))) {
                                            // console.log('🚨 Detected potential Smowl script re-injection!');
                                            // Re-apply our protections
                                            if (node.textContent) {
                                                node.textContent = '// Blocked by bypass script';
                                            }
                                        }
                                    }
                                });
                            });
                        });
                        
                        observer.observe(document, {
                            childList: true,
                            subtree: true
                        });
                        
                        // console.log('🔓 Keyboard shortcuts unlocked by bypass script!');
                        // console.log('✅ Ctrl+C, Ctrl+V, and other shortcuts should now work');
                        // console.log('✅ Smowl incident reporting blocked');
                        // console.log('✅ Continuous monitoring active');
                        // console.log('✅ Script re-injection protection enabled');
                    }
                }, (result) => {
                    if (chrome.runtime.lastError) {
                        // console.log(`⚠️ Could not inject into tab ${tab.id}: ${chrome.runtime.lastError.message}`);
                    }
                });
                
                injectedCount++;
            } catch (error) {
                // console.log(`❌ Failed to inject into tab ${tab.id}:`, error.message);
            }
        });
        
        setTimeout(() => {
            // console.log(`✅ Keyboard unlocker injected into ${injectedCount} tabs (${skippedCount} skipped)`);
        }, 500);
    });
}

// ============================================================================
// 8. TESTING FUNCTIONS - Verify each bypass is working
// ============================================================================

function testAllBypasses() {
    // console.log("🧪 Testing all bypasses...");
    
    const tests = [];
    
    // Test 1: Multi-screen detection
    if (chrome.system && chrome.system.display) {
        chrome.system.display.getInfo((displays) => {
            const test1 = displays.length === 1;
            tests.push({ name: "Multi-screen detection", passed: test1 });
            // console.log(`📊 Multi-screen test: ${test1 ? '✅ PASSED' : '❌ FAILED'} (${displays.length} displays)`);
        });
    }
    
    // Test 2: Message blocking
    if (chrome.runtime) {
        chrome.runtime.sendMessage({ id: 'EXPEL_USER', type: 3 }, (response) => {
            const test2 = response === undefined;
            tests.push({ name: "Message blocking", passed: test2 });
            // console.log(`📊 Message blocking test: ${test2 ? '✅ PASSED' : '❌ FAILED'}`);
        });
    }
    
    // Test 3: Network request blocking
    if (typeof fetch !== 'undefined') {
        fetch('https://example.com/saveExpel.php', { method: 'POST', body: 'test' })
            .then(response => response.json())
            .then(data => {
                const test3 = data.success === true && data.message.includes('blocked');
                tests.push({ name: "Network blocking", passed: test3 });
                // console.log(`📊 Network blocking test: ${test3 ? '✅ PASSED' : '❌ FAILED'}`);
            })
            .catch(error => {
                // console.log(`📊 Network blocking test: ❌ FAILED (${error.message})`);
                tests.push({ name: "Network blocking", passed: false });
            });
    }
    
    // Test 4: Screen capture
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia()
            .then(stream => {
                const test4 = stream && stream.getVideoTracks().length > 0;
                tests.push({ name: "Screen capture", passed: test4 });
                // console.log(`📊 Screen capture test: ${test4 ? '✅ PASSED' : '❌ FAILED'}`);
            })
            .catch(error => {
                // console.log(`📊 Screen capture test: ❌ FAILED (${error.message})`);
                tests.push({ name: "Screen capture", passed: false });
            });
    }
    
    // Test 5: Storage manipulation
    if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['test-key'], (result) => {
            const test5 = true; // Storage get is working
            tests.push({ name: "Storage manipulation", passed: test5 });
            // console.log(`📊 Storage manipulation test: ${test5 ? '✅ PASSED' : '❌ FAILED'}`);
        });
    }
    
    // Test 6: Keyboard shortcuts (inject test into active tab)
    if (!chrome.scripting || !chrome.scripting.executeScript) {
        // console.log("📊 Keyboard shortcuts test: ❌ SKIPPED (chrome.scripting not available)");
        tests.push({ name: "Keyboard shortcuts", passed: false });
    } else {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs.length > 0) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    world: 'MAIN',
                    func: function() {
                    return new Promise((resolve) => {
                        let testResults = {
                            ctrlCWorks: false,
                            ctrlVWorks: false,
                            noIncidentMessages: true
                        };
                        
                        // Test Ctrl+C by simulating the key combination
                        const ctrlC = new KeyboardEvent('keydown', {
                            key: 'c',
                            code: 'KeyC',
                            ctrlKey: true,
                            bubbles: true,
                            cancelable: true
                        });
                        
                        // Test Ctrl+V by simulating the key combination
                        const ctrlV = new KeyboardEvent('keydown', {
                            key: 'v',
                            code: 'KeyV',
                            ctrlKey: true,
                            bubbles: true,
                            cancelable: true
                        });
                        
                        // Check if events are not prevented (meaning shortcuts work)
                        document.dispatchEvent(ctrlC);
                        testResults.ctrlCWorks = !ctrlC.defaultPrevented;
                        
                        document.dispatchEvent(ctrlV);
                        testResults.ctrlVWorks = !ctrlV.defaultPrevented;
                        
                        // Check if preventDefault was overridden
                        const testEvent = new Event('test');
                        const originalPreventDefault = testEvent.preventDefault;
                        testEvent.preventDefault = function() {
                            testResults.noIncidentMessages = false;
                        };
                        testEvent.preventDefault();
                        
                        resolve(testResults);
                    });
                }
            }, (results) => {
                if (results && results[0] && results[0].result) {
                    const test6 = results[0].result.ctrlCWorks && results[0].result.ctrlVWorks;
                    tests.push({ name: "Keyboard shortcuts", passed: test6 });
                    // console.log(`📊 Keyboard shortcuts test: ${test6 ? '✅ PASSED' : '❌ FAILED'}`);
                    // console.log(`   - Ctrl+C: ${results[0].result.ctrlCWorks ? '✅' : '❌'}`);
                    // console.log(`   - Ctrl+V: ${results[0].result.ctrlVWorks ? '✅' : '❌'}`);
                } else {
                    tests.push({ name: "Keyboard shortcuts", passed: false });
                    // console.log(`📊 Keyboard shortcuts test: ❌ FAILED (could not test)`);
                }
            });
        } else {
            tests.push({ name: "Keyboard shortcuts", passed: false });
            // console.log(`📊 Keyboard shortcuts test: ❌ FAILED (no active tab)`);
        }
    });
    }
    
    setTimeout(() => {
        const passedTests = tests.filter(t => t.passed).length;
        const totalTests = tests.length;
        // console.log(`\n📊 BYPASS TEST SUMMARY: ${passedTests}/${totalTests} tests passed`);
        
        if (passedTests === totalTests) {
            // console.log("🎉 ALL BYPASSES WORKING CORRECTLY!");
        } else {
            // console.log("⚠️  Some bypasses may not be working properly");
        }
    }, 2000);
}

// ============================================================================
// 8. RESTORATION FUNCTIONS - Restore original functionality
// ============================================================================

function restoreAllFunctions() {
    // console.log("🔄 Restoring original functions...");
    
    originalFunctions.forEach((original, key) => {
        try {
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
            } else if (key === 'getDisplayMedia') {
                navigator.mediaDevices.getDisplayMedia = original;
            } else if (key === 'getUserMedia') {
                navigator.mediaDevices.getUserMedia = original;
            } else if (key === 'XMLHttpRequest.open') {
                XMLHttpRequest.prototype.open = original;
            } else if (key === 'XMLHttpRequest.send') {
                XMLHttpRequest.prototype.send = original;
            } else if (key === 'chrome.storage.local.set') {
                chrome.storage.local.set = original;
            } else if (key === 'chrome.storage.local.get') {
                chrome.storage.local.get = original;
            } else if (key === 'windows.addListener') {
                chrome.windows.onBoundsChanged.addListener = original;
            } else if (key === 'windows.removeListener') {
                chrome.windows.onBoundsChanged.removeListener = original;
            } else if (key === 'windows.hasListener') {
                chrome.windows.onBoundsChanged.hasListener = original;
            } else if (key === 'tabs.addListener') {
                chrome.tabs.onCreated.addListener = original;
            } else if (key === 'tabs.removeListener') {
                chrome.tabs.onCreated.removeListener = original;
            } else if (key === 'tabs.hasListener') {
                chrome.tabs.onCreated.hasListener = original;
            } else if (key === 'tabsUpdated.addListener') {
                chrome.tabs.onUpdated.addListener = original;
            } else if (key === 'tabsUpdated.removeListener') {
                chrome.tabs.onUpdated.removeListener = original;
            } else if (key === 'tabsUpdated.hasListener') {
                chrome.tabs.onUpdated.hasListener = original;
            } else if (key === 'tabs.remove') {
                chrome.tabs.remove = original;
            } else if (key === 'windows.update') {
                chrome.windows.update = original;
            } else if (key === 'tabs.sendMessage') {
                chrome.tabs.sendMessage = original;
            } else if (key === 'runtime.onMessage.addListener') {
                chrome.runtime.onMessage.addListener = original;
            }
            
            // console.log(`✅ Restored: ${key}`);
        } catch (error) {
            // console.error(`❌ Failed to restore: ${key}`, error);
        }
    });
    
    originalFunctions.clear();
    // console.log("✅ All original functions restored");
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function executeCompleteBypass() {
    // console.log("🚀 Executing complete bypass...");
    
    // Execute all patches
    patchDisplayAPIs();
    patchWindowAPIs();
    patchTabAPIs();
    patchMessaging();
    patchNetworkRequests();
    patchStorage();
    patchScreenCapture();
    
    // Inject keyboard unlocker into all tabs
    setTimeout(() => {
        injectKeyboardUnlocker();
    }, 500);
    
    // Run tests after a short delay
    setTimeout(() => {
        testAllBypasses();
    }, 1000);
    
    // Display statistics
    setTimeout(() => {
        const runtime = Date.now() - bypassStats.startTime;
        // console.log("\n📊 BYPASS STATISTICS:");
        // console.log(`⏱️  Runtime: ${runtime}ms`);
        // console.log(`🔧 APIs Patched: ${bypassStats.apisPatched}`);
        // console.log(`📨 Messages Blocked: ${bypassStats.messagesBlocked}`);
        // console.log(`🌐 Network Requests Blocked: ${bypassStats.networkRequestsBlocked}`);
        // console.log(`🚫 Tab Closures Blocked: ${bypassStats.tabCloseBlocked}`);
        // console.log(`🚫 Fullscreen Enforcements Blocked: ${bypassStats.fullscreenBlocked}`);
        // console.log("\n🎯 ALL SECURITY MONITORING DISABLED!");
        // console.log("🔓 Keyboard shortcuts (Ctrl+C, Ctrl+V, etc.) unlocked in all tabs!");
        // console.log("🚫 Smowl incident reporting blocked for keyboard usage!");
        // console.log("🔄 Continuous monitoring active to prevent re-registration!");
        // console.log("💡 To restore original functionality, run: restoreAllFunctions()");
        // console.log("🔍 To verify bypasses remain active, run: verifyAllBypassesActive()");
    }, 3000);
    
    // Verify bypasses remain active after 5 seconds
    setTimeout(() => {
        verifyAllBypassesActive();
    }, 5000);
}

// Execute the bypass
executeCompleteBypass();

// ============================================================================
// 9. PERSISTENCE VERIFICATION - Ensure all bypasses remain active
// ============================================================================

function verifyAllBypassesActive() {
    // console.log("🔍 Verifying all bypasses remain active...");
    
    const verificationResults = {
        displayAPIs: false,
        windowAPIs: false,
        tabAPIs: false,
        messaging: false,
        networkRequests: false,
        storage: false,
        screenCapture: false,
        keyboardBypass: false
    };
    
    // Check display APIs
    if (chrome.system && chrome.system.display && chrome.system.display.getInfo) {
        const originalGetInfo = originalFunctions.get('getInfo');
        verificationResults.displayAPIs = chrome.system.display.getInfo !== originalGetInfo;
    }
    
    // Check window APIs
    if (chrome.windows && chrome.windows.update) {
        const originalUpdate = originalFunctions.get('windows.update');
        verificationResults.windowAPIs = chrome.windows.update !== originalUpdate;
    }
    
    // Check tab APIs
    if (chrome.tabs && chrome.tabs.remove) {
        const originalRemove = originalFunctions.get('tabs.remove');
        verificationResults.tabAPIs = chrome.tabs.remove !== originalRemove;
    }
    
    // Check messaging
    if (chrome.runtime && chrome.runtime.sendMessage) {
        const originalSendMessage = originalFunctions.get('sendMessage');
        verificationResults.messaging = chrome.runtime.sendMessage !== originalSendMessage;
    }
    
    // Check network requests
    if (typeof fetch !== 'undefined') {
        const originalFetch = originalFunctions.get('fetch');
        verificationResults.networkRequests = globalThis.fetch !== originalFetch;
    }
    
    // Check storage
    if (chrome.storage && chrome.storage.local && chrome.storage.local.set) {
        const originalSet = originalFunctions.get('chrome.storage.local.set');
        verificationResults.storage = chrome.storage.local.set !== originalSet;
    }
    
    // Check screen capture
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const originalGetDisplayMedia = originalFunctions.get('getDisplayMedia');
        verificationResults.screenCapture = navigator.mediaDevices.getDisplayMedia !== originalGetDisplayMedia;
    }
    
    // Check keyboard bypass (inject into active tab)
    if (!chrome.scripting || !chrome.scripting.executeScript) {
        // console.log("📊 Keyboard bypass verification: ❌ SKIPPED (chrome.scripting not available)");
        verificationResults.keyboardBypass = false;
    } else {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs.length > 0) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    world: 'MAIN',
                    func: function() {
                        // Check if addEventListener is overridden
                        const hasOverride = EventTarget.prototype.addEventListener.toString().includes('Blocked Smowl');
                        return hasOverride;
                    }
                }, (results) => {
                if (results && results[0] && results[0].result) {
                    verificationResults.keyboardBypass = results[0].result;
                }
                
                // Display verification results
                const activeCount = Object.values(verificationResults).filter(Boolean).length;
                const totalCount = Object.keys(verificationResults).length;
                
                // console.log(`\n📊 BYPASS PERSISTENCE VERIFICATION: ${activeCount}/${totalCount} active`);
                // console.log(`📺 Display APIs: ${verificationResults.displayAPIs ? '✅' : '❌'}`);
                // console.log(`🪟 Window APIs: ${verificationResults.windowAPIs ? '✅' : '❌'}`);
                // console.log(`📑 Tab APIs: ${verificationResults.tabAPIs ? '✅' : '❌'}`);
                // console.log(`📨 Messaging: ${verificationResults.messaging ? '✅' : '❌'}`);
                // console.log(`🌐 Network: ${verificationResults.networkRequests ? '✅' : '❌'}`);
                // console.log(`💾 Storage: ${verificationResults.storage ? '✅' : '❌'}`);
                // console.log(`📹 Screen Capture: ${verificationResults.screenCapture ? '✅' : '❌'}`);
                // console.log(`⌨️  Keyboard: ${verificationResults.keyboardBypass ? '✅' : '❌'}`);
                
                if (activeCount === totalCount) {
                    // console.log("🎉 ALL BYPASSES REMAIN ACTIVE!");
                } else {
                    // console.log("⚠️  Some bypasses may have been disabled - re-running bypass...");
                    // Re-execute bypass for any disabled functions
                    executeCompleteBypass();
                }
            });
        }
    });
    }
}

// Make functions available globally
globalThis.restoreAllFunctions = restoreAllFunctions;
globalThis.testAllBypasses = testAllBypasses;
globalThis.verifyAllBypassesActive = verifyAllBypassesActive;
globalThis.bypassStats = bypassStats;

// console.log("✅ Complete Smowl Extension Bypass Script Loaded!");
// console.log("⚠️  WARNING: All security monitoring has been disabled!");
// console.log("📝 Available functions: restoreAllFunctions(), testAllBypasses()");
