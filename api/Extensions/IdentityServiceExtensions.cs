using System.IdentityModel.Tokens.Jwt;
using System.Text;
using api.Data;
using api.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace api.Extensions
{
    public static class IdentityServiceExtensions
    {
         public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config) 
        {

            services.AddIdentityCore<AppUser>(opt => {
                opt.Password.RequireNonAlphanumeric = false;
            })
            .AddRoles<AppRole>()
            .AddRoleManager<RoleManager<AppRole>>()
            .AddSignInManager<SignInManager<AppUser>>()
            .AddRoleValidator<RoleValidator<AppRole>>()
            .AddEntityFrameworkStores<DataContext>(); // This sets up our database with all of the tables we need to create the .NET identity tables

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme) 
             .AddJwtBearer (options => 
             {
                 options.TokenValidationParameters = new TokenValidationParameters 
                 {
                     ValidateIssuerSigningKey = true,
                     
                     
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"])), 
                    ValidateIssuer = false, // This is the API server
                    ValidateAudience = false // This is our angular app


                 };
             });

             return services;
        }
    }
}