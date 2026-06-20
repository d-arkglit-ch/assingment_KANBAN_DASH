import React, { createContext, useContext, useState, useEffect } from "react";
import socket from "../socket";

const KanbanContext = createContext();

export function useKanban() {
  return useContext(KanbanContext);
}

export function KanbanProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, task: null });

  // Handle WebSocket events automatically inside the provider
  useEffect(() => {
    socket.on("sync:tasks", (serverTasks) => { setTasks(serverTasks); setLoading(false); });
    socket.on("task:create", (newTask) => setTasks((prev) => [...prev, newTask]));
    socket.on("task:move", ({ taskId, newColumnId }) => setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, columnId: newColumnId } : t))));
    socket.on("task:update", (updated) => setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t))));
    socket.on("task:delete", (taskId) => setTasks((prev) => prev.filter((t) => t.id !== taskId)));

    return () => {
      socket.off("sync:tasks");
      socket.off("task:create");
      socket.off("task:move");
      socket.off("task:update");
      socket.off("task:delete");
    };
  }, []);

  // Actions that any component can call
  const moveTask = (taskId, newColumnId) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, columnId: newColumnId } : t)));
    socket.emit("task:move", { taskId, newColumnId });
  };

  const saveTask = (formData) => {
    if (modal.task) {
      const updated = { ...modal.task, ...formData };
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      socket.emit("task:update", updated);
    } else {
      const newTask = { id: crypto.randomUUID(), columnId: "To Do", ...formData };
      setTasks((prev) => [...prev, newTask]);
      socket.emit("task:create", newTask);
    }
    setModal({ open: false, task: null });
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    socket.emit("task:delete", taskId);
  };

  const openCreateModal = () => setModal({ open: true, task: null });
  const openEditModal = (task) => setModal({ open: true, task });
  const closeModal = () => setModal({ open: false, task: null });

  return (
    <KanbanContext.Provider value={{
      tasks, loading, modal, moveTask, saveTask, deleteTask, openCreateModal, openEditModal, closeModal
    }}>
      {children}
    </KanbanContext.Provider>
  );
}
