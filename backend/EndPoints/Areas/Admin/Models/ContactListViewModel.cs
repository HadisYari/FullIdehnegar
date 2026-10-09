using EndPoints.Core.Entities;

namespace EndPoints.Areas.Admin.Models;

public sealed record ContactListViewModel(IReadOnlyList<ContactSubmission> Messages);
