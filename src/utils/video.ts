/** React does not reliably set the `muted` attribute, and iOS/Android refuse to autoplay unless it is set. */
export function forceMuted(v: HTMLVideoElement) {
  v.muted = true;
  v.defaultMuted = true;
  v.setAttribute('muted', '');
  v.setAttribute('playsinline', '');
  v.setAttribute('webkit-playsinline', '');
}
