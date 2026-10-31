// All API endpoint bases begin with /api/ and end with /. Vite proxies this prefix.
export const API_PREFIX = '/api/';

// Pages use this prefix in the browser address bar.
export const SHARE_PAGE_PREFIX = '/~/';

// Go serves folder listings and file bytes here.
export const SHARE_API_PREFIX = `${API_PREFIX}share/`;

// Server details shown on the home page.
export const INFO_API_PREFIX = `${API_PREFIX}info/`;

// QR image for the share URL; pass the URL in the `url` query parameter.
export const QR_API_PREFIX = `${API_PREFIX}qr/`;
