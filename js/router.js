/** Thin navigate helper — avoids circular deps */
export function navigate(path) {
  window.location.hash = '#' + path;
}
export function getHash() {
  return decodeURIComponent(window.location.hash.slice(1) || '/');
}
