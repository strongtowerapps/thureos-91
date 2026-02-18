# 🛡️ Thureos-91 (T91) Protocol

> **"The Shield of your Data."** > Inspired by the *thureos* (θύρεος), the full-body shield of antiquity, this protocol offers comprehensive protection: extreme density, privacy, and mathematical validation.


## 📊 Technical Specifications

Thureos-91 is not a simple character mapping. It implements **Variable Stream Arithmetic**, which optimizes every transmitted bit.

* **Density Efficiency:** Uses a 91-character arithmetic base.
    * Bits per character: $\log_2(91) \approx 6.507$
    * Data Overhead: $\approx 23.1%$ (Better than Base64's 33.3%).
* **Privacy Layer:** Dynamic symmetric encryption using XOR operation ($\oplus$).
* **Integrity Layer:** CRC-16-CCITT polynomial seal ($x^{16} + x^{12} + x^5 + 1$).


## 📊 Efficiency Comparison

| Feature | Base64 | Base85 | **Thureos-91 (T91)** |
| :--- | :---: | :---: | :---: |
**Arithmetic Base** | 64 | 85 | **91** |
**Overhead** | ~33.3% | ~25% | **~23.1%** |
**XOR Encryption** | ❌ No | ❌ No | ✅ **Native** |
**CRC-16 Integrity** | ❌ No | ❌ No | ✅ **Native** |
**Bit Density** | 6.0 | 6.44 | **6.51** |


## 🚀 Installation and Use

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