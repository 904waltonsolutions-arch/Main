export type PackageId =
  | "StarterWebsite"
  | "BusinessApp"
  | "FullPlatform"
  | "MaintenanceAndHosting";

export interface ServicePackage {
  id: PackageId;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  featured?: boolean;
}

export const packages: ServicePackage[] = [
  {
    id: "StarterWebsite",
    name: "Starter Website Package",
    price: "From $1,500",
    tagline: "A professional website to get your business online fast.",
    features: [
      "Up to 5 responsive pages",
      "Mobile-first, modern design",
      "Contact form wired to your inbox",
      "Basic SEO & analytics setup",
      "Deployed to Azure",
    ],
  },
  {
    id: "BusinessApp",
    name: "Business App Package",
    price: "From $6,000",
    tagline: "A custom web app tailored to how your business works.",
    features: [
      "Everything in Starter",
      "Custom web application",
      "Secure user accounts & dashboards",
      "SQL Server database",
      "C# / .NET 8 backend API",
    ],
    featured: true,
  },
  {
    id: "FullPlatform",
    name: "Full Platform Package",
    price: "Custom quote",
    tagline: "A scalable, multi-service platform built to grow.",
    features: [
      "Everything in Business App",
      "Clean Architecture microservices",
      "Android & iOS apps (roadmap)",
      "Integrations & automations",
      "Cloud-ready for scale on Azure",
    ],
  },
  {
    id: "MaintenanceAndHosting",
    name: "Monthly Maintenance + Hosting",
    price: "From $99/mo",
    tagline: "Keep everything secure, updated, and online.",
    features: [
      "Azure hosting management",
      "Updates & security patches",
      "Uptime monitoring",
      "Backups",
      "Priority support",
    ],
  },
];
