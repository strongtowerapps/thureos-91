/**
 * THUREOS-91 (T91) PROTOCOL
 * "The Shield of your Data"
 * High-density encoding with XOR Cipher and CRC-16-CCITT Integrity.
 * License: MIT
 */

// If you use React Native, install:
// import 'fast-text-encoding';

// Alphabet original (v1.0)
const ALPHABET_V1_0 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+,-./:;<=>?@[]^_`{|}~";
// Alphabet new (v1.1)
const ALPHABET_V1_1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&()*+,-./:;<=>?@[]^_`{|}~abcdefghijklmnopqrstuvwxyz0123456789";

const BASE = 91;

export default class Thureos91 {
  
  get ALPHABET_V10() { return ALPHABET_V1_0; }
  get ALPHABET_V11() { return ALPHABET_V1_1; }

  /**
   * Generates a 16-bit polynomial integrity seal (CRC-16-CCITT).
   */
  static _crc16(data) {
    let crc = 0xFFFF;
    for (let byte of data) {
      crc ^= (byte << 8);
      for (let i = 0; i < 8; i++) {
        crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : (crc << 1);
        crc &= 0xFFFF;
      }
    }
    return crc & 0xFFFF;
  }

  /**
   * Internal Base91 Encoder
   */
  static _toBase91(data, alphabet) {
    let queue = 0, nbits = 0, encoded = "";
    for (let i = 0; i < data.length; i++) {
      queue |= (data[i] << nbits);
      nbits += 8;
      if (nbits > 13) {
        let val = queue & 0x1FFF;
        if (val > 88) { queue >>>= 13; nbits -= 13; } 
        else { val = queue & 0x3FFF; queue >>>= 14; nbits -= 14; }
        encoded += alphabet[val % BASE] + alphabet[Math.floor(val / BASE)];
      }
    }
    if (nbits > 0) {
      encoded += alphabet[queue % BASE];
      if (nbits > 7 || queue >= BASE) encoded += alphabet[Math.floor(queue / BASE)];
    }
    return encoded;
  }

  /**
   * Internal Base91 Decoder
   */
  static _fromBase91(string, alphabet) {
    let queue = 0, nbits = 0, val = -1;
    const bytes = [];
    for (let i = 0; i < string.length; i++) {
      let c = alphabet.indexOf(string[i]);
      if (val < 0) { val = c; } 
      else {
        val += c * BASE;
        queue |= (val << nbits);
        nbits += (val & 0x1FFF) > 88 ? 13 : 14;
        do {
          bytes.push(queue & 0xFF);
          queue >>>= 8;
          nbits -= 8;
        } while (nbits > 7);
        val = -1;
      }
    }
    if (val >= 0) bytes.push((queue | (val << nbits)) & 0xFF);
    return new Uint8Array(bytes);
  }

  /**
   * PBKDF2 Key Derivation (v1.1)
   */
  static async _deriveKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );
    const keyBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      256 // 32 bytes key
    );
    return new Uint8Array(keyBits);
  }

  /**
   * Core processing logic for encryption/decryption
   */
  static _processLegacy(data, password, alphabet, mode) {
    const encoder = new TextEncoder();
    const passBytes = encoder.encode(password);

    if (mode === 'encode') {
      const rawBytes = typeof data === 'string' ? encoder.encode(data) : data;
      const crc = this._crc16(rawBytes);
      const ciphered = rawBytes.map((b, i) => b ^ passBytes[i % passBytes.length]);
      
      const encoded = this._toBase91(ciphered, alphabet);
      const sig = alphabet[crc % BASE] + alphabet[Math.floor(crc / BASE) % BASE] + alphabet[Math.floor(crc / (BASE * BASE))];
      
      return `${encoded}"${sig}`;
    } else {
      // Decode
      const [encodedBody, sig] = data.split('"');
      if (!sig) throw new Error("Thureos-91: Integrity signature not found.");
      
      const ciphered = this._fromBase91(encodedBody, alphabet);
      const decrypted = ciphered.map((b, i) => b ^ passBytes[i % passBytes.length]);
      
      const expectedCRC = alphabet.indexOf(sig[0]) + (alphabet.indexOf(sig[1]) * BASE) + (alphabet.indexOf(sig[2]) * BASE * BASE);
      if (this._crc16(decrypted) !== expectedCRC) throw new Error("Thureos-91: Integrity Error.");
      
      return decrypted;
    }
  }

  static _processVariableFlow(data, keyBytes, alphabet, mode) {
    if (mode === 'encode') {
      const rawBytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
      const crc = this._crc16(rawBytes);
      const ciphered = rawBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
      
      const encoded = this._toBase91(ciphered, alphabet);
      const sig = alphabet[crc % BASE] + alphabet[Math.floor(crc / BASE) % BASE] + alphabet[Math.floor(crc / (BASE * BASE))];
      
      return encoded + sig;
    } else {
      // Decode
      const sig = data.slice(-3);
      const encodedBody = data.slice(0, -3);
      
      const ciphered = this._fromBase91(encodedBody, alphabet);
      const decrypted = ciphered.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
      
      const expectedCRC = alphabet.indexOf(sig[0]) + (alphabet.indexOf(sig[1]) * BASE) + (alphabet.indexOf(sig[2]) * BASE * BASE);
      if (this._crc16(decrypted) !== expectedCRC) throw new Error("Thureos-91: Integrity Error.");
      
      return decrypted;
    }
  }

  /**
   * Encode and protect data within the Thureos-91 shield.
   * @param {string|Uint8Array} data - Plain text
   * @param {string} password - User key
   * @param {string} version - 'v1.0' (Legacy) or 'v1.1' (Salted)
   */
  static encode(data, password, version = 'v1.0') {
    if (version === 'v1.0') {
      return this._processLegacy(data, password, ALPHABET_V1_0, 'encode');
    }

    if (version === 'v1.1') {
      // v1.1 Implementation (Salted + PBKDF2)
      const salt = crypto.getRandomValues(new Uint8Array(16));
      return this._deriveKey(password, salt).then(key => {
        const saltHeader = this._toBase91(salt, ALPHABET_V1_1);
        
        const payload = this._processVariableFlow(data, key, ALPHABET_V1_1, 'encode');
        return `${saltHeader}'${payload}`;
      });
    }

    throw new Error(`Thureos-91: Unsupported version '${version}'`);
  }

  /**
   * Decode with auto-version detection
   */
  static decode(shielded, password) {
    if (shielded.includes("'")) {
      const [saltH, payload] = shielded.split("'");
      const salt = this._fromBase91(saltH, ALPHABET_V1_1);
      return this._deriveKey(password, salt).then(key => {
        return this._processVariableFlow(payload, key, ALPHABET_V1_1, 'decode');
      });
    }
    
    // Default fallback to v1.0
    return this._processLegacy(shielded, password, ALPHABET_V1_0, 'decode');
  }
}
