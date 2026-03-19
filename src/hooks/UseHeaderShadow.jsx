"use client";

import { useEffect, useState } from "react";

export default function useHeaderShadow() {
  const [headerClass, setHeaderClass] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      setHeaderClass(scrollTop > 50 ? "topbar-shadow" : "");
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  return headerClass;
}
