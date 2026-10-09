# Backend Idehnegar

MVC solution `BackendIdehnegar.sln` contains the admin area, EF Core persistence and the versioned JSON API in the same ASP.NET Core project (`EndPoints`). No separate API host or extra project is required.

## Requirements

- .NET 9 SDK
- SQL Server 2019+ (local SQL Server, LocalDB, container, or hosted SQL Server)

## Configure and run

Set the SQL Server connection string outside source control. For example, in PowerShell:

```powershell
$env:ConnectionStrings__DefaultConnection = "Server=localhost;Database=Idehnegar;User Id=...;Password=...;Encrypt=True;TrustServerCertificate=True"
$env:Admin__Username = "site-admin"
$env:Admin__PasswordHash = "pbkdf2-sha256$210000$<salt-base64>$<hash-base64>"
```

Create the password hash with Node (salt is randomly generated):

```bash
node -e 'const c=require("crypto");const p=process.argv[1];const s=c.randomBytes(16);const h=c.pbkdf2Sync(p,s,210000,32,"sha256");console.log(`pbkdf2-sha256$210000$${s.toString("base64")}$${h.toString("base64")}`)' 'your-long-password'
```

Install packages and apply the checked-in migration from the solution directory:

```bash
dotnet restore BackendIdehnegar.sln
dotnet ef database update --project EndPoints/EndPoints.csproj --startup-project EndPoints/EndPoints.csproj
dotnet run --project EndPoints/EndPoints.csproj
```

To automatically apply pending migrations and insert the initial content on startup, explicitly set `Database__ApplyMigrations=true` and `Database__SeedOnStartup=true`. Automatic migrations are off by default so production deployments can apply migrations as a controlled release step. The importer only inserts missing stable content keys; it never overwrites administrator edits or creates duplicate rows.

The admin panel is at `/Admin` and uses the existing `/Panel` styles/scripts and layout. The default username/password are deliberately not committed. Without `Admin__Username` and `Admin__PasswordHash`, login is disabled. Uploaded image files are type-signature checked, limited to 8 MB, renamed to random identifiers, and placed under `wwwroot/uploads/content/`.

## Database layout

All objects are created explicitly in `dbo` and every primary key is SQL Server `IDENTITY(1,1)`. EF mapping does not infer a schema from the database login.

| Table | Purpose | Primary key |
|---|---|---|
| `dbo.tbl_ContentEntries` | Localized pages, SEO metadata, portfolio, testimonials, settings, and flexible JSON page data | `Id int IDENTITY(1,1)` |
| `dbo.tbl_ContactSubmissions` | Contact-form messages | `Id int IDENTITY(1,1)` |
| `dbo.tbl_EFMigrationHistory` | EF Core migration bookkeeping (framework metadata, not a content table) | EF-managed migration key |

`ContentKey` is unique. The three JSON documents (`DataFaJson`, `DataEnJson`, `SharedJson`) allow page-specific structures without creating a table per section. Locale-specific title/body/SEO/image-alt fields are exposed through one Persian/English editor form. No separate media table is needed; uploaded files are static assets.

## API v1

All public API routes are in `EndPoints/Endpoints`; responses use `application/json`. `locale` accepts `fa` or `en`.

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/v1/site?locale=fa` | Resolved dictionary, settings and testimonials |
| `GET` | `/api/v1/content?locale=fa&type=portfolio&limit=100` | Published content list (optional type and bounded limit) |
| `GET` | `/api/v1/content/{key}?locale=en` | Content by stable key |
| `GET` | `/api/v1/pages/{key}?locale=fa` | Page and locale-specific SEO data |
| `GET` | `/api/v1/portfolio?locale=en&featured=true` | Published portfolio items |
| `GET` | `/api/v1/portfolio/{slug}?locale=fa` | Portfolio detail |
| `POST` | `/api/v1/contact` | Validated, rate-limited contact form submission |
| `GET` | `/health` | Liveness check |

Portfolio/detail DTOs retain the original bilingual record in `shared`, while `data` resolves to the requested language. SEO fields (`metaTitle`, `metaDescription`, `keywords`, `canonicalUrl`, Open Graph title/description, image and alt text) are returned per locale. Admin mutations require the authenticated admin cookie and antiforgery validation. Contact submissions are validated, have a honeypot field, and are limited to five requests per minute per remote address.

## Static content import

`EndPoints/Seed/site-content.seed.json` is the normalized export of the existing Next.js dictionaries, company settings, testimonials and 17 portfolio records. The exporter lives in `frontend/scripts/export-cms-seed.mjs`; after changing the existing static source data, run `npm run export:cms-seed` from `frontend`, review the generated diff, then deploy the backend migration/seed option as above. The initial seed is additive/idempotent; use the admin panel to update content after import.
