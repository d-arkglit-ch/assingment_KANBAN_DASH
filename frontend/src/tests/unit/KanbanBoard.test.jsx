import React from "react";
import { render, screen } from "@testing-library/react";
import KanbanBoard from "../../components/KanbanBoard";
import { KanbanProvider } from "../../store/KanbanContext";
import { vi } from "vitest";

// Mock the socket so we don't wait for the loading state forever in our test!
vi.mock('../../socket', () => ({
  default: {
    on: vi.fn((event, callback) => {
      if (event === "sync:tasks") {
        callback([]); // Instantly tell the app we finished loading tasks
      }
    }),
    off: vi.fn(),
    emit: vi.fn()
  }
}));

test("renders Kanban board title", () => {
  render(
    <KanbanProvider>
      <KanbanBoard />
    </KanbanProvider>
  );
  expect(screen.getByText("Kanban Board")).toBeInTheDocument();
});
