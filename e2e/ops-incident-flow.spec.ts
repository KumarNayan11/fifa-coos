import { test, expect } from "@playwright/test";

test.describe("Operations Incident E2E Flow", () => {
  // Give test a bit more timeout for initial build load
  test.setTimeout(60000);

  test("complete incident lifecycle", async ({ page }) => {
    // 1. Landing page loads
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "FIFACoOS", exact: true })).toBeVisible();

    // 2. Operations card is reachable
    await page.getByRole("link", { name: /Operations Center/i }).click();

    // 3. /ops redirects to login when unauthenticated
    await page.waitForURL("**/ops/login");

    // 4. Login succeeds with demo credentials
    await page.locator('input[name="username"]').fill(process.env.OPS_USERNAME || "ops_admin");
    await page
      .locator('input[name="password"]')
      .fill(process.env.OPS_PASSWORD || "secure_password_123");
    await page.getByRole("button", { name: /Sign in/i }).click();

    // 5. Dashboard renders
    await page.waitForURL("**/ops");
    await expect(page.getByText("Command Center Ops")).toBeVisible();

    // 6. Create Incident
    await page.getByRole("button", { name: /Report Incident/i }).click();

    // Fill out the form
    await page.locator('input[name="title"]').fill("E2E Playwright Incident");
    await page
      .locator('textarea[name="description"]')
      .fill("Testing the incident flow via automated Playwright test");
    await page.locator('select[name="severity"]').selectOption("high");

    const zoneSelect = page.locator('select[name="zone_id"]');
    await zoneSelect.waitFor({ state: "visible" });

    // Wait for the zones to be populated via the Server Action
    await expect(zoneSelect.locator("option")).not.toHaveCount(1, { timeout: 10000 });

    // Now pick the second option (index 1)
    await zoneSelect.selectOption({ index: 1 });

    await page.getByRole("button", { name: /Submit Incident/i }).click();

    // 7. Verify dashboard metrics update
    // The incident should appear in the table on the dashboard
    await expect(page.getByText("E2E Playwright Incident")).toBeVisible({ timeout: 15000 });

    // 8. Open Incident Details
    const row = page.locator("tr").filter({ hasText: "E2E Playwright Incident" });
    await row.getByRole("link", { name: /Inspect/i }).click();
    await page.waitForURL("**/ops/incidents/**");

    // 9. Verify AI confidence, reasoning, and recommendation are visible
    // We expect the AI Copilot Review panel to be there.
    await expect(page.getByText("AI Copilot Review")).toBeVisible();

    // 10. Assign incident
    // Look for the select element inside the Assign Personnel area
    const assignSelect = page.locator("select").first();
    await assignSelect.selectOption({ index: 1 });
    await page.getByRole("button", { name: /Assign/i }).click();

    // Timeline should update to Assigned
    await expect(page.locator(".ml-6").filter({ hasText: "Assigned to" }).first()).toBeVisible();

    // 11. Resolve incident
    await page.getByPlaceholder(/Resolution notes/i).fill("Resolved by E2E test");
    await page.getByRole("button", { name: /Mark as Resolved/i }).click();

    // Timeline updates
    await expect(page.getByText("Incident marked as resolved.")).toBeVisible();

    // 12. Close incident
    await page.getByRole("button", { name: /Close Incident/i }).click();

    // 13. Verify timeline progression
    await expect(page.getByText("Incident Closed")).toBeVisible();

    // 14. Refresh page and verify persisted state
    await page.reload();
    await expect(page.getByText("Incident Closed")).toBeVisible();

    // 15. Logout and verify protected routes require authentication again
    await page.getByRole("button", { name: /Logout/i }).click();
    await page.waitForURL("**/ops/login");

    await page.goto("/ops");
    await page.waitForURL("**/ops/login");
  });
});
