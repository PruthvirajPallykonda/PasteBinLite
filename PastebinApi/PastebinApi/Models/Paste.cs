namespace PastebinApi.Models
{
    public class Paste
    {
        public string Id { get; set; } = default!;
        public string Content { get; set; } = default!;
        public int? MaxViews { get; set; }
        public int Views { get; set; }
        public DateTimeOffset? ExpiresAt { get; set; }
    }
}
