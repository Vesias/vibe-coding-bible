// Global polyfills for SSR
if (typeof global === 'undefined') {
  globalThis.global = globalThis;
}

if (typeof self === 'undefined') {
  globalThis.self = globalThis;
}

if (typeof window === 'undefined' && typeof globalThis !== 'undefined') {
  globalThis.window = globalThis;
}