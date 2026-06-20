try { process.loadEnvFile(); } catch (e) { /* ignore missing .env */ }

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" },maxHttpBufferSize:1e8  });

let tasks = [
  { id: "1", title: "Setup Project", columnId: "To Do", priority: "High", category: "Feature", attachment: null },
  { id: "2", title: "Build Backend", columnId: "In Progress", priority: "Medium", category: "Enhancement", attachment: null }
];

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Send initial tasks
  socket.emit("sync:tasks", tasks);

  socket.on("task:create", (newtask) => {
    tasks.push(newtask);
    socket.broadcast.emit("task:create", newtask);
  });

  socket.on("task:delete", (id) => {
    tasks = tasks.filter((element) => element.id !== id);
    socket.broadcast.emit("task:delete", id);
  });

  // FIXED: Now expects taskId and newColumnId to match the frontend
  socket.on("task:move", ({ taskId, newColumnId }) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.columnId = newColumnId;
    }
    // Broadcast the exact same variable names
    socket.broadcast.emit("task:move", { taskId, newColumnId });
  });

  socket.on("task:update", (updatedTask) => {
    tasks = tasks.map(t => (t.id === updatedTask.id ? updatedTask : t));
    socket.broadcast.emit("task:update", updatedTask);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
