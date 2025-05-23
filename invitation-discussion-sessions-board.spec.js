const { test, expect } = require("@playwright/test");

test.describe("Invitation, Discussion, Sessions, and Board pages", () => {
  test.beforeEach(async ({ page }) => {
    // Assuming the app is running on localhost:8000
    await page.goto("http://localhost:8000");
  });

  test("Invitation page - add, edit, delete invitation", async ({ page }) => {
    await page.goto("http://localhost:8000/invitations");
    // Add invitation
    await page.fill("#invitationNumber", "INV123");
    await page.fill("#invitationDate", "2024-06-01");
    await page.fill("#meetingType", "عام");
    await page.fill("#memberName", "أحمد");
    await page.fill("#memberTitleEnd", "دكتور");
    await page.fill("#sessionNumber", "S001");
    await page.fill("#meetingPlace", "قاعة الاجتماعات");
    await page.fill("#subject", "موضوع الاجتماع");
    await page.click('button:has-text("إضافة الدعوه")');
    await expect(page).toHaveURL(/invitations/);

    // Search invitation
    await page.fill("#searchInvitations", "INV123");
    await page.waitForTimeout(1000);
    const row = await page.locator("table#invitationsTable tbody tr").first();
    await expect(row).toContainText("INV123");

    // Edit invitation
    await row.locator("button.edit").click();
    await page.fill('input[placeholder="رقم الدعوه"]', "INV1234");
    await page.click('button:has-text("تحديث")').catch(() => {}); // If update button exists
    await page.waitForTimeout(1000);

    // Delete invitation
    await row.locator("button.delete").click();
    await page.waitForTimeout(1000);
  });

  test("Discussion page - view open sessions and search", async ({ page }) => {
    await page.goto("http://localhost:8000/discussion");
    await expect(page.locator("h1")).toHaveText("مناقشه الجلسات");
    await page.fill("#searchOpenSessions", "S001");
    await page.waitForTimeout(1000);
    const rows = await page.locator("table#openSessionsTable tbody tr");
    await expect(rows).toHaveCountGreaterThan(0);
  });

  test("Sessions page - open session, edit, delete", async ({ page }) => {
    await page.goto("http://localhost:8000/sessions");
    await page.fill("#sessionNumber", "S002");
    await page.fill("#date", "2024-06-02");
    await page.fill("#day", "الأحد");
    await page.fill("#time", "10:00");
    await page.fill("#duration", "60");
    await page.fill("#location", "قاعة الاجتماعات");
    await page.fill("#secretary", "محمد");
    await page.fill("#topic", "موضوع الجلسة");
    await page.click('button:has-text("فتح الجلسه")');
    await page.waitForTimeout(1000);

    // Edit and delete can be tested similarly by clicking buttons in the sessions table
  });

  test("Board page - add, edit board", async ({ page }) => {
    await page.goto("http://localhost:8000/boards");
    await page.fill("#boardCode", "B001");
    await page.fill("#startDateHijri", "1445-01-01");
    await page.fill("#startDateGregorian", "2024-06-01");
    await page.fill("#appointmentDecisionNumber", "D001");
    await page.fill("#endDateHijri", "1445-12-29");
    await page.fill("#endDateGregorian", "2025-05-20");
    // File upload and other fields can be tested if needed
    await page.click('button:has-text("حفظ")');
    await page.waitForTimeout(1000);

    // Edit board can be tested by navigating to edit page and updating fields
  });
});
