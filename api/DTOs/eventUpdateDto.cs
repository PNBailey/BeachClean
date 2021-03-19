using System;
using System.Collections.Generic;

namespace api.DTOs
{
    public class eventUpdateDto
    {
        public string Name { get; set; }

        public int Id { get; set; }

        public DateTime? Date { get; set; }

        public string Location { get; set; }

        public ICollection<MemberDto> Organisers { get; set; }
    }
}