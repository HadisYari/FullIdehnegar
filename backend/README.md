# EndPoints — بک‌اند ایده‌نگار (ASP.NET Core 9 + EF Core)

بک‌اند سایت `FullIdehnegar`: ذخیرهٔ محتوای سایت شرکتی، پنل مدیریت محتوا برای
ورود آسان داده، و API عمومی که فرانت‌اند Next.js از آن تغذیه می‌کند.

```
backend/
├─ Idehnegar.Core/            موجودیت‌ها، ValueObject‌ها، IGenericRepository، DTOها
├─ Idehnegar.Infrastructure/  AppDbContext (schema dbo)، GenericRepository، seed
├─ EndPoints/                 وب‌اپ: api/public/* + Area Admin + wwwroot/Panel
└─ tools/generate-seed.mjs    تولید seed.json از داده‌های frontend/src
```

## ۱. مدل داده (۲۶ جدول، همگی در schema `dbo`)

اصل طراحی: **جدول‌ها آینهٔ چیزی‌اند که فرانت‌اند واقعاً استفاده می‌کند** — بدون
جدول اضافی؛ و برای روان‌بودن ورود داده، هر صفحهٔ سایت تا جای ممکن در **یک جدول**
با آیتم‌هایش نگه داشته شده است به‌جای چند جدول نرمال‌شده.

| جدول | مصرف در فرانت‌اند |
| --- | --- |
| `SiteSettings` (تک‌رکورد) | `src/lib/site-config.ts` — نام، دامنه، تلفن‌ها، آدرس، ساعت، شبکه‌های اجتماعی، آمار |
| `PageMetas` | عنوان/توضیح/کلیدواژه/OG/noindex هر صفحه (۷ کلید: home…store-builder، gold-app). برچسب/تیتر/زیرتیتر فقط برای صفحهٔ اصلی است و در پنل فقط همان صفحه نمایش داده می‌شود؛ H1 بقیهٔ صفحه‌ها در فرانت‌اند استاتیک است. ستون‌های `CtaPrimary`/`CtaSecondary` در جدول مانده‌اند، اما دیگر در پنل ویرایش نمی‌شوند و فرانت‌اند هم نمی‌خواندشان. |
| `PortfolioCategories` | فیلترهای صفحهٔ نمونه‌کارها |
| `PortfolioProjects` | `src/data/portfolio.json` کامل (گالری، فیچرها، آمار، challenge/solution) |
| `Services`, `ProcessSteps` | سکشن سرویس‌ها و فرآیند همکاری صفحهٔ اصلی |
| `HomeServiceCards` | کارت‌های گرید «خدمات» صفحهٔ اصلی (جدا از شش خدمت صفحهٔ خدمات) |
| `Clients`, `Testimonials`, `Milestones`, `TeamDisciplines` | لوگوی مشتریان، نظرات، تایم‌لاین درباره ما، تیم |
| `AboutSections` | متن (eyebrow/عنوان/زیرعنوان) هر بلوک صفحهٔ درباره ما، با کلید `values`، `certifications`، `lifecycle`، `philosophy`، `tech-stack` |
| `CoreValues`, `Certifications`, `LifecycleSteps`, `PhilosophyPrinciples`, `TechStackGroups`, `AboutStats` | آیتم‌های بلوک‌های درباره ما: ارزش‌ها (مسیر SVG آیکون)، تاییدیه‌ها، مراحل توسعه، اصول مهندسی، گروه‌های فناوری (`ItemsJson`)، آمار |
| `PageSections` | متن و آیتم‌های بلوک‌های صفحه‌های دیگر، با کلید (`PageKey`, `SectionKey`) یکتا: `gold-app` (`hero`, `hero-badge`, `platform`, `desktop`, `mobile`, `value`, `cta`)، `about` (`manifesto`, `team`, `quick-links`)، `home` (`cta`, `cta-sla`, `testimonials`)، `services` (`quick-access`)، `contact` (`intro`, `hubs`, `hubs-hours`, `hubs-amenities`, `discovery`, `faq`)، `store-builder` (`intro`, `final-cta`). عنوان/زیرعنوان/متن دوزبانه و `ItemsJson` (بولت، کارت یا لینک، با آیکون، `Href` و `Value` اختیاری مثل ساعت یا عدد) |
| `FaqItems`, `InquiryTypes` | سوالات متداول و نوع درخواست‌های فرم تماس |
| `StoreTemplates` | قالب‌های صفحهٔ فروشگاه‌ساز؛ نام، توضیح، برچسب، امکانات و تصاویر به فارسی و انگلیسی (`NameEn`, `DescriptionEn`, `FeaturesEnJson`, …) |
| `AppDownloadLinks` | لینک‌های دانلود اپ طلا |
| `ContactMessages` | خروجی فرم تماس (فقط نوشتنی) |

