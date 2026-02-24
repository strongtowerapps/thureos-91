# Thureos-91 Specification (v1.1.0)

## 1. Key Derivation
To prevent brute-force attacks, v1.1 uses **PBKDF2-HMAC-SHA256** with 100,000 iterations and a 16-byte random salt.

## 2. Standards
- **v1.0**: Unsalted for v1.0.x.
- **v1.1**: Salted for v1.1.x.

## 3. Delimiters
The apostrophe (`'`) is the official separator for v1.1 salted packs. It is chosen for its compatibility with JSON strings and HTML attributes.

---
Strong Tower Apps™ © 2026