# Walton Solutions Platform

Full-stack platform for **Walton Solutions** — a web/app development business serving
small and medium-sized businesses. It includes a marketing website with the service
packages (Starter Website, Business App, Full Platform, and Monthly Maintenance +
Hosting) and a contact form that emails enquiries to `904Waltonsolutions@gmail.com`.

Built to be **hosted on Azure at low cost** and to **scale into more apps** later.

## Tech stack

| Layer      | Technology |
|------------|------------|
| Frontend   | Next.js 14 (App Router) + TypeScript + Tailwind CSS (static export) |
| Backend    | C# / .NET 8 Web API, **Clean Architecture** |
| Database   | SQL Server (Azure SQL) via EF Core 8 |
| Email      | SMTP via MailKit (Gmail SMTP / SendGrid / Azure Communication Services, etc.) |
| Infra      | Azure App Service + Azure SQL + Azure Static Web Apps (Bicep) |
| CI         | GitHub Actions (`.github/workflows/ci.yml`) |

## Repository layout

```
walton-solutions-platform/
├── backend/                       # C# / .NET 8 solution (Clean Architecture)
│   ├── WaltonSolutions.sln
│   ├── src/
│   │   ├── WaltonSolutions.Domain/          # Entities, enums (no dependencies)
│   │   ├── WaltonSolutions.Application/      # Use cases, interfaces, DTOs
│   │   ├── WaltonSolutions.Infrastructure/  # EF Core, SQL Server, email (MailKit)
│   │   └── WaltonSolutions.Api/             # ASP.NET Core Web API (controllers)
│   └── tests/
│       └── WaltonSolutions.Application.Tests/
├── frontend/                      # Next.js marketing site
│   └── src/
│       ├── app/                   # Pages: home + /contact
│       ├── components/            # Header, Footer, PackageCard, ContactForm
│       └── lib/                   # Site config, package data, API client
├── infra/
│   └── main.bicep                 # Low-cost Azure infrastructure
└── .github/workflows/ci.yml       # Build + test CI
```

## Architecture (backend)

Dependencies point inward (Clean Architecture):

```
Api ─▶ Application ─▶ Domain
Api ─▶ Infrastructure ─▶ Application ─▶ Domain
```

- **Domain** — `ContactSubmission` entity and `PackageInterest` enum. No framework deps.
- **Application** — `IContactService` / `ContactService` business logic, plus the
  `IApplicationDbContext` and `IEmailSender` abstractions the outer layers implement.
- **Infrastructure** — `ApplicationDbContext` (EF Core + SQL Server) and
  `SmtpEmailSender` (MailKit). This is the only layer that knows about SQL Server or SMTP.
- **Api** — thin controllers (`/api/contact`, `/api/health`) and composition root.

This layout is deliberately microservice-ready: additional services (e.g. billing,
scheduling) can be added as sibling APIs reusing the Domain/Application patterns.

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 20+](https://nodejs.org/)
- SQL Server (local, Docker, or Azure SQL). Quick local instance with Docker:
  ```bash
  docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Your_password123" \
    -p 1433:1433 --name waltonsql -d mcr.microsoft.com/mssql/server:2022-latest
  ```

## Running locally

### 1. Backend API

```bash
cd backend
# Point at your SQL Server (or edit src/WaltonSolutions.Api/appsettings.json)
export ConnectionStrings__DefaultConnection="Server=localhost;Database=WaltonSolutions;User Id=sa;Password=Your_password123;TrustServerCertificate=True;Encrypt=False"

# Apply the database schema (either run migrations explicitly...)
dotnet tool install --global dotnet-ef --version 8.0.8
dotnet ef database update --project src/WaltonSolutions.Infrastructure --startup-project src/WaltonSolutions.Api

# ...or set Database__MigrateOnStartup=true to migrate on boot.
ASPNETCORE_URLS=http://localhost:5080 dotnet run --project src/WaltonSolutions.Api
```

- API: `http://localhost:5080`
- Swagger (Development): `http://localhost:5080/swagger`
- Health check: `GET /api/health`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local     # set NEXT_PUBLIC_API_BASE_URL=http://localhost:5080
npm run dev                    # http://localhost:3000
```

## Contact form flow

1. Visitor submits the form on `/contact` (or a package "Get started" button).
2. Frontend `POST`s JSON to `POST /api/contact`.
3. `ContactService` validates + saves the submission to SQL Server, then sends an
   HTML notification email to `Email:ToEmail` (defaults to `904Waltonsolutions@gmail.com`).
4. Email delivery failures never fail the request — the record is always persisted.

### Contact API

`POST /api/contact`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "555-1234",
  "company": "Acme Co",
  "packageInterest": "BusinessApp",
  "message": "I'd like a quote for a booking app."
}
```

`packageInterest` is one of: `Unspecified`, `StarterWebsite`, `BusinessApp`,
`FullPlatform`, `MaintenanceAndHosting`, `Other`. Returns `201 Created` with the new id.

## Email configuration

Email is **disabled by default** (submissions are still saved and the intended message
is logged). To send real email, configure the `Email` settings — ideally via environment
variables / Azure App Settings, not source control:

| Setting | Example |
|---------|---------|
| `Email__Enabled` | `true` |
| `Email__Host` | `smtp.gmail.com` |
| `Email__Port` | `587` |
| `Email__Username` | `904Waltonsolutions@gmail.com` |
| `Email__Password` | *(Gmail App Password — not your login password)* |
| `Email__ToEmail` | `904Waltonsolutions@gmail.com` |

> **Gmail note:** a normal Gmail account cannot receive SMTP the way a server "sends to
> Gmail". To *send* mail through Gmail you need an **App Password** (requires 2FA on the
> Google account). Alternatives that also work with this SMTP sender: SendGrid, Brevo,
> or Azure Communication Services (all have free tiers).

## Deploying to Azure (low cost)

`infra/main.bicep` provisions the cheapest sensible setup:

- **Azure SQL Database** – Basic tier (main cost driver; ~a few USD/month).
- **App Service (Linux)** – `B1` by default; pass `appServiceSku=F1` for the free tier.
- **Azure Static Web Apps** – Free tier for the static Next.js site.

```bash
az group create -n walton-rg -l eastus
az deployment group create -g walton-rg -f infra/main.bicep \
  -p sqlAdminPassword='<strong-password>' \
     emailUsername='904Waltonsolutions@gmail.com' \
     emailPassword='<gmail-app-password>'
```

Then:

- **API:** `dotnet publish backend/src/WaltonSolutions.Api -c Release` and deploy the
  output to the Web App (`az webapp deploy`, GitHub Actions, or VS Code). The Web App is
  configured with `Database__MigrateOnStartup=true`, so the schema is created on boot.
- **Frontend:** `cd frontend && npm run build` produces a static site in `frontend/out/`.
  Deploy it to the Static Web App, and set `NEXT_PUBLIC_API_BASE_URL` to the API URL at
  build time.

## Testing

```bash
cd backend && dotnet test        # application-layer unit tests
cd frontend && npm run lint      # eslint
cd frontend && npm run build     # type-check + production build
```

## Roadmap

- Android & iOS apps (native or React Native) consuming the same API.
- Additional microservices (billing, scheduling) reusing the Clean Architecture layers.
- Authentication & customer dashboards for the Business App / Full Platform tiers.
