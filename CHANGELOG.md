# 📝 Changelog: Thureos-91

## [1.1.1] - 2026-02-25

### 🚨 CRITICAL: Determinism Fix
* **Alphabet Integrity**: Removed duplicate `;` character. Previous versions (1.0.x) suffered from "Decoding Drift" where multiple input values mapped to the same character, making the protocol non-deterministic and prone to silent data corruption.
* **Security Level**: Classified as **CRITICAL** because the error invalidates the CRC-16 integrity guarantee and makes some encrypted payloads mathematically impossible to recover.

### ✨ Added
* **PBKDF2-HMAC-SHA256**: Key derivation with 100k iterations.
* **Cryptographic Salt**: 16-byte unique salt per shield.
* **Visual Inspector**: Support for the new Watchtower Lab diagnostic tools.

### ⚡ Changed
* **Separator**: Apostrophe (`'`) separator for zero-escape overhead.
* **Flow**: Switched to asynchronous `crypto.subtle` API.