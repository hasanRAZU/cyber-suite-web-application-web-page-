// Helper: delay for visualization steps
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Event listeners for mode switch show/hide
document.querySelectorAll('input[name="mode"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const mode = getMode();
    document.getElementById('single-cipher-section').style.display = mode === 'single' ? 'block' : 'none';
    document.getElementById('multiple-cipher-section').style.display = mode === 'multiple' ? 'block' : 'none';
    clearVisualization();
    clearOutput();
  });
});

function getMode() {
  return document.querySelector('input[name="mode"]:checked').value;
}

function getSelectedCiphers() {
  if (getMode() === 'single') {
    return [document.getElementById('cipher-single').value];
  } else {
    return Array.from(document.querySelectorAll('input[name="cipher-multiple"]:checked')).map(cb => cb.value);
  }
}

function clearVisualization() {
  document.getElementById('visualization').innerHTML = '';
}

function clearOutput() {
  document.getElementById('output').value = '';
}

function showVisualizationStep(cipherName, stepDescription, result) {
  const viz = document.getElementById('visualization');
  const stepDiv = document.createElement('div');
  stepDiv.className = 'visualization-step';
  stepDiv.innerHTML = `<h4>${cipherName} Step:</h4><div>${stepDescription}</div><div><strong>Result:</strong> ${result}</div>`;
  viz.appendChild(stepDiv);
  viz.scrollTop = viz.scrollHeight;
}

function showBlankLine() {
  const viz = document.getElementById('visualization');
  const blank = document.createElement('div');
  blank.innerHTML = `<br>`;
  viz.appendChild(blank);
}

function showCipherSeparator() {
  const viz = document.getElementById('visualization');
  const separator = document.createElement('div');
  separator.innerHTML = `<hr style="margin: 20px 0; border: 1px dashed #aaa;">`;
  viz.appendChild(separator);
  viz.scrollTop = viz.scrollHeight;
}

// ======== Cipher Implementations ========

function playfairEncrypt(key, plaintext) {
  const steps = [];
  let result = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
  steps.push({desc: 'Cleaned plaintext', res: result});
  result = result.split('').reverse().join('');
  steps.push({desc: 'Reversed string as encrypted text', res: result});
  return steps;
}

function playfairDecrypt(key, ciphertext) {
  const steps = [];
  let result = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
  steps.push({desc: 'Cleaned ciphertext', res: result});
  result = result.split('').reverse().join('');
  steps.push({desc: 'Reversed string as decrypted text', res: result});
  return steps;
}

function vigenereEncrypt(key, plaintext) {
  const steps = [];
  const cleanText = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  steps.push({desc: 'Cleaned plaintext & key', res: `Plaintext: ${cleanText}, Key: ${cleanKey}`});
  let result = '';
  for(let i=0; i<cleanText.length; i++) {
    let ptChar = cleanText.charCodeAt(i) - 65;
    let keyChar = cleanKey.charCodeAt(i % cleanKey.length) - 65;
    let cipherChar = (ptChar + keyChar) % 26;
    result += String.fromCharCode(cipherChar + 65);
    steps.push({desc: `Encrypt '${cleanText[i]}' with key '${cleanKey[i % cleanKey.length]}'`, res: result});
  }
  return steps;
}

function vigenereDecrypt(key, ciphertext) {
  const steps = [];
  const cleanText = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  steps.push({desc: 'Cleaned ciphertext & key', res: `Ciphertext: ${cleanText}, Key: ${cleanKey}`});
  let result = '';
  for(let i=0; i<cleanText.length; i++) {
    let ctChar = cleanText.charCodeAt(i) - 65;
    let keyChar = cleanKey.charCodeAt(i % cleanKey.length) - 65;
    let ptChar = (ctChar - keyChar + 26) % 26;
    result += String.fromCharCode(ptChar + 65);
    steps.push({desc: `Decrypt '${cleanText[i]}' with key '${cleanKey[i % cleanKey.length]}'`, res: result});
  }
  return steps;
}

function autokeyEncrypt(key, plaintext) {
  const steps = [];
  const cleanText = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
  let cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  steps.push({desc: 'Cleaned plaintext & key', res: `Plaintext: ${cleanText}, Key: ${cleanKey}`});
  let keyStream = cleanKey + cleanText;
  let result = '';
  for(let i=0; i<cleanText.length; i++) {
    let ptChar = cleanText.charCodeAt(i) - 65;
    let keyChar = keyStream.charCodeAt(i) - 65;
    let cipherChar = (ptChar + keyChar) % 26;
    result += String.fromCharCode(cipherChar + 65);
    steps.push({desc: `Encrypt '${cleanText[i]}' with '${keyStream[i]}'`, res: result});
  }
  return steps;
}

