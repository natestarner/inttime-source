import { test, expect } from "@playwright/test";

test("app loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/.+/);
});

test("backend is reachable", async ({ request }) => {
  const res = await request.get("http://localhost:8080/actuator/health");
  expect(res.status()).toBe(200);
});
