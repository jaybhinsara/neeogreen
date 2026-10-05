import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Service pages from earlier versions of the site, still known to Google.
  // Each points at its closest current equivalent so links and any ranking
  // signal carry over; services we no longer offer go to the homepage.
  redirects() {
    return [
      { source: "/services/software-web-development", destination: "/services/web-development", permanent: true },
      { source: "/services/it-consulting", destination: "/services/managed-it-support", permanent: true },
      { source: "/services/networking-infrastructure", destination: "/services/managed-it-support", permanent: true },
      { source: "/services/brand-identity", destination: "/services/web-design", permanent: true },
      { source: "/services/packaging-design", destination: "/", permanent: true },
      { source: "/services/digital-marketing", destination: "/", permanent: true },
      { source: "/reviews", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
