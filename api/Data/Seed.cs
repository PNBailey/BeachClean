using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using api.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text;
using System.Security.Cryptography;
using api.Data;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(DataContext context) 
        {
            if(await context.Users.AnyAsync()) return;

            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json"); // This gets the text from the json file we created 

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData); // This deserializes the json data to an object of whatever type we specify here. As the Json data properties match the format of our AppUser properties, it converts it correctly to a list of Appusers

            foreach(var user in users) {
                using var hmac = new HMACSHA512();

                user.UserName = user.UserName.ToLower();

                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd"));

                user.PasswordSalt = hmac.Key;

                context.Users.Add(user); // This adds tracking to the users througn entity framework. This isn't actually adding the user. This is why we don't use the await keyword here. 
            }

            await context.SaveChangesAsync();
        }
    }
}