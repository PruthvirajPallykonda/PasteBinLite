using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PastebinApi.Data;
using System.Web;

namespace PastebinApi.Controllers
{
    [Route("p")]
    public class PasteViewController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PasteViewController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ViewPaste(string id)
        {
            var paste = await _db.Pastes.FindAsync(id);
            if (paste == null)
            {
                return NotFound("Paste not found or expired.");
            }

            var now = DateTimeOffset.UtcNow;
            if (paste.ExpiresAt.HasValue && now > paste.ExpiresAt.Value ||
                paste.MaxViews.HasValue && paste.Views >= paste.MaxViews.Value)
            {
                return NotFound("Paste not found or expired.");
            }

            paste.Views += 1;
            await _db.SaveChangesAsync();

            var remainingViews = paste.MaxViews.HasValue
                ? Math.Max(paste.MaxViews.Value - paste.Views, 0)
                : (int?)null;
            var expiresAt = paste.ExpiresAt?.UtcDateTime.ToString("o");

            var safeContent = HttpUtility.HtmlEncode(paste.Content);
            var html = $@"
            <!DOCTYPE html>
            <html>
            <head>
                <title>Pastebin Lite</title>
                <meta charset='utf-8'>
                <style>
                    body {{ font-family: 'Courier New', monospace; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.5; }}
                    pre {{ background: #f5f5f5; padding: 24px; border-radius: 8px; white-space: pre-wrap; word-wrap: break-word; margin: 0; }}
                    .meta {{ color: #666; margin-top: 24px; font-size: 14px; }}
                    h1 {{ color: #333; }}
                </style>
            </head>
            <body>
                <h1>Paste</h1>
                <pre>{safeContent}</pre>
                <div class='meta'>
                    {(remainingViews.HasValue ? $"<p>Remaining views: <strong>{remainingViews}</strong></p>" : "<p>Remaining views: <strong>Unlimited</strong></p>")}
                    {(expiresAt != null ? $"<p>Expires at: <strong>{expiresAt}</strong></p>" : "")}
                </div>
            </body>
            </html>";

            return Content(html, "text/html");
        }
    }
}
