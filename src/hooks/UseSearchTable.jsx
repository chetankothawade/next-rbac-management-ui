// src/hooks/UseSearchTable.js
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "use-debounce";

const UseSearchTable = (debounceTime = 1000) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initial search from URL
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);

  // Debounce search input
  const [debouncedSearch] = useDebounce(search, debounceTime);

  // Keep URL updated when debounced search changes
  useEffect(() => {
    const params = {};

    if (debouncedSearch) params.search = debouncedSearch;

    // Preserve other params like page
    const page = searchParams.get("page");
    if (page) params.page = page;

    setSearchParams(params, { replace: true });
  }, [debouncedSearch, searchParams, setSearchParams]); // ✅ include missing dependencies

  return { search, setSearch, debouncedSearch };
};

export default UseSearchTable;
