"use client";

import { useState } from "react";
import { Todo, Category, Priority } from "@/types/todo";
import { PRIORITY_CONFIG } from "@/lib/constants";
import { Modal } from "./ui/Modal";
import { cn } from "@/lib/utils";

interface TodoFormModalProps {
  todo: Todo | null;
  categories: Category[];
  onSave: (data: Partial<Todo>) => void;
  onClose: () => void;
}

export function TodoFormModal({
  todo,
  categories,
  onSave,
  onClose,
}: TodoFormModalProps) {
  const [title, setTitle] = useState(todo?.title ?? "");
  const [description, setDescription] = useState(todo?.description ?? "");
  const [priority, setPriority] = useState<Priority>(
    todo?.priority ?? "medium"
  );
  const [categoryId, setCategoryId] = useState<string>(
    todo?.categoryId ?? ""
  );
  const [dueDate, setDueDate] = useState(todo?.dueDate ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      categoryId: categoryId || null,
      dueDate: dueDate || null,
    });
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="mb-4 text-lg font-bold text-gray-900">
        {todo ? "TODOを編集" : "新しいTODO"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="何をする？"
            autoFocus
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            説明
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={3}
            placeholder="詳細を入力..."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            優先度
          </label>
          <div className="flex gap-2">
            {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                  priority === p
                    ? cn(
                        PRIORITY_CONFIG[p].bgColor,
                        PRIORITY_CONFIG[p].color,
                        "border-current"
                      )
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                )}
              >
                {PRIORITY_CONFIG[p].label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            カテゴリ
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">なし</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            期限
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {todo ? "更新" : "追加"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
