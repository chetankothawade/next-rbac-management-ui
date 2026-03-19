"use client";

import { useCallback, useEffect, useMemo } from "react";
import NextLink from "next/link";
import {
  useParams as useNextParams,
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";

export function BrowserRouter({ children }) {
  return children;
}

export function Routes({ children }) {
  return children;
}

export function Route() {
  return null;
}

export function Link({ to, href, children, ...props }) {
  const nextHref = href ?? to ?? "#";
  return (
    <NextLink href={nextHref} {...props}>
      {children}
    </NextLink>
  );
}

export function Navigate({ to, replace = false }) {
  const router = useRouter();

  useEffect(() => {
    if (!to) {
      return;
    }

    if (replace) {
      router.replace(to);
      return;
    }

    router.push(to);
  }, [router, to, replace]);

  return null;
}

export function useNavigate() {
  const router = useRouter();

  return useCallback(
    (to, options = {}) => {
      if (options?.replace) {
        router.replace(to);
        return;
      }

      router.push(to);
    },
    [router]
  );
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useNextSearchParams();
  const search = searchParams.toString();

  return useMemo(
    () => ({
      pathname,
      search: search ? `?${search}` : "",
      hash: "",
      key: pathname,
    }),
    [pathname, search]
  );
}

export function useParams() {
  return useNextParams();
}

function appendSearchParams(target, source) {
  if (!source) {
    return;
  }

  if (source instanceof URLSearchParams) {
    source.forEach((value, key) => {
      if (value !== "") {
        target.set(key, value);
      }
    });
    return;
  }

  if (Array.isArray(source)) {
    source.forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        target.set(key, String(value));
      }
    });
    return;
  }

  Object.entries(source).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      target.set(key, String(value));
    }
  });
}

export function useSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useNextSearchParams();

  const currentParams = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams]
  );

  const setSearchParams = useCallback(
    (nextInit, options = {}) => {
      const base = new URLSearchParams(searchParams.toString());
      const resolved =
        typeof nextInit === "function" ? nextInit(base) : nextInit;
      const nextParams = new URLSearchParams();

      appendSearchParams(nextParams, resolved);

      const query = nextParams.toString();
      const href = query ? `${pathname}?${query}` : pathname;

      if (options?.replace) {
        router.replace(href);
        return;
      }

      router.push(href);
    },
    [router, pathname, searchParams]
  );

  return [currentParams, setSearchParams];
}
