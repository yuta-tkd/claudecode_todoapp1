"use client";

import { useMemo } from "react";
import { Todo, Priority, TodoStatus } from "@/types/todo";
import { PRIORITY_CONFIG } from "@/lib/constants";
import { SortOption } from "@/lib/constants";

export interface FilterParams {
  search: string;
  status: TodoStatus | "all";
  categoryId: string | "all" | "uncategorized";
  priority: Priority | "all";
  sort: SortOption;
}

export function useFilteredTodos(
  todos: Todo[],
  filters: FilterParams
): Todo[] {
  return useMemo(() => {
    let result = [...todos];

    if (filters.status !== "all") {
      result = result.filter((t) => t.status === filters.status);
    }

    if (filters.categoryId === "uncategorized") {
      result = result.filter((t) => t.categoryId === null);
    } else if (filters.categoryId !== "all") {
      result = result.filter((t) => t.categoryId === filters.categoryId);
    }

    if (filters.priority !== "all") {
      result = result.filter((t) => t.priority === filters.priority);
    }

    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    switch (filters.sort) {
      case "dueDate":
        result.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        });
        break;
      case "priority":
        result.sort(
          (a, b) =>
            PRIORITY_CONFIG[a.priority].order -
            PRIORITY_CONFIG[b.priority].order
        );
        break;
      case "createdAt":
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case "manual":
        result.sort((a, b) => a.sortOrder - b.sortOrder);
        break;
    }

    return result;
  }, [todos, filters]);
}
