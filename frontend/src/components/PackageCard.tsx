import Link from "next/link";
import type { ServicePackage } from "@/lib/packages";

export default function PackageCard({ pkg }: { pkg: ServicePackage }) {
  return (
    <div
      className={`flex flex-col rounded-2xl border p-6 shadow-sm transition hover:shadow-md ${
        pkg.featured
          ? "border-brand-700 ring-2 ring-brand-700"
          : "border-slate-200"
      }`}
    >
      {pkg.featured && (
        <span className="mb-3 inline-block w-fit rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
          Most popular
        </span>
      )}
      <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
      <p className="mt-1 text-sm text-slate-600">{pkg.tagline}</p>
      <p className="mt-4 text-2xl font-extrabold text-slate-900">{pkg.price}</p>

      <ul className="mt-6 flex-1 space-y-3">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.1 3.1 6.8-6.8a1 1 0 011.4 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={`/contact?package=${pkg.id}`}
        className={`mt-6 rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition ${
          pkg.featured
            ? "bg-brand-700 text-white hover:bg-brand-800"
            : "bg-slate-100 text-slate-900 hover:bg-slate-200"
        }`}
      >
        Get started
      </Link>
    </div>
  );
}