قواعد مشترک:

- همهٔ جدول‌های محتوایی از `ContentEntity` ارث می‌برند: `Id (uniqueidentifier)`,
  `SortOrder`, `IsPublished`, `CreatedAtUtc`, `UpdatedAtUtc`.
- متن‌های دوزبانه به‌صورت `XxxFa` / `XxxEn` ذخیره می‌شوند (نه JSON) تا در پنل
  قابل ویرایش و در SQL قابل جست‌وجو باشند.
- لیست‌های تودرتو (گالری، برچسب‌ها، فیچرها، امکانات…) یک ستون `nvarchar(max)`
  با نام `XxxJson` دارند و روی همان یک پراپرتی `[NotMapped]` نوع‌دار تعریف شده
  است. این کار تعداد جدول‌ها را کم نگه می‌دارد و فرم پنل را یک‌مرحله‌ای می‌کند.
- `AppDbContext` با `options.HasDefaultSchema("dbo")` — هیچ جدولی در schema
  دیگری ساخته نمی‌شود.

### Generic Repository

`IGenericRepository<TEntity>` (در Core) تنها کلاس داده‌ای پروژه است:
`Query()`, `QueryTracked()`, `GetAllAsync`, `WhereAsync`, `FindAsync(predicate)`,
`AnyAsync`, `CountAsync`, `AddAsync`, `Update`, `Remove`, `SaveChangesAsync`.
هیچ service per entity نوشته نشده؛ رفتار هر موجودیت با expression در محل مصرف
بیان می‌شود. `IRepositoryProvider.For<TEntity>()` هر repository را on-demand
مي‌دهد (برای API و پنل با هم یک مسیر).

## ۲. راه‌اندازی

```bash
# ۱) اتصال SQL Server
#    backend/EndPoints/appsettings.Development.json
#    "ConnectionStrings": { "IdehnegarDb": "Server=localhost;Database=IdehnegarCms;User Id=sa;Password=…;TrustServerCertificate=True" }

# ۲) ساخت دیتابیس با مایگریشن
cd backend
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate -p Idehnegar.Infrastructure -s EndPoints
dotnet ef database update -p Idehnegar.Infrastructure -s EndPoints

# ۳) پنل
cd EndPoints
dotnet run
# http://localhost:5000  → ریدایرکت به /admin
```

اگر `Site:MigrateOnStartup = true` باشد (پیش‌فرض) برنامه در استارت خود
`Database.Migrate()` و سپس seed اولیه را اجرا می‌کند؛ seed از
`Idehnegar.Infrastructure/SeedData/seed.json` (نسخهٔ جاسازی‌شده) خوانده می‌شود
و فقط وقتی جدول خالی است عمل می‌کند.

تولید دوبارهٔ seed پس از هر تغییر در داده‌های فرانت‌اند:

```bash
node tools/generate-seed.mjs   # خروجی: Idehnegar.Infrastructure/SeedData/seed.json
```

رمز پنل در configuration است (نه در دیتابیس):

```bash
cd EndPoints
dotnet run -- hash-password "YourStrong#Pass"   # خروجی = Admin:PasswordSha256
```

`Admin:Username` + `Admin:PasswordSha256` را در `appsettings.Production.json`
بگذارید. در محیط Development در صورت خالی بودن، متغیر `IDEHNEGAR_ADMIN_PASSWORD`
پذیرفته می‌شود (فقط برای تست لوکال).

## ۳. API عمومی (`/api/public/*`)

خواندنی، بی‌نیاز از احراز هویت، و همه با این هدرها:

```
Cache-Control: public, max-age=60, s-maxage=600, stale-while-revalidate=3600, stale-if-error=86400
Vary: Accept-Encoding
X-Robots-Tag: noindex, nofollow
```

