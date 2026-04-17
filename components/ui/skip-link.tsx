"use client";

import React from "react";

/**
 * Skip to Content Link
 * Provides keyboard users a way to skip navigation and jump to main content
 * Should be first focusable element on page
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="absolute left-0 top-0 z-50 -translate-y-full bg-blue-600 px-4 py-2 text-white font-semibold focus:translate-y-0 transition-transform"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
}
