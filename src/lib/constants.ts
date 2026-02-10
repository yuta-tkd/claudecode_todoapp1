import { Priority } from "@/types/todo";

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bgColor: string; order: number }
> = {
  high: { label: "高", color: "text-red-700", bgColor: "bg-red-100", order: 0 },
  medium: { label: "中", color: "text-yellow-700", bgColor: "bg-yellow-100", order: 1 },
  low: { label: "低", color: "text-green-700", bgColor: "bg-green-100", order: 2 },
};

export const CATEGORY_COLORS = [
  { name: "blue", label: "青", value: "bg-blue-500" },
  { name: "red", label: "赤", value: "bg-red-500" },
  { name: "green", label: "緑", value: "bg-green-500" },
  { name: "yellow", label: "黄", value: "bg-yellow-500" },
  { name: "purple", label: "紫", value: "bg-purple-500" },
  { name: "pink", label: "桃", value: "bg-pink-500" },
  { name: "indigo", label: "藍", value: "bg-indigo-500" },
  { name: "orange", label: "橙", value: "bg-orange-500" },
];

export const SORT_OPTIONS = [
  { value: "manual", label: "手動" },
  { value: "dueDate", label: "期限順" },
  { value: "priority", label: "優先度順" },
  { value: "createdAt", label: "作成日順" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
