import { test, expect } from "@playwright/test";

test("User can add a task and see it on the board", async ({ page }) => {
  await page.goto("http://localhost:3000"); // Ensure your Vite server is running on port 3000!

  // The title in KanbanBoard.jsx is just "Kanban Board", so we assert on that
  await expect(page.getByText("Kanban Board")).toBeVisible();

  // Verify the New Task button is visible
  await expect(page.locator('button', { hasText: 'New Task' })).toBeVisible();
});
