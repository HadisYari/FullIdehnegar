using EndPoints.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EndPoints.Infrastructure.Data.Migrations;

[DbContext(typeof(AppDbContext))]
public sealed class AppDbContextModelSnapshot : ModelSnapshot
{
    protected override void BuildModel(ModelBuilder modelBuilder)
    {
#pragma warning disable 612, 618
        modelBuilder
            .HasAnnotation("ProductVersion", "9.0.12")
            .HasAnnotation("Relational:MaxIdentifierLength", 128);
        SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

        modelBuilder.Entity("EndPoints.Core.Entities.ContentEntry", entity =>
        {
            entity.Property<int>("Id").ValueGeneratedOnAdd()
                .HasColumnType("int")
                .HasAnnotation("SqlServer:Identity", "1, 1");
            entity.Property<string>("BodyEn").HasColumnType("nvarchar(max)");
            entity.Property<string>("BodyFa").HasColumnType("nvarchar(max)");
            entity.Property<string>("CanonicalUrlEn").HasMaxLength(512).HasColumnType("nvarchar(512)");
            entity.Property<string>("CanonicalUrlFa").HasMaxLength(512).HasColumnType("nvarchar(512)");
            entity.Property<string>("ContentKey").IsRequired().HasMaxLength(180).HasColumnType("nvarchar(180)");
            entity.Property<string>("ContentType").IsRequired().HasMaxLength(40).HasColumnType("nvarchar(40)");
            entity.Property<DateTime>("CreatedAtUtc").HasColumnType("datetime2");
            entity.Property<string>("DataEnJson").IsRequired().ValueGeneratedOnAdd().HasColumnType("nvarchar(max)").HasDefaultValue("{}");
            entity.Property<string>("DataFaJson").IsRequired().ValueGeneratedOnAdd().HasColumnType("nvarchar(max)").HasDefaultValue("{}");
            entity.Property<string>("ImageAltEn").HasMaxLength(250).HasColumnType("nvarchar(250)");
            entity.Property<string>("ImageAltFa").HasMaxLength(250).HasColumnType("nvarchar(250)");
            entity.Property<string>("ImagePath").HasMaxLength(512).HasColumnType("nvarchar(512)");
            entity.Property<bool>("IsFeatured").ValueGeneratedOnAdd().HasColumnType("bit").HasDefaultValue(false);
            entity.Property<bool>("IsPublished").ValueGeneratedOnAdd().HasColumnType("bit").HasDefaultValue(true);
            entity.Property<string>("KeywordsEn").HasMaxLength(500).HasColumnType("nvarchar(500)");
            entity.Property<string>("KeywordsFa").HasMaxLength(500).HasColumnType("nvarchar(500)");
            entity.Property<string>("MetaDescriptionEn").HasMaxLength(500).HasColumnType("nvarchar(500)");
            entity.Property<string>("MetaDescriptionFa").HasMaxLength(500).HasColumnType("nvarchar(500)");
            entity.Property<string>("MetaTitleEn").HasMaxLength(250).HasColumnType("nvarchar(250)");
            entity.Property<string>("MetaTitleFa").HasMaxLength(250).HasColumnType("nvarchar(250)");
            entity.Property<string>("OpenGraphDescriptionEn").HasMaxLength(500).HasColumnType("nvarchar(500)");
            entity.Property<string>("OpenGraphDescriptionFa").HasMaxLength(500).HasColumnType("nvarchar(500)");
            entity.Property<string>("OpenGraphTitleEn").HasMaxLength(250).HasColumnType("nvarchar(250)");
            entity.Property<string>("OpenGraphTitleFa").HasMaxLength(250).HasColumnType("nvarchar(250)");
            entity.Property<int>("SortOrder").HasColumnType("int");
            entity.Property<string>("Slug").HasMaxLength(180).HasColumnType("nvarchar(180)");
            entity.Property<string>("SlugEn").HasMaxLength(180).HasColumnType("nvarchar(180)");
            entity.Property<string>("SlugFa").HasMaxLength(180).HasColumnType("nvarchar(180)");
            entity.Property<string>("SharedJson").IsRequired().ValueGeneratedOnAdd().HasColumnType("nvarchar(max)").HasDefaultValue("{}");
            entity.Property<string>("SummaryEn").HasMaxLength(1000).HasColumnType("nvarchar(1000)");
            entity.Property<string>("SummaryFa").HasMaxLength(1000).HasColumnType("nvarchar(1000)");
            entity.Property<string>("TitleEn").HasMaxLength(250).HasColumnType("nvarchar(250)");
            entity.Property<string>("TitleFa").HasMaxLength(250).HasColumnType("nvarchar(250)");
            entity.Property<DateTime?>("UpdatedAtUtc").HasColumnType("datetime2");
            entity.HasKey("Id").HasName("PK_tbl_ContentEntries");
            entity.HasIndex("ContentKey").IsUnique().HasDatabaseName("UX_tbl_ContentEntries_ContentKey");
            entity.HasIndex("ContentType", "IsPublished", "SortOrder").HasDatabaseName("IX_tbl_ContentEntries_Type_Published_Order");
            entity.ToTable("tbl_ContentEntries", "dbo");
        });

        modelBuilder.Entity("EndPoints.Core.Entities.ContactSubmission", entity =>
        {
            entity.Property<int>("Id").ValueGeneratedOnAdd()
                .HasColumnType("int")
                .HasAnnotation("SqlServer:Identity", "1, 1");
            entity.Property<DateTime>("CreatedAtUtc").HasColumnType("datetime2");
            entity.Property<string>("Email").IsRequired().HasMaxLength(254).HasColumnType("nvarchar(254)");
            entity.Property<bool>("IsRead").ValueGeneratedOnAdd().HasColumnType("bit").HasDefaultValue(false);
            entity.Property<string>("Locale").IsRequired().IsUnicode(false).HasMaxLength(2).HasColumnType("varchar(2)");
            entity.Property<string>("Message").IsRequired().HasMaxLength(5000).HasColumnType("nvarchar(5000)");
            entity.Property<string>("Name").IsRequired().HasMaxLength(120).HasColumnType("nvarchar(120)");
            entity.Property<string>("Phone").HasMaxLength(40).HasColumnType("nvarchar(40)");
            entity.Property<string>("Subject").IsRequired().HasMaxLength(200).HasColumnType("nvarchar(200)");
            entity.HasKey("Id").HasName("PK_tbl_ContactSubmissions");
            entity.HasIndex("IsRead", "CreatedAtUtc").HasDatabaseName("IX_tbl_ContactSubmissions_Read_Created");
            entity.ToTable("tbl_ContactSubmissions", "dbo");
        });
#pragma warning restore 612, 618
    }
}
