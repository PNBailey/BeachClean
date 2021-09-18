using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using api.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text;
using System.Security.Cryptography;
using api.Data;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager) 
        {
            if(await userManager.Users.AnyAsync()) return;

            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json"); // This gets the text from the json file we created 

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData); // This deserializes the json data to an object of whatever type we specify here. As the Json data properties match the format of our AppUser properties, it converts it correctly to a list of Appusers

              var roles = new List<AppRole> {
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Moderator"},
                new AppRole{Name = "Member"}
            };

            foreach(var role in roles) {
                await roleManager.CreateAsync(role);
            }

            foreach(var user in users) {

                user.UserName = user.UserName.ToLower();

                // DataConext.Users.Add(user); // This adds tracking to the users througn entity framework. This isn't actually adding the user. This is why we don't use the await keyword here. 

                await userManager.CreateAsync(user, "Abc123");

                await userManager.AddToRoleAsync(user, "Member");
            }

          

        }
    }
}