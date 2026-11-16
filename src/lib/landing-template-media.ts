import media from "@/data/landing-media.json";

const [discover, join, grow, belong, mission, community, learning, collaboration] = media.stories;

// Match asset identities, not layout selectors: Framer can mount responsive
// variants and carousel slides without losing their original presentation.
export const templateVideos = {
  "GsatuRo0ahv30Z35pWEwY9JdI.mp4": discover,
  "Yr3h6vs18YgoJyP4oOCGaFpHmJE.mp4": join,
  "t25dQNGMbKkZQdQu2KYsbP47hM.mp4": grow,
  "ZYorOsJ4jzoltpYhCs3aEfVX3Q.mp4": belong,
  "bUASY9LUHlaH1m0tp8RYESupMI.mp4": mission,
  "SWODJdI19vPxO1TAW2LkxWfLk.mp4": community,
  "hvPLPJv81nVfbJnCYWM8G5AZW0.mp4": learning,
  "yeYR1LgYjyounDDCKcy4B4kg8.mp4": collaboration,
};

const images: Record<string, string> = {
  "ADczkIFbhujgD5Z1FLUbTwZT2ZY.png": "/api/hub-illustration",
  "tPRScvGRoFh8w1d1IY5rvxOls.jpg": "/assets/unispot/landing/cta-8199602.webp",
  "BKPUVzMdRlzUay3lrRTiHIKJ0XY.jpg": "/assets/unispot/landing/cta-7972485.webp",
  "rmnTdx8oYe32FX4UjODhD8eJ9js.jpg": "/assets/unispot/landing/cta-8199143.webp",
  "eIsSmfE68ShnSc8AZNgTGIb2Ybk.jpg": "/assets/unispot/landing/cta-16420457.webp",
  "ze5ggweYTwLpm9w2sFQV6WoAA.jpg": "/assets/unispot/landing/cta-8199223.webp",
  "k7RUh8jvV0TQG8ky5dPsS4f4s.jpg": "/assets/unispot/landing/cta-31367502.webp",
  "oAd5HjtSqlSuCyV3ny0VxMDWdQ.jpg": "/assets/unispot/landing/cta-8199602.webp",
  "F1Z58EHA4RvaOpTpwgpclgf0rek.jpg": "/assets/unispot/landing/cta-7972485.webp",
  "aw8ltwqcECPLOBauCmpaa4QGIw.jpg": "/assets/unispot/landing/cta-8199143.webp",
  "3TH6vi70C4Ov8gKWQp3NdUYAxlY.jpg": "/assets/unispot/landing/cta-16420457.webp",
  "2htiFeBv1PUNSrc9KIvYgCp7V5U.jpg": "/assets/unispot/landing/cta-8199223.webp",
  "sMdMuOCAMpsX67Tp1f5pvnWLf7Y.jpg": "/assets/unispot/landing/cta-31367502.webp",
  "ROpmkONrXm8u24WgauP8WBr0.jpg": discover.poster,
  "6dB5t8LvBxA1J9wXuEBvXYIdfI.jpg": join.poster,
  "OdsGZSiPD29RIrc3ulCs3EYVk.jpg": belong.poster,
  "2DtyZyqdQ12ukNWJhQgKvPzRuek.jpg": mission.poster,
  "n5bgDypSxu2scZTdA3kExJCOF3w.png": community.poster,
  "56krO2z74IcCzB2bPqOc9uBUVg.png": learning.poster,
  "Wt2XCZpOQGAQw1CeTKIRhfkrSrY.png": collaboration.poster,
  "ylW2EW6RMhsJtMog8Tf2AupXA.jpg": media.images.mission.src,
  "b4AD9fZsmatruxxVo4g1prdRndc.jpg": media.images.events.src,
  "WdTf0zL0GaUP4c8rQieARW4yzJw.jpg": media.images.scholarships.src,
  "l3R3hJN7IfFLHl0Lk2CpPPZ3Vo.jpg": media.images.career.src,
  "KWeBr23rXlvptcYLkZ2uE9HPzI.jpg": media.images.volunteering.src,
  "j6DpFLZyAbacJElWjs065SEIg.jpg": "/assets/unispot/landing/students-library-8199558.webp",
  "h0cdHp0vDGvVsbe0ZErKFz1rHU.jpg": "/assets/unispot/landing/career-competitions.webp",
  "XjTPRbUjHyDKhh6fxOM5ovxI.jpg": "/assets/unispot/opportunities/lpdp.webp",
  "atlJfWOpXo0ggOZlbH9cQzFgMSc.jpg": "/assets/unispot/opportunities/devfest-cloud-jakarta-2026.webp",
  "SA0IUSyJ6tpWVEbTk6WgvRkt0.jpg": "/assets/unispot/opportunities/google-ai.webp",
};

