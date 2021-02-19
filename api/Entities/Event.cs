using System;
using System.Collections.Generic;

namespace api.Entities
{
    public class Event
    {

        public int Id { get; set; }

        public AppUser Creator { get; set; }

        public int CreatorId { get; set; }
        public string Name { get; set; }

        public DateTime Date { get; set; }
        public string Location { get; set; }

        public ICollection<AppUser> Organisers { get; set; }

        public ICollection<AppUser> Attendees { get; set; }

        public ICollection<Photo> EventPhotos { get; set; }

        public Photo MainPhoto { get; set; }

    }
}