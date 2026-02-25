# 🛡️ Thureos-91 (T91) Protocol

---

<div align="center">
  <img src="thureos91.png" alt="Thureos-91" width="800" height="200"  />

**High-Density Encoding Protocol with XOR Encryption and CRC-16 Integrity.**

[![NPM Version](https://img.shields.io/npm/v/thureos-91?color=amber&label=Thureos-91&style=for-the-badge)](https://www.npmjs.com/package/thureos-91)
[![NPM Downloads](https://img.shields.io/npm/dm/thureos-91?color=blue&style=for-the-badge)](https://www.npmjs.com/package/thureos-91)
[![License](https://img.shields.io/npm/l/thureos-91?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Overview
Thureos-91 is a modern JavaScript protocol designed to shield and transport binary data as compactly as possible without compromising security. It combines a variable 13/14-bit Base-91 encoding with a dynamic XOR cipher layer and a mandatory CRC-16 integrity check.


## 🔄 Version Support
- **v1.1 (Secure Standard)**:  Keys with salt, PBKDF2, and reordered alphabet. Recommended for all new implementations requiring an additional layer of security.
- **v1.0 (Basic Security Standard)**: Support for original shields without breaking existing systems. Includes basic security with XOR Layer, CRC-16, and Radix-91 encryption.


### 📊 Technical Note on Efficiency
Thureos-91 prioritizes **Data Integrity** and **Privacy**.

* **Small Payloads:** Due to the mandatory 4-character integrity signature (separator + 3-char CRC-16), short strings may result in a larger output compared to non-secure encodings.
* **Large Payloads (>200 bytes):** This is where Thureos-91 shines, becoming progressively more efficient than standard Base64 as the data size increases.
* **Complexity:** Password length does not affect output size.
---


### 🔄 Protocol Comparison

| Feature | Base64 | Base85 | Common Base91 | **Thureos-91** | **Thureos-91 v1.1 (PBKDF2 with Salt)** |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Data Expansion** | ~33.3% | ~25% | ~23% | **~23% (for >200B)** | **~23% (for >200B)** |
| **Built-in Encryption** | ❌ No | ❌ No | ❌ No | ✅ **XOR Layer** | ✅ **XOR Layer** |
| **Integrity Signature** | ❌ No | ❌ No | ❌ No | ✅ **CRC-16** | ✅ **CRC-16** |
| **Error Detection** | ❌ No | ❌ No | ❌ No | ✅ **Yes** | ✅ **Yes** |
| **Library Status** | Standard | Various | Outdated/Legacy | **Modern (ESM)** | **Modern (ESM)** |
| **Integrates PBKDF2 with salt** | ❌ No | ❌ No | ❌ No | ❌ No | ✅ **Yes** |

> **"Thureos-91 is unique when you need to obfuscate data, ensure zero tampering, and maintain maximum storage density."**
---


### 🛡️ Why choose Thureos-91?

1.  **Vs. Common Encodings (B64, N85, B91):** Thureos-91 is a modern ESM package that bundles Security + Integrity + High Density in a single object.
2.  **Vs. Heavy Cryptography (AES-GCM):** While AES is the gold standard, it adds significant fixed overhead (IV + Auth Tag). Thureos-91 provides privacy and validation with only a **4-byte** total overhead (v1.0), making it superior for bandwidth-critical IoT or session tokens.
3.  **Security Provenance:** All releases are published using GitHub OIDC Trusted Publishers, ensuring that the NPM package matches the source code exactly.


### 🛠️ Best Use Cases Thureos-91
* **IoT & Edge Computing:** Perfect for low-bandwidth devices where every bit counts.
* **Session Tokens & Cookies:** Generate compact tokens that remain tamper-proof on the client-side.
* **NoSQL Databases:** Obfuscate sensitive fields while maintaining high storage density.
---


## 🚀 Installation and Use
```bash
npm install thureos-91
```
---

## 🛠️ Usage Examples
* **Thureos-91 v1.1 (PBKDF2 with Salt):**
The new standard uses asynchronous key derivation for maximum resistance against brute-force attacks.

```javascript
import Thureos91 from 'thureos-91';

const secret = "Confidential Data 2026";
const password = "your-key-to-the-shield";

// Shield data (Returns a Salted Pack: Salt'Payload)
const shielded = await Thureos91.encode(secret, password, "v1.1"); 

// Recovery (Auto-detects version)
try {
  const data = await Thureos91.decode(shielded, password);
  console.log("Integrity Verified:", data);
} catch (e) {
  console.error("Integrity Breach or wrong key.");
}
```

* **Thureos-91:**
Synchronous and lightweight for simple obfuscation. Includes basic security with XOR Layer, CRC-16, and Radix-91 encryption.

```javascript
import Thureos91 from 'thureos-91';

const secret = "Sensitive Information 2026";
const key = "your-key-to-the-shield";

const shielded = Thureos91.encode(secret, key); 

try {
  const data = Thureos91.decode(shielded, key);
  console.log("Access granted:", data);
} catch (e) {
  console.error("Access error.");
}
```
---

## 🚀 Version 1.1.1 Features
- **Deterministic Fix**: Fixed critical alphabet duplication for v1.0.x, allowing the use of Thureos 91 with basic security using an XOR layer, CRC-16, and Radix-91 encryption.
- **Enhanced Security**: PBKDF2 (100k iterations) + Salt.
- **Auto Support**: Built-in recovery for v1.0.x shields (use with caution).
- **JSON Safe**: Apostrophe (`'`) separator for zero-escape overhead.
---

## 🔬 Interactive Watchtower
Audit your data integrity and inspect the "Shielded Pack" structure in real-time at our web laboratory:

👉 [Thureos-91 Watchtower Lab](https://strongtowerapps.github.io/thureos-91/)