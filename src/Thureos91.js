/**
 * THUREOS-91 (T91) PROTOCOL
 * "The Shield of your Data"
 * High-density encoding with XOR Cipher and CRC-16-CCITT Integrity.
 * License: MIT
 */

// If you use React Native, install:
// import 'fast-text-encoding';


const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+,-./:;<=>?@[]^_`{|}~;";
const BASE = 91;

export default class Thureos91 {
  
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
   * Encode and protect data within the Thureos-91 shield.
   * @param {string|Uint8Array} input - Data to be protected.
   * @param {string} password - Encryption key.
   */
  static encode(input, password) {
    const encoder = new TextEncoder();
    const rawBytes = typeof input === 'string' ? encoder.encode(input) : input;
    const passBytes = encoder.encode(password);
    
    const crc = this._crc16(rawBytes);
    const ciphered = rawBytes.map((b, i) => b ^ passBytes[i % passBytes.length]);

    let queue = 0, nbits = 0, encoded = "";
    for (let i = 0; i < ciphered.length; i++) {
      queue |= (ciphered[i] << nbits);
      nbits += 8;
      if (nbits > 13) {
        let val = queue & 0x1FFF;
        if (val > 88) { queue >>>= 13; nbits -= 13; } 
        else { val = queue & 0x3FFF; queue >>>= 14; nbits -= 14; }
        encoded += ALPHABET[val % BASE] + ALPHABET[Math.floor(val / BASE)];
      }
    }
    if (nbits > 0) {
      encoded += ALPHABET[queue % BASE];
      if (nbits > 7 || queue >= BASE) encoded += ALPHABET[Math.floor(queue / BASE)];
    }

    const sig = ALPHABET[crc % BASE] + ALPHABET[Math.floor(crc / BASE) % BASE] + ALPHABET[Math.floor(crc / (BASE * BASE))];
    return `${encoded}"${sig}`;
  }

  /**
   * Retrieve and validate data protected by Thureos-91.
   */
  static decode(vaultString, password) {
    const [data, sig] = vaultString.split('"');
    if (!sig) throw new Error("Thureos-91: Integrity signature not found.");

    let queue = 0, nbits = 0, val = -1;
    const bytes = [];
    for (let i = 0; i < data.length; i++) {
      let c = ALPHABET.indexOf(data[i]);
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

    const uint8 = new Uint8Array(bytes);
    const expectedCRC = ALPHABET.indexOf(sig[0]) + (ALPHABET.indexOf(sig[1]) * BASE) + (ALPHABET.indexOf(sig[2]) * BASE * BASE);

    const passBytes = new TextEncoder().encode(password);
    const decrypted = uint8.map((b, i) => b ^ passBytes[i % passBytes.length]);
    
    if (this._crc16(decrypted) !== expectedCRC) throw new Error("Thureos-91: Integrity Error.");
    return decrypted;
  }
}