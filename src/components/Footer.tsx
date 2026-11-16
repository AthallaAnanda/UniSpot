import { memo } from "react";
import Link from "next/link";

export default memo(function Footer({ onAbout, onDiscover }: { onAbout: () => void; onDiscover: () => void }) {
  return <footer className="site-footer"><div className="footer-main"><Link className="brand footer-brand" href="/" aria-label="UniSpot home"><img src="/brand/unispot.svg" alt="UniSpot" width={90} height={27} /></Link><div className="footer-links"><button type="button" onClick={onDiscover}>Discover</button><Link href="/hubs">Hubs</Link><button type="button" onClick={onAbout}>About UniSpot</button></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} UniSpot</span><span>Find your people. Find your possibilities.</span></div></footer>;
});
