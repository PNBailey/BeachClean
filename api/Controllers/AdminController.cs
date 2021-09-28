using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        public AdminController(UserManager<AppUser> userManager, IMapper mapper)
        {
            _mapper = mapper;
            _userManager = userManager;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]

        public async Task<ActionResult> getUsersWithRoles()
        {

            var users = await _userManager.Users
            .Include(u => u.UserRoles)
            .ThenInclude(u => u.Role)
            .Select(u => new {
                u.Id,
                UserName = u.UserName,
                Roles = u.UserRoles.Select(ur => ur.Role).ToList()
            })
            .ToListAsync();

            if(users.Count <= 0) return BadRequest("No users found");

            return Ok(users);
            
      }
    }
}