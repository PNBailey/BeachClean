namespace api.Entities
{
    public class UserEvents
    {
        public AppUser Organiser { get; set; }

        public int OrganiserId { get; set; }

        public Event Event { get; set; }

        public int EventId { get; set; }
    }
}