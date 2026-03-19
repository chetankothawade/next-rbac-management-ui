"use client";

import { useEffect, useState } from "react";

import {
  DEFAULT_LAYOUT_MODE,
  applyLayoutAttributes,
  getDocumentLayoutMode,
  readStoredLayoutMode,
  resolveLayoutMode,
} from "../lib/layoutAttributes";

export default function useLayoutTheme() {
  const [layoutMode, setLayoutMode] = useState(() =>
    typeof window === "undefined"
      ? DEFAULT_LAYOUT_MODE
      : resolveLayoutMode(readStoredLayoutMode() || getDocumentLayoutMode())
  );

  useEffect(() => {
    const nextMode = resolveLayoutMode(layoutMode);

    applyLayoutAttributes({
      "data-layout-mode": nextMode,
    });
    sessionStorage.setItem("data-layout-mode", nextMode);
  }, [layoutMode]);

  return { layoutMode, setLayoutMode };
}
