using EndPoints.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EndPoints.Infrastructure.Data.Migrations;

[DbContext(typeof(AppDbContext))]
[Migration("202610090001_InitialCms")]
public sealed class InitialCms : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "tbl_ContentEntries",
            schema: "dbo",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                ContentKey = table.Column<string>(type: "nvarchar(180)", maxLength: 180, nullable: false),
                ContentType = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                Slug = table.Column<string>(type: "nvarchar(180)", maxLength: 180, nullable: true),
                SlugFa = table.Column<string>(type: "nvarchar(180)", maxLength: 180, nullable: true),
                SlugEn = table.Column<string>(type: "nvarchar(180)", maxLength: 180, nullable: true),
                TitleFa = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                TitleEn = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                SummaryFa = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                SummaryEn = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                BodyFa = table.Column<string>(type: "nvarchar(max)", nullable: true),
                BodyEn = table.Column<string>(type: "nvarchar(max)", nullable: true),
                MetaTitleFa = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                MetaTitleEn = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                MetaDescriptionFa = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                MetaDescriptionEn = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                KeywordsFa = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                KeywordsEn = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                CanonicalUrlFa = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                CanonicalUrlEn = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                OpenGraphTitleFa = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                OpenGraphTitleEn = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                OpenGraphDescriptionFa = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                OpenGraphDescriptionEn = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                ImagePath = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                ImageAltFa = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                ImageAltEn = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: true),
                DataFaJson = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValue: "{}"),
                DataEnJson = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValue: "{}"),
                SharedJson = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValue: "{}"),
                IsPublished = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                IsFeatured = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                SortOrder = table.Column<int>(type: "int", nullable: false),
                CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
            },
            constraints: table => table.PrimaryKey("PK_tbl_ContentEntries", x => x.Id));

        migrationBuilder.CreateTable(
            name: "tbl_ContactSubmissions",
            schema: "dbo",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                Name = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                Email = table.Column<string>(type: "nvarchar(254)", maxLength: 254, nullable: false),
                Phone = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                Subject = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                Message = table.Column<string>(type: "nvarchar(5000)", maxLength: 5000, nullable: false),
                Locale = table.Column<string>(type: "varchar(2)", unicode: false, maxLength: 2, nullable: false),
                CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                IsRead = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
            },
            constraints: table => table.PrimaryKey("PK_tbl_ContactSubmissions", x => x.Id));

        migrationBuilder.CreateIndex(
            name: "UX_tbl_ContentEntries_ContentKey",
            schema: "dbo",
            table: "tbl_ContentEntries",
            column: "ContentKey",
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_tbl_ContentEntries_Type_Published_Order",
            schema: "dbo",
            table: "tbl_ContentEntries",
            columns: new[] { "ContentType", "IsPublished", "SortOrder" });

        migrationBuilder.CreateIndex(
            name: "IX_tbl_ContactSubmissions_Read_Created",
            schema: "dbo",
            table: "tbl_ContactSubmissions",
            columns: new[] { "IsRead", "CreatedAtUtc" });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "tbl_ContentEntries", schema: "dbo");
        migrationBuilder.DropTable(name: "tbl_ContactSubmissions", schema: "dbo");
    }
}
