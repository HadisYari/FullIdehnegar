using System;
using Idehnegar.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Idehnegar.Infrastructure.Migrations
{
    /// <summary>
    /// جدول <c>Users</c> را می‌سازد: حساب‌های ورود به پنل مدیریت (نام کاربری، رمز
    /// عبور، نام و نقش). به‌خواستهٔ پروژه رمز عبور به‌صورت متن ساده ذخیره می‌شود،
    /// بنابراین ستون <c>Password</c> فقط یک nvarchar است و هیچ ستون هش/نمکی ندارد.
    /// خودِ جدول توسط <c>DbInitializer</c> با اولین حساب مدیر پر می‌شود.
    /// </summary>
    [DbContext(typeof(AppDbContext))]
    [Migration("20261011120000_AddUsers")]
    public partial class AddUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                schema: "dbo",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    LastLoginAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            // ورود با نام کاربری انجام می‌شود، پس نمی‌تواند تکراری باشد.
            migrationBuilder.CreateIndex(
                name: "UX_Users_Username",
                schema: "dbo",
                table: "Users",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_IsPublished",
                schema: "dbo",
                table: "Users",
                column: "IsPublished",
                unique: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users",
                schema: "dbo");
        }
    }
}
