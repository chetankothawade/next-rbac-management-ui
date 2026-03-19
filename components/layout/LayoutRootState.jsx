"use client";

import { useEffect } from "react";

import {
  applyLayoutAttributes,
  readStoredLayoutMode,
} from "@/src/lib/layoutAttributes";

export default function LayoutRootState() {
  useEffect(() => {
    applyLayoutAttributes({
      "data-layout-mode": readStoredLayoutMode(),
    });
  }, []);

  return null;
}
