using System;
using System.Collections.Generic;
using api.Helpers;

namespace api.DTOs
{
    public class EventDto
    {
        public string Name { get; set; }

        public int Id { get; set; }

        public DateTime Date { get; set; }

        public string Location { get; set; }

        public string MainPhotoUrl { get; set; }

        public ICollection<PhotoDto> Photos { get; set; }

        public MemberDto Creator { get; set; }

        public ICollection<MemberDto> Organisers { get; set; }

        public ICollection<MemberDto> Attendees { get; set; }
        

        
    }
}
