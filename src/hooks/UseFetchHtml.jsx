import { useEffect, useState, useCallback, useRef } from "react";
import DOMPurify from "dompurify";
import http from "../utils/http";

export function UseFetchHtml(
  url,
  {
    sanitize = true,
    autoFetch = true,
    fetchOptions = {},
  } = {}
) {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchedOnce = useRef(false);
  const stableFetchOptions = useRef(fetchOptions);

  const fetchHtml = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const res = await http.get(url, {
        responseType: "text",
        ...stableFetchOptions.current,
      });

      const content = res.data;

      setHtml(sanitize ? DOMPurify.sanitize(content) : content);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Failed to fetch HTML"
      );
    } finally {
      setLoading(false);
    }
  }, [url, sanitize]);

  useEffect(() => {
    if (!autoFetch || fetchedOnce.current) return;

    fetchedOnce.current = true;
    fetchHtml();
  }, [fetchHtml, autoFetch]);

  return {
    html,
    loading,
    error,
    refetch: fetchHtml,
    setHtml,
  };
}


// Usage Example – HTML Preview Component
// import React from "react";
// import { UseFetchHtml } from "../hooks/UseFetchHtml";
// function HtmlPreview() {
//   const { html, loading, error } = UseFetchHtml("/email/template/1");

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div dangerouslySetInnerHTML={{ __html: html }} />
//   );

// }

// export default HtmlPreview;

