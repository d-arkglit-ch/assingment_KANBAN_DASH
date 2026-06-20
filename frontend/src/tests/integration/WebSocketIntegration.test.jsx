import React from 'react';
import { render, screen, act } from "@testing-library/react";
import { vi } from 'vitest';
import KanbanBoard from "../../components/KanbanBoard";
import { KanbanProvider } from "../../store/KanbanContext";
import socket from "../../socket";

// We mock the WebSocket connection to simulate receiving tasks
vi.mock('../../socket', () => {
  let handlers = {};
  return {
    default: {
      on: vi.fn((event, cb) => {
        handlers[event] = cb;
      }),
      off: vi.fn(),
      emit: vi.fn(),
      // Helper to trigger events in tests
      simulateEvent: (event, payload) => {
        if (handlers[event]) handlers[event](payload);
      }
    }
  };
});

test("WebSocket receives task update", async () => {
  render(
    <KanbanProvider>
      <KanbanBoard />
    </KanbanProvider>
  );

  // Initially it should show loading
  expect(screen.getByText("Loading board...")).toBeInTheDocument();

  // Simulate receiving tasks from the backend via WebSocket
  act(() => {
    socket.simulateEvent("sync:tasks", [
      { id: "1", title: "Test Task via WebSockets", columnId: "To Do" }
    ]);
  });

  // Now the board should be visible!
  expect(screen.getByText("Kanban Board")).toBeInTheDocument();
  // And the simulated task should be present
  expect(screen.getByText("Test Task via WebSockets")).toBeInTheDocument();
});
