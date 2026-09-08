---
name: Hero video browser compatibility
description: Why the original hero footage has a web-compatible derivative and poster frame.
---

The original hero footage is encoded as 10-bit H.264, which can remain black in browser preview even though the file is valid. Use an 8-bit H.264 yuv420p derivative for the web hero and a representative poster frame from the same footage so the hero is visible before playback starts.

**Why:** The browser preview did not reliably decode the original 10-bit stream, while the derived version rendered correctly without changing the footage.

**How to apply:** Preserve the original source asset, serve the browser-compatible derivative for the hero, and keep the poster frame tied to that same source video rather than substituting unrelated or AI-generated imagery.