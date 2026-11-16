import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./scripts", testMatch: "check-auth.spec.ts", workers: 1, timeout: 60000,
  use: { headless: true }, reporter: "list",
  webServer: process.env.UNISPOT_QA_URL ? undefined : { command: "npm run start -- --port 3005", url: "http://localhost:3005/login", reuseExistingServer: true, timeout: 60000 },
});
