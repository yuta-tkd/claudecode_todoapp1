"use client";

import { Category, Priority, TodoStatus } from "@/types/todo";
import { PRIORITY_CONFIG, SORT_OPTIONS, SortOption, CATEGORY_COLORS } from "@/lib/constants";
import { FilterParams } from "@/hooks/useFilteredTodos";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  filters: FilterParams;
  onStatusChange: (status: TodoStatus | "all") => void;
  onCategoryChange: (categoryId: string | "all" | "uncategorized") => void;
  onPriorityChange: (priority: Priority | "all") => void;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
  onAddCategory: () => void;
  onEditCategory: (cat: { id: string; name: string; color: string }) => void;
  onDeleteCategory: (id: string, name: string) => void;
  todoCounts: { all: number; incomplete: number; complete: number };
}

export function Sidebar({
  open,
  onClose,
  categories,
  filters,
  onStatusChange,
  onCategoryChange,
  onPriorityChange,
  onSortChange,
  onResetFilters,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  todoCounts,
}: SidebarProps) {
  const statusOptions: { value: TodoStatus | "all"; label: string; count: number }[] = [
    { value: "all", label: "すべて", count: todoCounts.all },
    { value: "incomplete", label: "未完了", count: todoCounts.incomplete },
    { value: "complete", label: "完了", count: todoCounts.complete },
  ];

  const priorityOptions: { value: Priority | "all"; label: string }[] = [
    { value: "all", label: "すべて" },
    ...Object.entries(PRIORITY_CONFIG).map(([key, config]) => ({
      value: key as Priority,
      label: config.label,
    })),
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      {/* ステータスフィルタ */}
      <section className="mb-6">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          ステータス
        </h3>
        <div className="space-y-0.5">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors",
                filters.status === opt.value
                  ? "bg-blue-50 font-medium text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <span>{opt.label}</span>
              <span className="text-xs text-gray-400">{opt.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* カテゴリフィルタ */}
      <section className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            カテゴリ
          </h3>
          <button
            onClick={onAddCategory}
            className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="カテゴリを追加"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <div className="space-y-0.5">
          <button
            onClick={() => onCategoryChange("all")}
            className={cn(
              "flex w-full items-center rounded-lg px-3 py-1.5 text-sm transition-colors",
              filters.categoryId === "all"
                ? "bg-blue-50 font-medium text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            すべて
          </button>
          <button
            onClick={() => onCategoryChange("uncategorized")}
            className={cn(
              "flex w-full items-center rounded-lg px-3 py-1.5 text-sm transition-colors",
              filters.categoryId === "uncategorized"
                ? "bg-blue-50 font-medium text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            未分類
          </button>
          {categories.map((cat) => {
            const colorConfig = CATEGORY_COLORS.find((c) => c.name === cat.color);
            return (
              <div key={cat.id} className="group flex items-center">
                <button
                  onClick={() => onCategoryChange(cat.id)}
                  className={cn(
                    "flex flex-1 items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors",
                    filters.categoryId === cat.id
                      ? "bg-blue-50 font-medium text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-2.5 w-2.5 rounded-full",
                      colorConfig?.value ?? "bg-gray-400"
                    )}
                  />
                  <span className="truncate">{cat.name}</span>
                </button>
                <div className="flex shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() =>
                      onEditCategory({ id: cat.id, name: cat.name, color: cat.color })
                    }
                    className="rounded p-1 text-gray-300 hover:text-gray-500"
                    aria-label="編集"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteCategory(cat.id, cat.name)}
                    className="rounded p-1 text-gray-300 hover:text-red-500"
                    aria-label="削除"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 優先度フィルタ */}
      <section className="mb-6">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          優先度
        </h3>
        <div className="space-y-0.5">
          {priorityOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onPriorityChange(opt.value)}
              className={cn(
                "flex w-full items-center rounded-lg px-3 py-1.5 text-sm transition-colors",
                filters.priority === opt.value
                  ? "bg-blue-50 font-medium text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* ソート */}
      <section className="mb-6">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          並び替え
        </h3>
        <select
          value={filters.sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-500"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </section>

      {/* フィルタリセット */}
      <button
        onClick={onResetFilters}
        className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50"
      >
        フィルタをリセット
      </button>
    </div>
  );

  return (
    <>
      {/* デスクトップサイドバー */}
      <aside className="hidden w-72 shrink-0 border-r bg-white lg:block">
        {sidebarContent}
      </aside>

      {/* モバイルドロワー */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={onClose}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <span className="font-bold text-gray-900">フィルタ</span>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 hover:bg-gray-100"
                aria-label="閉じる"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
