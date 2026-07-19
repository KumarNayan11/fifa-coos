"use client";

import { useEffect, useState } from "react";
import { subscribeToAnnouncements, Announcement } from "@/lib/accessibility/announcements";

/**
 * FIFACoOS — Live Region Component
 *
 * Visually hidden component that announces text to screen readers.
 * Handles both polite and assertive priorities.
 */
export function LiveRegion() {
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToAnnouncements((announcement: Announcement) => {
      // Force a re-render for identical messages by clearing briefly if needed,
      // or simply rely on the DOM text update. Screen readers sometimes need
      // a slight change to re-announce identical strings. Using a zero-width space trick
      // or just setting it is usually enough if it's identical, but let's clear it and set it.

      const setFn = announcement.priority === "assertive" ? setAssertiveMessage : setPoliteMessage;

      setFn("");

      // Use setTimeout to allow the empty string to render, then set the actual message
      setTimeout(() => {
        setFn(announcement.message);
      }, 50);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="sr-only">
      <div aria-live="polite" aria-atomic="true">
        {politeMessage}
      </div>
      <div aria-live="assertive" aria-atomic="true">
        {assertiveMessage}
      </div>
    </div>
  );
}
