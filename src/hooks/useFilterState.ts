"use client";

import { useState, useCallback } from "react";
import { Priority, TodoStatus } from "@/types/todo";
import { SortOption } from "@/lib/constants";
import { FilterParams } from "./useFilteredTodos";

const DEFAULT_FILTERS: FilterParams = {
  search: "",
  status: "all",
  categoryId: "all",
  priority: "all",
  sort: "manual",
};

export function useFilterState() {
  const [filters, setFilters] = useState<FilterParams>(DEFAULT_FILTERS);

  const setSearch = useCallback(
    (search: string) => setFilters((f) => ({ ...f, search })),
    []
  );

  const setStatus = useCallback(
    (status: TodoStatus | "all") => setFilters((f) => ({ ...f, status })),
    []
  );

  const setCategoryId = useCallback(
    (categoryId: string | "all" | "uncategorized") =>
      setFilters((f) => ({ ...f, categoryId })),
    []
  );

  const setPriority = useCallback(
    (priority: Priority | "all") => setFilters((f) => ({ ...f, priority })),
    []
  );

  const setSort = useCallback(
    (sort: SortOption) => setFilters((f) => ({ ...f, sort })),
    []
  );

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return {
    filters,
    setSearch,
    setStatus,
    setCategoryId,
    setPriority,
    setSort,
    resetFilters,
  };
}
