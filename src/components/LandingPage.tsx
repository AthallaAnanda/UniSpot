import Link from "next/link";
import localFont from "next/font/local";
import { ArrowRight, Bookmark, Check, Compass, GraduationCap, HeartHandshake, Layers, MapPin, Sparkles, UsersRound, X } from "lucide-react";
import { categories } from "@/lib/unispot";
import { seedCatalog } from "@/lib/catalog-seed";
import landingMedia from "@/data/landing-media.json";
import { LandingNavigation, LandingPaths, LandingStories } from "./LandingControls";
import "./LandingPage.css";

const display = localFont({
  src: "../../public/assets/fonts/ZgNQjPxGPbbJUZemjC35hmHmNpCO.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-landing-display",
  display: "swap",
});

const services = [
  { title: "Events & workshops", description: "Find seminars, workshops, and hands-on activities to learn with people who share your interests.", features: ["Browse by category", "Find online and local events", "Check dates and details"], word: "Explore", caption: "Find your next event", href: "/explore?category=events", image: landingMedia.images.events, icon: Compass, tint: "peach" },
  { title: "Scholarships & study abroad", description: "Explore funding, exchange, and learning opportunities for your next academic step.", features: ["Find programs by interest", "Review eligibility", "Check deadlines"], word: "Learn", caption: "Explore programs", href: "/explore?category=scholarships", image: landingMedia.images.scholarships, icon: GraduationCap, tint: "lilac" },
  { title: "Career & competitions", description: "Build practical skills, take on a challenge, and find experiences that support your next career step.", features: ["Try new challenges", "Build practical skills", "Learn at your own pace"], word: "Grow", caption: "Grow through experience", href: "/explore?category=career", image: landingMedia.images.career, icon: Sparkles, tint: "blue" },
  { title: "Volunteering & communities", description: "Meet people who share your interests, explore volunteer projects, and find a community to follow.", features: ["Follow a Hub", "Explore community activities", "Find ways to contribute"], word: "Connect", caption: "Stay close to your communities", href: "/explore?category=volunteering", image: landingMedia.images.volunteering, icon: HeartHandshake, tint: "green" },
];

const featured = [
  { id: "lpdp-naist-2026", title: "LPDP–NAIST Scholarship", category: "Scholarship", detail: "Japan · Graduate study", description: "Explore LPDP’s partnership scholarship for master’s and doctoral study at Nara Institute of Science and Technology.", stats: [["3", "Study areas"], ["2", "Degree levels"]] },
  { id: "devfest-cloud-jakarta-2026", title: "DevFest Cloud Jakarta 2026", category: "Events & technology", detail: "Jakarta · Community", description: "Explore five technology tracks, connect with local developers, and learn directly from industry leaders in Jakarta.", stats: [["5", "Focus areas"], ["3", "Community benefits"]] },
  { id: "google-ai-essentials", title: "Google AI Essentials", category: "Online learning", detail: "Online · Self-paced", description: "Build practical generative-AI skills with a five-module, self-paced course from Google.", stats: [["5", "Course modules"], ["15", "Hours of self-paced learning"]] },
];

const hubDescriptions: Record<string, string> = {
  gdg: "Discover developer communities and hands-on technology opportunities.",
  lpdp: "Explore scholarships for Indonesian talent pursuing postgraduate study at home or abroad.",
  itb: "Discover academic conferences, campus conversations, and research opportunities.",
  indorelawan: "Explore volunteering projects and social causes across Indonesia.",
  google: "Build practical skills in AI, design, data, and more.",
  erasmus: "Explore study exchanges and international learning opportunities.",
  kaggle: "Practice data science, explore competitions, and learn with a global community.",
};

