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

        public async Task<ActionResult<ICollection<MemberDto>>> getUsersWithRoles()
        {

            var users = await _userManager.Users
            .Include(u => u.UserRoles)
            .ThenInclude(u => u.Role)
            .ToListAsync();

            if(users.Count <= 0) return BadRequest("No users found");

            return _mapper.Map<List<AppUser>, List<MemberDto>>(users);


            
      }
    }
}