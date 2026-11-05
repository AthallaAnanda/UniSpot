/** Load as the function body of Playwright MCP's browser_run_code_unsafe filename option. */
async function benchmarkMotion(page, label = "current", baseURL = "http://localhost:3002") {
  const context = await page.context().browser().newContext({ viewport: { width: 1440, height: 1000 } });
  const qa = await context.newPage();
  const cdp = await context.newCDPSession(qa);
  const title = "View The 9th International Conference on Mathematics and Natural Sciences";
  try {
    await qa.goto(`${baseURL}/explore?view=grid`);
    await qa.waitForLoadState("networkidle");
    await qa.getByRole("button", { name: title, exact: true }).click();
    await qa.waitForTimeout(650);
    await qa.getByRole("button", { name: "Close opportunity", exact: true }).click();
    await qa.waitForTimeout(650);
    for (const view of ["List view", "Grid view"]) {
      await qa.getByRole("button", { name: view, exact: true }).click();
      await qa.waitForTimeout(450);
    }
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Performance.enable");
    await qa.evaluate(() => {
      const probe = window.__motionPerf = { active: true, gaps: [], longTasks: [], clickPaint: [], shifts: [], observers: [] };
      let last = performance.now();
      function tick(now) {
        if (!probe.active) return;
        probe.gaps.push(now - last);
        last = now;
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      const click = () => { const start = performance.now(); requestAnimationFrame(() => probe.clickPaint.push(performance.now() - start)); };
      document.addEventListener("click", click, true);
      probe.cleanup = () => document.removeEventListener("click", click, true);
      for (const type of ["longtask", "layout-shift"]) {
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (type === "longtask") probe.longTasks.push(entry.duration);
            else if (!entry.hadRecentInput) probe.shifts.push(entry.value);
          }
        });
        observer.observe({ type, buffered: false });
        probe.observers.push(observer);
      }
    });
    const start = (await cdp.send("Performance.getMetrics")).metrics;
    for (let index = 0; index < 3; index++) {
      await qa.getByRole("button", { name: title, exact: true }).click();
      await qa.waitForTimeout(650);
      await qa.getByRole("button", { name: "Close opportunity", exact: true }).click();
      await qa.waitForTimeout(650);
      for (const view of ["List view", "Grid view"]) {
        await qa.getByRole("button", { name: view, exact: true }).click();
        await qa.waitForTimeout(450);
      }
    }
    const end = (await cdp.send("Performance.getMetrics")).metrics;
    const result = await qa.evaluate(() => {
      const probe = window.__motionPerf;
      probe.active = false;
      probe.cleanup();
      probe.observers.forEach(observer => observer.disconnect());
      const percentile = (values, p) => [...values].sort((a, b) => a - b)[Math.min(values.length - 1, Math.floor(values.length * p))] ?? 0;
      return {
        frames: probe.gaps.length,
        p95FrameGapMs: percentile(probe.gaps, .95),
        framesOver50ms: probe.gaps.filter(gap => gap > 50).length,
        p95ClickToFrameMs: percentile(probe.clickPaint, .95),
        longTasks: probe.longTasks,
        unexpectedLayoutShift: probe.shifts.reduce((sum, value) => sum + value, 0),
      };
    });
    const delta = name => end.find(metric => metric.name === name).value - start.find(metric => metric.name === name).value;
    return { label, environment: "Warmed Chromium, production, 1440px, 4x CPU, three detail/toggle cycles", ...result, taskMs: delta("TaskDuration") * 1000, layoutMs: delta("LayoutDuration") * 1000, styleMs: delta("RecalcStyleDuration") * 1000 };
  } finally {
    await cdp.detach();
    await context.close();
  }
}
