using System;
using Idehnegar.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Idehnegar.Infrastructure.Migrations
{
    /// <summary>
    /// Adds the English copy of the store-builder templates: name, plan name, tag,
    /// discount badge, description, feature list and the screenshot labels (the
    /// labels live in the JSON of the screen columns, so they need no column here).
    /// </summary>
    [DbContext(typeof(AppDbContext))]
    [Migration("20261010160000_AddStoreTemplateEnglish")]
    public partial class AddStoreTemplateEnglish : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NameEn",
                schema: "dbo",
                table: "StoreTemplates",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "");
            migrationBuilder.AddColumn<string>(
                name: "PlanNameEn",
                schema: "dbo",
                table: "StoreTemplates",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "");
            migrationBuilder.AddColumn<string>(
                name: "TagEn",
                schema: "dbo",
                table: "StoreTemplates",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);
            migrationBuilder.AddColumn<string>(
                name: "DiscountBadgeEn",
                schema: "dbo",
                table: "StoreTemplates",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: true);
            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                schema: "dbo",
                table: "StoreTemplates",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);
            migrationBuilder.AddColumn<string>(
                name: "FeaturesEnJson",
                schema: "dbo",
                table: "StoreTemplates",
                type: "nvarchar(max)",
                nullable: true);
            // Loads the English copy of the five shipped templates (same values as seed.json).
            migrationBuilder.Sql(@"
UPDATE dbo.StoreTemplates SET NameEn = N'MegaShop Enterprise (MegaShop Pro)', PlanNameEn = N'MegaShop Enterprise plan', TagEn = N'Multi-branch warehouse management system', DiscountBadgeEn = N'20% off annually', DescriptionEn = N'Designed for hypermarkets, digital goods retailers and brands with over 50,000 SKUs, several physical warehouses and official invoicing.', FeaturesEnJson = N'[""Real-time stock control across multiple warehouses"",""Barcode-based receipts and dispatches"",""Integration with financial systems and Sepidar"",""Dedicated cloud hosting and free SSL""]' WHERE Code = N'wh-1';
UPDATE dbo.StoreTemplates SET NameEn = N'Moda Matrix', PlanNameEn = N'Advanced fashion and apparel plan', TagEn = N'Size and colour warehouse management', DiscountBadgeEn = N'20% off annually', DescriptionEn = N'Built for clothing and footwear stores, with a multi-dimensional warehouse matrix by size, colour and production batch, plus low-stock alerts.', FeaturesEnJson = N'[""Colour and size matrix inventory"",""Temporary stock reservation in the cart"",""Critical low-stock alerts"",""Advanced discount code system""]' WHERE Code = N'wh-2';
UPDATE dbo.StoreTemplates SET NameEn = N'Techno Ware (Industrial & Tools)', PlanNameEn = N'B2B corporate plan', TagEn = N'Serialised and spare-parts warehouse', DiscountBadgeEn = N'20% off annually', DescriptionEn = N'For distributors of spare parts and components with individual serial numbers, shelf-organised warehouses and official B2B pro-forma invoices.', FeaturesEnJson = N'[""Consignment notes and technical part serial numbers"",""Instant pro-forma invoices with tax"",""Main and consignment warehouses kept separate"",""Synced accounting panel""]' WHERE Code = N'wh-3';
UPDATE dbo.StoreTemplates SET NameEn = N'Market Central', PlanNameEn = N'Multi-vendor marketplace plan', TagEn = N'Central multi-supplier warehouse', DiscountBadgeEn = N'20% off annually', DescriptionEn = N'A logistics hub that stores goods from several suppliers in one central warehouse and hands outgoing orders to the courier automatically.', FeaturesEnJson = N'[""Warehouse separation per seller"",""Automatic allocation to the nearest branch"",""Valuation of slow-moving stock in rials"",""Automatic multi-supplier settlement""]' WHERE Code = N'wh-4';
UPDATE dbo.StoreTemplates SET NameEn = N'Flash Direct', PlanNameEn = N'Light download plan', TagEn = N'No warehousing • instant purchase', DiscountBadgeEn = N'25% off annually', DescriptionEn = N'For businesses without a warehouse or physical stock (digital products, services, single products or instant sourcing). No heavy warehousing features, and very fast.', FeaturesEnJson = N'[""One-step checkout in 30 seconds"",""No warehousing log loading"",""Score of 100 in speed tests"",""Fast connection to the bank gateway""]' WHERE Code = N'light-1';
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NameEn",
                schema: "dbo",
                table: "StoreTemplates");
            migrationBuilder.DropColumn(
                name: "PlanNameEn",
                schema: "dbo",
                table: "StoreTemplates");
            migrationBuilder.DropColumn(
                name: "TagEn",
                schema: "dbo",
                table: "StoreTemplates");
            migrationBuilder.DropColumn(
                name: "DiscountBadgeEn",
                schema: "dbo",
                table: "StoreTemplates");
            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                schema: "dbo",
                table: "StoreTemplates");
            migrationBuilder.DropColumn(
                name: "FeaturesEnJson",
                schema: "dbo",
                table: "StoreTemplates");
        }
    }
}
