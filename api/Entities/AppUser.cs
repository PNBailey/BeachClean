using System;
using System.Collections.Generic;

namespace api.Entities
{
    public class AppUser
    {
        public int Id { get; set; }

        public string UserName { get; set; }

        public string Name { get; set; }

        public DateTime Created { get; set; } = DateTime.Now;

        public DateTime LastActive { get; set; } = DateTime.Now;
        
        public string Location { get; set; } 

        public string EmailAddress { get; set; }


        public string Occupation { get; set; }

        public UserPhoto Photo { get; set; }

        public byte[] PasswordHash { get; set; } 

        public byte[] PasswordSalt { get; set; } 

        public ICollection<UserLike> LikedByUsers { get; set; }

        public ICollection<UserLike> LikedUsers { get; set; }

        public ICollection<Event> CreatedEvents { get; set; }

        public ICollection<UserEvents> OrganisedEvents { get; set; }

        public ICollection<EventUsers> AttendingEvents { get; set; }








    }
}