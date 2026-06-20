import React from "react";
import KanbanBoard from "./components/KanbanBoard";
import { KanbanProvider } from "./store/KanbanContext";

function App() {
  return (
    <KanbanProvider>
      <KanbanBoard />
    </KanbanProvider>
  );
}

export default App;
