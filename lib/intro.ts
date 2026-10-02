/**
 * Tiny signal shared by the Loader and anything that should wait for it
 * (the hero reveal). Fires once per full page load.
 */
let done = false;
const listeners = new Set<() => void>();

export function onIntroDone(cb: () => void) {
  if (done) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((cb) => cb());
  listeners.clear();
}
