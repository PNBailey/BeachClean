using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using api.Entities;
using api.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace api.Services
{
    public class TokenService : ITokenService
    {

        private readonly SymmetricSecurityKey _key;

        public TokenService(IConfiguration config) // The config dependancy injection here gives us access to the appsettings.devlopment configuration file
        {
             _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"])); // Add token key to appsettings.devlopment "TokenKey": "super secret unnguesssable key",
        }
         public string CreateToken(AppUser user)
        {
           var claims = new List<Claim>  // We start off by identifying what claims we are going to put inside of this token. 
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()), // This will be our name identifier for just about everything. We use the NameId to store the user.userName
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
            };

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