import React, { useState } from "react";
import Select from "react-select";

const STATUS_OPTIONS = [
  { value: "To Do", label: "To Do" },
  { value: "In Progress", label: "In Progress" },
  { value: "Done", label: "Done" }
];

const PRIORITY_OPTIONS = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" }
];

const CATEGORY_OPTIONS = [
  { value: "Bug", label: "Bug" },
  { value: "Feature", label: "Feature" },
  { value: "Enhancement", label: "Enhancement" }
];

function TaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || "");
  const [status, setStatus] = useState(STATUS_OPTIONS.find((o) => o.value === task?.columnId) || STATUS_OPTIONS[0]);
  const [priority, setPriority] = useState(PRIORITY_OPTIONS.find((o) => o.value === task?.priority) || PRIORITY_OPTIONS[0]);
  const [category, setCategory] = useState(CATEGORY_OPTIONS.find((o) => o.value === task?.category) || CATEGORY_OPTIONS[1]);
  const [attachment, setAttachment] = useState(task?.attachment || null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAttachment(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ 
        title: title.trim(), 
        columnId: status.value,  // <--- This updates the status/column!
        priority: priority.value, 
        category: category.value, 
        attachment 
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">{task ? "Edit Task" : "New Task"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <Select options={STATUS_OPTIONS} value={status} onChange={setStatus} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <Select options={PRIORITY_OPTIONS} value={priority} onChange={setPriority} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <Select options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Attachment</label>
            <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700" />
            {attachment?.startsWith("data:image") && <img src={attachment} alt="Preview" className="mt-2 h-20 rounded border object-cover" />}
          </div>

          <div className="flex gap-2 mt-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700">Save</button>
            <button type="button" onClick={onClose} className="px-4 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
