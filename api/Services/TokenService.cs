using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using api.Entities;
using api.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace api.Services
{
    public class TokenService : ITokenService
    {

        private readonly SymmetricSecurityKey _key;
        public UserManager<AppUser> UserManager { get; }

        public TokenService(IConfiguration config, UserManager<AppUser> userManager) // The config dependancy injection here gives us access to the appsettings.devlopment configuration file
        {
            UserManager = userManager;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"])); // Add token key to appsettings.devlopment "TokenKey": "super secret unnguesssable key",
        }
        public async Task<string> CreateToken(AppUser user)
        {

            

            var claims = new List<Claim>  // We start off by identifying what claims we are going to put inside of this token. 
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()), // This will be our name identifier for just about everything. We use the NameId to store the user.userName
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
            };

            

            var roles = await UserManager.GetRolesAsync(user);

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role))); // The AddRange Adds the elements of the specified collection to the end of the list

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature); // This object takes a security key and an algorithm 

            // Now we need to describe our token:

            var tokenDescriptor = new SecurityTokenDescriptor // We specify here what goes inside of our token. This descrbes how this token is going to look
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);

            // This is a lot of code here but ultimately all we need to know is that this is the code that will create our token. When we want to create a new token within a class, we inject this service into the class. We can then use the create token method which allows us to create a new token based on the user
        }
    }
}