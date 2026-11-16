import rebrandSource from "@/lib/unispot-rebrand-source.json";
import media from "@/data/landing-media.json";
import { replaceTemplateAssets, templateMediaSyncScript } from "@/lib/landing-template-media";
import { landingPathsScript } from "@/lib/landing-paths";

const roleSwitchPattern = /    if \(!sections\[9\]\.dataset\.unispotRoleSwitch\) \{[\s\S]*?\n    \}\n\n    const footer =/;
const roleSwitch = `    setupUniSpotPaths(sections[9]);

    const footer =`;

export function landingAdapterSource() {
  let source = replaceTemplateAssets(rebrandSource);
  source = source.replace(
    "anchor.parentElement?.remove();",
    'anchor.parentElement?.id === "__framer-badge-container" ? anchor.remove() : anchor.parentElement?.remove();',
  );
  source = source.replace('["mila.creates", "Information sources"]', '["mila.creates", "UniSpot community"]');
  source = source.replaceAll("Students discovering a community opportunity on UniSpot", media.images.mission.alt);
  source = source.replace("(() => {", `(() => {${templateMediaSyncScript()}${landingPathsScript()}`);
  source = source.replace(roleSwitchPattern, roleSwitch);
  source = source.replace(
    "    return true;\n  }\n\n  function start()",
    '    updateLinksByLabel(document, [["Book a call", "/explore", "Explore"]]);\n    syncTemplateMedia();\n    document.documentElement.classList.add("unispot-ready");\n    return true;\n  }\n\n  function start()',
  );
  source = source.replace(
    'if (value) setNodeText(value, valueCopy[index]);',
    'if (value) { value.textContent = valueCopy[index]; setNodeText(value, valueCopy[index]); }',
  );
  source = source.replace(
    `for (const image of document.querySelectorAll('img[alt="Brand Logo"]')) setImage(image, "/brand/unispot.svg", "UniSpot");`,
    `for (const image of document.querySelectorAll('img[alt="Brand Logo"]')) { setImage(image, "/brand/unispot.svg", "UniSpot"); image.style.backgroundColor = "transparent"; }`,
  );
  source = source.replace(
    `featureVideo.src = "${media.stories[2].src}";`,
    `featureVideo.src = "${media.stories[2].src}";\n      featureVideo.poster = "${media.stories[2].poster}";`,
  );
  source = source.replace(
    'featureVideo.style.setProperty("object-fit", "cover", "important");',
    'featureVideo.style.setProperty("object-fit", "contain", "important");',
  );
  source = source
    .replace("function configureHeroStoryCards(section)", "function configureHeroStoryCards(section, play = true)")
    .replace("video.autoplay = true;", "video.autoplay = play;")
    .replace("const playAttempt = video.play();", "const playAttempt = play ? video.play() : null;")
    .replace("featureVideo.autoplay = true;", "featureVideo.autoplay = play;")
    .replace("if (featureVideo.paused)", "if (play && featureVideo.paused)");
  source = source.replace(
    `document.querySelectorAll('img[alt="Case-Study Image"]').forEach((image, index) => setImage(image, showcaseImages[index % showcaseImages.length], "Featured UniSpot opportunity"));`,
    `const featuredCopy = normalize(sections[4].innerText);
    const showcaseIndex = /Google AI Essentials|Mintwave/i.test(featuredCopy) ? 2 : /DevFest Cloud Jakarta|Duskline/i.test(featuredCopy) ? 1 : 0;
    sections[4].querySelectorAll('img[alt="Case-Study Image"]').forEach(image => setImage(image, showcaseImages[showcaseIndex], "Featured UniSpot opportunity"));`,
  );
  source = source.replace(
    `document.querySelectorAll('img[alt="CTA Image"]').forEach((image, index) => setImage(image, showcaseImages[index % showcaseImages.length], "Explore opportunities on UniSpot"));`,
    `document.querySelectorAll('[data-framer-name="CTA"] img[alt="CTA Image"]').forEach(image => { image.alt = ""; });`,
  );
  // Match the template's sentence-case headings as well as the original copy map.
  source = source.replaceAll("normalize(element.innerText) === normalize(from)", "normalize(element.innerText).toLowerCase() === normalize(from).toLowerCase()");
  source = source.replaceAll("normalize(walker.currentNode.nodeValue) === normalize(from)", "normalize(walker.currentNode.nodeValue).toLowerCase() === normalize(from).toLowerCase()");
  // Brand parser output before waiting for images, videos, remote modules, or
  // window.load. Hydrated CMS variants are corrected
  // in the mutation microtask itself, before the browser can paint their copy.
  const start = source.indexOf("  function start()");
  if (start < 0) throw new Error("The landing adapter startup could not be located.");
  return source.slice(0, start) + `
  function firstViewport() {
    document.querySelectorAll("nav").forEach(nav => {
      updateLinksByLabel(nav, [["Book a call", "/explore", "Explore"]]);
      nav.querySelectorAll('a[href="/explore"] img[alt="Icon"]').forEach(image => {
        if (image.getAttribute("src") !== "/brand/unispot-icon.svg") setImage(image, "/brand/unispot-icon.svg", "");
      });
    });
    const hero = document.querySelector('main > [data-framer-name="Hero"]');
    const top = hero?.querySelector('[data-framer-appear-id="18gxn5u"]');
    // The next sibling means the parser has finished the headline/CTA subtree.
    if (!top?.nextElementSibling) return;
    if (!hero.querySelector('h1.unispot-hero-headline')) {
      setHeroHeadline(hero);
      replaceMap(top, [
        ["UGC · Short form · Creator marketing", "There are many ways to grow."],
        ["We turn real people into your best sales team. Authentic UGC that stops the scroll, earns trust, and converts built on data, not gut feelings.", "Find your next step—and the community to grow with."]
      ]);
      updateLinksByLabel(top, [["Start growing", "/explore", "Explore opportunities"]]);
      document.documentElement.classList.add("unispot-hero-ready");
    }
    if (hero.querySelector('[data-framer-name="Platform"]') && !hero.querySelector('video.unispot-hero-feature-video')) {
      configureHeroStoryCards(hero, false);
      document.documentElement.classList.add("unispot-stories-ready");
    }
  }
  function start() {
    if (!rebrand()) return;
    document.documentElement.classList.add("unispot-hero-ready");
    document.documentElement.classList.add("unispot-stories-ready");
    document.documentElement.dataset.unispotStartup = "inline";
    const observe = () => observer.observe(document.body, {
      subtree: true, childList: true, characterData: true,
      attributes: true, attributeFilter: ["src", "alt"]
    });
    const observer = new MutationObserver(() => {
      const hero = document.querySelector('main > [data-framer-name="Hero"]');
      const staleHeadline = hero && !hero.querySelector('h1.unispot-hero-headline');
      const legacyCopy = /UGC|Oralyn|Duskline|Mintwave|Get template|Book a (?:free )?call|Creators we work with|Case studies/i.test(document.body.innerText);
      if (!staleHeadline && !legacyCopy && !document.querySelector('img[alt="Brand Logo"]')) return;
      observer.disconnect();
      try { rebrand(); } finally { observe(); }
    });
    observe();
    document.dispatchEvent(new Event("unispot:ready"));
    window.addEventListener("pageshow", event => {
      if (!event.persisted) return;
      observer.disconnect();
      try { rebrand(); } finally { observe(); }
    });
  }
  const parsingObserver = new MutationObserver(() => {
    firstViewport();
    if (document.querySelectorAll("main > section").length < 11 || !document.querySelector("footer")) return;
    parsingObserver.disconnect();
    start();
  });
  parsingObserver.observe(document.documentElement, { subtree: true, childList: true });
  firstViewport();
  if (document.querySelectorAll("main > section").length >= 11 && document.querySelector("footer")) {
    parsingObserver.disconnect();
    start();
  }
  document.addEventListener("DOMContentLoaded", () => {
    if (document.documentElement.dataset.unispotStartup === "inline") return;
    parsingObserver.disconnect();
    start();
  }, { once: true });
})();`;
}
