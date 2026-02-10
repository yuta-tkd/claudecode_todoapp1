export type Priority = "high" | "medium" | "low";
export type TodoStatus = "incomplete" | "complete";

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  priority: Priority;
  categoryId: string | null;
  dueDate: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  todos: Todo[];
  categories: Category[];
}
