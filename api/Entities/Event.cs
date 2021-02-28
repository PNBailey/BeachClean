using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

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

        public ICollection<UserEvents> Organisers { get; set; }

        public ICollection<EventUsers> Attendees { get; set; }


    }
}