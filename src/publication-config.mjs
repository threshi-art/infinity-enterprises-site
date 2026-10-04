/**
 * Publication identity configuration.
 * 
 * PUBLICATION_NAME is the canonical name used throughout the site.
 * Current value "SAVRONO" is a working name (not legally cleared).
 * See #107 and #140 for name clearance and finalization.
 * 
 * To rename: change PUBLICATION_NAME below, run `npm ci && npm run build && npm test`.
 */

export const PUBLICATION_NAME = 'SAVRONO';
export const PARENT_NAME = 'Infinity Enterprises';
export const PUBLICATION_NAME_STATUS = 'working-name';

/**
 * Replace __PUBLICATION_NAME__ token with the publication name (HTML-escaped).
 * 
 * Use this placeholder in HTML text and attributes only.
 * Do NOT use it inside <script> JSON-LD (requires JSON encoding)
 * or RSS XML (requires XML encoding). Those stay on the parent name
 * until a separate change handles their encoding requirements.
 * 
 * @param {string} html - HTML content with __PUBLICATION_NAME__ tokens
 * @param {string} name - The publication name to insert (defaults to PUBLICATION_NAME)
 * @returns {string} HTML with tokens replaced
 * @throws {Error} If name is empty or not a string
 */
export function applyPublicationName(html, name = PUBLICATION_NAME) {
  if (typeof name !== 'string' || name.length === 0) {
    throw new Error('Publication name must be a non-empty string');
  }
  
  const escaped = name.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
  
  return html.replaceAll('__PUBLICATION_NAME__', escaped);
}
