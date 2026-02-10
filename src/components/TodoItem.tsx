"use client";

import { Todo, Category } from "@/types/todo";
import { PRIORITY_CONFIG } from "@/lib/constants";
import { cn, isOverdue, formatDate } from "@/lib/utils";
import { Badge } from "./ui/Badge";

interface TodoItemProps {
  todo: Todo;
  category: Category | undefined;
  onToggleStatus: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string, title: string) => void;
  dragHandleProps?: Record<string, unknown>;
  isDragging?: boolean;
}

export function TodoItem({
  todo,
  category,
  onToggleStatus,
  onEdit,
  onDelete,
  dragHandleProps,
  isDragging,
}: TodoItemProps) {
  const priorityConfig = PRIORITY_CONFIG[todo.priority];
  const overdue = isOverdue(todo.dueDate, todo.status);
  const isComplete = todo.status === "complete";

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-lg border bg-white p-3 transition-shadow hover:shadow-sm",
        isDragging && "shadow-lg ring-2 ring-blue-200",
        isComplete && "opacity-60"
      )}
    >
      {dragHandleProps && (
        <button
          className="cursor-grab touch-none text-gray-300 hover:text-gray-500 active:cursor-grabbing"
          {...dragHandleProps}
          aria-label="ドラッグして並び替え"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
          </svg>
        </button>
      )}

      <button
        onClick={() => onToggleStatus(todo.id)}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          isComplete
            ? "border-green-500 bg-green-500 text-white"
            : "border-gray-300 hover:border-gray-400"
        )}
        aria-label={isComplete ? "未完了にする" : "完了にする"}
      >
        {isComplete && (
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-medium text-gray-900", isComplete && "line-through text-gray-500")}>
            {todo.title}
          </span>
          <Badge className={cn(priorityConfig.bgColor, priorityConfig.color)}>
            {priorityConfig.label}
          </Badge>
          {category && (
            <Badge className="bg-gray-100 text-gray-600">
              <span className={cn("mr-1 inline-block h-2 w-2 rounded-full", `bg-${category.color}-500`)} />
              {category.name}
            </Badge>
          )}
        </div>
        {todo.description && (
          <p className="mt-0.5 truncate text-xs text-gray-500">
            {todo.description}
          </p>
        )}
        {todo.dueDate && (
          <p className={cn("mt-0.5 text-xs", overdue ? "font-medium text-red-600" : "text-gray-400")}>
            {overdue && "⚠ "}
            {formatDate(todo.dueDate)}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(todo)}
          className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="編集"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={() => onDelete(todo.id, todo.title)}
          className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
          aria-label="削除"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
