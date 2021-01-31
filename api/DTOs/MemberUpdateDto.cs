using System;

namespace api.DTOs
{
    public class MemberUpdateDto
    {

        public string UserName { get; set; }

        public string Location { get; set; }
        public string Name { get; set; }

        public string EmailAddress { get; set; }

        public string Occupation { get; set; }

    }
}