| Endpoint | توضیح |
| --- | --- |
| `GET /api/public/settings` | تنظیمات شرکت (نام، تلفن‌ها، آدرس، شبکه‌های اجتماعی، آمار) |
| `GET /api/public/pages` | همهٔ متاهای سئو، keyed با `pageKey` |
| `GET /api/public/pages/{key}` | متای یک صفحه |
| `GET /api/public/bootstrap?featuredTake=8` | یک پاسخ کامل برای رندر صفحهٔ اصلی |
| `GET /api/public/sitemap` | ورودی‌های sitemap (بدون صفحات noindex) |
| `GET /api/public/categories` | دسته‌بندی نمونه‌کارها |
| `GET /api/public/portfolio?category=&featured=&take=` | لیست پروژه‌ها |
| `GET /api/public/portfolio/{slug}` | جزئیات یک پروژه |
| `GET /api/public/portfolio/{slug}/related?take=3` | پروژه‌های مرتبط |
| `GET /api/public/services` `home-services` `about-content` (همهٔ بلوک‌های درباره ما در یک پاسخ) `page-sections/{pageKey}` (متن و آیتم‌های بلوک‌های یک صفحه) `process-steps` `clients` `testimonials` `milestones` `team` `faqs` `inquiry-types` `store-templates` `store-plans` `app-download-links` | محتوای سکشن‌ها |
| `POST /api/public/contact` | ذخیرهٔ پیام + ایمیل (rate limited) |
| `GET /api/public/health` | سلامت + تعداد رکوردها (بدون کش) |

خروجی JSON `camelCase` است و فیلدهای null حذف می‌شوند تا با interfaceهای
TypeScript فرانت‌اند (`PortfolioItem`…) یک‌به‌یک جور دربیاید.

## ۴. پنل مدیریت (`/admin`)

- **بدون سرویس per entity:** یک `AdminRegistry` هر جدول را توصیف می‌کند
  (فیلدها، ستون‌های لیست، Icon، Group، Source/Target اسلاگ، تگ‌های revalidate).
  `ContentController` با مسیر `[Route("admin/{entity}")]` برای همهٔ جدول‌ها
  Index/create/edit/save/delete/toggle/move را می‌سازد و `Content/Form.cshtml`
  همهٔ نوع فیلدها را رندر می‌کند:
  `Text, Textarea, Number, Decimal, Checkbox, Select, Image, LineList, TagList, Repeater, Slug, Code`.
- **ورود داده روان:** لیست‌ها (امکانات، گالری…) به‌صورت «هر خط یک مورد» یا با
  Repeater ردیفی پر می‌شوند؛ ترتیب نمایش با دکمه‌های ↑/↓؛ انتشار با یک کلیک روی
  badge وضعیت؛ تصویر با Drag & Drop در همان فرم (`wwwroot/Panel/custome/js/file-uploader.js`).
- **قفل امنیتی:** کوکی احراز هویت، `[ValidateAntiForgeryToken]` روی همهٔ POSTها
  (توکن از هدر `RequestVerificationToken` هم پذیرفته می‌شود)، مقایسهٔ رمز با
  `CryptographicOperations.FixedTimeEquals`، تأخیر ۷۰۰ms در صورت خطا، محافظت در
  برابر open-redirect، و هدرهای `X-Robots-Tag: noindex` + `X-Frame-Options: SAMEORIGIN`
  برای همهٔ مسیرهای `/admin`.
- **صندوق‌ها:** `/admin/inbox/messages` (بایگانی، حذف).
- **تنظیمات:** `/admin/site-settings` (اطلاعات شرکت + سئوی صفحه‌ها در یک صفحهٔ گروه‌بندی‌شده).

### Revalidation (ISR)

پس از هر `save`/`delete`/`toggle`/`move`، `SiteNotifier` این را صدا می‌زند:

```
POST {Site:RevalidateUrl}        مثال: https://idehnegar.co/api/revalidate
body: { "secret": "…", "tags": ["portfolio","home","sitemap"] }
```

سمت فرانت‌اند `frontend/src/app/api/revalidate/route.ts` بعد از بررسی رمز،
`revalidateTag(tag, { expire: 0 })` را برای همان تگ‌ها اجرا می‌کند. تگ‌ها بین
پنل و فرانت مشترک‌اند: `settings, pages, home, portfolio, services, about,
contact, store, gold-app, sitemap`.

## ۵. اتصال فرانت‌اند

همهٔ خواندن‌ها از یک فایل می‌گذرند: `frontend/src/lib/cms.ts`.

```bash
cd frontend
echo 'CMS_API_URL=http://localhost:5000' >> .env.local
echo 'CMS_REVALIDATE_SECRET=…' >> .env.local   # همان مقدار Site:RevalidateSecret
```

- اگر `CMS_API_URL` تنظیم نشده یا سرویس پاسخ ندهد، لایهٔ CMS **سکوت می‌کند و به
  دادهٔ همراه مخزن برمی‌گردد** (`src/lib/site-config.ts`, `src/data/*.json`) — پس
  build و دیپلوی هیچ‌وقت به بک‌اند وابسته نیستند.
- `getPortfolioItems/getPortfolioItem/getFeaturedPortfolioItems` از
  `/api/public/portfolio` می‌خوانند (با تگ‌های ISR) و همان تایپ `PortfolioItem`
  را برمی‌گردانند؛ IR بک‌اند دقیقاً بر اساس همین تایپ طراحی شده.
