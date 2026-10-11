using Idehnegar.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Idehnegar.Infrastructure.Migrations
{
    /// <summary>
    /// Removes the payment copy from the content that already lives in the database:
    /// the payment page rows (if any were created in the panel), the one store template
    /// whose features and tag promised a payment gateway, and the store-builder meta and
    /// intro/final-CTA copy. The values match the regenerated seed, so a fresh database
    /// and a migrated one end up with the same text. <c>Down</c> is a no-op: the removed
    /// rows and the old copy are not restored.
    /// </summary>
    [DbContext(typeof(AppDbContext))]
    [Migration("20261010170000_RemovePaymentCopy")]
    public partial class RemovePaymentCopy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DELETE FROM dbo.PageSections WHERE PageKey = N'payment';
                DELETE FROM dbo.PageMetas WHERE PageKey = N'payment';
                UPDATE dbo.StoreTemplates SET Tag = N'بدون انبارداری • راه‌اندازی فوری', TagEn = N'No warehousing • instant setup', FeaturesJson = N'[""تسویه حساب تک‌مرحله‌ای در ۳۰ ثانیه"", ""بدون لودینگ لاگ انبارداری"", ""امتیاز ۱۰۰ در تست سرعت""]', FeaturesEnJson = N'[""One-step checkout in 30 seconds"", ""No warehousing log loading"", ""Score of 100 in speed tests""]' WHERE Code = N'light-1';
                UPDATE dbo.PageMetas SET TitleFa = N'فروشگاه‌ساز ابری | قالب‌های فروشگاه اینترنتی | پیشگامان ایده‌نگار', TitleEn = N'Cloud Store Builder | Store Templates | Idehnegar', DescriptionFa = N'قالب فروشگاه اینترنتی خود را با انبارداری جامع یا نسخه سبک انتخاب کنید و برای راه‌اندازی با تیم ایده‌نگار در تماس باشید.', DescriptionEn = N'Pick a store template with full warehouse management or a light version, then contact our team to get started.' WHERE PageKey = N'store-builder';
                UPDATE dbo.PageSections SET BodyFa = N'قالب و معماری مورد نیاز کسب‌وکار خود را انتخاب کنید، پیش‌نمایش را بررسی کرده و برای راه‌اندازی فروشگاه با تیم ایده‌نگار در تماس باشید.', BodyEn = N'Choose the template and architecture your business needs, review the previews, and contact our team to set up your store.' WHERE PageKey = N'store-builder' AND SectionKey = N'intro';
                UPDATE dbo.PageSections SET BodyFa = N'پس از هماهنگی با تیم ایده‌نگار، لایسنس فروشگاه و زیرساخت سرور شما در کمتر از ۱۰ دقیقه به‌صورت اتوماتیک کانفیگ و تحویل داده می‌شود.', BodyEn = N'After we agree on the details with the Idehnegar team, your store license and server infrastructure are configured and delivered automatically within 10 minutes.' WHERE PageKey = N'store-builder' AND SectionKey = N'final-cta';
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
