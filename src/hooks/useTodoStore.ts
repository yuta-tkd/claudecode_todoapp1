"use client";

import { useReducer, useEffect, useCallback } from "react";
import { Todo, Category, AppState, Priority, TodoStatus } from "@/types/todo";
import { loadState, saveState } from "@/lib/storage";

interface TodoStoreState {
  todos: Todo[];
  categories: Category[];
  hydrated: boolean;
}

type TodoAction =
  | { type: "HYDRATE"; payload: AppState }
  | {
      type: "ADD_TODO";
      payload: {
        title: string;
        description: string;
        priority: Priority;
        categoryId: string | null;
        dueDate: string | null;
      };
    }
  | { type: "UPDATE_TODO"; payload: { id: string; updates: Partial<Todo> } }
  | { type: "DELETE_TODO"; payload: { id: string } }
  | { type: "TOGGLE_TODO_STATUS"; payload: { id: string } }
  | { type: "REORDER_TODOS"; payload: { activeId: string; overId: string } }
  | { type: "ADD_CATEGORY"; payload: { name: string; color: string } }
  | {
      type: "UPDATE_CATEGORY";
      payload: { id: string; updates: Partial<Category> };
    }
  | { type: "DELETE_CATEGORY"; payload: { id: string } };

function todoReducer(
  state: TodoStoreState,
  action: TodoAction
): TodoStoreState {
  switch (action.type) {
    case "HYDRATE":
      return {
        todos: action.payload.todos,
        categories: action.payload.categories,
        hydrated: true,
      };

    case "ADD_TODO": {
      const now = new Date().toISOString();
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title: action.payload.title,
        description: action.payload.description,
        status: "incomplete",
        priority: action.payload.priority,
        categoryId: action.payload.categoryId,
        dueDate: action.payload.dueDate,
        sortOrder: state.todos.length,
        createdAt: now,
        updatedAt: now,
      };
      return { ...state, todos: [...state.todos, newTodo] };
    }

    case "UPDATE_TODO": {
      const now = new Date().toISOString();
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id
            ? { ...t, ...action.payload.updates, updatedAt: now }
            : t
        ),
      };
    }

    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.payload.id),
      };

    case "TOGGLE_TODO_STATUS": {
      const now = new Date().toISOString();
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id
            ? {
                ...t,
                status:
                  t.status === "complete"
                    ? ("incomplete" as TodoStatus)
                    : ("complete" as TodoStatus),
                updatedAt: now,
              }
            : t
        ),
      };
    }

    case "REORDER_TODOS": {
      const { activeId, overId } = action.payload;
      const oldIndex = state.todos.findIndex((t) => t.id === activeId);
      const newIndex = state.todos.findIndex((t) => t.id === overId);
      if (oldIndex === -1 || newIndex === -1) return state;

      const newTodos = [...state.todos];
      const [moved] = newTodos.splice(oldIndex, 1);
      newTodos.splice(newIndex, 0, moved);

      return {
        ...state,
        todos: newTodos.map((todo, index) => ({
          ...todo,
          sortOrder: index,
        })),
      };
    }

    case "ADD_CATEGORY": {
      const newCategory: Category = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        color: action.payload.color,
        createdAt: new Date().toISOString(),
      };
      return { ...state, categories: [...state.categories, newCategory] };
    }

    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.id
            ? { ...c, ...action.payload.updates }
            : c
        ),
      };

    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter(
          (c) => c.id !== action.payload.id
        ),
        todos: state.todos.map((t) =>
          t.categoryId === action.payload.id
            ? { ...t, categoryId: null }
            : t
        ),
      };

    default:
      return state;
  }
}

export function useTodoStore() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    categories: [],
    hydrated: false,
  });

  useEffect(() => {
    const stored = loadState();
    dispatch({ type: "HYDRATE", payload: stored });
  }, []);

  useEffect(() => {
    if (state.hydrated) {
      saveState({ todos: state.todos, categories: state.categories });
    }
  }, [state.todos, state.categories, state.hydrated]);

  const addTodo = useCallback(
    (data: {
      title: string;
      description: string;
      priority: Priority;
      categoryId: string | null;
      dueDate: string | null;
    }) => dispatch({ type: "ADD_TODO", payload: data }),
    []
  );

  const updateTodo = useCallback(
    (id: string, updates: Partial<Todo>) =>
      dispatch({ type: "UPDATE_TODO", payload: { id, updates } }),
    []
  );

  const deleteTodo = useCallback(
    (id: string) => dispatch({ type: "DELETE_TODO", payload: { id } }),
    []
  );

  const toggleTodoStatus = useCallback(
    (id: string) =>
      dispatch({ type: "TOGGLE_TODO_STATUS", payload: { id } }),
    []
  );

  const reorderTodos = useCallback(
    (activeId: string, overId: string) =>
      dispatch({ type: "REORDER_TODOS", payload: { activeId, overId } }),
    []
  );

  const addCategory = useCallback(
    (data: { name: string; color: string }) =>
      dispatch({ type: "ADD_CATEGORY", payload: data }),
    []
  );

  const updateCategory = useCallback(
    (id: string, updates: Partial<Category>) =>
      dispatch({ type: "UPDATE_CATEGORY", payload: { id, updates } }),
    []
  );

  const deleteCategory = useCallback(
    (id: string) =>
      dispatch({ type: "DELETE_CATEGORY", payload: { id } }),
    []
  );

  return {
    todos: state.todos,
    categories: state.categories,
    hydrated: state.hydrated,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoStatus,
    reorderTodos,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
