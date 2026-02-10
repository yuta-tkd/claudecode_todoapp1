"use client";

import { useState } from "react";
import { Todo } from "@/types/todo";
import { useTodoStore } from "@/hooks/useTodoStore";
import { useFilteredTodos } from "@/hooks/useFilteredTodos";
import { useFilterState } from "@/hooks/useFilterState";
import { useToast } from "@/hooks/useToast";
import { TodoAppSkeleton } from "./TodoAppSkeleton";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { TodoList } from "./TodoList";
import { AddTodoButton } from "./AddTodoButton";
import { TodoFormModal } from "./TodoFormModal";
import { CategoryFormModal } from "./CategoryFormModal";
import { ConfirmDialog } from "./ConfirmDialog";
import { ToastContainer } from "./Toast";

export function TodoApp() {
  const store = useTodoStore();
  const { filters, setSearch, setStatus, setCategoryId, setPriority, setSort, resetFilters } =
    useFilterState();
  const filteredTodos = useFilteredTodos(store.todos, filters);
  const { toasts, showToast, dismissToast } = useToast();

  const [todoModalOpen, setTodoModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    color: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "todo" | "category";
    id: string;
    name: string;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!store.hydrated) {
    return <TodoAppSkeleton />;
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header
        search={filters.search}
        onSearchChange={setSearch}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        onAddTodo={() => {
          setEditingTodo(null);
          setTodoModalOpen(true);
        }}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          categories={store.categories}
          filters={filters}
          onStatusChange={setStatus}
          onCategoryChange={setCategoryId}
          onPriorityChange={setPriority}
          onSortChange={setSort}
          onResetFilters={resetFilters}
          onAddCategory={() => {
            setEditingCategory(null);
            setCategoryModalOpen(true);
          }}
          onEditCategory={(cat) => {
            setEditingCategory(cat);
            setCategoryModalOpen(true);
          }}
          onDeleteCategory={(id, name) =>
            setDeleteTarget({ type: "category", id, name })
          }
          todoCounts={{
            all: store.todos.length,
            incomplete: store.todos.filter((t) => t.status === "incomplete")
              .length,
            complete: store.todos.filter((t) => t.status === "complete")
              .length,
          }}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <TodoList
            todos={filteredTodos}
            categories={store.categories}
            sortMode={filters.sort}
            onToggleStatus={store.toggleTodoStatus}
            onEdit={(todo) => {
              setEditingTodo(todo);
              setTodoModalOpen(true);
            }}
            onDelete={(id, title) =>
              setDeleteTarget({ type: "todo", id, name: title })
            }
            onReorder={store.reorderTodos}
          />
          <AddTodoButton
            onClick={() => {
              setEditingTodo(null);
              setTodoModalOpen(true);
            }}
          />
        </main>
      </div>

      {todoModalOpen && (
        <TodoFormModal
          todo={editingTodo}
          categories={store.categories}
          onSave={(data) => {
            if (editingTodo) {
              store.updateTodo(editingTodo.id, data);
              showToast("TODOを更新しました");
            } else {
              store.addTodo({
                title: data.title ?? "",
                description: data.description ?? "",
                priority: data.priority ?? "medium",
                categoryId: data.categoryId ?? null,
                dueDate: data.dueDate ?? null,
              });
              showToast("TODOを追加しました");
            }
            setTodoModalOpen(false);
            setEditingTodo(null);
          }}
          onClose={() => {
            setTodoModalOpen(false);
            setEditingTodo(null);
          }}
        />
      )}

      {categoryModalOpen && (
        <CategoryFormModal
          category={editingCategory}
          onSave={(data) => {
            if (editingCategory) {
              store.updateCategory(editingCategory.id, data);
              showToast("カテゴリを更新しました");
            } else {
              store.addCategory(data);
              showToast("カテゴリを追加しました");
            }
            setCategoryModalOpen(false);
            setEditingCategory(null);
          }}
          onClose={() => {
            setCategoryModalOpen(false);
            setEditingCategory(null);
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={
            deleteTarget.type === "todo"
              ? "TODOの削除"
              : "カテゴリの削除"
          }
          message={`「${deleteTarget.name}」を削除しますか？${
            deleteTarget.type === "category"
              ? "このカテゴリに属するTODOは未分類になります。"
              : ""
          }`}
          onConfirm={() => {
            if (deleteTarget.type === "todo") {
              store.deleteTodo(deleteTarget.id);
              showToast("TODOを削除しました");
            } else {
              store.deleteCategory(deleteTarget.id);
              showToast("カテゴリを削除しました");
            }
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
