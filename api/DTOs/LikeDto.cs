using api.Entities;
using api.Helpers;

namespace api.DTOs
{
    public class LikeDto
    {
        public int Id { get; set; }

        public string UserName { get; set; }

        public string Location { get; set; }

        public string Name { get; set; }

        public PhotoDto Photo { get; set; }

        public string PhotoUrl { get; set; }

    }
}