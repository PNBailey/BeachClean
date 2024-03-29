using api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class DataContext : IdentityDbContext<
    AppUser,
    AppRole,
    int,
    IdentityUserClaim<int>,
    AppUserRole,
    IdentityUserLogin<int>,
    IdentityRoleClaim<int>,
    IdentityUserToken<int>>
    {

        public DataContext(DbContextOptions options)
         : base(options)
        {

        }


        public DbSet<UserLike> Likes { get; set; }

        public DbSet<Event> Events { get; set; }

        public DbSet<UserEvents> UserEvents { get; set; }

        public DbSet<EventUsers> EventUsers { get; set; }

        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<AppRole>()
                .HasMany(u => u.UserRoles)
                .WithOne(u => u.Role)
                .HasForeignKey(u => u.RoleId)
                .IsRequired();

            builder.Entity<AppUser>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.UserId)
                .IsRequired();

            builder.Entity<UserLike>()
                .HasKey(key => new { key.SourceUserId, key.LikedUserId });

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
                .HasForeignKey(e => e.CreatorId);

            builder.Entity<UserEvents>()
                .HasKey(key => new { key.OrganiserId, key.EventId });

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

            builder.Entity<EventUsers>()
                .HasKey(key => new { key.AttendeeId, key.AttendingEventId });

            builder.Entity<EventUsers>()
                .HasOne(e => e.Attendee)
                .WithMany(e => e.AttendingEvents)
                .HasForeignKey(e => e.AttendeeId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<EventUsers>()
                .HasOne(e => e.AttendingEvent)
                .WithMany(e => e.Attendees)
                .HasForeignKey(e => e.AttendingEventId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(u => u.SentMessages)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(m => m.Recipient)
                .WithMany(u => u.ReceivedMessages)
                .OnDelete(DeleteBehavior.Restrict);



        }



    }
}