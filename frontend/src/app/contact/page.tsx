import { Suspense } from "react";
import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Contact — ${site.name}`,
  description: "Get in touch with Walton Solutions for a free quote.",
};

export default function ContactPage() {
  return (
    <section className="container-page py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Let&apos;s talk about your project</h1>
          <p className="mt-4 text-slate-600">
            Fill out the form and we&apos;ll get back to you shortly. Prefer email? Reach us any
            time at{" "}
            <a href={`mailto:${site.email}`} className="font-medium text-brand-700 hover:underline">
              {site.email}
            </a>
            .
          </p>

          <ul className="mt-8 space-y-4 text-sm text-slate-700">
            <li className="flex gap-3">
              <span className="font-semibold text-slate-900">Free consultation</span>
              <span className="text-slate-500">— we&apos;ll help scope the right package.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-slate-900">Fast response</span>
              <span className="text-slate-500">— we aim to reply within one business day.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-slate-900">No obligation</span>
              <span className="text-slate-500">— quotes are always free.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 p-6 shadow-sm sm:p-8">
          <Suspense fallback={<div className="text-sm text-slate-500">Loading form…</div>}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
