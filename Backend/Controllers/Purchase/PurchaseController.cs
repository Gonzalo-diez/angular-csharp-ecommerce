using Backend.Interfaces;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/purchases")]
    [ApiController]
    public class PurchaseController : ControllerBase
    {
        private readonly IPurchaseService _purchaseService;

        public PurchaseController(IPurchaseService purchaseService)
        {
            _purchaseService = purchaseService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var purchases = await _purchaseService.GetAllPurchasesAsync();
            return Ok(purchases);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var purchase = await _purchaseService.GetPurchaseByIdAsync(id);
            if (purchase == null)
                return NotFound(new { message = "Purchase not found" });

            return Ok(purchase);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId([FromQuery] int? userId, [FromQuery] string? sessionId)
        {
            var purchases = await _purchaseService.GetPurchasesByUserIdOrSessionIdAsync(userId, sessionId);
            return Ok(purchases);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PurchaseRequest request, [FromQuery] int? userId, [FromQuery] string? sessionId)
        {
            var purchase = await _purchaseService.CreatePurchaseAsync(request.UserId, sessionId, request.Product, request.Quantity);
            return CreatedAtAction(nameof(GetById), new { id = purchase.Id }, purchase);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _purchaseService.DeletePurchaseAsync(id);
            if (!result)
                return NotFound(new { message = "Purchase not found" });

            return NoContent();
        }
    }

    // DTO para recibir datos del request
    public class PurchaseRequest
    {
        public int UserId { get; set; }
        public required Product Product { get; set; }
        public int Quantity { get; set; }
    }
}
