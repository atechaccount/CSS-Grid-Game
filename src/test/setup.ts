import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// React 19 + vitest without globals: Testing Library's act needs this flag.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Controllable stand-in for the viewport, shared by window.matchMedia, window.innerWidth, and
 * window.innerHeight. Tests call setViewport() before rendering; useMediaQuery reads the mock at
 * mount, so a viewport change takes effect on the next render, exactly like a real resize for a
 * freshly mounted tree.
 */
const viewport = { width: 1280, height: 800 };

export function setViewport(width: number, height = 800): void {
  viewport.width = width;
  viewport.height = height;
  window.innerWidth = width;
  window.innerHeight = height;
}

function queryMatches(query: string): boolean {
  const m = query.trim().match(/^\((min|max)-(width|height):\s*([\d.]+)px\)$/);
  if (!m) return false;
  const [, bound, axis, raw] = m;
  const actual = axis === "width" ? viewport.width : viewport.height;
  const value = parseFloat(raw);
  return bound === "min" ? actual >= value : actual <= value;
}

window.matchMedia = ((query: string) => {
  const listeners = new Set<() => void>();
  return {
    matches: queryMatches(query),
    media: query,
    onchange: null,
    addListener: (listener: () => void) => listeners.add(listener),
    removeListener: (listener: () => void) => listeners.delete(listener),
    addEventListener: (_type: string, listener: EventListener) =>
      listeners.add(listener as () => void),
    removeEventListener: (_type: string, listener: EventListener) =>
      listeners.delete(listener as () => void),
    dispatchEvent: () => {
      listeners.forEach((listener) => listener());
      return true;
    },
  };
}) as typeof window.matchMedia;

// jsdom has no layout engine and no ResizeObserver; the dock overlay only reads computed tracks.
class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
window.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

// CodeMirror and the pane code call this on focus/scroll paths; jsdom does not implement it.
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView ?? ((): void => {});

// CodeMirror measures text ranges during editing; jsdom's Range lacks the geometry members.
const rangeProto = Range.prototype as unknown as Record<string, (() => unknown) | undefined>;
const zeroRect = {
  x: 0,
  y: 0,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0,
  toJSON: () => ({}),
};
if (!rangeProto.getClientRects) {
  rangeProto.getClientRects = () =>
    [] as unknown as DOMRectList;
}
if (!rangeProto.getBoundingClientRect) {
  rangeProto.getBoundingClientRect = () => zeroRect as DOMRect;
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  window.history.replaceState(null, "", "/");
});
