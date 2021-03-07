using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using api.Data;
using api.DTOs;
using api.Entities;
using api.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;

        private readonly ITokenService _tokenService;
        public AccountController(DataContext context, ITokenService tokenService)
        {
            _context = context; // This allows us to access the database 
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {

            if (await UserExistsAsync(registerDto.UserName.ToLower())) 

            {
                return BadRequest("Username is taken");

            }

            using var hmac = new HMACSHA512();

            var user = new AppUser
            {
                UserName = registerDto.UserName.ToLower(),

                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),

                PasswordSalt = hmac.Key,

                Location = registerDto.Location
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            return new UserDto 
            
            {
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user),
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
         var user = await _context.Users.
         
         Include(user => user.Photo).

         SingleOrDefaultAsync(user => user.UserName == loginDto.UserName.ToLower());

        if(user == null) return Unauthorized("Invalid Username");

        using var hmac = new HMACSHA512(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for(int i = 0; i < computedHash.Length; i++) {

            if(computedHash[i] != user.PasswordHash[i]) {
                return Unauthorized("Invalid Password!");
            }
        }

          return new UserDto {
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user),
                Location = user.Location,
                PhotoUrl = user.Photo.Url

            };
    }

    }
}