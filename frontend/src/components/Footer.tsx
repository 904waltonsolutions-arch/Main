import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-brand-700 text-sm font-black text-white">
              WS
            </span>
            <span>{site.name}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-600">{site.description}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brand-700">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Get in touch</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-brand-700">
                {site.email}
              </a>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand-700">
                Request a free quote
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-6">
        <p className="container-page text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
