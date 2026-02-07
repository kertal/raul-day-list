// Polyfill crypto.getRandomValues for JSDOM test environment
const nodeCrypto = require('crypto');

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (buffer: Uint8Array) => nodeCrypto.randomFillSync(buffer),
  },
});
