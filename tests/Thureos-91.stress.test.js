import Thureos91 from '../src/Thureos91.js';

describe('Thureos-91 Protocol - Stress & Integrity Lab', () => {
  
  const PASS = "thureos-vanguard-high-security-2026";

  test('High Volume Stress: 10,000 random cycles', () => {
    for (let i = 0; i < 10000; i++) {
      // Long 1 and 512 bytes
      const length = Math.floor(Math.random() * 512) + 1;
      const randomBuffer = new Uint8Array(length);
      for (let j = 0; j < length; j++) {
        randomBuffer[j] = Math.floor(Math.random() * 256);
      }
      
      const originalText = new TextDecoder().decode(randomBuffer);
      
      const shielded = Thureos91.encode(originalText, PASS);
      const recovered = Thureos91.decode(shielded, PASS);
      const recoveredText = new TextDecoder().decode(recovered);
      
      expect(recoveredText).toBe(originalText);
    }
  });

  test('Heavy Payload: 1,000,000 bytes integrity', () => {
    const heavyData = "StrongTower".repeat(100000); // ~1.1MB
    
    const shielded = Thureos91.encode(heavyData, PASS);
    
    expect(shielded).toContain('"');
    
    const recovered = Thureos91.decode(shielded, PASS);
    const recoveredText = new TextDecoder().decode(recovered);
    
    expect(recoveredText).toBe(heavyData);
    expect(recoveredText.length).toBe(heavyData.length);
  });

  test('Tamper Detection under Stress', () => {
    const data = "Sensitive military-grade information";
    const shielded = Thureos91.encode(data, PASS);
    
    const parts = shielded.split('"');
    const corruptedBody = parts[0].substring(0, 5) + 
                         (parts[0][5] === 'A' ? 'B' : 'A') + 
                         parts[0].substring(6);
    
    const corruptedShield = `${corruptedBody}"${parts[1]}`;
    
    expect(() => {
      Thureos91.decode(corruptedShield, PASS);
    }).toThrow("Integrity Error");
  });
});