import { useEffect, useState } from "react";
import type { FormEvent } from "react";

const EVENT_TYPES = [
  "Wedding",
  "Engagement Party",
  "Birthday / Anniversary",
  "Corporate / Community Event",
  "Other",
];

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = Record<string, string>;

export function InquiryForm({ phoneDisplay, phoneTel }: { phoneDisplay: string; phoneTel: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    setMinDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      eventType: fd.get("eventType"),
      eventDate: fd.get("eventDate"),
      altDate: fd.get("altDate"),
      timeOfDay: fd.get("timeOfDay"),
      guestCount: fd.get("guestCount"),
      contactPref: fd.get("contactPref"),
      message: fd.get("message"),
      wantsTour: fd.get("wantsTour") === "on",
      website: fd.get("website"),
    };

    setStatus("submitting");
    setErrorMsg("");
    setFieldErrors({});
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        errors?: FieldErrors;
      };
      if (res.ok && data.ok) {
        form.reset();
        setStatus("success");
        return;
      }
      if (data.errors) setFieldErrors(data.errors);
      setErrorMsg(data.error ?? "Please check the highlighted fields and try again.");
      setStatus("error");
    } catch {
      setErrorMsg("Could not send your request. Please check your connection or call us.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="pearl-form pearl-form--done" role="status">
        <div className="pearl-form__check" aria-hidden="true">
          ✓
        </div>
        <h3>Thank you — your request is in</h3>
        <p>
          We&rsquo;ll reach out soon to confirm availability for your date. Need an answer sooner? Call{" "}
          <a href={phoneTel}>{phoneDisplay}</a>.
        </p>
        <button type="button" className="pearl-btn pearl-btn--outline" onClick={() => setStatus("idle")}>
          Send another request
        </button>
      </div>
    );
  }

  const err = (key: string) =>
    fieldErrors[key] ? (
      <span className="pearl-field__error" role="alert">
        {fieldErrors[key]}
      </span>
    ) : null;

  return (
    <form className="pearl-form" onSubmit={onSubmit}>
      <div className="pearl-form__grid">
        <label className="pearl-field">
          <span>Full name *</span>
          <input name="name" type="text" autoComplete="name" required maxLength={120} />
          {err("name")}
        </label>
        <label className="pearl-field">
          <span>Phone *</span>
          <input name="phone" type="tel" autoComplete="tel" required maxLength={40} />
          {err("phone")}
        </label>
        <label className="pearl-field pearl-field--full">
          <span>Email *</span>
          <input name="email" type="email" autoComplete="email" required maxLength={160} />
          {err("email")}
        </label>
        <label className="pearl-field">
          <span>Event type *</span>
          <select name="eventType" required defaultValue="">
            <option value="" disabled>
              Select an event
            </option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {err("eventType")}
        </label>
        <label className="pearl-field">
          <span>Estimated guests</span>
          <input name="guestCount" type="number" inputMode="numeric" min={1} max={2000} placeholder="e.g. 250" />
        </label>
        <label className="pearl-field">
          <span>Preferred date *</span>
          <input name="eventDate" type="date" required min={minDate || undefined} />
          {err("eventDate")}
        </label>
        <label className="pearl-field">
          <span>Alternate date</span>
          <input name="altDate" type="date" min={minDate || undefined} />
          {err("altDate")}
        </label>
        <label className="pearl-field">
          <span>Time of day</span>
          <select name="timeOfDay" defaultValue="">
            <option value="">No preference</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
        </label>
        <label className="pearl-field">
          <span>Best way to reach you</span>
          <select name="contactPref" defaultValue="">
            <option value="">No preference</option>
            <option value="Phone call">Phone call</option>
            <option value="Text message">Text message</option>
            <option value="Email">Email</option>
          </select>
        </label>
        <label className="pearl-field pearl-field--full">
          <span>Tell us about your event</span>
          <textarea name="message" rows={4} maxLength={2000} placeholder="Style, catering needs, questions…" />
        </label>

        <label className="pearl-check pearl-field--full">
          <input name="wantsTour" type="checkbox" />
          <span>I&rsquo;d also like to schedule a tour of the hall</span>
        </label>

        {/* Honeypot — hidden from real visitors */}
        <div className="pearl-hp" aria-hidden="true">
          <label>
            Website
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </div>

      {status === "error" && errorMsg ? (
        <p className="pearl-form__error" role="alert">
          {errorMsg}
        </p>
      ) : null}

      <div className="pearl-form__footer">
        <button type="submit" className="pearl-btn pearl-btn--solid" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Request Availability"}
        </button>
        <span className="pearl-form__note">
          Or call <a href={phoneTel}>{phoneDisplay}</a>
        </span>
      </div>
    </form>
  );
}
