import { test, expect } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
const base = process.env.UNISPOT_QA_URL ?? "http://localhost:3005";

test("public catalog is available and private routes reject unauthenticated requests", async ({ request }) => {
  const catalog = await request.get(`${base}/api/catalog`);
  expect(catalog.ok()).toBeTruthy();
  const data = await catalog.json();
  expect(data.calendars).toHaveLength(8);
  expect(data.opportunities.length).toBeGreaterThanOrEqual(31);
  expect(data.calendars.every((hub: { canManage: boolean }) => !hub.canManage)).toBeTruthy();
  const create = await request.post(`${base}/api/calendars`, { data: { name: "Unauthorized Hub" } });
  expect(create.status()).toBe(401);
  const collection = await request.put(`${base}/api/me/collections`, { data: { kind: "followed", id: "gdg", active: true } });
  expect(collection.status()).toBe(401);
  const managed = await request.get(`${base}/api/calendars/arkavidia/manage`);
  expect(managed.status()).toBe(401);
});

test("saved redirects to login and preserves the return destination", async ({ page }) => {
  await page.goto(`${base}/saved`);
  await expect(page).toHaveURL(/\/login\?next=%2Fsaved/);
  await expect(page.getByRole("heading", { name: "Welcome back." })).toBeVisible();
  await page.getByLabel("Email address").fill("nobody@example.com");
  await page.locator('input[name="password"]').fill("NotARealPassword123!");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(page.locator('input[name="password"]')).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Hide password" }).click();
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible({ timeout: 30000 });
  await expect(page).toHaveURL(/\/login/);
});

test("auth pages fit desktop and mobile and reset requires a session", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of ["login", "signup", "forgot-password", "reset-password"]) {
      await page.goto(`${base}/${path}`);
      await expect(page.locator("h1")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
      await page.screenshot({ path: `/tmp/opencode/auth-${path}-${width}.png`, fullPage: true });
    }
  }
  await expect(page.locator(".auth-alert")).toContainText("valid password reset");
  expect(errors).toEqual([]);
});

test("invalid callbacks never redirect to external destinations", async ({ request }) => {
  const response = await request.get(`${base}/auth/callback?next=//example.com`, { maxRedirects: 0 });
  const location = response.headers().location;
  expect(new URL(location).origin).toBe(new URL(base).origin);
  expect(location).toContain("next=%2Fdiscover");
});

test("real Hub owner can sign in, sync collections, and cannot manage another Hub", async ({ page }) => {
  const filename = process.env.UNISPOT_QA_ACCOUNTS ?? ".local/hub-accounts.json";
  test.skip(!existsSync(filename), "Private demo credentials are available only on the provisioning machine.");
  const accounts = JSON.parse(readFileSync(filename, "utf8")) as { slug: string; email: string; password: string }[];
  const owner = accounts.find(account => account.slug === "arkavidia")!;
  const other = accounts.find(account => account.slug !== owner.slug)!;
  await page.goto(`${base}/login`);
  await page.getByLabel("Email address").fill(owner.email);
  await page.locator('input[name="password"]').fill(owner.password);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/discover$/, { timeout: 30000 });
  await page.reload();
  await expect(page.getByRole("button", { name: "Account menu" })).toBeVisible();
  const catalog = await (await page.request.get(`${base}/api/catalog`)).json();
  expect(catalog.calendars.filter((hub: { canManage: boolean }) => hub.canManage).map((hub: { slug: string }) => hub.slug)).toEqual([owner.slug]);
  expect((await page.request.get(`${base}/api/calendars/${owner.slug}/manage`)).status()).toBe(200);
  expect((await page.request.get(`${base}/api/calendars/${other.slug}/manage`)).status()).toBe(403);
  expect((await page.request.post(`${base}/api/calendars/${other.slug}/opportunities`, { data: { title: "Must not be saved", status: "draft" } })).status()).toBe(403);
  const me = await (await page.request.get(`${base}/api/me`)).json();
  expect(me.user.email).toBe(owner.email);
  const edit = await page.request.patch(`${base}/api/me`, { data: { ...me.profile, campus: "UniSpot QA" } });
  expect(edit.status()).toBe(200);
  expect((await (await page.request.get(`${base}/api/me`)).json()).profile.campus).toBe("UniSpot QA");
  expect((await page.request.patch(`${base}/api/me`, { data: me.profile })).status()).toBe(200);
  for (const kind of ["saved", "followed"] as const) {
    const id = kind === "saved" ? catalog.opportunities[0].id : catalog.calendars[0].id;
    const original = me[kind].includes(id);
    try {
      expect((await page.request.put(`${base}/api/me/collections`, { data: { kind, id, active: !original } })).status()).toBe(200);
      const updated = await (await page.request.get(`${base}/api/me`)).json();
      expect(updated[kind].includes(id)).toBe(!original);
    } finally { await page.request.put(`${base}/api/me/collections`, { data: { kind, id, active: original } }); }
  }
  await page.getByRole("button", { name: "Account menu" }).click();
  await page.getByRole("menuitem", { name: "Log out" }).click();
  await expect(page.getByRole("link", { name: "Log in", exact: true })).toBeVisible();
  expect((await (await page.request.get(`${base}/api/me`)).json()).user).toBeNull();
});
