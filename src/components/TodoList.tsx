"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Todo, Category } from "@/types/todo";
import { SortOption } from "@/lib/constants";
import { TodoItem } from "./TodoItem";
import { EmptyState } from "./EmptyState";

interface SortableTodoItemProps {
  todo: Todo;
  category: Category | undefined;
  onToggleStatus: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string, title: string) => void;
  isDragEnabled: boolean;
}

function SortableTodoItem({
  todo,
  category,
  onToggleStatus,
  onEdit,
  onDelete,
  isDragEnabled,
}: SortableTodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id, disabled: !isDragEnabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TodoItem
        todo={todo}
        category={category}
        onToggleStatus={onToggleStatus}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={
          isDragEnabled ? { ...attributes, ...listeners } : undefined
        }
        isDragging={isDragging}
      />
    </div>
  );
}

interface TodoListProps {
  todos: Todo[];
  categories: Category[];
  sortMode: SortOption;
  onToggleStatus: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string, title: string) => void;
  onReorder: (activeId: string, overId: string) => void;
}

export function TodoList({
  todos,
  categories,
  sortMode,
  onToggleStatus,
  onEdit,
  onDelete,
  onReorder,
}: TodoListProps) {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  const isDragEnabled = sortMode === "manual";
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (todos.length === 0) {
    return <EmptyState />;
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id));
    }
  };

  const activeTodo = activeId
    ? todos.find((t) => t.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={todos.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {todos.map((todo) => (
            <SortableTodoItem
              key={todo.id}
              todo={todo}
              category={
                todo.categoryId
                  ? categoryMap.get(todo.categoryId)
                  : undefined
              }
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
              isDragEnabled={isDragEnabled}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeTodo ? (
          <div className="opacity-90">
            <TodoItem
              todo={activeTodo}
              category={
                activeTodo.categoryId
                  ? categoryMap.get(activeTodo.categoryId)
                  : undefined
              }
              onToggleStatus={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
              isDragging
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
