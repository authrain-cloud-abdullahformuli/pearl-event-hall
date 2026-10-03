import type {
  ScrollScrubScene,
  ScrollScrubTheme,
} from "@/components/scroll-scrub/scroll-scrub";

export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#C9A24B",
  background: "#0B2E24",
  ink: "#F5EFE2",
  muted: "#9FB6A8",
};

export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    id: "arrival-to-toast",
    label: "Pearl Event Hall",
    poster: "/assets/world/hero-poster.jpg",
    mobilePoster: "/assets/world/hero-poster-mobile.jpg",
    clip: "/assets/world/hero-desktop.mp4",
    mobileClip: "/assets/world/hero-mobile.mp4",
    title: "An Evening Worth Remembering",
    body: "Step through candlelit halls into a night built for celebration — weddings, engagements, and gatherings that deserve to shine.",
    kicker: "Sacramento, California",
    tags: ["4.9★ · 32 Google reviews", "Elegant hall · Afghan cuisine"],
  },
];
