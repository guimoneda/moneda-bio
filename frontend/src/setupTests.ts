import '@testing-library/jest-dom';

// jsdom implements neither of these, and the design system depends on both:
// `matchMedia` drives the reduced-motion branch, `ResizeObserver` drives the
// hero canvas.
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

window.scrollTo = (() => {}) as typeof window.scrollTo;

// jsdom has no 2D canvas implementation and reports an uncaught exception when
// `getContext` is called. The hero's signal grid is purely decorative, so tests
// get a no-op context rather than pulling in the native `canvas` package.
const noopContext = new Proxy(
  {
    canvas: null,
    createLinearGradient: () => ({ addColorStop: () => {} }),
  },
  { get: (target, prop) => (prop in target ? (target as never)[prop] : () => {}) }
);

HTMLCanvasElement.prototype.getContext = (() =>
  noopContext) as unknown as HTMLCanvasElement['getContext'];

// Motion's `whileInView` needs an IntersectionObserver; jsdom has none. The stub
// reports every observed element as fully visible so entry states settle at once.
if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    constructor(private callback: IntersectionObserverCallback) {}
    observe(target: Element) {
      this.callback(
        [{ target, isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver
      );
    }
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
}
