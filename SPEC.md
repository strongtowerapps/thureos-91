# Thureos-91 Specification (v1.1.1)

## 1. Key Derivation
To prevent brute-force attacks, v1.1 uses **PBKDF2-HMAC-SHA256** with 100,000 iterations and a 16-byte random salt.

## 2. Version Support
- **v1.1 (Secure Standard)**:  Keys with salt, PBKDF2, and reordered alphabet. Recommended for all new implementations requiring an additional layer of security.
- **v1.0 (Basic Security Standard)**: Support for original shields without breaking existing systems. Includes basic security with XOR Layer, CRC-16, and Radix-91 encryption.

## 3. Delimiters
The apostrophe (`'`) is the official separator for v1.1 salted packs. It is chosen for its compatibility with JSON strings and HTML attributes.

---
Strong Tower Apps™ © 2026