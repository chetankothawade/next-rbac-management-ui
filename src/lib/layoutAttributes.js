export const DEFAULT_LAYOUT_MODE = "light";

export const DEFAULT_LAYOUT_ATTRIBUTES = {
  "data-layout": "vertical",
  "data-topbar": "light",
  "data-sidebar": "light",
  "data-sidebar-size": "lg",
  "data-sidebar-image": "none",
  "data-preloader": "disable",
  "data-layout-mode": DEFAULT_LAYOUT_MODE,
};

export function resolveLayoutMode(mode) {
  return mode === "dark" ? "dark" : DEFAULT_LAYOUT_MODE;
}

export function readStoredLayoutMode() {
  if (typeof window === "undefined") {
    return DEFAULT_LAYOUT_MODE;
  }

  return resolveLayoutMode(sessionStorage.getItem("data-layout-mode"));
}

export function getDocumentLayoutMode() {
  if (typeof document === "undefined") {
    return DEFAULT_LAYOUT_MODE;
  }

  return resolveLayoutMode(
    document.documentElement.getAttribute("data-layout-mode")
  );
}

export function applyLayoutAttributes(overrides = {}) {
  if (typeof document === "undefined") {
    return;
  }

  const nextAttributes = {
    ...DEFAULT_LAYOUT_ATTRIBUTES,
    ...overrides,
  };

  Object.entries(nextAttributes).forEach(([key, value]) => {
    document.documentElement.setAttribute(key, value);
  });
}
