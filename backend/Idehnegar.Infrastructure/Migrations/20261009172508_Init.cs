using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Idehnegar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "dbo");

            migrationBuilder.CreateTable(
                name: "AppDownloadLinks",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TitleFa = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    TitleEn = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CaptionFa = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CaptionEn = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Href = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Emoji = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    Variant = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppDownloadLinks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Clients",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NameFa = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    NameEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Monogram = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    LogoUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ContactMessages",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    Subject = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    Message = table.Column<string>(type: "nvarchar(max)", maxLength: 8000, nullable: false),
                    InquiryType = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: true),
                    Locale = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    SourceIp = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: true),
                    EmailSent = table.Column<bool>(type: "bit", nullable: false),
                    IsArchived = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactMessages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FaqItems",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QuestionFa = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    QuestionEn = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    AnswerFa = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    AnswerEn = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FaqItems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InquiryTypes",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    LabelFa = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    LabelEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InquiryTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Milestones",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Year = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TitleFa = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    TitleEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    DescriptionFa = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    DescriptionEn = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Glow = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Gradient = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Milestones", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PageMetas",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PageKey = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    Path = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    TitleFa = table.Column<string>(type: "nvarchar(220)", maxLength: 220, nullable: false),
                    TitleEn = table.Column<string>(type: "nvarchar(220)", maxLength: 220, nullable: false),
                    DescriptionFa = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: false),
                    DescriptionEn = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: false),
                    KeywordsFa = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    KeywordsEn = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    EyebrowFa = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    EyebrowEn = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    HeadingFa = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    HeadingEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    SubheadingFa = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    SubheadingEn = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CtaPrimaryFa = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    CtaPrimaryEn = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    CtaSecondaryFa = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    CtaSecondaryEn = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    OgImage = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    NoIndex = table.Column<bool>(type: "bit", nullable: false),
                    ChangeFrequency = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Priority = table.Column<decimal>(type: "decimal(4,2)", precision: 4, scale: 2, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PageMetas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PortfolioCategories",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    NameFa = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    NameEn = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PortfolioCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PortfolioProjects",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(180)", maxLength: 180, nullable: false),
                    TitleFa = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    TitleEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    SummaryFa = table.Column<string>(type: "nvarchar(600)", maxLength: 600, nullable: false),
                    SummaryEn = table.Column<string>(type: "nvarchar(600)", maxLength: 600, nullable: false),
                    DescriptionFa = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    DescriptionEn = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    Category = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Image = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    DesktopScreenshot = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    MobileScreenshot = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    GalleryJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TagsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FeaturesJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StatsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ChallengeFa = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    ChallengeEn = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    SolutionFa = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    SolutionEn = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    ClientFa = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    ClientEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Link = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Featured = table.Column<bool>(type: "bit", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PortfolioProjects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProcessSteps",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    Color = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Accent = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    TitleFa = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    TitleEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    DurationFa = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    DurationEn = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    DescriptionFa = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    DescriptionEn = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    DeliverablesFaJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeliverablesEnJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProcessSteps", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    TitleFa = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    TitleEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    DescriptionFa = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    DescriptionEn = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    HighlightsFaJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HighlightsEnJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VisualIndex = table.Column<int>(type: "int", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SiteSettings",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Domain = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    SiteUrl = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    NameFa = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    NameEn = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ShortNameFa = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ShortNameEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TaglineFa = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    TaglineEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    FoundedJalali = table.Column<int>(type: "int", nullable: false),
                    FoundedGregorian = table.Column<int>(type: "int", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PhonesJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TelegramId = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    WhatsAppNumber = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    AddressFa = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    AddressEn = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    HoursFa = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    HoursEn = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                    MapEmbedSrc = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    SocialJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StatsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DefaultOgImage = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StoreOrders",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Mobile = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    StoreName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    DesiredDomain = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    TemplateCode = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    PlanName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    BillingCycle = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Gateway = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    AuthCode = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: true),
                    Locale = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PaidAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StoreOrders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StorePlans",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Badge = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Tagline = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsPopular = table.Column<bool>(type: "bit", nullable: false),
                    MonthlyPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    YearlyPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    SetupTime = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    FeaturesJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LimitationsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StorePlans", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StoreTemplates",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Tag = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    PlanName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    PriceMonthly = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    PriceYearly = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    DiscountBadge = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    FeaturesJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DesktopScreensJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MobileScreensJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StoreTemplates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TeamDisciplines",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoleEn = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    LabelFa = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Span = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    Background = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamDisciplines", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Testimonials",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NameFa = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    NameEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    QuoteFa = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    QuoteEn = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Testimonials", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppDownloadLinks_Published_Sort",
                schema: "dbo",
                table: "AppDownloadLinks",
                columns: new[] { "IsPublished", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_Clients_Published_Sort",
                schema: "dbo",
                table: "Clients",
                columns: new[] { "IsPublished", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_ContactMessages_Archived",
                schema: "dbo",
                table: "ContactMessages",
                column: "IsArchived");

            migrationBuilder.CreateIndex(
                name: "IX_ContactMessages_Created",
                schema: "dbo",
                table: "ContactMessages",
                column: "CreatedAtUtc",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "IX_FaqItems_Published_Sort",
                schema: "dbo",
                table: "FaqItems",
                columns: new[] { "IsPublished", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "UX_InquiryTypes_Code",
                schema: "dbo",
                table: "InquiryTypes",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Milestones_Published_Sort",
                schema: "dbo",
                table: "Milestones",
                columns: new[] { "IsPublished", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "UX_PageMetas_PageKey",
                schema: "dbo",
                table: "PageMetas",
                column: "PageKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PortfolioCategories_Published_Sort",
                schema: "dbo",
                table: "PortfolioCategories",
                columns: new[] { "IsPublished", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "UX_PortfolioCategories_Slug",
                schema: "dbo",
                table: "PortfolioCategories",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PortfolioProjects_Category",
                schema: "dbo",
                table: "PortfolioProjects",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_PortfolioProjects_Featured",
                schema: "dbo",
                table: "PortfolioProjects",
                column: "Featured");

            migrationBuilder.CreateIndex(
                name: "IX_PortfolioProjects_Published_Sort",
                schema: "dbo",
                table: "PortfolioProjects",
                columns: new[] { "IsPublished", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "UX_PortfolioProjects_Slug",
                schema: "dbo",
                table: "PortfolioProjects",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProcessSteps_Published_Sort",
                schema: "dbo",
                table: "ProcessSteps",
                columns: new[] { "IsPublished", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_Services_Published_Sort",
                schema: "dbo",
                table: "Services",
                columns: new[] { "IsPublished", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_StoreOrders_Created",
                schema: "dbo",
                table: "StoreOrders",
                column: "CreatedAtUtc",
                descending: new bool[0]);

            migrationBuilder.CreateIndex(
                name: "IX_StoreOrders_Status",
                schema: "dbo",
                table: "StoreOrders",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "UX_StorePlans_Code",
                schema: "dbo",
                table: "StorePlans",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StoreTemplates_Published_Category",
                schema: "dbo",
                table: "StoreTemplates",
                columns: new[] { "IsPublished", "Category", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "UX_StoreTemplates_Code",
                schema: "dbo",
                table: "StoreTemplates",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TeamDisciplines_Published_Sort",
                schema: "dbo",
                table: "TeamDisciplines",
                columns: new[] { "IsPublished", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_Testimonials_Published_Sort",
                schema: "dbo",
                table: "Testimonials",
                columns: new[] { "IsPublished", "SortOrder" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppDownloadLinks",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "Clients",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "ContactMessages",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "FaqItems",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "InquiryTypes",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "Milestones",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "PageMetas",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "PortfolioCategories",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "PortfolioProjects",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "ProcessSteps",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "Services",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "SiteSettings",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "StoreOrders",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "StorePlans",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "StoreTemplates",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "TeamDisciplines",
                schema: "dbo");

            migrationBuilder.DropTable(
                name: "Testimonials",
                schema: "dbo");
        }
    }
}
