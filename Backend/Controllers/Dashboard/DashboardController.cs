using Backend.DTOs;
using Backend.Identity;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _service;

        public DashboardController(IDashboardService service)
        {
            _service = service;
        }

        [Authorize(Policy = IdentityRoles.Admin)]
        [HttpGet]
        public async Task<ActionResult<DashboardDTO>> GetDashboardData()
        {
            var data = await _service.GetDashboardData();
            return Ok(data);
        }
    }
}