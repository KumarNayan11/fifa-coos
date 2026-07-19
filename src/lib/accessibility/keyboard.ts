/**
 * FIFACoOS — Keyboard Accessibility Utilities
 *
 * Helpers for keyboard navigation, focus trapping, and element discovery.
 */

const FOCUSABLE_ELEMENT_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Returns all tabbable elements within a given container.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENT_SELECTOR)).filter(
    (el) => {
      // Exclude visually hidden or detached elements
      return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
    },
  );
}

/**
 * Traps focus within a container, typically used for modals or dialogs.
 * Returns a keydown event listener.
 */
export function createFocusTrap(container: HTMLElement) {
  return function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== "Tab") return;

    const focusableEls = getFocusableElements(container);
    if (focusableEls.length === 0) {
      e.preventDefault();
      return;
    }

    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        lastEl.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastEl) {
        firstEl.focus();
        e.preventDefault();
      }
    }
  };
}
