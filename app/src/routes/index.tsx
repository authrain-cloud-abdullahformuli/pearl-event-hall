import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { InquiryForm } from "@/components/inquiry-form";
import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { scrollScrubScenes, scrollScrubTheme } from "@/scroll-scrub-scenes";

export const Route = createFileRoute("/")({
  component: Index,
});

function useScrollParallax(speed: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      setOffset(progress * speed);
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [speed]);

  return { ref, offset };
}

const PHONE_DISPLAY = "(916) 709-7157";
const PHONE_TEL = "tel:+19167097157";
const ADDRESS = "2118 El Camino Ave, Sacramento, CA 95821";
const MAPS_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=2118+El+Camino+Ave%2C+Sacramento%2C+CA+95821";

const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "EventVenue",
  name: "Pearl Event Hall",
  image: "/assets/images/og-image.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2118 El Camino Ave",
    addressLocality: "Sacramento",
    addressRegion: "CA",
    postalCode: "95821",
    addressCountry: "US",
  },
  telephone: "+1-916-709-7157",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "32",
  },
});

function Index() {
  const bgLayer = useScrollParallax(-26);
  const ornamentLayer = useScrollParallax(-14);
  const textLayer = useScrollParallax(8);

  return (
    <main className="pearl-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON_LD }}
      />

      <nav className="pearl-nav">
        <a href="#top" className="pearl-nav__brand">
          <img src="/assets/images/logo.png" alt="" />
          Pearl Event Hall
        </a>
        <a href="#inquire" className="pearl-nav__cta">
          Request a Date
        </a>
      </nav>

      <div id="top">
        <ScrollScrub scenes={scrollScrubScenes} theme={scrollScrubTheme} />
      </div>

      <section className="pearl-section" id="about">
        <div className="pearl-about">
          <div className="pearl-about__art">
            <div
              ref={bgLayer.ref}
              className="pearl-about__layer"
              style={{ transform: `translate3d(0, ${bgLayer.offset}px, 0)` }}
            >
              <img
                src="/assets/images/foyer-content.jpg"
                alt="Candlelit foyer entrance at Pearl Event Hall"
              />
            </div>
            <div
              ref={ornamentLayer.ref}
              className="pearl-about__ornament"
              style={{
                transform: `translate3d(0, ${ornamentLayer.offset}px, 0)`,
              }}
            />
          </div>
          <div
            ref={textLayer.ref}
            className="pearl-about__text"
            style={{ transform: `translate3d(0, ${textLayer.offset}px, 0)` }}
          >
            <p className="pearl-eyebrow">About the Venue</p>
            <h2 className="pearl-heading">
              A Sacramento events space built for elegant celebrations
            </h2>
            <p className="pearl-body">
              Pearl Event Hall is an event venue in Sacramento known for its
              clean, elegant design — guests describe the lighting and décor
              as sophisticated and well-suited to weddings and special
              occasions. The hall is led by owner Sahar, whose family's
              cooking has become part of what guests remember most, alongside
              a team reviewers call professional, friendly, and attentive.
            </p>
            <div className="pearl-tags">
              <span className="pearl-tag">4.9★ on Google · 32 reviews</span>
              <span className="pearl-tag">Weddings &amp; engagements</span>
              <span className="pearl-tag">Afghan cuisine</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pearl-section pearl-section--alt" id="services">
        <p className="pearl-eyebrow pearl-center">Occasions We Host</p>
        <h2 className="pearl-heading pearl-center">
          A hall for the moments that matter
        </h2>
        <div className="pearl-cards">
          <article className="pearl-card">
            <h3>Weddings</h3>
            <p>
              Guests describe the hall as beautiful and well-maintained, with
              lighting and décor that create an elegant, romantic atmosphere
              for a wedding reception.
            </p>
          </article>
          <article className="pearl-card">
            <h3>Engagement Parties</h3>
            <p>
              A clean, sophisticated setting for engagement celebrations,
              with an attentive staff on hand to keep the evening running
              smoothly.
            </p>
          </article>
          <article className="pearl-card">
            <h3>Special Celebrations</h3>
            <p>
              From family milestones to community gatherings, the hall pairs
              its emerald-and-gold interior with a fresh, flavorful Afghan
              menu.
            </p>
          </article>
        </div>
      </section>

      <section className="pearl-section" id="reviews">
        <p className="pearl-eyebrow pearl-center">What Guests Say</p>
        <h2 className="pearl-heading pearl-center">
          4.9 stars from 32 Google reviews
        </h2>
        <div className="pearl-reviews">
          <div className="pearl-review">
            <div className="pearl-review__stars">★★★★★</div>
            <p>&ldquo;Great food, great service, and a nice atmosphere.&rdquo;</p>
            <span>Google review</span>
          </div>
          <div className="pearl-review">
            <div className="pearl-review__stars">★★★★★</div>
            <p>&ldquo;Tasty food, quick service, and a comfortable vibe.&rdquo;</p>
            <span>Google review</span>
          </div>
          <div className="pearl-review">
            <div className="pearl-review__stars">★★★★★</div>
            <p>
              &ldquo;Sahar's mother is truly blessed by God with an incredible
              gift for cooking.&rdquo;
            </p>
            <span>Google review</span>
          </div>
        </div>
      </section>

      <section className="pearl-section pearl-section--alt" id="inquire">
        <p className="pearl-eyebrow pearl-center">Book Your Date</p>
        <h2 className="pearl-heading pearl-center">
          Check availability &amp; schedule a tour
        </h2>
        <p className="pearl-body pearl-body--center">
          Tell us about your celebration and preferred date. We&rsquo;ll
          confirm availability and follow up with details.
        </p>
        <div className="pearl-form-wrap">
          <InquiryForm phoneDisplay={PHONE_DISPLAY} phoneTel={PHONE_TEL} />
        </div>
      </section>

      <section className="pearl-section" id="location">
        <p className="pearl-eyebrow pearl-center">Visit Us</p>
        <h2 className="pearl-heading pearl-center">Plan your visit</h2>
        <div className="pearl-location">
          <div className="pearl-location__card">
            <div className="pearl-location__row">
              <span className="pearl-location__icon" aria-hidden="true">
                📍
              </span>
              <div>
                <strong>{ADDRESS}</strong>
              </div>
            </div>
            <div className="pearl-location__row">
              <span className="pearl-location__icon" aria-hidden="true">
                📞
              </span>
              <div>
                <a href={PHONE_TEL} className="pearl-inherit-link">
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>
            <div className="pearl-actions">
              <a
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noreferrer"
                className="pearl-btn pearl-btn--solid"
              >
                Get Directions
              </a>
              <a href="#inquire" className="pearl-btn pearl-btn--outline">
                Request a Date
              </a>
            </div>
          </div>
          <div className="pearl-location__card">
            <p className="pearl-body pearl-body--wide">
              Pearl Event Hall sits on El Camino Avenue in Sacramento. Tap
              &ldquo;Get Directions&rdquo; for turn-by-turn navigation, or
              request your date online or call ahead to check availability.
            </p>
          </div>
        </div>
      </section>

      <footer className="pearl-footer">
        <div className="pearl-footer__brand">
          <img src="/assets/images/logo.png" alt="" />
          Pearl Event Hall
        </div>
        <div className="pearl-footer__meta">
          {ADDRESS}
          <br />
          <a href={PHONE_TEL}>{PHONE_DISPLAY}</a> ·{" "}
          <a href={MAPS_DIRECTIONS_URL} target="_blank" rel="noreferrer">
            Get Directions
          </a>
        </div>
      </footer>
    </main>
  );
}
