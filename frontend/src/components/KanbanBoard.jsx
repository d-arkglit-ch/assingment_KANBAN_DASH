import React, { useState } from "react";
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";

import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import ProgressChart from "./ProgressChart";
import { useKanban } from "../store/KanbanContext"; // Import Context

const COLUMNS = ["To Do", "In Progress", "Done"];

// Look, no onEdit or onDelete props needed here anymore!
function Column({ columnId, tasks, isOver }) {
  const { setNodeRef } = useDroppable({ id: columnId });
  const taskIds = tasks.map((t) => t.id);

  return (
    <div ref={setNodeRef} className={`flex flex-col bg-slate-100 rounded-xl min-h-[400px] border ${isOver ? "border-blue-400 bg-blue-50" : "border-slate-200"}`}>
      <div className="p-3 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-semibold text-slate-700 text-sm">{columnId}</h3>
        <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{tasks.length}</span>
      </div>
      <div className="p-2 flex-1 flex flex-col gap-2">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => <TaskCard key={task.id} task={task} />)}
        </SortableContext>
      </div>
    </div>
  );
}

function KanbanBoard() {
  // Grab everything we need from Context
  const { tasks, loading, modal, moveTask, saveTask, closeModal, openCreateModal } = useKanban();
  
  // We only keep temporary drag-and-drop state locally
  const [activeTask, setActiveTask] = useState(null);
  const [overId, setOverId] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragStart = (e) => setActiveTask(tasks.find((t) => t.id === e.active.id));
  const handleDragOver = (e) => setOverId(e.over?.id || null);
  
  const handleDragEnd = (e) => {
    const { active, over } = e;
    setActiveTask(null);
    setOverId(null);
    if (!over) return;

    const newColumnId = COLUMNS.includes(over.id) ? over.id : tasks.find((t) => t.id === over.id)?.columnId;
    if (!newColumnId || newColumnId === tasks.find(t => t.id === active.id)?.columnId) return;

    // Trigger the context action
    moveTask(active.id, newColumnId);
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading board...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Kanban Board</h1>
        <button onClick={openCreateModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> New Task
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => (
             <Column key={col} columnId={col} tasks={tasks.filter((t) => t.columnId === col)} isOver={overId === col} />
          ))}
        </div>
        <DragOverlay>{activeTask && <TaskCard task={activeTask} />}</DragOverlay>
      </DndContext>

      <ProgressChart tasks={tasks} />

      {modal.open && <TaskModal task={modal.task} onSave={saveTask} onClose={closeModal} />}
    </div>
  );
}

export default KanbanBoard;
