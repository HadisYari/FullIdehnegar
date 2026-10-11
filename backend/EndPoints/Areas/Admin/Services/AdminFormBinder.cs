using EndPoints.Areas.Admin.Models;

namespace EndPoints.Areas.Admin.Services;

/// <summary>
/// Shared rendering/binding logic of the generic admin forms. Used by the
/// content CRUD screens and by the single-row site settings screen.
/// </summary>
public static class AdminFormBinder
{
    public static AdminFormModel Build(
        string routeName,
        string title,
        bool isNew,
        Guid? id,
        IReadOnlyList<AdminFieldSpec> fields,
        object row,
        Func<AdminFieldSpec, IReadOnlyList<AdminOption>>? optionsResolver = null)
    {
        var model = new AdminFormModel
        {
            RouteName = routeName,
            Title = title,
            IsNew = isNew,
            Id = id,
        };

        foreach (var field in fields)
        {
            if (field.ShowWhen is not null && !field.ShowWhen(row))
            {
                continue;
            }

            var raw = EntityValue.GetText(row, field.Property);
            var value = field.Kind switch
            {
                AdminFieldKind.LineList => EntityValue.JsonToLines(raw),
                AdminFieldKind.TagList => EntityValue.JsonToTags(raw),
                _ => raw,
            };

            model.Fields.Add(new AdminFieldModel
            {
                Property = field.Property,
                Label = field.Label,
                Kind = field.Kind,
                Value = value,
                Required = field.Required,
                MaxLength = field.MaxLength,
                Help = field.Help,
                Column = field.Column,
                Columns = field.Columns ?? Array.Empty<AdminRepeaterColumn>(),
                Options = optionsResolver?.Invoke(field) ?? Array.Empty<AdminOption>(),
            });
        }

        return model;
    }

    public static List<string> Bind(IReadOnlyList<AdminFieldSpec> fields, object row, IFormCollection form)
    {
        var errors = new List<string>();

        foreach (var field in fields)
        {
            // Hidden fields are not posted; skipping them keeps the stored value.
            if (field.ShowWhen is not null && !field.ShowWhen(row))
            {
                continue;
            }

            var raw = form[field.Property].FirstOrDefault();

            if (field.IsJsonBacked)
            {
                // Tag inputs accept "a, b, c"; the column stores a JSON array.
                var source = field.Kind == AdminFieldKind.TagList && raw is not null && !raw.TrimStart().StartsWith('[')
                    ? string.Join('\n', raw.Split(',', StringSplitOptions.RemoveEmptyEntries))
                    : raw;

                if (!EntityValue.TryNormalizeJson(source, out var json, out var jsonError))
                {
                    errors.Add($"{field.Label}: {jsonError}");
                    continue;
                }

                EntityValue.Set(row, field.Property, json, field.Kind, out _);
                continue;
            }

            if (field.Required && string.IsNullOrWhiteSpace(raw))
            {
                errors.Add($"«{field.Label}» الزامی است.");
                continue;
            }

            EntityValue.Set(row, field.Property, raw, field.Kind, out var error);
            if (error is not null)
            {
                errors.Add(error);
            }
        }

        return errors;
    }
}
