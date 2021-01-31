using api.Data;
using api.Interfaces;
using api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using api.Helpers;
using API.Helpers;

namespace api.Extensions
{
    public static class ApplicationServiceExtensions
    {
         public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config) { // The method must also be static. We are extending the IServiceCollection and creating this method to creae our application service

         services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
        
            services.AddScoped<ITokenService, TokenService>(); // This is what we need to add so our token service to enable us to use the service in other parts of our app. The Addscoped is scoped to the lifetime of the http request in this case. When the request comes in and we have this service injected into that particular controller then a new instance of this service is created and when the request is finished, the service is disposed. We use this one almost all of the time. 

            services.AddScoped<IUserRepository, UserRepository>();

            services.AddScoped<IPhotoService, PhotoService>();

            services.AddAutoMapper(typeof(AutoMapperProfile).Assembly);


            services.AddDbContext<DataContext>(options => 
            {  
                options.UseSqlite(config.GetConnectionString("DefaultConnection"));

            });

            return services;
         }
    }
}