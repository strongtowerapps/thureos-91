# 🛡️ Thureos-91 (T91) Protocol

---

<div align="center">
  <img src="thureos91.png" alt="Thureos-91" width="300" />

<h1>Thureos-91 🛡️</h1>

**High-Density Encoding Protocol with XOR Encryption and CRC-16 Integrity.**

[![NPM Version](https://img.shields.io/npm/v/thureos-91?color=amber&label=Thureos-91&style=for-the-badge)](https://www.npmjs.com/package/thureos-91)
[![NPM Downloads](https://img.shields.io/npm/dm/thureos-91?color=blue&style=for-the-badge)](https://www.npmjs.com/package/thureos-91)
[![License](https://img.shields.io/npm/l/thureos-91?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Overview

Thureos-91 is a modern JavaScript protocol designed to shield and transport binary data as compactly as possible without compromising security. It combines a variable 13/14-bit Base-91 encoding with a dynamic XOR cipher layer and a mandatory CRC-16 integrity check.


### 📊 Technical Note on Efficiency
Thureos-91 prioritizes **Data Integrity** and **Privacy**.

* **Small Payloads:** Due to the mandatory 4-character integrity signature (separator + 3-char CRC-16), short strings may result in a larger output compared to non-secure encodings.
* **Large Payloads (>200 bytes):** This is where Thureos-91 shines, becoming progressively more efficient than standard Base64 as the data size increases.
* **Complexity:** Password length does not affect output size.

---

### 🔄 Protocol Comparison

| Feature | Base64 | Base85 | Common Base91 | **Thureos-91** |
| :--- | :---: | :---: | :---: | :---: |
| **Data Expansion** | ~33.3% | ~25% | ~23% | **~23% (for >200B)** |
| **Built-in Encryption** | ❌ No | ❌ No | ❌ No | ✅ **XOR Layer** |
| **Integrity Signature** | ❌ No | ❌ No | ❌ No | ✅ **CRC-16** |
| **Error Detection** | ❌ No | ❌ No | ❌ No | ✅ **Yes** |
| **Library Status** | Standard | Various | Outdated/Legacy | **Modern (ESM)** |

> **"Thureos-91 is UNIQUE and NECESSARY in this scenario: When you need to obfuscate data to hide plain text, ensure it hasn't been tampered with, and keep the result as small as possible."**

---


### 🛡️ Why choose Thureos-91?

1.  **Vs. Common Encodings (B64, B85, B91):** Most Base91 libraries on NPM are outdated, lack testing, or are just C-ports. Thureos-91 is the only modern JS package that bundles Security + Integrity + High Density in a single object.
2.  **Vs. Heavy Cryptography (AES-GCM):** While AES is the gold standard for high-level security, it requires an IV and an Auth Tag that add significant fixed overhead (28-32 bytes). Thureos-91 provides privacy and validation with only a **4-byte** total overhead, making it the superior choice when bandwidth and storage are critical.


### 🛠️ Best Use Cases
* **IoT & Edge Computing:** Perfect for low-bandwidth devices where every bit counts.
* **Session Tokens & Cookies:** Generate compact tokens that remain tamper-proof on the client-side.
* **NoSQL Databases:** Obfuscate sensitive fields while maintaining high storage density.

---


## 🚀 Installation and Use


```bash
npm install thureos-91


```javascript
import Thureos91 from 'thureos-91';

const secret = "Sensitive Information 2026";
const key = "your-key-to-the-shield";

// Proteger
const shielded = Thureos91.encode(secret, key); 

// Recuperar
try {
  const data = Thureos91.decode(shielded, key);
  console.log("Access granted:", data);
} catch (e) {
  console.error("Access error.");
}