const replacements: Record<string, string> = {
  ...images,
  ...Object.fromEntries(Object.entries(templateVideos).map(([name, video]) => [name, video.src])),
};

export function replaceTemplateAssets(source: string) {
  return source
    .replace(/(?:https:\/\/framerusercontent\.com\/(?:assets|images)\/|\/assets\/(?:misc|images)\/)([^?"'\s<>\\]+)(?:\?[^"'\s<>\\]*)?/g,
      (original, name: string) => replacements[name] ?? original)
    .replaceAll("/assets/unispot/opportunities/google-community.webp", media.images.mission.src);
}

export function templateMediaSyncScript() {
  return `
    const mediaVideos = ${JSON.stringify(templateVideos)};
    const mediaImages = ${JSON.stringify(images)};
    const hubIllustrationAlt = "Explore Hubs including Google Developer Groups, LPDP, Institut Teknologi Bandung, Indorelawan and Kaggle, or create a Hub for your community.";
    const categoryImageAlts = ${JSON.stringify(Object.fromEntries([media.images.events, media.images.scholarships, media.images.career, media.images.volunteering].map(image => [image.src, image.alt])))};
    const videoByPath = new Map(Object.values(mediaVideos).map(video => [video.src, video]));
    const phoneStories = ${JSON.stringify({ "Video 01": collaboration, "Video 02": learning, "Video 03": community })};
    function syncTemplateMedia(root = document) {
      const elements = root instanceof Element && root.matches("img,video")
        ? [root] : Array.from(root.querySelectorAll?.("img,video") || []);
      for (const element of elements) {
        const path = new URL(element.getAttribute("src") || "", location.href).pathname;
        const name = path.split("/").pop();
        if (element instanceof HTMLImageElement) {
          if (element.closest('[data-framer-name="Mobile Reels"] .framer-l8hd00')) {
            element.removeAttribute("srcset");
            if (element.getAttribute("src") !== "/brand/unispot-icon.svg") element.setAttribute("src", "/brand/unispot-icon.svg");
            element.alt = "";
            continue;
          }
          const destination = mediaImages[name];
          if (destination) {
            element.removeAttribute("srcset");
            if (element.getAttribute("src") !== destination) element.setAttribute("src", destination);
          }
          const currentPath = new URL(element.getAttribute("src") || "", location.href).pathname;
          if (currentPath === "/api/hub-illustration") element.alt = hubIllustrationAlt;
          if (currentPath === "/assets/unispot/landing/students-library-8199558.webp") element.alt = "Students studying and discussing together in a university library";
          if (element.closest('[data-framer-name="Services"]') && categoryImageAlts[currentPath]) {
            element.alt = categoryImageAlts[currentPath];
          }
        } else {
          const phoneFrame = element.closest('[data-framer-name="Mobile Reels"] [data-framer-name^="Video 0"]');
          const story = phoneStories[phoneFrame?.getAttribute("data-framer-name")] || mediaVideos[name] || videoByPath.get(path);
          if (!story) continue;
          if (element.getAttribute("src") !== story.src) element.setAttribute("src", story.src);
          if (element.getAttribute("poster") !== story.poster) element.setAttribute("poster", story.poster);
          element.setAttribute("aria-label", story.label + ": " + story.description);
        }
      }
    }
    const mediaObserver = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === "attributes") syncTemplateMedia(record.target);
        else record.addedNodes.forEach(node => { if (node instanceof Element) syncTemplateMedia(node); });
      }
    });
    mediaObserver.observe(document.documentElement, {
      subtree: true, childList: true, attributes: true, attributeFilter: ["src", "poster"]
    });
    syncTemplateMedia();
  `;
}
