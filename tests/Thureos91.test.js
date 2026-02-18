import Thureos91 from '../src/Thureos91.js';

describe('Thureos-91 Protocol Tests', () => {
  const key = "your-key-to-the-shield";
  const text = "Data protected by the Thureos shield 🛡️";

  test('It should successfully encrypt and decrypt text.', () => {
    const encoded = Thureos91.encode(text, key);
    const decoded = new TextDecoder().decode(Thureos91.decode(encoded, key));
    expect(decoded).toBe(text);
  });

  test('It should detect data alteration (CRC signature).', () => {
    const encoded = Thureos91.encode(text, key);
    const corrupted = "0" + encoded.substring(1);
    expect(() => Thureos91.decode(corrupted, key)).toThrow();
  });

  test('It should fail with an incorrect password.', () => {
    const encoded = Thureos91.encode(text, key);
    expect(() => Thureos91.decode(encoded, "wrong-pass")).toThrow();
  });

  test('It should process binary data correctly.', () => {
    const bin = new Uint8Array([0x00, 0xFF, 0xAA, 0x55]);
    const encoded = Thureos91.encode(bin, key);
    const decoded = Thureos91.decode(encoded, key);
    expect(decoded).toEqual(bin);
  });
});