- `withPageMeta(key, locale, fallback)` در `generateMetadata` صفحه‌ها عنوان،
  توضیح، keywords، canonical، hreflang و `robots: noindex` را از `PageMetas`
  می‌گیرد (home در layout، به‌علاوهٔ about/services/contact/portfolio).
- `sitemap.ts` و `robots.ts` دامنه و مسیرها را از همان تنظیمات می‌سازند.
- فرم تماس: `POST /api/contact` اول بک‌اند را صدا می‌زند و فقط در نبود آن
  در `src/data/messages.json` می‌نویسد.

### کارهای باقی‌مانده (دانسته و عمدی)

1. صفحهٔ اصلی: `ServicesSection` از `HomeServiceCards` می‌خواند (با fallback
   داخل فایل). `ProcessSection` و `ClientsSection` قبلاً وصل بودند.
   `TestimonialsSection` در هیچ صفحه‌ای رندر نمی‌شود (کد مرده).
2. صفحه‌های `store-builder` و `gold-app` `withPageMeta` دارند.
3. هیدر H1 صفحه‌های `services`, `portfolio`, `contact`, `store-builder`
   عمداً متن JSX ثابت است (برای سئو) و eyebrow/heading/subheading این صفحه‌ها از
   پنل `PageMetas` حذف شده‌اند (`ShowsHeroCopy`). متن بلوک‌های بدنه (کپسول‌های
   دسترسی سریع `services`، سه کارت `contact` شامل ساعت کاری، امکانات، HQ و FAQ،
   متن `store-builder`) از `PageSections` خوانده می‌شود. برچسب‌های
   کوتاه UI (دکمه‌ها، تب‌ها، فیلدهای فرم) و کانال‌های تماس با لینک‌های `SiteSetting`
   ثابت‌اند. `bootstrap` هم هنوز فراخوانی نمی‌شود و کنار اندپوینت‌های تکی است.
4. صفحهٔ «درباره ما»: شش بلوک `components/sections/about/*` (ارزش‌ها، تاییدیه‌ها،
   فرایند توسعه، فلسفه مهندسی، آمار، فناوری‌ها) از `GET /api/public/about-content`
   داده می‌گیرند و متن محلی‌شان فقط در نبود API استفاده می‌شود. هدر و مانیفست
   صفحهٔ درباره ما (مانیفست، بلوک تیم و کپسول‌های دسترسی) از `PageSections`
   خوانده می‌شود. هدر H1 و دکمه‌های کوتاه ثابت‌اند. `about-hero.tsx` هم در هیچ صفحه‌ای import
   نشده است (طرح جایگزین). بقیهٔ کامپوننت‌های `project-*`، `page-hero.tsx`،
   `contact-form.tsx` import نشده‌اند. `testimonials-section.tsx` روی صفحهٔ اصلی
   mount شده و نظرات را از `GET /api/public/testimonials` می‌گیرد.
5. سه خطای از قبل موجود در `npm run lint` (state-in-effect در
   `device-mockup.tsx`، `ProcessSection.tsx` و یک کامنت JSX
   در `services/page.tsx`) به این تغییرات مربوط نیستند و دست‌نخورده مانده‌اند.
6. کد C# در این محیط **کامپایل نشده** (دسترسی به nuget.org نبود). اولین کار بعد
   از کشیدن ریپو: `cd backend && dotnet build BackendIdehnegar.sln`.

## ۶. SEO در بک‌اند

- `CanonicalBaseUrl` و مسیرهای `PageMetas` منبع تنها برای URLها هستند؛
  `/api/public/sitemap` همان چیزی را می‌دهد که `sitemap.ts` مصرف می‌کند
  (با `lastModified` واقعی از `UpdatedAtUtc` و حذف صفحات `NoIndex`).
- اسلاگ پروژه‌ها با `Slugifier` ساخته می‌شود که رفتار `slugify()` فرانت‌اند را
  تقلید می‌کند (حروف فارسی حفظ می‌شوند) تا URLهای موجود نشکنند.
- پاسخ‌های API برای خزنده‌ها بی‌ضررند: `X-Robots-Tag: noindex` و کش عمومی.
- `robots.txt` مسیرهای `/admin` و `/api` را disallow می‌کند و خود پنل هم روی
  همهٔ صفحاتش `noindex, nofollow` می‌گذارد.
- تصاویر آپلودشده در `/uploads/{yyyyMM}/…` با `Cache-Control: public,
  max-age=31536000, immutable` سرو می‌شوند (نام فایل یکتاست).
- `app.UseResponseCompression()` با Brotli برای JSON/API.
