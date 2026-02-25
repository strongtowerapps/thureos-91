const ALPHABET_CORRECT = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+,-./:;<=>?@[]^_`{|}~";
const ALPHABET_BUGGY = ALPHABET_CORRECT + ";";

function checkIntegrity(alphabet, label) {
    console.log(`\n🚀 Verifying alphabet integrity: ${label} (${alphabet.length} characters)...`);
    
    let errors = 0;

    for (let i = 0; i < alphabet.length; i++) {
        const char = alphabet[i];
        const decodedIndex = alphabet.indexOf(char);

        if (decodedIndex !== i) {
            console.error(`❌ COLLISION DETECTED at index ${i}:`);
            console.error(`- Character: '${char}'`);
            console.error(`- Recovered as index: ${decodedIndex} (Original: ${i})`);
            errors++;
        }
    }

    if (errors === 0) {
        console.log(`✅ TEST PASSED: The alphabet ${label} is integral and unique.`);
    } else {
        console.error(`🛑 FAILURE DETECTED: The alphabet ${label} contains ${errors} collisions.`);
    }
}

checkIntegrity(ALPHABET_CORRECT, "CORRECT");

checkIntegrity(ALPHABET_BUGGY, "BUGGY");