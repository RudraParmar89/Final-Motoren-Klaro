export function resolveImageUrl(url?: string | null) {
  if (!url) return '';
  const trimmed = url.trim();
  // If already absolute, return as-is
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  // If it's an absolute path on the current host (starts with '/'), prefix origin
  if (trimmed.startsWith('/')) {
    try {
      return `${window.location.origin}${trimmed}`;
    } catch (e) {
      // In environments without window (SSR), return the path unchanged
      return trimmed;
    }
  }

  // Otherwise assume relative path and prefix origin + '/'
  try {
    return `${window.location.origin}/${trimmed}`;
  } catch (e) {
    return trimmed;
  }
}
