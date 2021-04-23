namespace api.Helpers
{
    public class LikesParams : PaginationParams
    {
        public int UserId { get; set; }
        public string Predicate { get; set; }

        #nullable enable
        public string? UserName { get; set; }
    }
}
