using api.Entities;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class DataContext : DbContext
    {
           public DataContext(DbContextOptions options)
            : base(options)
        {
            
        }

        public DbSet<AppUser> Users { get; set; }

        public DbSet<UserLike> Likes { get; set; }

        public DbSet<Event> Events { get; set; }

        public DbSet<UserEvents> UserEvents { get; set; }

        protected override void OnModelCreating(ModelBuilder builder) 
        {
             base.OnModelCreating(builder); 
            builder.Entity<UserLike>() 
                .HasKey(key => new {key.SourceUserId, key.LikedUserId});

            builder.Entity<UserLike>()
                .HasOne(s => s.SourceUser) 
                .WithMany(l => l.LikedUsers)
                .HasForeignKey(s => s.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserLike>() 
                .HasOne(s => s.LikedUser) 
                .WithMany(l => l.LikedByUsers)
                .HasForeignKey(s => s.LikedUserId)
                .OnDelete(DeleteBehavior.Cascade); 

            builder.Entity<UserEvents>()
                .HasKey(key => new {key.OrganiserId, key.EventId});

            builder.Entity<UserEvents>()
                .HasOne(e => e.Organiser)
                .WithMany(e => e.OrganisedEvents)
                .HasForeignKey(e => e.OrganiserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserEvents>()
                .HasOne(e => e.Event)
                .WithMany(e => e.Organisers)
                .HasForeignKey(e => e.EventId)
                .OnDelete(DeleteBehavior.Cascade);


                
        }

      

    }
}