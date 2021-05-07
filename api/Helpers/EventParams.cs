namespace api.Helpers
{
    public class EventParams : PaginationParams
    {

        
        public string usersLocation { get; set; }

        #nullable enable
        public string? username { get; set; }

        public string? predicate { get; set; }

    }
}