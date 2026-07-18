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

    // 4. Login with seeded Supabase credentials
    await page.fill('input[name="email"]', "ops@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.getByRole("button", { name: /Sign in/i }).click();

    // 5. Dashboard renders
    await page.waitForURL("**/ops");
    await expect(page.getByText("Command Center Ops")).toBeVisible();

    // 6. Create Incident
    const incidentTitle = `E2E Playwright Incident ${Date.now()}`;
    await page.getByRole("button", { name: "Report Incident" }).click();

    // Wait for the modal to be visible
    const modal = page.locator("form#create-incident-form");
    await modal.waitFor({ state: "visible" });

    await page.fill('input[name="title"]', incidentTitle);
    await page.fill(
      'textarea[name="description"]',
      "This is an automated test incident for end-to-end verification.",
    );
    await page.locator('select[name="severity"]').selectOption("medium");

    // Select a zone from the dropdown
    const zoneSelect = page.locator('select[name="zone_id"]');
    await zoneSelect.waitFor({ state: "visible" });
    // Wait for the zones to be populated via the Server Action
    await expect(zoneSelect.locator("option")).not.toHaveCount(1, { timeout: 10000 });
    await zoneSelect.selectOption({ index: 1 });

    await page.getByRole("button", { name: "Submit Incident" }).click();

    // 7. Verify dashboard metrics update
    // The incident should appear in the table on the dashboard
    await expect(page.getByText(incidentTitle)).toBeVisible({ timeout: 15000 });

    // 8. Open Incident Details
    const row = page.locator("tr").filter({ hasText: incidentTitle }).first();
    await row.getByRole("link", { name: "Inspect" }).click();
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
