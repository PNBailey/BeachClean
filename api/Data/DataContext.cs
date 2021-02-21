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

            builder.Entity<Event>()
                .HasOne(e => e.Creator)
                .WithMany(e => e.CreatedEvents)
                .HasForeignKey(e => e.CreatorId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Event>()
                .HasMany(e => e.Organisers)
                .WithMany(u => u.OrganisedEvents);

            builder.Entity<Event>()
                .HasMany(e => e.Attendees)
                .WithMany(u => u.AttendingEvents);

            builder.Entity<AppUser>()
                .HasMany(e => e.AttendingEvents)
                .WithMany(e => e.Attendees);

            builder.Entity<AppUser>()
                .HasMany(e => e.OrganisedEvents)
                .WithMany(e => e.Organisers);

                
        }

      

    }
}