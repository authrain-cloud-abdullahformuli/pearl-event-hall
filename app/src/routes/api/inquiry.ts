import { createFileRoute } from "@tanstack/react-router";

import { bindings } from "@/lib/bindings.server";

const EVENT_TYPES = [
  "Wedding",
  "Engagement Party",
  "Birthday / Anniversary",
  "Corporate / Community Event",
  "Other",
];
const TIMES_OF_DAY = ["Morning", "Afternoon", "Evening"];
const CONTACT_PREFS = ["Phone call", "Text message", "Email"];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(value);
}

export const Route = createFileRoute("/api/inquiry")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let raw: Record<string, unknown>;
        try {
          raw = (await request.json()) as Record<string, unknown>;
        } catch {
          return json({ ok: false, error: "Invalid request." }, 400);
        }

        // Honeypot — real visitors never fill this hidden field. Pretend success to bots.
        if (clean(raw.website, 200)) return json({ ok: true });

        const name = clean(raw.name, 120);
        const email = clean(raw.email, 160);
        const phone = clean(raw.phone, 40);
        const eventType = clean(raw.eventType, 60);
        const eventDate = clean(raw.eventDate, 10);
        const altDate = clean(raw.altDate, 10);
        const timeOfDay = clean(raw.timeOfDay, 20);
        const contactPref = clean(raw.contactPref, 30);
        const message = clean(raw.message, 2000);
        const wantsTour = raw.wantsTour === true ? 1 : 0;
        const guestRaw = Number(raw.guestCount);
        const guestCount =
          Number.isFinite(guestRaw) && guestRaw > 0 ? Math.min(Math.round(guestRaw), 2000) : null;

        const errors: Record<string, string> = {};
        if (name.length < 2) errors.name = "Please enter your name.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email.";
        if (phone.replace(/\D/g, "").length < 7) errors.phone = "Please enter a valid phone number.";
        if (!EVENT_TYPES.includes(eventType)) errors.eventType = "Please choose an event type.";
        if (!isIsoDate(eventDate)) errors.eventDate = "Please choose your preferred date.";
        if (altDate && !isIsoDate(altDate)) errors.altDate = "Alternate date is not valid.";
        if (timeOfDay && !TIMES_OF_DAY.includes(timeOfDay)) errors.timeOfDay = "Invalid time of day.";
        if (contactPref && !CONTACT_PREFS.includes(contactPref)) errors.contactPref = "Invalid contact method.";
        if (Object.keys(errors).length) return json({ ok: false, errors }, 400);

        const { DB } = bindings();
        if (!DB) {
          return json(
            { ok: false, error: "Online requests are temporarily unavailable. Please call us instead." },
            503,
          );
        }

        try {
          // Light spam guard: max 5 submissions per email/phone per hour.
          const recent = await DB.prepare(
            "SELECT COUNT(*) AS n FROM inquiries WHERE (email = ?1 OR phone = ?2) AND created_at > datetime('now', '-1 hour')",
          )
            .bind(email.toLowerCase(), phone)
            .first<{ n: number }>();
          if ((recent?.n ?? 0) >= 5) {
            return json({ ok: false, error: "Too many requests. Please call us directly." }, 429);
          }

          await DB.prepare(
            `INSERT INTO inquiries
              (name, email, phone, event_type, event_date, alt_date, time_of_day, guest_count, wants_tour, contact_pref, message)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)`,
          )
            .bind(
              name,
              email.toLowerCase(),
              phone,
              eventType,
              eventDate,
              altDate || null,
              timeOfDay || null,
              guestCount,
              wantsTour,
              contactPref || null,
              message || null,
            )
            .run();
        } catch {
          return json({ ok: false, error: "Something went wrong. Please try again or call us." }, 500);
        }

        return json({ ok: true });
      },
    },
  },
});
