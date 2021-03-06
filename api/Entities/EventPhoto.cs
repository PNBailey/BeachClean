using System.ComponentModel.DataAnnotations.Schema;

namespace api.Entities
{

    [Table("EventPhoto")]
    public class EventPhoto
    {
        public int Id { get; set; }
        
        public string publicId { get; set; }

        public string Url { get; set; }

        public bool MainPhoto { get; set; }

        public Event Event { get; set; }

        public int EventId { get; set; }
    }
}