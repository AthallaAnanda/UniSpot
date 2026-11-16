import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { Script } from "node:vm";

const base = new URL(process.env.UNISPOT_QA_URL || "http://localhost:3000");
const response = await fetch(base);
const html = await response.text();
const captured = JSON.parse(await readFile(new URL("../src/lib/unispot-landing-source.json", import.meta.url), "utf8"));
const media = JSON.parse(await readFile(new URL("../src/data/landing-media.json", import.meta.url), "utf8"));

test("the root serves the preserved Ugency document with UniSpot branding", () => {
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /text\/html/);
  assert.match(html, /<title>[^<]*UniSpot<\/title>/);
  for (const section of ["Hero", "Pinpoints", "Mission", "Services", "Case Study", "compare", "Steps", "Counter", "Testimonial", "Pricing", "CTA"]) {
    assert.ok(html.includes(`data-framer-name="${section}"`), `${section} template section is missing`);
  }
  assert.equal(response.headers.get("x-unispot-landing"), "template-inline");
  assert.match(html, /<script data-unispot-adapter>/);
  assert.doesNotMatch(html, /src="\/api\/unispot-rebrand"/);
  assert.doesNotMatch(html, /classList\.add\("unispot-ready"\), 7000/);
  assert.doesNotMatch(html, /<link\b[^>]*rel="modulepreload"/);
  assert.doesNotMatch(html, /html\{visibility:hidden\}/);
  assert.doesNotMatch(html, /class="lp(?:\s|")/);
});

test("template styles, inline geometry, and named wrappers are unchanged", () => {
  const styles = value => [...value.matchAll(/<style\b[^>]*>[\s\S]*?<\/style>/g)].map(match => match[0]);
  const attributes = (value, name) => [...value.matchAll(new RegExp(`\\s${name}="([^"]*)"`, "g"))].map(match => match[1]);
  const originalStyles = styles(captured);
  const templateStyles = styles(html).filter(style => !style.startsWith("<style data-unispot-critical>"));
  const hash = value => createHash("sha256").update(value).digest("hex");
  assert.deepEqual(templateStyles.map(hash), originalStyles.map(hash));
  assert.deepEqual(attributes(html, "style"), attributes(captured, "style"));
  assert.deepEqual(attributes(html, "data-framer-name"), attributes(captured, "data-framer-name"));
  assert.deepEqual(attributes(html, "class"), attributes(captured, "class"));
});

test("replacement photos, videos, and posters are local and load successfully", async () => {
  const assets = [...new Set([...html.matchAll(/(?:src|poster)="(\/assets\/unispot\/[^"<>]+)"/g)].map(match => match[1].replaceAll("&amp;", "&")))];
  assert.ok(assets.includes("/assets/unispot/landing/discover-hd-poster.webp"));
  assert.ok(assets.includes("/assets/unispot/landing/mission-campus-student.webp"));
  assert.ok(assets.some(asset => asset.endsWith(".mp4")));
  await Promise.all(assets.map(async asset => {
    const url = new URL(asset, base);
    assert.equal(url.origin, base.origin, `Unexpected third-party asset: ${url}`);
    const result = await fetch(url, { method: "HEAD" });
    assert.equal(result.status, 200, `Asset failed: ${url.pathname}`);
  }));
});

test("each of the eight video slots has a distinct source and local HD asset", async () => {
  assert.equal(media.stories.length, 8);
  for (const field of ["src", "source", "poster"]) {
    assert.equal(new Set(media.stories.map(story => story[field])).size, 8, `${field} must be unique`);
  }
  await Promise.all(media.stories.flatMap(story => [story.src, story.poster]).map(async asset => {
    const result = await fetch(new URL(asset, base), { method: "HEAD" });
    assert.equal(result.status, 200, `Asset failed: ${asset}`);
  }));
});

test("template runtime and UniSpot content adapter are active", async () => {
  const template = await fetch(new URL("/landing-static", base));
  assert.equal(template.status, 200);
  assert.equal(await template.text(), html);
  const adapter = await fetch(new URL("/api/unispot-rebrand", base));
  assert.equal(adapter.status, 200);
  const source = await adapter.text();
  assert.match(source, /Your next step/);
  assert.match(source, /syncTemplateMedia/);
  assert.match(source, /\/assets\/unispot\/landing\/grow-hd\.mp4/);
  assert.doesNotMatch(source, /window\.addEventListener\("load"/);
  assert.doesNotMatch(source, /setTimeout\(run, 150\)/);
  assert.doesNotMatch(source, /\}, 32\);/);
  assert.ok(html.includes(source.replaceAll("</script", "<\\/script")), "The inline adapter must match the tested API source");
  new Script(source);
  assert.match(html, /script_main\.[^"\s]+\.mjs/);
});
