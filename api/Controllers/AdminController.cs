using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    public class AdminController : BaseApiController
    {
      [Authorize(Policy = "RequireAdminRole")]
      [HttpGet("users-with-roles")]
                
      public ActionResult getUsersWithRoles() {
          return Ok("only admins can seen this");
      }
    }
}