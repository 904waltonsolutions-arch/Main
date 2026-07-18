import Link from "next/link";
import PackageCard from "@/components/PackageCard";
import { packages } from "@/lib/packages";

const services = [
  {
    title: "Websites",
    description:
      "Fast, modern, mobile-first marketing sites that make your business look professional and convert visitors into customers.",
    icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  },
  {
    title: "Business Apps",
    description:
      "Custom web applications with secure logins, dashboards, and a SQL Server database — built on a C# / .NET 8 backend.",
    icon: "M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z",
  },
  {
    title: "Full Platforms",
    description:
      "Scalable, multi-service platforms using Clean Architecture and microservices, ready to grow with Android and iOS apps.",
    icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v6H4V5zm0 8h16v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z",
  },
  {
    title: "Maintenance & Hosting",
    description:
      "Ongoing Azure hosting, updates, security patches, backups, and monitoring so you can focus on running your business.",
    icon: "M12 15a3 3 0 100-6 3 3 0 000 6zm7.4-3a7.4 7.4 0 00-.1-1l2-1.6-2-3.4-2.4 1a7.3 7.3 0 00-1.7-1l-.4-2.5H9.2l-.4 2.5a7.3 7.3 0 00-1.7 1l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 000 2l-2 1.6 2 3.4 2.4-1c.5.4 1.1.7 1.7 1l.4 2.5h4.6l.4-2.5c.6-.3 1.2-.6 1.7-1l2.4 1 2-3.4-2-1.6c.1-.3.1-.7.1-1z",
  },
];

const steps = [
  { title: "Discovery", description: "We learn about your business, goals, and what success looks like." },
  { title: "Design", description: "We design a clean, professional experience tailored to your brand." },
  { title: "Build", description: "We build on a solid .NET 8 + modern frontend foundation." },
  { title: "Launch & Support", description: "We deploy to Azure and keep it running with maintenance plans." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-900 to-brand-700 text-white">
        <div className="container-page py-20 sm:py-28">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Full-stack development for growing businesses
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
              Professional websites, apps &amp; platforms for your business
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-blue-100">
              Walton Solutions helps small and medium-sized businesses launch online with
              starter websites, custom business apps, and full platforms — plus monthly
              maintenance and hosting on Azure.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-800 transition hover:bg-blue-50"
              >
                Get a free quote
              </Link>
              <Link
                href="/#packages"
                className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="container-page py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">What we build</h2>
          <p className="mt-3 text-slate-600">
            From your first website to a full-scale platform, we grow with you.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.title} className="rounded-2xl border border-slate-200 p-6">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand-50 text-brand-700">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d={s.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="bg-slate-50 py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">Packages &amp; pricing</h2>
            <p className="mt-3 text-slate-600">
              Simple, transparent options. Every project is tailored to your needs — reach out
              for an exact quote.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="container-page py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">How we work</h2>
          <p className="mt-3 text-slate-600">A simple, transparent process from idea to launch.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="rounded-2xl border border-slate-200 p-6">
              <div className="text-3xl font-black text-brand-100">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="mt-2 font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-700">
        <div className="container-page flex flex-col items-center gap-6 py-16 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to build something great?</h2>
          <p className="max-w-xl text-blue-100">
            Tell us about your project and we&apos;ll get back to you with a plan and a quote.
          </p>
          <Link
            href="/contact"
            className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-800 transition hover:bg-blue-50"
          >
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
