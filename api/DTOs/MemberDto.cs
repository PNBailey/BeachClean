using System;
using System.Collections.Generic;
using api.Entities;
using api.Helpers;

namespace api.DTOs
{
        public class MemberDto
        {


            public int Id { get; set; }
            public string UserName { get; set; }

            public string PhotoUrl { get; set; }

            public string Name { get; set; }

            public DateTime Created { get; set; } = DateTime.Now;

            public DateTime LastActive { get; set; } = DateTime.Now;
            
            public string Location { get; set; } 

            public string EmailAddress { get; set; }
            
            public string Occupation { get; set; }

            public PhotoDto Photo { get; set; }

        }
}