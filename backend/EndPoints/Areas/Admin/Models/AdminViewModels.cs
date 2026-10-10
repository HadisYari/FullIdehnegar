namespace EndPoints.Areas.Admin.Models;

/// <summary>One cell of the generic index table.</summary>
public sealed class AdminCellModel
{
    public string Label { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public bool IsImage { get; set; }
    public bool IsBool { get; set; }
}

/// <summary>One row of the generic index table.</summary>
public sealed class AdminRowModel
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public bool IsPublished { get; set; }
    public List<AdminCellModel> Cells { get; set; } = new();
}

/// <summary>The edit form of any content entity.</summary>
public sealed class AdminFormModel
{
    public string RouteName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public bool IsNew { get; set; }
    public Guid? Id { get; set; }
    public List<AdminFieldModel> Fields { get; set; } = new();
}

public sealed class AdminFieldModel
{
    public string Property { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public AdminFieldKind Kind { get; set; }
    public string Value { get; set; } = string.Empty;
    public bool Required { get; set; }
    public int MaxLength { get; set; } = 500;
    public string? Help { get; set; }
    public string Column { get; set; } = "col-12";
    public IReadOnlyList<AdminOption> Options { get; set; } = Array.Empty<AdminOption>();
    public IReadOnlyList<AdminRepeaterColumn> Columns { get; set; } = Array.Empty<AdminRepeaterColumn>();

    public bool IsText => Kind is AdminFieldKind.Text or AdminFieldKind.Code or AdminFieldKind.Slug;
    public bool IsMultiline => Kind is AdminFieldKind.Textarea or AdminFieldKind.LineList;
    public bool IsNumber => Kind is AdminFieldKind.Number or AdminFieldKind.Decimal;
    public bool IsJsonEditor => Kind is AdminFieldKind.LineList or AdminFieldKind.TagList or AdminFieldKind.Repeater;

    /// <summary>Rendering/publishing switches get their own card in the form.</summary>
    public bool IsTechnical => Property is "SortOrder" or "IsPublished";

    /// <summary>
    /// The panel is RTL, but slugs, urls, colors and English copy must be typed
    /// left-to-right, otherwise the caret behaviour is confusing.
    /// </summary>
    public bool IsLatinInput => Kind is AdminFieldKind.Image or AdminFieldKind.Code or AdminFieldKind.Slug
        || Property.EndsWith("En", StringComparison.Ordinal)
        || Property.EndsWith("Json", StringComparison.Ordinal)
        || Property.Contains("Url", StringComparison.OrdinalIgnoreCase)
        || Property.Contains("Href", StringComparison.OrdinalIgnoreCase)
        || Property.Contains("Embed", StringComparison.OrdinalIgnoreCase)
        || Property.Contains("Image", StringComparison.OrdinalIgnoreCase)
        || Property.Contains("Screenshot", StringComparison.OrdinalIgnoreCase)
        || Property.Contains("Icon", StringComparison.OrdinalIgnoreCase)
        || Property.Contains("Slug", StringComparison.OrdinalIgnoreCase)
        || Property.Contains("Color", StringComparison.OrdinalIgnoreCase)
        || Property.Contains("Gradient", StringComparison.OrdinalIgnoreCase)
        || Property.Contains("Monogram", StringComparison.OrdinalIgnoreCase);
}

/// <summary>Dashboard tiles.</summary>
public sealed class AdminDashboardModel
{
    public int Projects { get; set; }
    public int DraftProjects { get; set; }
    public int Services { get; set; }
    public int Testimonials { get; set; }
    public int Clients { get; set; }
    public int UnreadMessages { get; set; }
    public DateTime? LastContentUpdateUtc { get; set; }
    public List<AdminMessagePreview> LatestMessages { get; set; } = new();
}

public sealed class AdminMessagePreview
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public bool IsArchived { get; set; }
}

/// <summary>Inbox row (contact messages and store orders share the list layout).</summary>
public sealed class AdminInboxModel
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public bool IsArchived { get; set; }
    public string Status { get; set; } = string.Empty;
}

/// <summary>Generic list screen of a content entity.</summary>
public sealed class AdminIndexModel
{
    public string RouteName { get; set; } = string.Empty;
    public string TitleFa { get; set; } = string.Empty;
    public string SingularFa { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public bool Searchable { get; set; }
    public List<AdminColumnSpec> Columns { get; set; } = new();
    public List<AdminRowModel> Rows { get; set; } = new();
}
