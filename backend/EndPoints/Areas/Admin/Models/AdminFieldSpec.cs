namespace EndPoints.Areas.Admin.Models;

/// <summary>How a property of an entity is edited in the panel.</summary>
public enum AdminFieldKind
{
    Text,
    Textarea,
    Number,
    Decimal,
    Checkbox,
    Select,
    Image,
    /// <summary>JSON array of strings, edited as one item per line.</summary>
    LineList,
    /// <summary>JSON array of strings, edited as a comma separated list.</summary>
    TagList,
    /// <summary>JSON array of objects, edited with a repeater.</summary>
    Repeater,
    /// <summary>URL slug, auto-filled from another property when left empty.</summary>
    Slug,
    /// <summary>Slug of a portfolio category, edited as a plain code.</summary>
    Code,
}

public sealed record AdminOption(string Value, string Label);

public sealed record AdminRepeaterColumn(
    string Property,
    string Label,
    AdminFieldKind Kind = AdminFieldKind.Text,
    int MaxLength = 400);

public sealed class AdminFieldSpec
{
    /// <summary>Name of the string/decimal/bool property on the entity.</summary>
    public required string Property { get; init; }

    public required string Label { get; init; }

    public AdminFieldKind Kind { get; init; } = AdminFieldKind.Text;

    public string? Help { get; init; }

    public int MaxLength { get; init; } = 500;

    public bool Required { get; init; }

    /// <summary>Key resolved by the controller into a list of <see cref="AdminOption"/>.</summary>
    public string? OptionsKey { get; init; }

    public AdminRepeaterColumn[]? Columns { get; init; }

    /// <summary>Bootstrap grid width of the field inside the form.</summary>
    public string Column { get; init; } = "col-12 col-lg-6";

    /// <summary>Value lives in a JSON column of the table.</summary>
    public bool IsJsonBacked => Kind is AdminFieldKind.LineList or AdminFieldKind.TagList or AdminFieldKind.Repeater;
}

/// <summary>A column of the index table.</summary>
public sealed class AdminColumnSpec
{
    public required string Property { get; init; }
    public required string Label { get; init; }
    public bool IsImage { get; init; }
    public bool IsBool { get; init; }
    public int MaxWidth { get; init; }
}

/// <summary>Everything the generic screens need to manage one entity.</summary>
public sealed class AdminEntityDefinition
{
    /// <summary>URL segment under /admin (also used by AdminServices in the panel JS).</summary>
    public required string RouteName { get; init; }

    public required string TitleFa { get; init; }

    public required string SingularFa { get; init; }

    public required string Icon { get; init; }

    public required Func<IServiceProvider, IEntityGateway> Gateway { get; init; }

    public IReadOnlyList<AdminFieldSpec> Fields { get; init; } = Array.Empty<AdminFieldSpec>();

    public IReadOnlyList<AdminColumnSpec> Columns { get; init; } = Array.Empty<AdminColumnSpec>();

    /// <summary>Menu grouping in the sidebar.</summary>
    public string Group { get; init; } = "محتوا";

    /// <summary>Property used to auto-generate the slug/code of a new row.</summary>
    public string? SlugSource { get; init; }

    public string? SlugTarget { get; init; }

    /// <summary>ISR tags pushed to the front end after a save.</summary>
    public string[] RevalidateTags { get; init; } = Array.Empty<string>();

    /// <summary>True when the list should be searchable/sortable by the admin.</summary>
    public bool Searchable { get; init; } = true;

    public string SearchProperty { get; init; } = "TitleFa";
}
