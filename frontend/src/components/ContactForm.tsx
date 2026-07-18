"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { submitContact } from "@/lib/api";
import { packages } from "@/lib/packages";

type Status = "idle" | "submitting" | "success" | "error";

const packageOptions = [
  { value: "Unspecified", label: "Not sure yet / General enquiry" },
  ...packages.map((p) => ({ value: p.id, label: p.name })),
];

export default function ContactForm() {
  const searchParams = useSearchParams();
  const presetPackage = searchParams.get("package") ?? "Unspecified";
  const initialPackage = packageOptions.some((o) => o.value === presetPackage)
    ? presetPackage
    : "Unspecified";

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await submitContact({
        name: String(data.get("name") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
        phone: String(data.get("phone") ?? "").trim() || undefined,
        company: String(data.get("company") ?? "").trim() || undefined,
        packageInterest: String(data.get("packageInterest") ?? "Unspecified"),
        message: String(data.get("message") ?? "").trim(),
      });
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <h3 className="text-xl font-bold text-green-800">Thank you!</h3>
        <p className="mt-2 text-green-700">
          Your message has been sent. We&apos;ll get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-semibold text-green-800 underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-700 focus:ring-2 focus:ring-brand-100";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
            Name *
          </label>
          <input id="name" name="name" required minLength={2} className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
            Email *
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor="company" className="mb-1 block text-sm font-medium text-slate-700">
            Company
          </label>
          <input id="company" name="company" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="packageInterest" className="mb-1 block text-sm font-medium text-slate-700">
          I&apos;m interested in
        </label>
        <select
          id="packageInterest"
          name="packageInterest"
          defaultValue={initialPackage}
          className={inputClass}
        >
          {packageOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-700">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={5}
          rows={5}
          className={inputClass}
          placeholder="Tell us a bit about your project..."
        />
      </div>

      {status === "error" && error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