function Action({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
  return <Link href={href} prefetch={false} className={`lp-button${secondary ? " lp-button-light" : ""}`}><span className="lp-button-icon"><ArrowRight size={21} strokeWidth={1.5} aria-hidden="true" /></span><span>{children}</span></Link>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="lp-eyebrow"><span aria-hidden="true" />{children}</p>;
}

function SectionHeading({ label, children, id }: { label: string; children: React.ReactNode; id: string }) {
  return <div className="lp-section-heading"><Eyebrow>{label}</Eyebrow><h2 id={id}>{children}</h2></div>;
}

export default function LandingPage() {
  return <div className={`lp ${display.variable}`}>
    <a className="lp-skip" href="#landing-main">Skip to content</a>
    <LandingNavigation />
    <main id="landing-main">
      <section className="lp-hero" aria-labelledby="landing-title">
        <div className="lp-hero-copy">
          <p className="lp-hero-badge">There are many ways to grow.</p>
          <h1 id="landing-title">Your next step<br />can start here.</h1>
          <p className="lp-hero-description">Find your next step—and the community to grow with.</p>
          <Action href="/explore">Explore opportunities</Action>
        </div>
        <LandingStories />
        <div className="lp-hero-foot"><p>Opportunities are everywhere. Start exploring.</p><div className="lp-category-links" aria-label="Opportunity categories">{categories.map(category => <Link prefetch={false} key={category.id} href={`/explore?category=${category.id}`}>{category.name}</Link>)}</div></div>
      </section>

      <section className="lp-problem lp-section" aria-labelledby="landing-problem-title">
        <div className="lp-container lp-problem-layout"><Eyebrow>Finding your next step?</Eyebrow><div><h2 id="landing-problem-title">Opportunities are scattered across sites, groups, and timelines.<span> Deadlines can be hard to track.</span></h2><p>Each opportunity comes with its own source, deadline, and application details to keep track of. Find more opportunities in one place with UniSpot.</p><div className="lp-problem-note"><span className="lp-symbol"><Layers size={25} strokeWidth={1.4} /></span><p>Less searching. More possibilities.<br /><span>Find your people. Find your possibilities.</span></p></div></div></div>
      </section>

      <section className="lp-mission lp-section" aria-labelledby="landing-mission-title">
        <div className="lp-container lp-mission-layout"><div className="lp-mission-image"><img src={landingMedia.images.mission.src} alt={landingMedia.images.mission.alt} width={1200} height={900} loading="lazy" /><div className="lp-mission-words"><span>Find</span><span>Follow</span><span>Grow</span></div></div><div className="lp-mission-copy"><Eyebrow>Our mission</Eyebrow><h2 id="landing-mission-title">We bring opportunities closer to students.</h2><p>UniSpot brings opportunities and the communities behind them into one place, so students can find and follow what matters.</p><Action href="/discover">Discover UniSpot</Action></div></div>
      </section>

      <section className="lp-services lp-section" aria-labelledby="landing-services-title">
        <div className="lp-container"><SectionHeading label="Explore your possibilities" id="landing-services-title">What you can explore</SectionHeading><div className="lp-service-stack">{services.map((service, index) => <article className={`lp-service lp-tint-${service.tint}`} key={service.title}><div className="lp-service-copy"><span className="lp-service-number">0{index + 1} / <service.icon size={19} strokeWidth={1.5} aria-hidden="true" /></span><h3>{service.title}</h3><p>{service.description}</p><ul>{service.features.map(feature => <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>)}</ul><Action href={service.href}>Explore opportunities</Action></div><div className="lp-service-visual"><img src={service.image.src} alt={service.image.alt} width={640} height={520} loading="lazy" /><div className="lp-service-caption"><strong>{service.word}</strong><span>{service.caption}</span></div></div></article>)}</div></div>
      </section>

      <section className="lp-featured lp-section" aria-labelledby="landing-featured-title">
        <div className="lp-container"><SectionHeading label="Featured opportunities" id="landing-featured-title">Find opportunities that move you forward.</SectionHeading><div className="lp-featured-grid">{featured.map(item => {
          const opportunity = seedCatalog.opportunities.find(opportunity => opportunity.id === item.id)!;
          return <article className="lp-featured-card" key={item.id}><Link href={`/opportunities/${item.id}`} prefetch={false} className="lp-featured-image" aria-label={`View ${item.title}`}><img src={opportunity.image} alt={item.title} width={580} height={430} loading="lazy" /><span className="lp-featured-arrow"><ArrowRight size={24} aria-hidden="true" /></span></Link><div className="lp-featured-copy"><div className="lp-tags"><span>{item.category}</span><span>{item.detail}</span></div><h3><Link href={`/opportunities/${item.id}`} prefetch={false}>{item.title}</Link></h3><p>{item.description}</p><div className="lp-featured-stats">{item.stats.map(([number, label]) => <div key={label}><strong>{number}</strong><span>{label}</span></div>)}</div><Link href={`/opportunities/${item.id}`} prefetch={false} className="lp-text-link">View opportunity<ArrowRight size={16} aria-hidden="true" /></Link></div></article>;
        })}</div><div className="lp-section-foot"><p>Explore opportunities across events, scholarships, learning, volunteering, and communities.</p><Action href="/explore">Explore all opportunities</Action></div></div>
      </section>

      <section className="lp-compare lp-section" aria-labelledby="landing-compare-title">
        <div className="lp-container"><SectionHeading label="Why UniSpot" id="landing-compare-title">A clearer way to find your next opportunity.</SectionHeading><div className="lp-compare-grid"><div className="lp-compare-intro"><span className="lp-symbol"><Compass size={30} strokeWidth={1.3} /></span><h3>On UniSpot</h3><p>One searchable catalog.<br />A clearer next step.</p><Action href="/explore">Start exploring</Action></div><div className="lp-compare-column"><h3>When information is scattered</h3><ul>{["Separate tabs and feeds", "Deadlines are easy to miss", "Details can be hard to find", "Every source has a different format", "Opportunities can be hard to revisit", "Good opportunities get overlooked"].map(text => <li key={text}><X size={17} aria-hidden="true" />{text}</li>)}</ul></div><div className="lp-compare-column lp-compare-positive"><img src="/brand/unispot.svg" alt="UniSpot" width={124} height={37} /><ul>{["Browse across categories", "Explore by location", "Save opportunities", "Follow Hubs", "Find source links", "Create a Hub"].map(text => <li key={text}><Check size={17} aria-hidden="true" />{text}</li>)}</ul></div></div></div>
      </section>

      <section className="lp-steps lp-section" aria-labelledby="landing-steps-title">
        <div className="lp-container"><SectionHeading label="How it works" id="landing-steps-title">Four steps to your next opportunity with UniSpot.</SectionHeading><div className="lp-step-grid">{[
          { title: "Discover opportunities", description: "Explore opportunities by interest, format, and location.", icon: Compass, label: "8 opportunity categories", href: "/explore", action: "Explore by category" },
          { title: "Choose your Hub", description: "Follow a community, organizer, institution, or program that matches your interests.", icon: UsersRound, label: "Find your communities", href: "/hubs", action: "Explore Hubs" },
          { title: "Save what matters", description: "Keep opportunities in your Saved collection and come back when you’re ready.", icon: Bookmark, label: "Keep your next steps close", href: "/saved", action: "Your saved opportunities" },
          { title: "Take your next step", description: "Review the details, check the official source, and choose the opportunity that feels right for you.", icon: ArrowRight, label: "Your choice. Your possibilities.", href: "/discover", action: "Find your next opportunity" },
        ].map((step, index) => <article className="lp-step" key={step.title}><span className="lp-step-number">S/{index + 1}</span><div className="lp-step-illustration"><step.icon size={64} strokeWidth={1} aria-hidden="true" /><span>{step.label}</span></div><h3>{step.title}</h3><p>{step.description}</p><Link href={step.href} prefetch={false} className="lp-text-link">{step.action}<ArrowRight size={16} aria-hidden="true" /></Link></article>)}</div></div>
      </section>

      <section className="lp-glance lp-section" aria-labelledby="landing-glance-title">
        <div className="lp-container"><SectionHeading label="UniSpot at a glance" id="landing-glance-title">Built for students. Open to every possibility.</SectionHeading><div className="lp-stat-grid">{[["8", "Opportunity categories to explore."], ["1", "Place to find your next opportunity."], ["Follow", "Hubs that share opportunities and activities."], ["Save", "Keep opportunities you want to revisit."]].map(([number, label]) => <div className="lp-stat" key={number}><strong>{number}</strong><p>{label}</p></div>)}</div><div className="lp-glance-tags">{["Browse by category", "Explore by location", "Save opportunities", "Follow a Hub", "Check dates and deadlines", "Open official source links"].map(text => <span key={text}><Check size={15} aria-hidden="true" />{text}</span>)}</div></div>
      </section>

      <section className="lp-hubs lp-section" aria-labelledby="landing-hubs-title">
        <div className="lp-container"><SectionHeading label="Opportunity Hubs" id="landing-hubs-title">Follow the Hubs behind your next opportunity.</SectionHeading><p className="lp-section-description">One page for a community, organizer, institution, or program to share opportunities.</p><div className="lp-hub-grid">{seedCatalog.calendars.map(hub => <Link href={`/hubs/${hub.slug}`} prefetch={false} className="lp-hub-card" key={hub.id}><img src={hub.logo} alt="" width={48} height={48} loading="lazy" /><p>{hubDescriptions[hub.id]}</p><div><h3>{hub.name}</h3><span>Curated by UniSpot</span></div><ArrowRight className="lp-hub-arrow" size={18} aria-hidden="true" /></Link>)}</div><div className="lp-hubs-foot"><p>More sources to discover on UniSpot</p><Action href="/hubs">Explore Hubs</Action></div></div>
      </section>

      <section className="lp-paths lp-section" aria-labelledby="landing-paths-title">
        <div className="lp-container"><SectionHeading label="Choose your path" id="landing-paths-title">There’s a place for you on UniSpot.</SectionHeading><LandingPaths /><p className="lp-paths-note">Opportunities from communities and organizations.<br />A place for student communities and campus organizers to share what’s next.</p></div>
      </section>

      <section className="lp-cta lp-section" aria-labelledby="landing-cta-title"><div className="lp-container"><Eyebrow>Ready?</Eyebrow><h2 id="landing-cta-title">Your next chapter starts somewhere.</h2><p>Find an opportunity, follow a Hub, and see where your curiosity takes you.</p><div className="lp-cta-actions"><Action href="/explore">Explore opportunities</Action><Action href="/hubs" secondary>Explore Hubs</Action></div><div className="lp-cta-stickers" aria-hidden="true"><span><GraduationCap size={32} strokeWidth={1.4} />Learn</span><span><MapPin size={32} strokeWidth={1.4} />Discover</span><span><UsersRound size={32} strokeWidth={1.4} />Belong</span></div></div></section>
    </main>
    <footer className="lp-footer"><div className="lp-container"><div className="lp-footer-main"><div><Link href="/" prefetch={false} aria-label="UniSpot home"><img src="/brand/unispot.svg" alt="UniSpot" width={150} height={45} /></Link><p>A home for student opportunities<br />and the Hubs that share them.</p></div><div><h2>Explore UniSpot</h2><nav aria-label="Footer navigation"><Link href="/discover" prefetch={false}>Discover</Link><Link href="/explore" prefetch={false}>Opportunities</Link><Link href="/hubs" prefetch={false}>Hubs</Link><Link href="/saved" prefetch={false}>Saved</Link></nav></div><div className="lp-footer-next"><h2>Find what’s next.</h2><p>Find your people.<br />Find your possibilities.</p><Action href="/hubs/new">Create a Hub</Action></div></div><div className="lp-footer-bottom"><span>© {new Date().getFullYear()} UniSpot</span><span>Made for your next chapter.</span><a href="#landing-title">Back to top ↑</a></div></div></footer>
  </div>;
}
