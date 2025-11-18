# 🔓 Smowl Security Research

**Researcher**: [Mohamed Elsheikh](https://www.linkedin.com/in/mohamedelsheiikh/)  
**Email**: mohamedelsheikh4859@gmail.com  
**LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Security Research](https://img.shields.io/badge/Security-Research-red.svg)](https://github.com)
[![Educational Purpose](https://img.shields.io/badge/Purpose-Educational-blue.svg)](https://github.com)

---

## ⚠️ Security Disclaimer

**WARNING**: This repository contains security research and proof-of-concept code demonstrating vulnerabilities in the Smowl proctoring extension. This research is intended for:

- **Educational purposes only**
- **Authorized security testing**
- **Responsible vulnerability disclosure**
- **Security awareness and improvement**

**DO NOT USE** these scripts to:
- Cheat on exams or assessments
- Violate academic integrity policies
- Circumvent security measures without authorization
- Engage in any illegal activities

The author assumes no liability for misuse of this research. Use at your own risk.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Usage Guide](#usage-guide)
- [Testing Guide](#testing-guide)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 Overview

This repository contains comprehensive security research on the Smowl proctoring extension, demonstrating critical vulnerabilities in client-side security monitoring. The research includes:

- **Complete bypass scripts** that disable all security monitoring
- **Detailed technical analysis** of each vulnerability
- **Module-by-module documentation** explaining how and why each bypass works
- **Testing procedures** to verify bypass effectiveness
- **Architectural analysis** of security flaws

For detailed architecture information, see the [Architecture Overview](docs/architecture-overview.md).

### Research Goals

1. **Identify vulnerabilities** in client-side proctoring systems
2. **Demonstrate security weaknesses** through proof-of-concept code
3. **Educate developers** on secure coding practices
4. **Raise awareness** about the limitations of browser-based security

---

## ✨ Features

The complete bypass script (`scripts/complete_bypass.js`) disables **ALL** security monitoring features:

| Feature | Status | Description | Documentation |
|---------|--------|-------------|---------------|
| 📺 **Multi-Screen Detection** | ✅ Bypassed | Prevents detection of multiple displays | [Display API Overrides](docs/modules/02-display-api-overrides.md), [Multi-Screen Analysis](docs/multi-screen-bypass-analysis.md) |
| 🪟 **Fullscreen Enforcement** | ✅ Bypassed | Blocks forced fullscreen mode | [Window API Overrides](docs/modules/03-window-api-overrides.md) |
| 📑 **Tab Management** | ✅ Bypassed | Prevents tab closing and monitoring | [Tab API Overrides](docs/modules/04-tab-api-overrides.md) |
| 📨 **Message Interception** | ✅ Bypassed | Blocks security-related messages | [Message Interception](docs/modules/05-message-interception.md) |
| 🌐 **Network Blocking** | ✅ Bypassed | Intercepts and blocks security endpoints | [Network Blocking](docs/modules/06-network-blocking.md) |
| 💾 **Storage Manipulation** | ✅ Bypassed | Prevents incident data storage | [Storage Manipulation](docs/modules/07-storage-manipulation.md) |
| 📹 **Screen Capture** | ✅ Bypassed | Returns fake screen/camera streams | [Screen Capture Overrides](docs/modules/08-screen-capture-overrides.md) |
| ⌨️ **Keyboard Shortcuts** | ✅ Bypassed | Unlocks Ctrl+C, Ctrl+V, etc. | [Keyboard Shortcut Unlocker](docs/modules/09-keyboard-shortcut-unlocker.md) |
| 🔄 **Persistence** | ✅ Active | Continuous monitoring prevents re-registration | [Execution & Verification](docs/modules/12-execution-verification.md) |

For complete module documentation, see the [Documentation](#-documentation) section.

---

## 🚀 Quick Start

> **📖 For detailed setup instructions, see the [Installation Guide](docs/guides/installation.md)**

### Prerequisites

- Google Chrome or Microsoft Edge browser
- Smowl proctoring extension installed
- Access to Chrome DevTools

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/smowl-security-research.git
   cd smowl-security-research
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Find the Smowl extension and click "Inspect views: service worker" or "background page"

4. Open the Console tab in DevTools

For detailed installation steps, see the [Installation Guide](docs/guides/installation.md).

### Basic Usage

#### Option 1: Complete Bypass (All Features)

1. Open the background script console (see Installation step 3)
2. Copy the contents of `scripts/complete_bypass.js`
3. Paste and execute in the console
4. Verify bypass is active by checking console output

#### Option 2: Multi-Screen Bypass Only

1. Open the background script console
2. Copy the contents of `scripts/bypass_twoscreen.js`
3. Paste and execute in the console
4. Test with multiple displays connected

### Expected Output

When the bypass is active, you should see:

```
🔧 Starting Complete Smowl Extension Bypass...
✅ getInfo patched successfully
✅ Display change listeners patched successfully
✅ Window update API patched successfully
...
🎯 ALL SECURITY MONITORING DISABLED!
```

For detailed usage instructions, see the [Usage Guide](docs/guides/usage-guide.md).

---

## 📚 Documentation

### Core Documentation

- **[Architecture Overview](docs/architecture-overview.md)** - High-level system architecture and flow diagrams
- **[Multi-Screen Bypass Analysis](docs/multi-screen-bypass-analysis.md)** - Detailed analysis of the multi-screen detection bypass

### Module Documentation

Each module in `complete_bypass.js` is fully documented:

1. **[Configuration & Storage](docs/modules/01-configuration-storage.md)** - Function preservation and statistics tracking
2. **[Display API Overrides](docs/modules/02-display-api-overrides.md)** - Multi-screen detection bypass
3. **[Window API Overrides](docs/modules/03-window-api-overrides.md)** - Fullscreen enforcement bypass
4. **[Tab API Overrides](docs/modules/04-tab-api-overrides.md)** - Tab management bypass
5. **[Message Interception](docs/modules/05-message-interception.md)** - Runtime message filtering
6. **[Network Blocking](docs/modules/06-network-blocking.md)** - Fetch/XHR interception
7. **[Storage Manipulation](docs/modules/07-storage-manipulation.md)** - Chrome storage API interception
8. **[Screen Capture Overrides](docs/modules/08-screen-capture-overrides.md)** - Media API manipulation
9. **[Keyboard Shortcut Unlocker](docs/modules/09-keyboard-shortcut-unlocker.md)** - Content script injection
10. **[Testing Functions](docs/modules/10-testing-functions.md)** - Comprehensive testing suite
11. **[Restoration Functions](docs/modules/11-restoration-functions.md)** - Function restoration
12. **[Execution & Verification](docs/modules/12-execution-verification.md)** - Main orchestration and persistence

### Guides

- **[Usage Guide](docs/guides/usage-guide.md)** - Step-by-step usage instructions
- **[Testing Guide](docs/guides/testing-guide.md)** - How to test and verify bypasses
- **[Installation Guide](docs/guides/installation.md)** - Setup and prerequisites

---

## 📖 Usage Guide

> **📚 For comprehensive usage instructions, see the [Usage Guide](docs/guides/usage-guide.md)**

### Using Complete Bypass

The complete bypass script disables all security monitoring. See [Usage Guide](docs/guides/usage-guide.md) for detailed instructions.

**Quick Steps**:
1. Open Chrome DevTools on the Smowl extension background page
2. Paste `scripts/complete_bypass.js` into the console
3. Press Enter to execute
4. Verify bypass is active using built-in tests

For detailed module information, see:
- [Configuration & Storage](docs/modules/01-configuration-storage.md)
- [Execution & Verification](docs/modules/12-execution-verification.md)

### Using Multi-Screen Bypass Only

For just multi-screen detection bypass:
1. Open Chrome DevTools on the Smowl extension background page
2. Paste `scripts/bypass_twoscreen.js` into the console
3. Press Enter to execute

For detailed information, see:
- [Display API Overrides](docs/modules/02-display-api-overrides.md)
- [Multi-Screen Bypass Analysis](docs/multi-screen-bypass-analysis.md)

### Testing the Bypass

After executing the bypass, run the built-in test function:

```javascript
testAllBypasses()
```

This will verify that all bypass modules are working correctly.

For comprehensive testing procedures, see:
- [Testing Guide](docs/guides/testing-guide.md)
- [Testing Functions](docs/modules/10-testing-functions.md)

### Restoring Original Functionality

To restore original extension behavior:

```javascript
restoreAllFunctions()
```

For details on restoration, see [Restoration Functions](docs/modules/11-restoration-functions.md).

---

## 🧪 Testing Guide

> **📚 For comprehensive testing procedures, see the [Testing Guide](docs/guides/testing-guide.md)**

### Automated Testing

The bypass script includes built-in testing functions:

```javascript
// Test all bypasses
testAllBypasses()

// Verify bypasses remain active
verifyAllBypassesActive()

// Check statistics
console.log(bypassStats)
```

For detailed information on testing functions, see [Testing Functions](docs/modules/10-testing-functions.md).

### Manual Testing

1. **Multi-Screen Test**: Connect multiple displays and verify no expulsion occurs
   - See [Display API Overrides](docs/modules/02-display-api-overrides.md) for details
2. **Keyboard Shortcuts**: Test Ctrl+C, Ctrl+V, Ctrl+A, etc.
   - See [Keyboard Shortcut Unlocker](docs/modules/09-keyboard-shortcut-unlocker.md) for details
3. **Fullscreen Test**: Try to exit fullscreen mode
   - See [Window API Overrides](docs/modules/03-window-api-overrides.md) for details
4. **Tab Management**: Try to open new tabs or close tabs
   - See [Tab API Overrides](docs/modules/04-tab-api-overrides.md) for details
5. **Network Test**: Check DevTools Network tab for blocked requests
   - See [Network Blocking](docs/modules/06-network-blocking.md) for details

For detailed testing procedures, see the [Testing Guide](docs/guides/testing-guide.md).

---

## 🏗️ Architecture

> **📚 For comprehensive architecture documentation, see the [Architecture Overview](docs/architecture-overview.md)**

### Bypass Architecture Flow

```
┌─────────────────────────────────────────────────────────┐
│              Complete Bypass Execution                   │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │  executeCompleteBypass()      │
        └───────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌───────────┐   ┌───────────┐   ┌───────────┐
│ Display   │   │ Window    │   │ Tab       │
│ APIs      │   │ APIs      │   │ APIs      │
└───────────┘   └───────────┘   └───────────┘
        │               │               │
        ▼               ▼               ▼
┌───────────┐   ┌───────────┐   ┌───────────┐
│ Message   │   │ Network   │   │ Storage   │
│ Intercept │   │ Blocking  │   │ Manip.    │
└───────────┘   └───────────┘   └───────────┘
        │               │               │
        ▼               ▼               ▼
┌───────────┐   ┌───────────┐   ┌───────────┐
│ Screen    │   │ Keyboard  │   │ Testing   │
│ Capture   │   │ Unlocker  │   │ Functions │
└───────────┘   └───────────┘   └───────────┘
```

### Module Documentation

Each module in the architecture is fully documented:

- **[Configuration & Storage](docs/modules/01-configuration-storage.md)** - Function preservation and statistics tracking
- **[Display API Overrides](docs/modules/02-display-api-overrides.md)** - Multi-screen detection bypass
- **[Window API Overrides](docs/modules/03-window-api-overrides.md)** - Fullscreen enforcement bypass
- **[Tab API Overrides](docs/modules/04-tab-api-overrides.md)** - Tab management bypass
- **[Message Interception](docs/modules/05-message-interception.md)** - Runtime message filtering
- **[Network Blocking](docs/modules/06-network-blocking.md)** - Fetch/XHR interception
- **[Storage Manipulation](docs/modules/07-storage-manipulation.md)** - Chrome storage API interception
- **[Screen Capture Overrides](docs/modules/08-screen-capture-overrides.md)** - Media API manipulation
- **[Keyboard Shortcut Unlocker](docs/modules/09-keyboard-shortcut-unlocker.md)** - Content script injection
- **[Testing Functions](docs/modules/10-testing-functions.md)** - Comprehensive testing suite
- **[Restoration Functions](docs/modules/11-restoration-functions.md)** - Function restoration
- **[Execution & Verification](docs/modules/12-execution-verification.md)** - Main orchestration and persistence

For detailed architecture documentation, see [Architecture Overview](docs/architecture-overview.md).

---

## 🤝 Contributing

> **📚 For detailed contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md)**

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Contribution Areas

- Additional bypass techniques
- Documentation improvements
- Testing enhancements
- Security analysis
- Countermeasure research

For complete contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📄 License

> **📄 For full license details, see the [LICENSE](LICENSE) file**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Copyright (c) 2024 Mohamed Elsheikh**

---

## 📧 Contact

**Researcher**: Mohamed Elsheikh

- **Email**: mohamedelsheikh4859@gmail.com
- **LinkedIn**: https://www.linkedin.com/in/mohamedelsheiikh/

### Reporting Issues

If you discover additional vulnerabilities or have questions about this research:

1. **Do not** create public issues for security vulnerabilities
2. Contact the researcher directly via email
3. Provide detailed information about the issue
4. Allow reasonable time for response

For contribution-related questions, see [Contributing](#-contributing) and [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 🙏 Acknowledgments

This research was conducted for educational purposes to improve security awareness and help developers build more secure proctoring systems.

**Special Thanks**:
- Security research community
- Open source contributors
- Educational institutions for supporting security research

---

## 📊 Repository Statistics

- **Total Modules**: 12
- **Bypass Scripts**: 2
- **Documentation Files**: 15+
- **Lines of Code**: 1,200+
- **Security Features Bypassed**: 8+

---

**Last Updated**: 2025  
**Version**: 2.5.0  
**Status**: Active Research

---

*This repository is maintained for educational and security research purposes. Use responsibly.*