function autokeyDecrypt(key, ciphertext) {
  const steps = [];
  const cleanText = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
  let cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  steps.push({desc: 'Cleaned ciphertext & key', res: `Ciphertext: ${cleanText}, Key: ${cleanKey}`});
  let result = '';
  let keyStream = cleanKey;
  for(let i=0; i<cleanText.length; i++) {
    let ctChar = cleanText.charCodeAt(i) - 65;
    let keyChar = (i < keyStream.length) ? keyStream.charCodeAt(i) - 65 : result.charCodeAt(i - keyStream.length) - 65;
    let ptChar = (ctChar - keyChar + 26) % 26;
    let ptCharLetter = String.fromCharCode(ptChar + 65);
    result += ptCharLetter;
    if (i >= keyStream.length) keyStream += ptCharLetter;
    steps.push({desc: `Decrypt '${cleanText[i]}' with '${String.fromCharCode(keyChar + 65)}'`, res: result});
  }
  return steps;
}

function aesEncrypt(key, plaintext) {
  const steps = [];
  steps.push({desc: 'AES encryption starting', res: ''});
  const encrypted = CryptoJS.AES.encrypt(plaintext, key).toString();
  steps.push({desc: 'AES encrypted result', res: encrypted});
  return steps;
}

function aesDecrypt(key, ciphertext) {
  const steps = [];
  steps.push({desc: 'AES decryption starting', res: ''});
  try {
    const decrypted = CryptoJS.AES.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);
    steps.push({desc: 'AES decrypted result', res: decrypted});
  } catch (e) {
    steps.push({desc: 'AES decryption error', res: e.message});
  }
  return steps;
}

// Mapping
const cipherFunctions = {
  playfair: { encrypt: playfairEncrypt, decrypt: playfairDecrypt },
  vigenere: { encrypt: vigenereEncrypt, decrypt: vigenereDecrypt },
  autokey: { encrypt: autokeyEncrypt, decrypt: autokeyDecrypt },
  aes: { encrypt: aesEncrypt, decrypt: aesDecrypt }
};

// Encrypt button
async function handleEncrypt() {
  clearVisualization();
  clearOutput();

  const key = document.getElementById('key').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!key || !message) return alert('Please enter both key and message.');

  const mode = getMode();
  let finalResult = message;

  if (mode === 'single') {
    const cipher = getSelectedCiphers()[0];
    if (!(cipher in cipherFunctions)) return alert('Unsupported cipher.');
    const steps = cipherFunctions[cipher].encrypt(key, message);
    for (const step of steps) {
      showVisualizationStep(cipher, step.desc, step.res);
      await delay(700);
    }
    showBlankLine();
    showCipherSeparator();
    finalResult = steps[steps.length - 1].res;
  } else {
    const ciphers = getSelectedCiphers();
    if (ciphers.length === 0) return alert('Select at least one cipher.');

    let currentText = message;
    for (const cipher of ciphers) {
      const steps = cipherFunctions[cipher].encrypt(key, currentText);
      for (const step of steps) {
        showVisualizationStep(cipher, step.desc, step.res);
        await delay(700);
      }
      currentText = steps[steps.length - 1].res;
      showBlankLine();
      showCipherSeparator();
    }
    finalResult = currentText;
  }

  document.getElementById('output').value = finalResult;
}

// Decrypt button
async function handleDecrypt() {
  clearVisualization();
  clearOutput();

  const key = document.getElementById('key').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!key || !message) return alert('Please enter both key and message.');

  const mode = getMode();
  let finalResult = message;

  if (mode === 'single') {
    const cipher = getSelectedCiphers()[0];
    if (!(cipher in cipherFunctions)) return alert('Unsupported cipher.');
    const steps = cipherFunctions[cipher].decrypt(key, message);
    for (const step of steps) {
      showVisualizationStep(cipher, step.desc, step.res);
      await delay(700);
    }
    showBlankLine();
    showCipherSeparator();
    finalResult = steps[steps.length - 1].res;
  } else {
    const ciphers = getSelectedCiphers().reverse();
    if (ciphers.length === 0) return alert('Select at least one cipher.');

    let currentText = message;
    for (const cipher of ciphers) {
      const steps = cipherFunctions[cipher].decrypt(key, currentText);
      for (const step of steps) {
        showVisualizationStep(cipher, step.desc, step.res);
        await delay(700);
      }
      currentText = steps[steps.length - 1].res;
      showBlankLine();
      showCipherSeparator();
    }
    finalResult = currentText;
  }

  document.getElementById('output').value = finalResult;
}
