using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace api.Entities
{
    public class AppUser : IdentityUser<int>
    {


        public string Name { get; set; }

        public DateTime Created { get; set; } = DateTime.Now;

        public DateTime LastActive { get; set; } = DateTime.Now;
        
        public string Location { get; set; } 

        public string EmailAddress { get; set; }


        public string Occupation { get; set; }

        public UserPhoto Photo { get; set; }

        public ICollection<UserLike> LikedByUsers { get; set; }

        public ICollection<UserLike> LikedUsers { get; set; }

        public ICollection<Event> CreatedEvents { get; set; }

        public ICollection<UserEvents> OrganisedEvents { get; set; }

        public ICollection<EventUsers> AttendingEvents { get; set; }

        public ICollection<Message> SentMessages { get; set; }

        public ICollection<Message> ReceivedMessages { get; set; }

        public ICollection<AppUserRole> UserRoles { get; set; }








    }
}