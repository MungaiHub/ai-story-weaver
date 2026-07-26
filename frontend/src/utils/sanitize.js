/**
 * sanitize.js
 *
 * Treats all AI-generated (and user-submitted) text as untrusted.
 * We use a minimal allow-list approach: strip every HTML tag entirely,
 * then normalise whitespace. This is intentionally strict — the app
 * renders story content as plain text, not HTML, so we never need tags.
 *
 * This keeps the bundle lean (no heavy DOMPurify dependency required when
 * content is rendered as text nodes), but the function can be swapped for
 * DOMPurify.sanitize() if rich-HTML rendering is ever added.
 */

const TAG_RE = /<[^>]*>/g;
const SCRIPT_PROTOCOL_RE = /javascript\s*:/gi;
const NULL_BYTE_RE = /\0/g;

/**
 * Sanitize a string that originates from the LLM or any untrusted source.
 * Safe to pass to React's children prop as plain text.
 *
 * @param {string} str
 * @returns {string}
 */
export function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(NULL_BYTE_RE, '')
    .replace(SCRIPT_PROTOCOL_RE, '')
    .replace(TAG_RE, '')
    .trim();
}
