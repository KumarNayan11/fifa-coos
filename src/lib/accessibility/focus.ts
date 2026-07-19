/**
 * FIFACoOS — Focus Management
 *
 * Helpers for saving and restoring focus across application state changes
 * (e.g. opening/closing dialogs or completing async tasks).
 */

let savedFocusElement: HTMLElement | null = null;

/**
 * Saves the currently focused element so it can be restored later.
 */
export function saveFocus() {
  if (document.activeElement instanceof HTMLElement) {
    savedFocusElement = document.activeElement;
  }
}

/**
 * Restores focus to the previously saved element.
 * Safe to call even if saveFocus() wasn't called.
 */
export function restoreFocus() {
  if (savedFocusElement) {
    // Check if element is still in the DOM
    if (document.body.contains(savedFocusElement)) {
      savedFocusElement.focus();
    }
    savedFocusElement = null;
  }
}

/**
 * Focuses an element by its ID. Useful for programmatic skip links.
 */
export function focusElementById(id: string) {
  const el = document.getElementById(id);
  if (el) {
    // If element is not naturally focusable, make it temporarily focusable
    if (!el.hasAttribute("tabindex")) {
      el.setAttribute("tabindex", "-1");
      // Optional: remove tabindex on blur to avoid polluting tab sequence
      el.addEventListener(
        "blur",
        () => {
          el.removeAttribute("tabindex");
        },
        { once: true },
      );
    }
    el.focus();
  }
}
