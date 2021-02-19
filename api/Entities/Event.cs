using System;
using System.Collections.Generic;

namespace api.Entities
{
    public class Event
    {

        public int Id { get; set; }

        public AppUser EventCreator { get; set; }

        public int EventCreatorId { get; set; }
        public string EventName { get; set; }

        public DateTime EventDate { get; set; }
        public string EventLocation { get; set; }

        public ICollection<AppUser> Organisers { get; set; }

        public ICollection<AppUser> Attendees { get; set; }

        public ICollection<Photo> EventPhotos { get; set; }

        public Photo MainPhoto { get; set; }

    }
}