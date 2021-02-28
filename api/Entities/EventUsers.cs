namespace api.Entities
{
    public class EventUsers
    {
        public AppUser Attendee { get; set; }

        public int AttendeeId { get; set; }

        public Event AttendingEvent { get; set; }

        public int AttendingEventId { get; set; }
        
    }

}