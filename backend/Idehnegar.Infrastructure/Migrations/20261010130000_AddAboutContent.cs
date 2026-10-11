using System;
using Idehnegar.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Idehnegar.Infrastructure.Migrations
{
    /// <summary>
    /// Adds the about-page tables: section copy (<c>AboutSections</c>) and the item
    /// tables of its blocks (values, certifications, lifecycle, philosophy, tech stack
    /// and counters). The front end used to hard-code these in its components.
    /// </summary>
    [DbContext(typeof(AppDbContext))]
    [Migration("20261010130000_AddAboutContent")]
    public partial class AddAboutContent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AboutSections",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Key = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    EyebrowFa = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    EyebrowEn = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    TitleFa = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    TitleEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    SubtitleFa = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    SubtitleEn = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AboutSections", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "UX_AboutSections_Key",
                schema: "dbo",
                table: "AboutSections",
                columns: new[] { "Key" },
                unique: true);

            migrationBuilder.CreateTable(
                name: "AboutStats",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Value = table.Column<int>(type: "int", nullable: false),
                    Suffix = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    LabelFa = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    LabelEn = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AboutStats", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AboutStats_Published_Sort",
                schema: "dbo",
                table: "AboutStats",
                columns: new[] { "IsPublished", "SortOrder" },
                unique: false);

            migrationBuilder.CreateTable(
                name: "Certifications",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    TitleFa = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    TitleEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    OrganizationFa = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: false),
                    OrganizationEn = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: false),
                    ColorClass = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    BorderClass = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Certifications", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Certifications_Published_Sort",
                schema: "dbo",
                table: "Certifications",
                columns: new[] { "IsPublished", "SortOrder" },
                unique: false);

            migrationBuilder.CreateTable(
                name: "CoreValues",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IconPath = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    TitleFa = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    TitleEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    DescriptionFa = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    DescriptionEn = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoreValues", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CoreValues_Published_Sort",
                schema: "dbo",
                table: "CoreValues",
                columns: new[] { "IsPublished", "SortOrder" },
                unique: false);

            migrationBuilder.CreateTable(
                name: "LifecycleSteps",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NumberLabel = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    NameFa = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    NameEn = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DescriptionFa = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    DescriptionEn = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LifecycleSteps", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LifecycleSteps_Published_Sort",
                schema: "dbo",
                table: "LifecycleSteps",
                columns: new[] { "IsPublished", "SortOrder" },
                unique: false);

            migrationBuilder.CreateTable(
                name: "PhilosophyPrinciples",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IconName = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    TagFa = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    TagEn = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    TitleFa = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    TitleEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    DescriptionFa = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    DescriptionEn = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CodeSnippet = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhilosophyPrinciples", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PhilosophyPrinciples_Published_Sort",
                schema: "dbo",
                table: "PhilosophyPrinciples",
                columns: new[] { "IsPublished", "SortOrder" },
                unique: false);

            migrationBuilder.CreateTable(
                name: "TechStackGroups",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LabelFa = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    LabelEn = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    ItemsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TechStackGroups", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TechStackGroups_Published_Sort",
                schema: "dbo",
                table: "TechStackGroups",
                columns: new[] { "IsPublished", "SortOrder" },
                unique: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TechStackGroups",
                schema: "dbo");
            migrationBuilder.DropTable(
                name: "PhilosophyPrinciples",
                schema: "dbo");
            migrationBuilder.DropTable(
                name: "LifecycleSteps",
                schema: "dbo");
            migrationBuilder.DropTable(
                name: "CoreValues",
                schema: "dbo");
            migrationBuilder.DropTable(
                name: "Certifications",
                schema: "dbo");
            migrationBuilder.DropTable(
                name: "AboutStats",
                schema: "dbo");
            migrationBuilder.DropTable(
                name: "AboutSections",
                schema: "dbo");
        }
    }
}
