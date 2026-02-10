import { AppState, Todo, Category } from "@/types/todo";

const STORAGE_KEY = "todo-app-state";
const CURRENT_VERSION = 1;

interface StoredData {
  version: number;
  todos: Todo[];
  categories: Category[];
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { todos: [], categories: [] };
    const data: StoredData = JSON.parse(raw);
    if (data.version !== CURRENT_VERSION) {
      return migrateState(data);
    }
    return { todos: data.todos, categories: data.categories };
  } catch {
    return { todos: [], categories: [] };
  }
}

export function saveState(state: AppState): void {
  try {
    const data: StoredData = {
      version: CURRENT_VERSION,
      todos: state.todos,
      categories: state.categories,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // QuotaExceededError等を静かに処理
  }
}

function migrateState(data: StoredData): AppState {
  return { todos: data.todos ?? [], categories: data.categories ?? [] };
}
