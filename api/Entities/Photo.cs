using System.ComponentModel.DataAnnotations.Schema;

namespace api.Entities
{
    [Table("Photos")]
    public class Photo
    {

        public int Id { get; set; }
        
        public string publicId { get; set; }

        public string Url { get; set; }

        public AppUser AppUser { get; set; }

        public int AppUserId { get; set; }


    }
}