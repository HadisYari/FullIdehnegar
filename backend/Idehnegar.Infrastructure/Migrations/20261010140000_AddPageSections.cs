using System;
using Idehnegar.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Idehnegar.Infrastructure.Migrations
{
    /// <summary>
    /// Adds <c>PageSections</c>: the copy and repeated items of page blocks (gold-app,
    /// about manifesto and quick links, home CTA). Keyed by page and block.
    /// </summary>
    [DbContext(typeof(AppDbContext))]
    [Migration("20261010140000_AddPageSections")]
    public partial class AddPageSections : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PageSections",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PageKey = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    SectionKey = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    EyebrowFa = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    EyebrowEn = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    TitleFa = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    TitleEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    SubtitleFa = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    SubtitleEn = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    BodyFa = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    BodyEn = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    ItemsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PageSections", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "UX_PageSections_Page_Section",
                schema: "dbo",
                table: "PageSections",
                columns: new[] { "PageKey", "SectionKey" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PageSections",
                schema: "dbo");
        }
    }
}
