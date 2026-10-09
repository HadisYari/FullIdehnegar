namespace EndPoints.Models;

/// <summary>
/// Payload of the two fallback pages: <c>UseExceptionHandler</c> (500) and
/// <c>UseStatusCodePagesWithReExecute</c> (404/405/…). Kept intentionally
/// information-free — details only ever go to the log, never to the visitor.
/// </summary>
public class ErrorViewModel
{
    /// <summary>HTTP status the page is explaining.</summary>
    public int Code { get; set; } = 500;

    public string Title { get; set; } = "مشکلی پیش آمد";

    public string Message { get; set; } = "درخواست شما پرداز نشد. کمی بعد دوباره تلاش کنید.";

    public string? RequestId { get; set; }

    public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);

    /// <summary>True when the visitor should simply be sent back to the site.</summary>
    public bool IsNotFound => Code == 404;
}
