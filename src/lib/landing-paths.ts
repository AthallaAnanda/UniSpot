// Runs inside the landing adapter's closure to reuse its text helpers while
// keeping audience content independent of Framer's Monthly/Yearly billing.
export function landingPathsScript() {
  return `
    let pathEventsBound = false;
    let observedPathSection = null;
    let pathObserver = null;
    let pathResizeObserver = null;
    const pathCards = {
      students: [
        { title: "Discover", value: "Find", description: "Find opportunities that fit your interests",
          features: ["Browse events, scholarships, and programs", "Filter by category and location", "Save opportunities to revisit", "Follow Hubs that interest you", "Check details and deadlines"],
          action: "Explore opportunities", href: "/explore" },
        { title: "Save", value: "Keep", description: "Keep the next steps in one place",
          features: ["Explore opportunities from Hubs", "See dates, formats, and locations", "Save the opportunities you like", "Follow communities and organizers", "Open the original source when ready"],
          action: "View saved", href: "/saved" },
        { title: "Follow", value: "Connect", description: "Start with the opportunity that feels right",
          features: ["Explore curated opportunities", "Browse local and international options", "Keep your saved list close", "Discover a new path forward", "Explore UniSpot today"],
          action: "Explore Hubs", href: "/hubs" }
      ],
      organizers: [
        { title: "Create a Hub", value: "Create", description: "Make a home for your community",
          features: ["Create a Hub for your opportunities", "Add your logo, cover, and links", "Share your Hub with students", "Publish opportunities in one place", "Manage drafts and published posts"],
          action: "Create a Hub", href: "/hubs/new" },
        { title: "Publish opportunities", value: "Publish", description: "Keep your community’s updates together",
          features: ["Add events, programs, and deadlines", "Publish details and official links", "Keep drafts private until ready", "Edit and update your opportunities", "Share a public Hub page"],
          action: "Add an opportunity", href: "/create" },
        { title: "Share your Hub", value: "Share", description: "Bring your next opportunity to UniSpot",
          features: ["Create a community Hub", "Add opportunities when they are ready", "Keep your page details up to date", "Share your Hub with students", "Publish through your Hub"],
          action: "Explore Hubs", href: "/hubs" }
      ]
    };
    const pathTabSelector = '[data-framer-name="Monthly"], [data-framer-name="Yearly"]';

    function pathAudience() {
      return window.__unispotAudience === "organizers" ? "organizers" : "students";
    }

    function positionPathIndicator(section) {
      section.querySelectorAll('[data-framer-name="Pricing Tab Link"]').forEach(track => {
        track.dataset.unispotPathTabs = "true";
        track.setAttribute("role", "group");
        track.setAttribute("aria-label", "Choose your path");
        track.querySelectorAll(pathTabSelector).forEach(tab => {
          const role = tab.getAttribute("data-framer-name") === "Yearly" ? "organizers" : "students";
          tab.setAttribute("role", "button");
          tab.setAttribute("tabindex", "0");
          tab.setAttribute("aria-pressed", String(role === pathAudience()));
          const label = tab.querySelector("p");
          const text = role === "organizers" ? "Organizers" : "Students";
          if (label && normalize(label.textContent) !== text) setNodeText(label, text);
          if (role === pathAudience() && tab.offsetWidth) {
            track.style.setProperty("--unispot-path-left", (tab.offsetLeft + 2) + "px");
            track.style.setProperty("--unispot-path-width", tab.offsetWidth + "px");
          }
        });
      });
    }

    function observePathSection() {
      if (observedPathSection && pathObserver) pathObserver.observe(observedPathSection, {
        subtree: true, childList: true, characterData: true, attributes: true,
        attributeFilter: ["href", "aria-pressed"]
      });
    }

    function syncUniSpotPaths(section, role = pathAudience()) {
      if (!section) return;
      pathObserver?.disconnect();
      try {
        window.__unispotAudience = role;
        // Responsive/runtime mounts can briefly contain multiple sets of cards.
        // Repair every set, not just the first three outgoing price nodes.
        section.querySelectorAll('[data-framer-name="Pre Title"] h3').forEach((heading, index) => {
          const expected = pathCards[role][index % 3].title;
          if (normalize(heading.textContent) !== expected) setNodeText(heading, expected);
        });
        section.querySelectorAll('[data-framer-name="Price"]').forEach((block, index) => {
          const value = block.querySelector("h3,h4,h5");
          const card = pathCards[role][index % 3];
          const expected = card.value;
          if (value && normalize(value.textContent) !== expected) value.textContent = expected;
          const period = block.querySelector('[data-framer-name="Month"]');
          if (period && normalize(period.textContent) !== "on UniSpot") setNodeText(period, "on UniSpot");
          const content = block.closest('[data-framer-name="Content"]');
          const description = content?.querySelector('[data-framer-name="Pre Title"] p');
          if (description && normalize(description.textContent) !== card.description) setNodeText(description, card.description);
          content?.querySelectorAll('[data-framer-name="List"] p').forEach((feature, featureIndex) => {
            const text = card.features[featureIndex];
            if (text && normalize(feature.textContent) !== text) setNodeText(feature, text);
          });
        });
        section.querySelectorAll("a.framer-xfgtC").forEach((anchor, index) => {
          const { action: label, href } = pathCards[role][index % 3];
          if (anchor.getAttribute("href") !== href) anchor.setAttribute("href", href);
          if (anchorLabel(anchor) !== label) setAnchorLabel(anchor, label);
        });
        positionPathIndicator(section);
      } finally {
        observePathSection();
      }
    }

    function pathNeedsSync(section) {
      const role = pathAudience();
      const values = Array.from(section.querySelectorAll('[data-framer-name="Price"] h3, [data-framer-name="Price"] h4, [data-framer-name="Price"] h5'));
      if (values.some((value, index) => normalize(value.textContent) !== pathCards[role][index % 3].value)) return true;
      const headings = Array.from(section.querySelectorAll('[data-framer-name="Pre Title"] h3'));
      if (headings.some((heading, index) => normalize(heading.textContent) !== pathCards[role][index % 3].title)) return true;
      const blocks = Array.from(section.querySelectorAll('[data-framer-name="Price"]'));
      if (blocks.some((block, index) => {
        const card = pathCards[role][index % 3];
        const content = block.closest('[data-framer-name="Content"]');
        const description = content?.querySelector('[data-framer-name="Pre Title"] p');
        if (description && normalize(description.textContent) !== card.description) return true;
        return Array.from(content?.querySelectorAll('[data-framer-name="List"] p') || []).some((feature, featureIndex) =>
          card.features[featureIndex] && normalize(feature.textContent) !== card.features[featureIndex]);
      })) return true;
      const actions = Array.from(section.querySelectorAll("a.framer-xfgtC"));
      if (actions.some((anchor, index) => {
        const { action: label, href } = pathCards[role][index % 3];
        return anchor.getAttribute("href") !== href || anchorLabel(anchor) !== label;
      })) return true;
      // Counter updates may restore only a dollar value, with none of the old
      // marketing keywords watched by the page-wide branding observer.
      if (/\\$\\s*\\d|\\bUGC\\b|For brands|Content strategy|Get growth plan|Unlock full service|\\/month|20% off/i.test(section.innerText)) return true;
      return Array.from(section.querySelectorAll(pathTabSelector)).some(tab => {
        const selected = (tab.getAttribute("data-framer-name") === "Yearly") === (role === "organizers");
        const label = tab.getAttribute("data-framer-name") === "Yearly" ? "Organizers" : "Students";
        return tab.getAttribute("aria-pressed") !== String(selected) || normalize(tab.querySelector("p")?.textContent) !== label;
      });
    }

    function handlePathControl(event) {
      const tab = event.target instanceof Element ? event.target.closest(pathTabSelector) : null;
      const section = tab?.closest('main > [data-framer-name="Pricing"]');
      if (!section) return;
      const keys = ["Enter", " ", "ArrowLeft", "ArrowRight", "Home", "End"];
      if ((event.type === "keydown" || event.type === "keyup") && !keys.includes(event.key)) return;
      // Document capture runs before React/Framer's delegated gesture handlers.
      // A path selection must never start a Monthly/Yearly price animation.
      event.stopImmediatePropagation();
      if (event.type !== "click" && event.type !== "keydown") return;
      event.preventDefault();
      let role = tab.getAttribute("data-framer-name") === "Yearly" ? "organizers" : "students";
      if (event.key === "Home") role = "students";
      else if (event.key === "End") role = "organizers";
      else if (event.key === "ArrowLeft" || event.key === "ArrowRight") role = pathAudience() === "students" ? "organizers" : "students";
      syncUniSpotPaths(section, role);
      const target = section.querySelector(role === "organizers" ? '[data-framer-name="Yearly"]' : '[data-framer-name="Monthly"]');
      target?.focus({ preventScroll: true });
    }

    function setupUniSpotPaths(section) {
      if (!section) return;
      section.dataset.unispotRoleSwitch = "true";
      if (observedPathSection !== section) {
        pathObserver?.disconnect();
        pathResizeObserver?.disconnect();
        observedPathSection = section;
        pathObserver = new MutationObserver(() => {
          if (pathNeedsSync(section)) syncUniSpotPaths(section);
        });
        pathResizeObserver = new ResizeObserver(() => positionPathIndicator(section));
        pathResizeObserver.observe(section);
      }
      syncUniSpotPaths(section);
      if (!pathEventsBound) {
        pathEventsBound = true;
        ["pointerdown", "pointerup", "mousedown", "mouseup", "touchstart", "touchend", "click", "keydown", "keyup"].forEach(type => {
          document.addEventListener(type, handlePathControl, { capture: true });
        });
      }
    }
  `;
}
