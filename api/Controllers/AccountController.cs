using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using api.Data;
using api.DTOs;
using api.Entities;
using api.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        public UserManager<AppUser> UserManager { get; }
        public SignInManager<AppUser> SignInManager { get; }
        private readonly ITokenService _tokenService;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService, DataContext context)
        {
            _context = context;
            SignInManager = signInManager;
            UserManager = userManager;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {

            if (await UserExistsAsync(registerDto.UserName.ToLower()))

            {
                return BadRequest("Username is taken");

            }


            var user = new AppUser
            {
                UserName = registerDto.UserName.ToLower(),

                Location = registerDto.Location
            };

            var result = await UserManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await UserManager.AddToRoleAsync(user, "Member");

            if (!roleResult.Succeeded) return BadRequest(result.Errors);

            return new UserDto

            {
                UserName = user.UserName,
                Token = await _tokenService.CreateToken(user),
                Location = user.Location

            };

        }

        private async Task<bool> UserExistsAsync(string userName)
        {
            return await _context.Users.AnyAsync(x => x.UserName == userName);
        }


        [HttpPost("login")]

        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)

        {
            var user = await UserManager.Users.

            Include(user => user.Photo).

            SingleOrDefaultAsync(user => user.UserName == loginDto.UserName.ToLower());

            if (user == null) return Unauthorized("Invalid Username");

            var result = SignInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (!result.IsCompleted) return Unauthorized();

            return new UserDto
            {
                UserName = user.UserName,
                Token = await _tokenService.CreateToken(user),
                Location = user.Location,
                PhotoUrl = user.Photo?.Url

            };
        }

    }
}