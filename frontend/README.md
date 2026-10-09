# وب‌سایت ایده‌نگار (idehnegar.co)

فرانت‌اند عمومی وب‌سایت شرکت پیشگامان ایده‌نگار با Next.js، فارسی/انگلیسی، واکنش‌گرا و سئو‌محور است. محتوای قابل مدیریت، فرم تماس و پنل مدیریت در بک‌اند MVC موجود در `../backend/` قرار دارند؛ API جداگانه‌ای ساخته نشده است.

## پشته فنی

- Next.js 16 (App Router)، React 19 و TypeScript
- Tailwind CSS v4
- فونت‌های محلی (بدون وابستگی runtime به Google Fonts)
- برای CMS و پنل: ASP.NET Core MVC 9، EF Core و SQL Server در Solution موجود

## راه‌اندازی محلی

ابتدا بک‌اند و SQL Server را طبق [`../backend/README.md`](../backend/README.md) راه‌اندازی کنید. سپس در این پوشه:

```bash
npm install
cp .env.example .env.local
```

در `.env.local` حداقل این موارد را تنظیم کنید:

```dotenv
CMS_API_URL=http://localhost:5100
NEXT_PUBLIC_SITE_URL=https://idehnegar.co
```

`CMS_API_URL` نشانی قابل دسترس بک‌اند از سمت process سرور Next.js است، نه نشانی‌ای که کد مرورگر مستقیم فراخوانی می‌کند. این متغیر را هم هنگام build و هم هنگام اجرای production تنظیم کنید؛ Next آن را برای proxy کردن `/Admin`, `/Panel`, و `/uploads` در زمان build می‌خواند.

```bash
npm run dev
```

پیش‌فرض سایت روی `http://localhost:3000` است. مسیرهای عمومی فعلی حفظ شده‌اند: فارسی بدون پیشوند (`/`, `/about`, `/services`, `/portfolio`, `/contact`) و انگلیسی با `/en`.

## Build و بررسی

```bash
npm run lint
npx tsc --noEmit
npm run build
```

برای build production مقدار `CMS_API_URL` را قبل از build export کنید و همان مقدار قابل دسترس را در اجرای production نیز نگه دارید:

```bash
CMS_API_URL=http://localhost:5100 NEXT_PUBLIC_SITE_URL=https://idehnegar.co npm run build
npm start
```

## پنل مدیریت و آپلود

پنل MVC بک‌اند روی `/Admin` قرار دارد. در صورت ارائه فرانت و بک‌اند روی یک origin، Next مسیرهای پنل، فایل‌های `/Panel` و `/uploads` را به `CMS_API_URL` proxy می‌کند؛ بنابراین مرورگر نیازی به آدرس localhost یا CORS ندارد. ورود مدیر با تنظیمات امن بک‌اند انجام می‌شود (مقادیر در `backend/README.md` توضیح داده شده‌اند). اعتبارنامه یا رمز پیش‌فرض در فرانت‌اند تعریف نشده است.

تصاویر منتشرشده در CMS از مسیر `/uploads/...` در دسترس‌اند. uploader بک‌اند نوع فایل، امضا و سقف حجم را بررسی می‌کند.

## اتصال CMS و fallback

- `src/lib/cms.ts` تمام خواندن‌های CMS را فقط در سمت سرور انجام می‌دهد؛ URL داخلی API به bundle مرورگر نمی‌رود.
- API نسخه‌دار مورد استفاده شامل `/api/v1/site`, `/api/v1/pages/{key}`, `/api/v1/portfolio`, `/api/v1/portfolio/{slug}` و `/api/v1/contact` است.
- واژه‌نامه و تنظیمات مشترک سایت، دسته‌بندی‌ها، نمونه‌کارها و فیلدهای SEO هنگام درخواست از API خوانده می‌شوند. ویرایش این داده‌ها پس از تأیید اتصال CMS نیاز به build مجدد ندارد.
- متن‌های بخش‌به‌بخش بعضی صفحه‌های اختصاصی (از جمله About، Store Builder، Payment و Gold App) هنوز در مؤلفه‌های موجود فرانت‌اند ثابت هستند؛ فیلدهای Body/JSON عمومی بک‌اند فعلاً به renderer عمومی تبدیل نشده‌اند. بنابراین مدیریت کامل همه متن‌های این صفحات هنوز تکمیل نشده است.
- اگر `CMS_API_URL` تنظیم نشده یا سرویس موقتاً در دسترس نباشد، محتوای فعلی داخل سورس Next.js به‌عنوان fallback استفاده می‌شود.
- پیام فرم تماس در حالت CMS به `dbo.tbl_ContactSubmissions` ارسال می‌شود؛ ایمیل اطلاع‌رسانی جداگانه و اختیاری است.

برای ساخت فایل Seed از محتوای فعلی فرانت‌اند و ورود اولیه به CMS:

```bash
npm run export:cms-seed
```

اسکریپت، خروجی idempotent را در `../backend/EndPoints/Seed/site-content.seed.json` می‌نویسد؛ اجرای Seeder کلیدهای موجود را دوباره درج نمی‌کند و محتوای ویرایش‌شده توسط مدیر را بازنویسی نمی‌کند.

## SEO

- metadata دو‌زبانه، canonical و `hreflang` از رکوردهای CMS خوانده می‌شوند و مقدار fallback دارند.
- JSON-LD برای سازمان، فهرست نمونه‌کارها و جزئیات پروژه‌ها حفظ شده است.
- `/sitemap.xml` و `/robots.txt` به‌صورت server-rendered تولید می‌شوند تا دامنه، مسیرها و نمونه‌کارهای منتشرشده را از CMS منعکس کنند.
- صفحه‌های عمومی SSR هستند تا تغییرات CMS بدون build مجدد در محتوا و metadata منعکس شوند.
