using Microsoft.AspNetCore.Mvc;
using PastebinApi.Data;

namespace PastebinApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthzController : ControllerBase
    {
        private readonly AppDbContext _db;

        public HealthzController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                await _db.Database.CanConnectAsync();
                return Ok(new { ok = true });
            }
            catch
            {
                return StatusCode(503, new { ok = false });
            }
        }
    }
}
