import { test, expect } from "@playwright/test";

test("app loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/.*/);
});

test("backend is reachable", async ({ request }) => {
  const apiUrl = process.env.E2E_API_URL || "http://localhost:8080";
  const response = await request.get(`${apiUrl}/actuator/health`);
  expect(response.ok()).toBeTruthy();
});
