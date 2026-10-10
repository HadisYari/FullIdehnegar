using System;
using Idehnegar.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Idehnegar.Infrastructure.Migrations
{
    /// <summary>
    /// Adds the <c>HomeServiceCards</c> table: the cards of the home services grid,
    /// which the front end used to hard-code in <c>services-section.tsx</c>.
    /// </summary>
    [DbContext(typeof(AppDbContext))]
    [Migration("20261010120000_AddHomeServiceCards")]
    public partial class AddHomeServiceCards : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HomeServiceCards",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    IconName = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    TitleFa = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    TitleEn = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    DescriptionFa = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    DescriptionEn = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Color = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    SoftColor = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    GlowColor = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: true),
                    FeatureTitleFa = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    FeatureTitleEn = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    FeatureValueFa = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    FeatureValueEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Progress = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    TagsJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HomeServiceCards", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HomeServiceCards_Published_Sort",
                schema: "dbo",
                table: "HomeServiceCards",
                columns: new[] { "IsPublished", "SortOrder" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HomeServiceCards",
                schema: "dbo");
        }
    }
}
