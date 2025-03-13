using Backend.DTOs;
using Backend.Identity;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    [Authorize(Policy = IdentityRoles.Admin)]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _service;

        public DashboardController(IDashboardService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<DashboardDTO>> GetDashboardData()
        {
            var data = await _service.GetDashboardData();
            return Ok(data);
        }
    }
}