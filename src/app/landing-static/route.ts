import landingHtml from "@/lib/unispot-landing-source.json";
import { replaceTemplateAssets } from "@/lib/landing-template-media";
import { landingAdapterSource } from "@/lib/landing-adapter";
import { currentUser } from "@/lib/server/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const criticalCss = `
  img[alt="Brand Logo"] { content:url("/brand/unispot.svg"); background-color:transparent!important; }
  [data-framer-name="Hero"] [data-framer-appear-id="18gxn5u"] { visibility:hidden; }
  html.unispot-hero-ready [data-framer-name="Hero"] [data-framer-appear-id="18gxn5u"] { visibility:visible; opacity:1!important; transform:none!important; }
  html.unispot-stories-ready [data-framer-name="Hero"] [data-framer-appear-id="1juxuac"] { opacity:1!important; transform:none!important; }
  #__framer-badge-container, a[href*="buy.polar.sh"] { display:none!important; }
  [data-unispot-path-tabs] > [data-framer-name="BG Active"] {
    left:var(--unispot-path-left, 10px)!important;
    right:auto!important;
    width:var(--unispot-path-width, calc(50% - 8px))!important;
    transform:none!important;
    transition:left 240ms cubic-bezier(.22,1,.36,1), width 240ms cubic-bezier(.22,1,.36,1);
  }
  [data-unispot-path-tabs] [data-framer-name="Yearly"] [data-framer-name="Badge"] { display:none!important; }
  @media (prefers-reduced-motion: reduce) {
    [data-unispot-path-tabs] > [data-framer-name="BG Active"] { transition:none; }
  }
`;

export async function GET() {
  const user = await currentUser();
  const accountHref = user ? "/account" : "/login";
  const accountLabel = user ? "My account" : "Log in";
  const runtimePattern = /<script\b[^>]*data-framer-bundle="main"[^>]*src="([^"]+)"[^>]*><\/script>/;
  const runtimeUrl = landingHtml.match(runtimePattern)?.[1];
  if (!runtimeUrl) throw new Error("The landing runtime URL could not be located.");
  // Preserve the template styles/wrappers, but do not let its module preloads
  // compete with the first document, logo, font, and theme stylesheets.
  const html = replaceTemplateAssets(landingHtml)
    .replace(/^<!doctype html>\s*<!doctype html>/i, "<!doctype html>")
    .replace(/<link\b[^>]*rel="modulepreload"[^>]*>/g, "")
    .replace(runtimePattern, "")
    .replace(/<img\b[^>]*>/g, tag => tag.includes('alt="Brand Logo"')
      ? tag.replace(/\ssrc="[^"]*"/, ' src="/brand/unispot.svg"')
      : tag.includes("loading=") ? tag : tag.replace("<img", '<img loading="lazy"'))
    .replaceAll("https://ugency-wbs.framer.website/", "/")
    .replaceAll(">Book a call<", ">Explore<")
    .replaceAll("https://framerusercontent.com/assets/wxd9YkVlLwJDkRM4o16YIVJA1o.jpg", "/assets/unispot/opportunities/devfest-cloud-jakarta-2026.webp")
    .replace(
      '<script src="/scripts/unispot-rebrand.js" defer></script>',
      `<script data-unispot-runtime>
        function startUniSpotRuntime() {
          const runtime = document.createElement("script");
          runtime.type = "module";
          runtime.async = true;
          runtime.dataset.framerBundle = "main";
          runtime.src = ${JSON.stringify(runtimeUrl)};
          document.body.append(runtime);
        }
        if (document.documentElement.dataset.unispotStartup === "inline") startUniSpotRuntime();
        else document.addEventListener("unispot:ready", startUniSpotRuntime, { once: true });
      </script>`,
    )
    .replace("</body>", `<a href="${accountHref}" class="unispot-landing-account">${accountLabel}</a><style>.unispot-landing-account{position:fixed;right:24px;bottom:24px;z-index:9999;background:#bb267e;color:white;border-radius:30px;padding:12px 22px;font:500 13px/20px sans-serif;text-decoration:none;box-shadow:0 4px 24px #5b16482b}.unispot-landing-account:hover{background:#a4206d}@media(max-width:600px){.unispot-landing-account{right:16px;bottom:16px;padding:10px 18px}}</style></body>`)
    .replace("</head>", `<script>
      window.addEventListener("click", event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
        if (!anchor || (anchor.target && anchor.target !== "_self")) return;
        const destination = new URL(anchor.href, window.location.href);
        if (destination.origin !== window.location.origin || (destination.pathname === window.location.pathname && destination.search === window.location.search)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.assign(destination.href);
      }, true);
    </script><link rel="preload" href="/brand/unispot.svg" as="image" fetchpriority="high"><link rel="stylesheet" href="/brand/landing-theme.css"><link rel="stylesheet" href="/brand/landing-media-fit.css"><style data-unispot-critical>${criticalCss}</style><script data-unispot-adapter>${landingAdapterSource().replaceAll("</script", "<\\/script")}</script></head>`);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-UniSpot-Landing": "template-inline",
    },
  });
}
