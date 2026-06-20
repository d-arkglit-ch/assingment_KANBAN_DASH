import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { useKanban } from "../store/KanbanContext";

function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const { openEditModal, deleteTask } = useKanban();

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const priorityColors = { Low: "bg-emerald-100 text-emerald-800", Medium: "bg-amber-100 text-amber-800", High: "bg-rose-100 text-rose-800" };

  // Chrome blocks raw base64 data URLs in new tabs for security.
  // We must convert it to a Blob and create a trusted object URL instead!
  const handleOpenAttachment = (e) => {
    e.stopPropagation();
    if (!task.attachment) return;

    try {
      const arr = task.attachment.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]); // decode base64
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      // Create a blob and a trusted browser URL
      const blob = new Blob([u8arr], { type: mime });
      const url = URL.createObjectURL(blob);
      
      // Open in a new tab safely
      window.open(url, '_blank');
      
      // Cleanup memory
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("Failed to open attachment", err);
      alert("Could not open attachment. It might be corrupted.");
    }
  };

  return (
    <div ref={setNodeRef} style={style} className={`bg-white border border-slate-200 rounded-lg p-3 shadow-sm group ${isDragging ? "shadow-md z-50" : ""}`}>
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners} className="text-slate-400 hover:text-slate-600 cursor-grab mt-1 shrink-0">
          <GripVertical size={16} />
        </div>
        <p className="text-sm font-medium text-slate-800 flex-1">{task.title}</p>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => openEditModal(task)} className="text-slate-400 hover:text-blue-600"><Pencil size={14} /></button>
          <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={14} /></button>
        </div>
      </div>

      <div className="flex gap-2 mt-3 ml-6">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
          {task.category}
        </span>
      </div>

      {/* Clickable Image */}
      {task.attachment?.startsWith("data:image") && (
        <div onClick={handleOpenAttachment} className="cursor-pointer hover:opacity-80 transition-opacity">
          <img src={task.attachment} alt="attachment" className="mt-3 ml-6 rounded border border-slate-200 w-full max-h-24 object-cover overflow-hidden" />
        </div>
      )}
      
      {/* Clickable PDF */}
      {task.attachment?.startsWith("data:application/pdf") && (
        <div onClick={handleOpenAttachment} className="mt-3 ml-6 flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 p-2 rounded border border-blue-100 cursor-pointer transition-colors">
          📄 PDF Document Attached (Click to view)
        </div>
      )}
    </div>
  );
}

export default TaskCard;
