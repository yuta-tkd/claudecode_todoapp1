"use client";

import { useState } from "react";
import { CATEGORY_COLORS } from "@/lib/constants";
import { Modal } from "./ui/Modal";
import { cn } from "@/lib/utils";

interface CategoryFormModalProps {
  category: { id: string; name: string; color: string } | null;
  onSave: (data: { name: string; color: string }) => void;
  onClose: () => void;
}

export function CategoryFormModal({
  category,
  onSave,
  onClose,
}: CategoryFormModalProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [color, setColor] = useState(category?.color ?? CATEGORY_COLORS[0].name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), color });
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="mb-4 text-lg font-bold text-gray-900">
        {category ? "カテゴリを編集" : "新しいカテゴリ"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            カテゴリ名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="カテゴリ名を入力"
            autoFocus
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            カラー
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.name)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-transform",
                  c.value,
                  color === c.name
                    ? "scale-110 ring-2 ring-offset-2 ring-gray-400"
                    : "hover:scale-105"
                )}
                aria-label={c.label}
              >
                {color === c.name && (
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
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
            disabled={!name.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {category ? "更新" : "追加"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
