import Thureos91 from '../src/Thureos91.js';

async function runSmokeTest() {
  const original = "Strong Tower Protocol 2026";
  const pass = "vanguard-key";
  
  try {
    console.log("🛡️ Starting Thureos-91 Smoke Test...");
    
    // 1. Encoding Test
    const shielded = Thureos91.encode(original, pass);
    if (!shielded.includes('"')) throw new Error("Invalid shield format.");

    // 2. Integrity Test (Simulated Hack)
    const tampered = shielded.replace(shielded[0], shielded[0] === 'A' ? 'B' : 'A');
    try {
      Thureos91.decode(tampered, pass);
      throw new Error("Critical Failure: Shield did not detect manipulation.");
    } catch (e) {
      // Adjusted to match the standard English error message
      if (e.message !== "Thureos-91: Integrity Error.") throw e;
      console.log("✅ Integrity verified: Manipulation detected correctly.");
    }

    // 3. Recovery Test
    const recovered = Thureos91.decode(shielded, pass);
    const decodedText = new TextDecoder().decode(recovered);
    
    if (decodedText !== original) throw new Error("Failure: Recovered message is different.");

    console.log("✨ SMOKE TEST PASSED: Shield is stable.");
    process.exit(0); // Success
  } catch (error) {
    console.error(`🛑 SMOKE TEST FAILED: ${error.message}`);
    process.exit(1); // Error (stops npm processes)
  }
}

runSmokeTest();